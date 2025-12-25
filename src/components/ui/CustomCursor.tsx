import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface CustomCursorProps {
    theme: 'light' | 'dark';
}

export function CustomCursor({ theme }: CustomCursorProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [hoverText, setHoverText] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const cursorRef = useRef<HTMLDivElement>(null);

    // Use motion values for smooth animation
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Spring animation for smooth following
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);

        if (!isVisible) {
            setIsVisible(true);
        }
    }, [cursorX, cursorY, isVisible]);

    const handleMouseDown = useCallback(() => setIsClicking(true), []);
    const handleMouseUp = useCallback(() => setIsClicking(false), []);

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
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        // Add event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
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
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            document.documentElement.removeEventListener('mouseenter', handleMouseEnter);

            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnterInteractive);
                el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
            });

            document.body.style.cursor = 'auto';
        };
    }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseEnterInteractive, handleMouseLeaveInteractive, handleMouseLeave, handleMouseEnter]);

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
            {/* Main cursor dot */}
            <motion.div
                ref={cursorRef}
                className="fixed pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isClicking ? 0.8 : isHovering ? 0.5 : 1,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.15 }}
            >
                <div
                    className="rounded-full"
                    style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'white',
                    }}
                />
            </motion.div>

            {/* Cursor ring */}
            <motion.div
                className="fixed pointer-events-none z-[9998]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isClicking ? 0.9 : isHovering ? 1.5 : 1,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                <div
                    className="rounded-full"
                    style={{
                        width: '40px',
                        height: '40px',
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
                    className="fixed pointer-events-none z-[9999]"
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

            {/* Global styles to hide cursor on all elements */}
            <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
        </>
    );
}
