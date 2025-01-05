export default function useScroller(elementRef: any) {

    const scrollPercentage = ref(0);
    const scrollPixels = ref(0);
    const scrollContainerRef: any = ref(elementRef || null);

    const scrollToBottom = (behavior: string) => {
        const container = scrollContainerRef.value;
        container.scrollTo({
            top: container.scrollHeight,
            behavior: behavior,
        });
    };

    const scrollToTop = (behavior: string) => {
        const container = scrollContainerRef.value;
        container.scrollTo({
            top: 0,
            behavior: behavior,
        });
    };

    const updateScrollPercentage = () => {
        const container = scrollContainerRef.value;
        const scrollHeight = container.scrollHeight - container.clientHeight;
        const scrollTop = container.scrollTop;
        scrollPixels.value = container.scrollHeight - container.clientHeight;
        scrollPercentage.value = (scrollTop / scrollHeight) * 100;
    };

    return { 
        scrollPercentage, 
        scrollPixels,
        scrollContainerRef,
        scrollToBottom, 
        scrollToTop, 
        updateScrollPercentage,  
    };

}




