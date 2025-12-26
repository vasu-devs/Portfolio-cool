import { motion } from 'framer-motion';
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
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="p-3 md:p-4 rounded-full border border-border-primary hover:bg-fg-primary hover:text-bg-primary transition-colors block">
                <Icon size={18} className="md:w-5 md:h-5" />
            </a>
        </MagneticButton>
    );
};
