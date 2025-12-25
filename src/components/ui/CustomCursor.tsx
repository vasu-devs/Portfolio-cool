import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

interface CustomCursorProps {
    theme: 'light' | 'dark';
}

interface PaintDot {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
}

// Helper to get the background color at a specific point
function getColorAtPoint(x: number, y: number): string {
    // Get all elements at the point
    const elements = document.elementsFromPoint(x, y);

    for (const el of elements) {
        // Skip our cursor elements
        if (el.classList.contains('cursor-element') || el.classList.contains('paint-dot')) {
            continue;
        }

        const style = window.getComputedStyle(el);
        const bgColor = style.backgroundColor;

        // If element has a non-transparent background
        if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
            // Parse the color to determine if it's light or dark
            const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                const r = parseInt(match[1]);
                const g = parseInt(match[2]);
                const b = parseInt(match[3]);
                // Calculate luminance
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                // Return white for dark backgrounds, black for light backgrounds
                return luminance < 0.5 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
            }
        }
    }

    // Default based on document background (check data-theme)
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
}

export function CustomCursor({ theme }: CustomCursorProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [hoverText, setHoverText] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [paintDots, setPaintDots] = useState<PaintDot[]>([]);
    const [isPainting, setIsPainting] = useState(false);
    const [velocityScale, setVelocityScale] = useState(1);
    const cursorRef = useRef<HTMLDivElement>(null);
    const paintIdRef = useRef(0);
    const lastPaintPos = useRef({ x: 0, y: 0 });
    const lastMovePos = useRef({ x: 0, y: 0, time: Date.now() });
    const isMouseDownRef = useRef(false);
    const currentStrokeDots = useRef<number[]>([]);
    const velocityDecayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Use motion values for smooth animation
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Spring animation for smooth following
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Function to fade out all dots from current stroke - one by one
    const fadeOutCurrentStroke = useCallback(() => {
        const dotsToFade = [...currentStrokeDots.current];
        currentStrokeDots.current = [];

        // Fade dots one by one, starting from the first
        dotsToFade.forEach((dotId, index) => {
            setTimeout(() => {
                setPaintDots(prev => prev.filter(dot => dot.id !== dotId));
            }, index * 30); // 30ms delay between each dot fading
        });
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);

        if (!isVisible) {
            setIsVisible(true);
        }

        // Calculate velocity for shake detection
        const now = Date.now();
        const dt = now - lastMovePos.current.time;
        if (dt > 0) {
            const dx = e.clientX - lastMovePos.current.x;
            const dy = e.clientY - lastMovePos.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const velocity = distance / dt; // pixels per ms

            // Scale up when moving fast (shaking)
            const newScale = Math.min(1 + velocity * 0.5, 3); // Max 3x scale
            if (newScale > velocityScale) {
                setVelocityScale(newScale);

                // Clear existing decay timeout
                if (velocityDecayRef.current) {
                    clearTimeout(velocityDecayRef.current);
                }

                // Decay back to normal after stopping
                velocityDecayRef.current = setTimeout(() => {
                    setVelocityScale(1);
                }, 150);
            }
        }
        lastMovePos.current = { x: e.clientX, y: e.clientY, time: now };

        // Paint while clicking and moving
        if (isMouseDownRef.current) {
            const dx = e.clientX - lastPaintPos.current.x;
            const dy = e.clientY - lastPaintPos.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only paint if moved enough distance
            if (distance > 6) {
                // Get the color based on what's behind the cursor
                const paintColor = getColorAtPoint(e.clientX, e.clientY);

                const newDot: PaintDot = {
                    id: paintIdRef.current++,
                    x: e.clientX,
                    y: e.clientY,
                    color: paintColor,
                    size: 5 + Math.random() * 3,
                };

                setPaintDots(prev => [...prev, newDot]);
                currentStrokeDots.current.push(newDot.id);
                lastPaintPos.current = { x: e.clientX, y: e.clientY };
            }
        }
    }, [cursorX, cursorY, isVisible]);

    const handleMouseDown = useCallback((e: MouseEvent) => {
        // Prevent text selection
        e.preventDefault();

        setIsClicking(true);
        setIsPainting(true);
        isMouseDownRef.current = true;
        lastPaintPos.current = { x: e.clientX, y: e.clientY };
        currentStrokeDots.current = [];

        // Get the color based on what's behind the cursor
        const paintColor = getColorAtPoint(e.clientX, e.clientY);

        // Add initial dot on click
        const newDot: PaintDot = {
            id: paintIdRef.current++,
            x: e.clientX,
            y: e.clientY,
            color: paintColor,
            size: 6,
        };
        setPaintDots(prev => [...prev, newDot]);
        currentStrokeDots.current.push(newDot.id);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsClicking(false);
        setIsPainting(false);
        isMouseDownRef.current = false;

        // Trigger fade out for current stroke
        fadeOutCurrentStroke();
    }, [fadeOutCurrentStroke]);

    const handleMouseEnterInteractive = useCallback((e: Event) => {
        setIsHovering(true);
        const target = e.target as HTMLElement;
        const cursorText = target.getAttribute('data-cursor-text');
        if (cursorText) {
            setHoverText(cursorText);
        }
    }, []);

    const handleMouseLeaveInteractive = useCallback(() => {
        setIsHovering(false);
        setHoverText(null);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsVisible(false);
        if (isMouseDownRef.current) {
            fadeOutCurrentStroke();
        }
        isMouseDownRef.current = false;
        setIsPainting(false);
    }, [fadeOutCurrentStroke]);

    const handleMouseEnter = useCallback(() => {
        setIsVisible(true);
    }, []);

    // Prevent default drag behavior
    const handleDragStart = useCallback((e: DragEvent) => {
        e.preventDefault();
    }, []);

    useEffect(() => {
        // Add event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('dragstart', handleDragStart);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        document.documentElement.addEventListener('mouseenter', handleMouseEnter);

        // Find all interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
        );

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnterInteractive);
            el.addEventListener('mouseleave', handleMouseLeaveInteractive);
        });

        // Hide default cursor
        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('dragstart', handleDragStart);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            document.documentElement.removeEventListener('mouseenter', handleMouseEnter);

            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnterInteractive);
                el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
            });

            document.body.style.cursor = 'auto';
        };
    }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseEnterInteractive, handleMouseLeaveInteractive, handleMouseLeave, handleMouseEnter, handleDragStart]);

    // Re-attach listeners when DOM changes (for dynamic content)
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const interactiveElements = document.querySelectorAll(
                'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
            );

            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnterInteractive);
                el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
                el.addEventListener('mouseenter', handleMouseEnterInteractive);
                el.addEventListener('mouseleave', handleMouseLeaveInteractive);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [handleMouseEnterInteractive, handleMouseLeaveInteractive]);

    // Don't show on touch devices
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    if (isTouchDevice) return null;

    const cursorColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
    const cursorBorderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';

    return (
        <>
            {/* Paint dots canvas - uses mix-blend-difference for auto color inversion */}
            <div className="fixed inset-0 pointer-events-none z-[9990] mix-blend-difference">
                <AnimatePresence>
                    {paintDots.map((dot) => (
                        <motion.div
                            key={dot.id}
                            className="absolute rounded-full paint-dot"
                            style={{
                                left: dot.x,
                                top: dot.y,
                                width: dot.size,
                                height: dot.size,
                                backgroundColor: 'white',
                                transform: 'translate(-50%, -50%)',
                            }}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{
                                duration: 0.1,
                                exit: { duration: 0.8, ease: 'easeOut' }
                            }}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Main cursor dot */}
            <motion.div
                ref={cursorRef}
                className="fixed pointer-events-none z-[9999] mix-blend-difference cursor-element"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isClicking ? 0.8 * velocityScale : isHovering ? 0.5 : velocityScale,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.15 }}
            >
                <div
                    className="rounded-full"
                    style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: 'white',
                    }}
                />
            </motion.div>

            {/* Cursor ring */}
            <motion.div
                className="fixed pointer-events-none z-[9998] cursor-element"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isClicking ? 0.9 * velocityScale : isHovering ? 1.5 : velocityScale,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                <div
                    className="rounded-full"
                    style={{
                        width: '60px',
                        height: '60px',
                        border: `1px solid ${cursorBorderColor}`,
                        backgroundColor: isHovering ? `${cursorColor}` : 'transparent',
                        opacity: isHovering ? 0.1 : 1,
                        transition: 'background-color 0.2s, opacity 0.2s',
                    }}
                />
            </motion.div>

            {/* Hover text */}
            {hoverText && (
                <motion.div
                    className="fixed pointer-events-none z-[9999] cursor-element"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                >
                    <div
                        className="ml-6 mt-6 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap"
                        style={{
                            backgroundColor: cursorColor,
                            color: theme === 'dark' ? 'black' : 'white',
                        }}
                    >
                        {hoverText}
                    </div>
                </motion.div>
            )}

            {/* Global styles to hide cursor and prevent selection while painting */}
            <style>{`
                * {
                    cursor: none !important;
                }
                ${isPainting ? `
                    * {
                        user-select: none !important;
                        -webkit-user-select: none !important;
                        -moz-user-select: none !important;
                        -ms-user-select: none !important;
                    }
                ` : ''}
            `}</style>
        </>
    );
}
