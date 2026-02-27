/**
 * Image Optimization Utilities for Mobile Performance
 * Provides responsive image loading and optimization
 */

interface ImageDimensions {
  width: number;
  height: number;
}

interface ResponsiveImageOptions {
  src: string;
  alt: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
}

/**
 * Get optimized image source based on device pixel ratio and screen size
 */
export function getOptimizedImageSrc(src: string, targetWidth?: number): string {
  // For generated assets, use the original path
  if (src.includes('/assets/generated/')) {
    return src;
  }

  // For other assets, return as-is (can be extended for CDN optimization)
  return src;
}

/**
 * Get responsive image sizes attribute
 */
export function getResponsiveSizes(maxWidth?: number): string {
  if (maxWidth) {
    return `(max-width: 640px) ${Math.min(maxWidth, 640)}px, (max-width: 768px) ${Math.min(maxWidth, 768)}px, ${maxWidth}px`;
  }
  return '(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1280px';
}

/**
 * Preload critical images for faster initial render
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images in parallel
 */
export async function preloadImages(sources: string[]): Promise<void> {
  await Promise.all(sources.map(src => preloadImage(src)));
}

/**
 * Get image dimensions from cache or load
 */
const imageDimensionsCache = new Map<string, ImageDimensions>();

export async function getImageDimensions(src: string): Promise<ImageDimensions> {
  if (imageDimensionsCache.has(src)) {
    return imageDimensionsCache.get(src)!;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
      imageDimensionsCache.set(src, dimensions);
      resolve(dimensions);
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Create responsive image props
 */
export function createResponsiveImageProps(options: ResponsiveImageOptions) {
  const { src, alt, sizes, loading = 'lazy', className } = options;

  return {
    src: getOptimizedImageSrc(src),
    alt,
    sizes: sizes || getResponsiveSizes(),
    loading,
    className,
    decoding: 'async' as const,
  };
}

/**
 * Check if image is in viewport (for lazy loading)
 */
export function isImageInViewport(element: HTMLElement, threshold = 200): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight + threshold &&
    rect.bottom > -threshold &&
    rect.left < window.innerWidth + threshold &&
    rect.right > -threshold
  );
}
