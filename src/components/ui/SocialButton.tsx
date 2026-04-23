import { MagneticButton } from './MagneticButton';
import { LucideIcon } from 'lucide-react';

interface SocialButtonProps {
    href: string;
    icon: LucideIcon;
    label: string;
}

export const SocialButton = ({ href, icon: Icon, label }: SocialButtonProps) => {
    return (
        <MagneticButton>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group relative flex items-center justify-center p-2.5 md:w-14 md:h-14 rounded-full border border-fg-primary/30 bg-gradient-to-br from-fg-primary/[0.18] via-fg-primary/[0.10] to-fg-primary/[0.04] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_10px_30px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-500 hover:border-fg-primary/50 hover:shadow-[0_14px_40px_rgba(0,0,0,0.28),inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.15)]"
            >
                {/* Top gleam — bright reflection along the upper edge */}
                <span className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-fg-primary/[0.18] to-transparent" />

                {/* Hover Background Expansion */}
                <div className="absolute inset-0 bg-fg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />

                {/* Icon */}
                <Icon
                    size={20}
                    className="relative z-10 text-fg-primary group-hover:text-bg-primary transition-colors duration-500 md:w-6 md:h-6"
                />
            </a>
        </MagneticButton>
    );
};
