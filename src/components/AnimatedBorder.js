import { motion } from "framer-motion";
import { useAnimateContext } from './AnimateContext';

const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { delay: 1, duration: 1.35, ease: "easeInOut" }
    },
    static: { pathLength: 1, opacity: 1, }
};

export default function AnimatedBorder({ key }) {

    const { manual, system } = useAnimateContext();
    const mode = system || manual;

    return (
        <svg
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                borderRadius: '12px',
            }}
        >
            <defs>
                <linearGradient id="img-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00dbde" />
                    <stop offset="100%" stopColor="#fc00ff" />
                </linearGradient>
            </defs>
            <motion.rect
                key={key}
                width="100%"
                height="100%"
                rx="12"
                stroke="url(#img-gradient)"
                strokeWidth="6"
                fill="transparent"
                variants={draw}
                initial="hidden"
                whileInView={mode == 'normal' ? "visible" : "static"}
                viewport={{ once: false, amount: 0.5 }}
            />
        </svg>
    );
};