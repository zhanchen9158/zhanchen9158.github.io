import React, { createContext, useContext, useState } from 'react';

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

    const handleMediaQuery = React.useCallback(
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

    const mediaListener = React.useRef(handleMediaQuery);
    mediaListener.current = handleMediaQuery;

    React.useEffect(() => {
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

    return (
        <AnimateContext.Provider value={{ manual: mode.manual, system: mode.system, setAniMode }}>
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