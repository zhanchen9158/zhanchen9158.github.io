import React, {
    useState, useEffect
} from 'react';
import { MotionValue } from "motion/react";


function getWindowWidth() {
    const windowWidth = new MotionValue(
        typeof window !== "undefined" ? window.innerWidth : 1
    );

    useEffect(() => {
        const handleResize = () => {
            windowWidth.set(window.innerWidth);
        };

        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return windowWidth;
}

export { getWindowWidth };