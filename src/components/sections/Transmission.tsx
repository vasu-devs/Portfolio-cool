
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Mail, Twitter, Linkedin, Github } from 'lucide-react';

export default function Transmission() {
    const [copied, setCopied] = useState(false);
    const [textIndex, setTextIndex] = useState(0);
    const [line2, setLine2] = useState(false);

    // Typing effect
    useEffect(() => {
        const t1 = setTimeout(() => setTextIndex(1), 500);
        const t2 = setTimeout(() => setLine2(true), 1500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const copyEmail = () => {
        navigator.clipboard.writeText("siddhvasudev1402@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="h-full w-full flex items-center justify-center relative overflow-hidden">
            {/* Terminal Window */}
            <div className="w-full max-w-2xl bg-black border border-white/20 p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
                {/* Header */}
                <div className="border-b border-white/10 pb-4 mb-8 flex justify-between items-center text-xs font-mono text-warrior-silver">
                    <span>SECURE_CHANNEL_v9.0</span>
                    <span className="animate-pulse flex items-center gap-2">
                        <span className="block w-2 h-2 rounded-full bg-warrior-crimson" />
                        LIVE
                    </span>
                </div>

                {/* Content */}
                <div className="font-mono text-sm md:text-base space-y-6">
                    <div className="text-gray-400">
                        <span className="text-warrior-gold">root@void:~$</span> request_connection --target="vasudev-siddh"
                    </div>

                    {textIndex >= 1 && (
                        <div className="text-white">
                            <span className="text-warrior-crimson">[SYSTEM]</span> ACCESS GRANTED. CHANNEL OPEN.
                        </div>
                    )}

                    {line2 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="pt-8"
                        >
                            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-12">
                                <span className="text-2xl md:text-4xl font-display font-bold text-white tracking-widest">
                                    LETS_TALK.exe
                                </span>
                                <button
                                    onClick={copyEmail}
                                    className="group flex items-center gap-4 border border-white/20 px-6 py-3 hover:bg-white/5 hover:border-white/50 transition-all active:scale-95"
                                >
                                    <span className="text-warrior-silver group-hover:text-white">
                                        siddhvasudev1402@gmail.com
                                    </span>
                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500 group-hover:text-white" />}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'GITHUB', icon: Github, url: 'https://github.com/vasu-devs' },
                                    { label: 'TWITTER', icon: Twitter, url: 'https://twitter.com/Vasu_DevS' },
                                    { label: 'LINKEDIN', icon: Linkedin, url: 'https://linkedin.com/in/vasudev-siddh/' },
                                    { label: 'EMAIL', icon: Mail, url: 'mailto:siddhvasudev1402@gmail.com' },
                                ].map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.url}
                                        target="_blank"
                                        className="flex items-center justify-center gap-2 py-4 border border-white/10 hover:bg-warrior-crimson hover:border-warrior-crimson text-gray-400 hover:text-white transition-all duration-300"
                                    >
                                        <link.icon size={16} />
                                        <span className="text-xs tracking-wider">{link.label}</span>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Scanlines Overlay - moved pointer-events-none to prevent blocking clicks */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] pointer-events-none" />
            </div>
        </section>
    );
}
