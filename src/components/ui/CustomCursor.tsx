import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { Bot, Pointer } from 'lucide-react';

interface CustomCursorProps {
    theme: 'light' | 'dark';
    isAppTransitioning?: boolean;
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
            // Parse alpha if present
            const alphaMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
            if (alphaMatch) {
                const alpha = alphaMatch[4] ? parseFloat(alphaMatch[4]) : 1;

                // Ignore effectively transparent backgrounds
                if (alpha < 0.1) continue;

                const r = parseInt(alphaMatch[1]);
                const g = parseInt(alphaMatch[2]);
                const b = parseInt(alphaMatch[3]);

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

export function CustomCursor({ theme, isAppTransitioning }: CustomCursorProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [hoverText, setHoverText] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [paintDots, setPaintDots] = useState<PaintDot[]>([]);
    const [isPainting, setIsPainting] = useState(false);
    const [velocityScale, setVelocityScale] = useState(1);

    // Robot Eater State
    const [eaterVisible, setEaterVisible] = useState(false);
    const [eaterPos, setEaterPos] = useState({ x: 0, y: 0, rotate: 0 });

    const cursorRef = useRef<HTMLDivElement>(null);
    const paintIdRef = useRef(0);
    const lastPaintPos = useRef({ x: 0, y: 0 });
    const lastMovePos = useRef({ x: 0, y: 0, time: Date.now() });
    const isMouseDownRef = useRef(false);
    // Store full dot info for the eater to follow
    const currentStrokeDots = useRef<PaintDot[]>([]);
    const velocityDecayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Use motion values for smooth animation
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Spring animation for smooth following (for the outer ring)
    const springConfig = { damping: 30, stiffness: 600, mass: 0.4 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // State for dynamic bot contrast
    const [botContrast, setBotContrast] = useState<'light' | 'dark'>('light');

    // Check background at Bot position
    useEffect(() => {
        const checkContrast = () => {
            if (isAppTransitioning) return; // Skip checks during theme toggle
            let mode: 'light' | 'dark' = 'light';

            // 1. Check if we are visually over the Hero section
            // Hero is fixed at z-0. Content (z-20) starts at 100vh.
            // So if scrollY < 100vh - (Bot Position + Buffer), the Bot is over Hero.
            // Bot Top is 32px (top-8). Let's use 100px buffer. or window.innerHeight - 80
            const isHeroVisible = window.scrollY < (window.innerHeight - 80);

            if (isHeroVisible) {
                // Hero Logic: Inverted
                // Dark Theme -> White Top BG -> Needs Black Text (light mode)
                // Light Theme -> Black Top BG -> Needs White Text (dark mode)
                if (theme === 'dark') {
                    mode = 'light';
                } else {
                    mode = 'dark';
                }
            } else {
                // 2. Standard Logic for rest of page
                const color = getColorAtPoint(48, 48);
                // getColorAtPoint returns the CONTRAST color (White for Dark BG, Black for Light BG)

                if (color.startsWith('rgba(255')) {
                    // Returns White -> BG is Dark -> Needs White Text
                    mode = 'dark';
                } else {
                    // Returns Black -> BG is Light -> Needs Black Text
                    mode = 'light';
                }
            }

            setBotContrast(mode);
        };

        // Check initially
        checkContrast();

        // Check on scroll
        window.addEventListener('scroll', checkContrast, { passive: true });

        // Interval for dynamic content
        const interval = setInterval(checkContrast, 500);

        return () => {
            window.removeEventListener('scroll', checkContrast);
            clearInterval(interval);
        };
    }, [theme]); // Add theme dependency so it updates when theme toggles

    // State for animation duration control
    const [moveDuration, setMoveDuration] = useState(0.1);

    // Function to spawn eater and consume the stroke
    const fadeOutCurrentStroke = useCallback(() => {
        const dotsToConsume = [...currentStrokeDots.current];
        currentStrokeDots.current = [];

        if (dotsToConsume.length <= 1) {
            // If it's just a single tap, just clear the dots silently without spawning the bot
            setPaintDots(prev => prev.filter(dot => !dotsToConsume.some(d => d.id === dot.id)));
            return;
        }

        setEaterVisible(true);
        setMoveDuration(0); // Instant placement
        setEaterPos({ x: 48, y: 48, rotate: 0 }); // Home position (top-left)

        // Wait for instant placement to render
        setTimeout(() => {
            // Phase 1: Fly In
            setMoveDuration(0.8);
            const firstDot = dotsToConsume[0];
            setEaterPos({ x: firstDot.x, y: firstDot.y, rotate: 0 });

            // Wait for Fly In
            setTimeout(() => {
                // Phase 2: Start Eating
                setMoveDuration(0.1); // Fast for eating
                let cumulativeDelay = 0;

                dotsToConsume.forEach((dot, index) => {
                    const progress = index / Math.max(dotsToConsume.length - 1, 1);
                    const delay = 70 * Math.pow(1 - progress, 2) + 15;
                    cumulativeDelay += delay;

                    setTimeout(() => {
                        setEaterPos((prev) => {
                            let rotate = prev.rotate;
                            if (index < dotsToConsume.length - 1) {
                                const nextDot = dotsToConsume[index + 1];
                                const angle = Math.atan2(nextDot.y - dot.y, nextDot.x - dot.x) * (180 / Math.PI);
                                rotate = angle;
                            }
                            return { x: dot.x, y: dot.y, rotate };
                        });
                        // Eat the dot
                        setPaintDots(prev => prev.filter(p => p.id !== dot.id));

                        // If last dot
                        if (index === dotsToConsume.length - 1) {
                            setTimeout(() => {
                                // Phase 3: Fly Out
                                setMoveDuration(0.8);
                                const homeX = 48;
                                const homeY = 48;
                                const angleToHome = Math.atan2(homeY - dot.y, homeX - dot.x) * (180 / Math.PI);
                                setEaterPos({ x: homeX, y: homeY, rotate: angleToHome });

                                // Phase 4: Reset
                                setTimeout(() => {
                                    setEaterVisible(false);
                                    setMoveDuration(0.1); // Reset duration
                                }, 800);
                            }, 100);
                        }
                    }, cumulativeDelay);
                });
            }, 800); // 800ms for Fly In
        }, 50);
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
                const newDot: PaintDot = {
                    id: paintIdRef.current++,
                    x: e.clientX,
                    y: e.clientY,
                    color: 'white', // Color inversion handled by mix-blend-difference
                    size: 5 + Math.random() * 3,
                };

                setPaintDots(prev => [...prev, newDot]);
                // Store full dot info
                currentStrokeDots.current.push(newDot);
                lastPaintPos.current = { x: e.clientX, y: e.clientY };
            }
        }
    }, [cursorX, cursorY, isVisible, velocityScale]);

    const handleMouseDown = useCallback((e: MouseEvent) => {
        // Prevent text selection
        e.preventDefault();

        setIsClicking(true);
        setIsPainting(true);
        isMouseDownRef.current = true;
        lastPaintPos.current = { x: e.clientX, y: e.clientY };
        currentStrokeDots.current = [];

        // Add initial dot on click
        const newDot: PaintDot = {
            id: paintIdRef.current++,
            x: e.clientX,
            y: e.clientY,
            color: 'white',
            size: 6,
        };
        setPaintDots(prev => [...prev, newDot]);
        currentStrokeDots.current.push(newDot);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsClicking(false);
        setIsPainting(false);
        isMouseDownRef.current = false;

        // Trigger robot eater
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

    const handleMouseLeave = useCallback((e: MouseEvent) => {
        // If moving into an iframe, don't hide the cursor
        if (e.relatedTarget instanceof HTMLIFrameElement) {
            return;
        }

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
            {/* Paint dots canvas */}
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
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.1 }}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Resting Bot */}
            <AnimatePresence>
                {!eaterVisible && !isPainting && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`fixed top-8 left-8 z-[50] hidden md:flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border shadow-lg pointer-events-none select-none transition-colors duration-300 cursor-element
                       ${botContrast === 'dark'
                                ? 'bg-white/20 border-white/30 shadow-black/20'
                                : 'bg-white border-black/10 shadow-black/10'}`}
                    >
                        <Bot size={18} className={botContrast === 'dark' ? 'text-white' : 'text-black'} />
                        <span className={`text-xs font-mono font-medium tracking-tight ${botContrast === 'dark' ? 'text-white/80' : 'text-black'}`}>
                            Hold and move
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Eater Bot */}
            <AnimatePresence>
                {eaterVisible && (
                    <motion.div
                        className="fixed pointer-events-none z-[9995] text-white mix-blend-difference"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            left: eaterPos.x,
                            top: eaterPos.y,
                            rotate: eaterPos.rotate
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: moveDuration }}
                        style={{ transform: 'translate(-50%, -50%)', marginLeft: '-12px', marginTop: '-12px' }}
                    >
                        <Bot size={24} strokeWidth={2.5} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Cursor Dot & Hand Morph */}
            <motion.div
                ref={cursorRef}
                className="fixed pointer-events-none z-[9999] mix-blend-difference cursor-element flex items-center justify-center overflow-visible"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: isHovering ? 32 : 12,
                    height: isHovering ? 32 : 12,
                }}
            >
                <AnimatePresence mode="wait">
                    {isHovering ? (
                        <motion.div
                            key="hand"
                            initial={{ scale: 0, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0, rotate: -20 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Pointer size={24} fill="white" color="white" className="drop-shadow-sm" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dot"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="w-full h-full bg-white rounded-full"
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Cursor Ring */}
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

            {/* Hover Text */}
            <AnimatePresence>
                {hoverText && (
                    <motion.div
                        className="fixed pointer-events-none z-[9999] cursor-element"
                        style={{ x: cursorXSpring, y: cursorYSpring }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <div className="ml-10 bg-bg-primary/90 backdrop-blur-md border border-border-primary px-3 py-1.5 rounded-lg shadow-xl shrink-0">
                            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-fg-primary whitespace-nowrap">
                                {hoverText}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        touch-action: none !important;
                    }
                    body {
                        overflow: hidden !important;
                        touch-action: none;
                    }
                ` : ''}
            `}</style>
        </>
    );
}
