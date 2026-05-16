import { useCallback } from 'react';

export default function useRefRegistry(ref) {
    const getRefSetter = useCallback((el) => {
        if (!ref || !el) return;
        if (el) {
            ref.current[el.name] = el;
        } else {
            delete ref.current[el.name];
        }
    }, []);

    return { getRefSetter };
}