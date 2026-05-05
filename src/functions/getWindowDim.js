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

let listeners = new Set();
let windowSize = {
    w: typeof window !== 'undefined' ? window.innerWidth : 1,
    h: typeof window !== 'undefined' ? window.innerHeight : 1
};

const handleResize = () => {
    windowSize = { w: window.innerWidth, h: window.innerHeight };
    listeners.forEach(listener => listener(windowSize));
};

function useWindowDim() {
    const [dim, setDim] = useState(windowSize);

    useEffect(() => {
        if (listeners.size === 0) {
            window.addEventListener('resize', handleResize);
        }

        listeners.add(setDim);

        return () => {
            listeners.delete(setDim);
            if (listeners.size === 0) {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    return dim;
}

export { getWindowWidth, useWindowDim };