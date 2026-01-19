/**
 * Documentation Content Renderer
 * Processes HTML content and renders images with lazy loading and blur-up effects
 */

import React, { useEffect, useRef, useState } from 'react';

interface LazyDocImageProps {
    src: string;
    alt?: string;
}

const LazyDocImage: React.FC<LazyDocImageProps> = ({ src, alt = '' }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
                rootMargin: '150px',
                threshold: 0.01
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <figure ref={containerRef} className="lazy-doc-image-wrapper">
            {/* Shimmer placeholder */}
            <div
                className={`lazy-doc-placeholder ${isLoaded ? 'loaded' : ''}`}
                aria-hidden="true"
            />

            {/* Actual image - only load when in view */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    className={`lazy-doc-image ${isLoaded ? 'loaded' : ''}`}
                />
            )}

            {alt && <figcaption className="lazy-doc-caption">{alt}</figcaption>}
        </figure>
    );
};

interface DocumentationContentProps {
    content: string;
    className?: string;
}

const DocumentationContent: React.FC<DocumentationContentProps> = ({
    content,
    className = ''
}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [processedContent, setProcessedContent] = useState<React.ReactNode[]>([]);

    useEffect(() => {
        // Parse HTML and extract images for lazy loading
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const images = doc.querySelectorAll('img');

        // Store image data for replacement
        const imageData: { placeholder: string; src: string; alt: string }[] = [];

        images.forEach((img, index) => {
            const placeholder = `__LAZY_IMAGE_${index}__`;
            const src = img.getAttribute('src') || '';
            const alt = img.getAttribute('alt') || '';

            imageData.push({ placeholder, src, alt });

            // Replace img with placeholder text
            const textNode = doc.createTextNode(placeholder);
            img.parentNode?.replaceChild(textNode, img);
        });

        // Get modified HTML
        const modifiedHtml = doc.body.innerHTML;

        // Split by placeholders and create React nodes
        const parts = modifiedHtml.split(/(__LAZY_IMAGE_\d+__)/);

        const nodes: React.ReactNode[] = parts.map((part, index) => {
            const imageMatch = part.match(/__LAZY_IMAGE_(\d+)__/);

            if (imageMatch) {
                const imageIndex = parseInt(imageMatch[1], 10);
                const data = imageData[imageIndex];
                if (data) {
                    return <LazyDocImage key={`img-${index}`} src={data.src} alt={data.alt} />;
                }
            }

            // Regular HTML content
            return (
                <span
                    key={`content-${index}`}
                    dangerouslySetInnerHTML={{ __html: part }}
                />
            );
        });

        setProcessedContent(nodes);
    }, [content]);

    return (
        <div ref={contentRef} className={`documentation-content ${className}`}>
            {processedContent}

            {/* Lazy image styles */}
            <style>{`
        .lazy-doc-image-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem;
          margin: 1.5rem 0;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          min-height: 200px;
        }
        
        .lazy-doc-placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            #e5e7eb 0%,
            #f3f4f6 50%,
            #e5e7eb 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          transition: opacity 0.5s ease-out;
        }
        
        .lazy-doc-placeholder.loaded {
          opacity: 0;
          pointer-events: none;
        }
        
        .lazy-doc-image {
          display: block;
          width: 100%;
          height: auto;
          opacity: 0;
          filter: blur(10px);
          transform: scale(1.02);
          transition: 
            opacity 0.6s ease-out,
            filter 0.6s ease-out,
            transform 0.6s ease-out;
        }
        
        .lazy-doc-image.loaded {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
        }
        
        .lazy-doc-caption {
          text-align: center;
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          margin-top: 0.5rem;
          font-style: italic;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        /* Dark mode support */
        .dark .lazy-doc-image-wrapper {
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
        }
        
        .dark .lazy-doc-placeholder {
          background: linear-gradient(
            90deg,
            #374151 0%,
            #4b5563 50%,
            #374151 100%
          );
          background-size: 200% 100%;
        }
      `}</style>
        </div>
    );
};

export default DocumentationContent;
export { LazyDocImage };
