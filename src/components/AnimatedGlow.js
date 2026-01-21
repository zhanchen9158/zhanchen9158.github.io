import { animate, motion } from "motion/react";
import { useAnimateContext } from './AnimateContext';

const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { delay: 0.15, duration: 1.35, ease: "easeInOut" }
    },
    static: { pathLength: 1, opacity: 1 }
};

export default function AnimatedGlow({ key }) {
    const { manual, system } = useAnimateContext();
    const mode = system || manual;

    const pathProps = {
        fill: "transparent",
        strokeLinecap: "round",
        variants: draw,
        initial: "hidden",
        animate: mode === 'normal' ? "visible" : "static",
        exit: 'hidden',
    };

    return (
        <svg
            // 1. Defining the coordinate space (0 to 100)
            viewBox="0 0 100 100"
            // 2. Allow the SVG to stretch to fill the container exactly
            preserveAspectRatio="none"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'visible',
                zIndex: -1,
            }}
        >
            <g>
                {/* 1. Large Diffused Glow */}
                <motion.path
                    d="M 0 0 H 100"
                    stroke="white"
                    strokeWidth="6"
                    style={{ filter: "blur(8px)", opacity: 0.2 }}
                    {...pathProps}
                />
                {/* 2. Tight Neon Beam */}
                <motion.path
                    d="M 0 0 H 100"
                    stroke="white"
                    strokeWidth="3"
                    style={{ filter: "blur(3px)", opacity: 0.5 }}
                    {...pathProps}
                />
                {/* 3. The Sharp Core */}
                <motion.path
                    d="M 1 0 H 95"
                    stroke="white"
                    strokeWidth="2"
                    style={{ filter: "blur(1px)", opacity: 1 }}
                    {...pathProps}
                />
            </g>
            <g>
                {/* 1. Large Diffused Glow */}
                <motion.path
                    d="M 0 0 V 100"
                    stroke="white"
                    strokeWidth="6"
                    style={{ filter: "blur(8px)", opacity: 0.2 }}
                    {...pathProps}
                />
                {/* 2. Tight Neon Beam */}
                <motion.path
                    d="M 0 0 V 100"
                    stroke="white"
                    strokeWidth="3"
                    style={{ filter: "blur(3px)", opacity: 0.5 }}
                    {...pathProps}
                />
                {/* 3. The Sharp Core */}
                <motion.path
                    d="M 0 1 V 95"
                    stroke="white"
                    strokeWidth="2"
                    style={{ filter: "blur(1px)", opacity: 1 }}
                    {...pathProps}
                />
            </g>
        </svg>
    );
}