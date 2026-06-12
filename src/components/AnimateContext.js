import React, {
    useEffect, useRef, useCallback,
    createContext, useContext, useState
} from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMotionValue } from 'framer-motion';


const AnimateContext = createContext();

export const AnimateProvider = ({ children }) => {
    const defaultMode = 'normal';
    const storagekey = 'zcp-animode';

    const [mode, setMode] = useState(() => {
        const initialMode = window?.localStorage.getItem('zcp-animode') || defaultMode;
        return {
            manual: initialMode,
            system: getSystemMode(initialMode)
        }
    });

    const setAniMode = (mode) => {
        setMode((prev) => {
            if (mode === prev.manual) {
                return prev;
            }
            const newMode = mode ?? defaultMode;
            window.localStorage.setItem(storagekey, newMode);
            return {
                manual: newMode,
                system: getSystemMode(newMode),
            };
        });
    }

    const handleMediaQuery = useCallback(
        (e) => {
            if (mode.manual === 'system') {
                setMode((prev) => {
                    const systemMode = e?.matches ? 'reduce' : 'normal';

                    if (prev.system === systemMode) {
                        return prev;
                    }
                    return { ...prev, system: systemMode };
                });
            }
        },
        [mode.manual],
    );

    const mediaListener = useRef(handleMediaQuery);
    mediaListener.current = handleMediaQuery;

    useEffect(() => {
        const handler = (...args) => mediaListener.current(...args);

        // Always listen to System preference
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');

        // Intentionally use deprecated listener methods to support iOS & old browsers
        media.addListener(handler);
        handler(media);
        return () => {
            media.removeListener(handler);
        };
    }, []);

    const lesserThanSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const lesserThanMd = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const windowDimRef = useRef({
        w: typeof window !== 'undefined' ? window.innerWidth : 1,
        h: typeof window !== 'undefined' ? window.innerHeight : 1
    });

    useEffect(() => {
        const update = () => {
            windowDimRef.current = { w: window.innerWidth, h: window.innerHeight };
        };
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const mousePosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleGlobalMouseMove = (event) => {
            if (!windowDimRef?.current) return;

            const x = event.clientX / windowDimRef.current.w;
            const y = event.clientY / windowDimRef.current.h;

            mouseX.set(x);
            mouseY.set(y);

            mousePosRef.current.x = x * 2 - 1;
            mousePosRef.current.y = y * 2 - 1;
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, [mouseX, mouseY]);

    return (
        <AnimateContext.Provider
            value={{
                manual: mode.manual, system: mode.system, setAniMode,
                lesserThanSm: lesserThanSm, lesserThanMd: lesserThanMd,
                windowDimRef: windowDimRef,
                mouseX: mouseX, mouseY: mouseY, mousePosRef: mousePosRef
            }}
        >
            {children}
        </AnimateContext.Provider>
    );
}

export const useAnimateContext = () => useContext(AnimateContext);

function getSystemMode(mode) {
    if (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        mode === 'system'
    ) {
        const prm = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prm.matches) {
            return 'reduce';
        }
        return 'normal';
    }
    return undefined;
}