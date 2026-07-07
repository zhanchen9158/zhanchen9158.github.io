import React, { useEffect, memo } from 'react';

const criticalimport = import.meta.glob([
    '../pics/inkblot*.webp',
    '../pics/wireframe*.webp',
], {
    eager: true,
    query: '?url'
});
const criticalarray = Object.values(criticalimport).map((v, _) => (v.default));

const noncriticalimport = import.meta.glob([
    '../pics/marketintelligence*.webp',
    '../pics/researchdigest*.webp',
    '../pics/mealplanner*.webp'
], {
    eager: true,
    query: '?url'
});
const noncriticalarray = Object.values(noncriticalimport).map((v, _) => (v.default));


const Preloader = memo(function Preloader({ }) {

    useEffect(() => {
        const preload = () => {
            noncriticalarray.forEach((src) => {
                const img = new Image();
                img.src = src;
            });
        };

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(preload);
        } else {
            setTimeout(preload, 2000);
        }
    }, []);

    return (
        <div style={{
            position: 'absolute', width: 0, height: 0,
            overflow: 'hidden', visibility: 'hidden',
        }}>
            {criticalarray.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    decoding="async"
                    fetchpriority="low"
                    loading="lazy"
                    alt=""
                />
            ))}
        </div>
    )
});

export default Preloader;