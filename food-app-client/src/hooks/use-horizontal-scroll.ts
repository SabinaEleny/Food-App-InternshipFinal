import {useCallback, useEffect, useRef, useState} from 'react';

export function useHorizontalScroll<T extends HTMLElement>() {
    const scrollContainerRef = useRef<T>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const {scrollLeft, scrollWidth, clientWidth} = container;
            const isScrollable = scrollWidth > clientWidth;
            setShowLeftArrow(isScrollable && scrollLeft > 0);
            setShowRightArrow(isScrollable && scrollLeft < scrollWidth - clientWidth - 1);
        }
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            handleScroll();
            container.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll);
            return () => {
                container.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleScroll);
            };
        }
    }, [handleScroll]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            scrollContainerRef.current.scrollBy({left: scrollAmount, behavior: 'smooth'});
        }
    };

    return {scrollContainerRef, scroll, showLeftArrow, showRightArrow};
}