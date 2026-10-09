
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuraPlayer({ startPlaying }: { startPlaying: boolean }) {
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (startPlaying && audioRef.current) {
            audioRef.current.volume = 0.4;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play prevented:", error);
                });
            }
        }
    }, [startPlaying]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-12 right-12 z-50 mix-blend-difference"
        >
            <audio
                ref={audioRef}
                // Dark Ambient Drone
                src="https://pixabay.com/music/download/audio/2022/10/25/audio_2d83279189.mp3"
                loop
            />

            <button
                onClick={toggleMute}
                className="text-warrior-silver hover:text-warrior-crimson transition-colors flex items-center gap-4 group"
            >
                <span className="font-mono text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {isMuted ? 'SILENCE' : 'DRONE'}
                </span>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
        </motion.div>
    );
}
