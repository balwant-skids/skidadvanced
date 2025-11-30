/**
 * Image Optimization Utilities
 * 
 * Provides utilities for WebP conversion, responsive images,
 * and lazy loading to improve performance.
 */

/**
 * Image format configuration
 */
export const IMAGE_FORMATS = {
  webp: 'image/webp',
  jpeg: 'image/jpeg',
  png: 'image/png',
} as const;

/**
 * Responsive image sizes for srcset
 */
export const RESPONSIVE_SIZES = [320, 640, 768, 1024, 1280, 1536, 1920] as const;

/**
 * Image quality settings
 */
export const IMAGE_QUALITY = {
  low: 60,
  medium: 75,
  high: 90,
} as const;

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: readonly number[] = RESPONSIVE_SIZES
): string {
  return sizes
    .map((size) => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizesAttribute(
  breakpoints: Array<{ maxWidth: string; size: string }>
): string {
  const sizeStrings = breakpoints.map(
    (bp) => `(max-width: ${bp.maxWidth}) ${bp.size}`
  );
  sizeStrings.push('100vw'); // Default size
  return sizeStrings.join(', ');
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Get optimized image URL with format and quality
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string {
  const { width, height, quality = IMAGE_QUALITY.medium, format = 'webp' } = options;

  // If using Cloudflare Image Resizing
  if (process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_RESIZING === 'true') {
    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());
    params.append('quality', quality.toString());
    params.append('format', format);

    return `/cdn-cgi/image/${params.toString()}/${src}`;
  }

  // Fallback to Next.js Image Optimization
  const params = new URLSearchParams();
  params.append('url', src);
  if (width) params.append('w', width.toString());
  if (quality) params.append('q', quality.toString());

  return `/_next/image?${params.toString()}`;
}

/**
 * Lazy load image with Intersection Observer
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  options: IntersectionObserverInit = {}
): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback: load immediately
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement;

        // Load the image
        if (image.dataset.src) {
          image.src = image.dataset.src;
        }
        if (image.dataset.srcset) {
          image.srcset = image.dataset.srcset;
        }

        // Remove loading class
        image.classList.remove('lazy-loading');
        image.classList.add('lazy-loaded');

        // Stop observing
        observer.unobserve(image);
      }
    });
  }, options);

  observer.observe(img);

  // Return cleanup function
  return () => observer.disconnect();
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, options: { as?: string } = {}): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = options.as || 'image';
  link.href = src;

  document.head.appendChild(link);
}

/**
 * Convert image to WebP (client-side)
 */
export async function convertToWebP(
  file: File,
  quality: number = IMAGE_QUALITY.medium
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not convert image to WebP'));
            }
          },
          'image/webp',
          quality / 100
        );
      };

      img.onerror = () => reject(new Error('Could not load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions
 */
export function getImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

/**
 * Calculate aspect ratio
 */
export function calculateAspectRatio(
  width: number,
  height: number
): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Resize image maintaining aspect ratio
 */
export function resizeImage(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Image optimization configuration for Next.js
 */
export const nextImageConfig = {
  formats: ['image/webp', 'image/jpeg'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  domains: ['localhost', process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''].filter(Boolean),
  minimumCacheTTL: 60,
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};

/**
 * Cloudflare Image Resizing options
 */
export const cloudflareImageOptions = {
  fit: 'scale-down' as const,
  quality: IMAGE_QUALITY.medium,
  format: 'auto' as const,
  metadata: 'none' as const,
};
