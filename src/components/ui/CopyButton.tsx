import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CopyButtonProps {
    contentId?: string;
    text?: string;
    className?: string;
}

export const CopyButton = ({ contentId, text, className = "" }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        let textToCopy = text;
        if (contentId) {
            const element = document.getElementById(contentId);
            if (element) {
                textToCopy = element.innerText;
            }
        }

        if (textToCopy) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy: ", err);
            }
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-border-primary bg-bg-secondary/50 hover:bg-bg-secondary transition-all duration-300 text-fg-secondary hover:text-fg-primary group relative overflow-hidden ${className}`}
            title="Copy modal content"
        >
            <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                    <motion.div
                        key="check"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2"
                    >
                        <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
                        <span className="text-[10px] md:text-xs font-mono uppercase tracking-wider font-bold text-green-500">Copied</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="copy"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2"
                    >
                        <Copy className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] md:text-xs font-mono uppercase tracking-wider font-bold">Copy Text</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fg-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
    );
};
