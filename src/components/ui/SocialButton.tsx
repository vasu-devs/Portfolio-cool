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
                className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-fg-primary/10 bg-fg-primary/[0.03] backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-fg-primary/30"
            >
                {/* Hover Background Expansion */}
                <div className="absolute inset-0 bg-fg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.76, 0, 0.24, 1]" />

                {/* Icon */}
                <Icon
                    size={20}
                    className="relative z-10 text-fg-primary group-hover:text-bg-primary transition-colors duration-500 md:w-6 md:h-6"
                />
            </a>
        </MagneticButton>
    );
};
