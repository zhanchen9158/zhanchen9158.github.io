import React, {
    useEffect, useRef
} from 'react';
import { MotionValue } from "motion/react";

function getWindowDimRef() {
    const windowDimRef = useRef({ w: 1, h: 1 });

    useEffect(() => {
        const update = () => {
            windowDimRef.current = { w: window.innerWidth, h: window.innerHeight };
        };

        update();

        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return windowDimRef;
}

function getWindowWidth() {
    const windowWidth = new MotionValue(
        typeof window !== "undefined" ? window.innerWidth : 1
    );

    const handleResize = () => {
        windowWidth.set(window.innerWidth);
    };

    if (typeof window !== "undefined") {
        window.addEventListener("resize", handleResize);
    }

    return windowWidth;
}

export { getWindowDimRef, getWindowWidth };