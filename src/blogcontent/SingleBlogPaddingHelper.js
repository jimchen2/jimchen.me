export function calculateBlogPadding() {
    const windowWidth = window.innerWidth;
    const basePaddingTop = 30;
    
    // Default padding values based on screen size
    const getPaddingValues = (width) => {
        if (width >= 1200) return { left: 10, right: 20 };
        if (width >= 600) return { left: 10, right: 10 };
        return { left: 5, right: 5 };
    };

    // Get initial padding values
    const padding = getPaddingValues(windowWidth);

    return {
        paddingTop: `${basePaddingTop}px`,
        paddingLeft: `${padding.left}%`,
        paddingRight: `${padding.right}%`,
    };
}