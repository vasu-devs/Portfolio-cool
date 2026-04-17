// Custom SVG brand icons for tools that aren't in react-icons 5.5.0 yet.
// Shapes based on each brand's public logo mark — simplified to 24x24 viewBox
// and using `currentColor` so they work with existing hover/grayscale styling.
//
// Keep these in sync with simple-icons.org when official versions ship.

import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    xmlns: 'http://www.w3.org/2000/svg',
};

// Groq — stylized flame / fast-inference mark. Red-orange #F55036.
export const BrandGroq = (props: IconProps) => (
    <svg {...baseProps} {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2zm-.5 5h3a3.5 3.5 0 0 1 3.5 3.5v.5h-2v-.5a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h1.5v-2h-1v-1.5h3v3.5A3.5 3.5 0 0 1 11.5 18h-3A3.5 3.5 0 0 1 5 14.5v-4A3.5 3.5 0 0 1 8.5 7h3z" />
    </svg>
);

// LiveKit — triangular play mark in a rounded square. Magenta/red #FF3399.
export const BrandLivekit = (props: IconProps) => (
    <svg {...baseProps} {...props}>
        <path d="M4 4h5v5H4V4zm0 7h5v5H4v-5zm0 7h5v2H4v-2zm7-7h5v5h-5v-5zm7-7h2v5h-2V4zm-7 14h5v2h-5v-2zm7-7h2v5h-2v-5z" />
    </svg>
);

// DeepSeek — stylized whale silhouette (brand motif). Blue #4D6BFE.
export const BrandDeepseek = (props: IconProps) => (
    <svg {...baseProps} {...props}>
        <path d="M22 12c0-3.87-3.13-7-7-7-1.89 0-3.6.75-4.86 1.96C8.96 5.73 7.08 5 5 5c-1.66 0-3 1.34-3 3 0 1.3.84 2.4 2 2.82V12c0 3.87 3.13 7 7 7h2v-3h1c3.87 0 7-1.57 7-4zm-17-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </svg>
);

// Qdrant — stylized Q with geometric cut. Red-pink #DC244C.
export const BrandQdrant = (props: IconProps) => (
    <svg {...baseProps} {...props}>
        <path d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.24 6.91 3.84L12 12 5.09 8.08 12 4.24zM5 9.78l6 3.38v6.92l-6-3.33V9.78zm8 10.3v-6.92l6-3.38v6.97l-6 3.33zm3.5-7.12 2.37-1.32-2.37-1.32-2.37 1.32 2.37 1.32z" />
    </svg>
);

// ChromaDB — three-segment pie/palette mark. Orange #FC521F.
export const BrandChromadb = (props: IconProps) => (
    <svg {...baseProps} {...props}>
        <path d="M12 2a10 10 0 0 0-10 10h10V2zm0 20a10 10 0 0 0 7.07-2.93L12 12v10zm7.07-17.07A10 10 0 0 0 12 2v10l7.07-7.07z" />
    </svg>
);

// Neon (serverless Postgres) — stylized lightning bolt. Green #00E699.
export const BrandNeon = (props: IconProps) => (
    <svg {...baseProps} {...props}>
        <path d="M5 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h10l-5-6h5V4H5z M19 4h-2v8l2 2.5V4z" />
    </svg>
);

// LangGraph — connected nodes. Same green family as LangChain #3DA374.
export const BrandLanggraph = (props: IconProps) => (
    <svg {...baseProps} {...props}>
        <circle cx="5" cy="5" r="2.5" />
        <circle cx="19" cy="5" r="2.5" />
        <circle cx="5" cy="19" r="2.5" />
        <circle cx="19" cy="19" r="2.5" />
        <circle cx="12" cy="12" r="2.5" />
        <path
            d="M5 5l7 7M19 5l-7 7M5 19l7-7M19 19l-7-7"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
        />
    </svg>
);
