/**
 * LazyImage Component
 * Provides lazy loading with blur-up placeholder effect for optimized image loading
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
    src: string;
    alt?: string;
    className?: string;
    placeholderColor?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt = '',
    className = '',
    placeholderColor = '#e5e7eb'
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '100px', // Start loading 100px before image enters viewport
                threshold: 0.01
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    return (
        <div
            ref={imgRef}
            className={cn(
                'lazy-image-container relative overflow-hidden rounded-lg',
                className
            )}
            style={{
                backgroundColor: placeholderColor,
                aspectRatio: 'auto'
            }}
        >
            {/* Blur placeholder skeleton */}
            <div
                className={cn(
                    'absolute inset-0 transition-opacity duration-500',
                    isLoaded ? 'opacity-0' : 'opacity-100'
                )}
                style={{
                    background: `linear-gradient(90deg, ${placeholderColor} 0%, #f3f4f6 50%, ${placeholderColor} 100%)`,
                    backgroundSize: '200% 100%',
                    animation: isLoaded ? 'none' : 'shimmer 1.5s infinite'
                }}
            />

            {/* Actual image */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        'w-full h-auto transition-all duration-500',
                        isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'
                    )}
                    style={{
                        transform: isLoaded ? 'scale(1)' : 'scale(1.05)'
                    }}
                />
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
                    Failed to load image
                </div>
            )}
        </div>
    );
};

export default LazyImage;
