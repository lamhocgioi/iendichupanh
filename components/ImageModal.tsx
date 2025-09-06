/* eslint-disable @next/next/no-img-element */
// components/ImageModal.tsx - Enhanced modal với UX tối ưu
import { useEffect, useState, useCallback, useRef } from 'react';

interface DriveFile {
  id: string;
  name: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

interface ImageModalProps {
  isOpen: boolean;
  images: DriveFile[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageModal = ({ isOpen, images, currentIndex, onClose, onNext, onPrev }: ImageModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentImage = images[currentIndex];

  // Enhanced image URL với quality cao hơn
  const getHighQualityImageUrl = useCallback((file: DriveFile): string => {
    if (file.thumbnailLink) {
      return file.thumbnailLink.replace(/=s\d+$/, "=s1600"); // Tăng từ s1024 lên s1600
    }
    if (file.webContentLink) {
      return file.webContentLink;
    }
    return `https://drive.google.com/uc?export=view&id=${file.id}`;
  }, []);

  const imageUrl = currentImage ? getHighQualityImageUrl(currentImage) : '';

  // Reset state khi image thay đổi
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Enhanced keyboard navigation với thêm shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      e.preventDefault();
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ': // Spacebar để next
          onNext();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          setScale(prev => Math.min(prev + 0.2, 4)); // Max zoom 4x
          break;
        case '-':
          setScale(prev => Math.max(prev - 0.2, 0.5));
          break;
        case '0':
          setScale(1);
          setPosition({ x: 0, y: 0 });
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  // Body scroll lock với fix layout shift
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Enhanced touch handling với zoom support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(scale > 1);
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && scale > 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  }, [isDragging, scale, touchStart]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Swipe detection với threshold cao hơn
      if (distance > 80 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          onPrev();
        } else {
          onNext();
        }
      }
    }
    setIsDragging(false);
  }, [isDragging, touchStart, onNext, onPrev]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isOpen) return;
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale(prev => Math.min(Math.max(prev + delta, 0.5), 4));
  }, [isOpen]);

  // Double-click to zoom
  const handleDoubleClick = useCallback(() => {
    if (scale === 1) {
      setScale(2.5);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  // Click outside to close
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Image handlers
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoaded(true);
    setImageError(true);
  }, []);

  // Preload next/prev images for smoother experience
  useEffect(() => {
    if (isOpen && images.length > 1) {
      const preloadIndexes = [
        (currentIndex + 1) % images.length,
        (currentIndex - 1 + images.length) % images.length
      ];
      
      preloadIndexes.forEach(index => {
        const img = new Image();
        img.src = getHighQualityImageUrl(images[index]);
      });
    }
  }, [isOpen, currentIndex, images, getHighQualityImageUrl]);

  if (!isOpen || !currentImage) return null;

  return (
    <div 
      className="modal is-open modal-enhanced"
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Navigation buttons - chỉ hiện khi có nhiều hơn 1 ảnh */}
      {images.length > 1 && (
        <>
          <button 
            className="modal-nav modal-prev"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Ảnh trước"
          >
            ←
          </button>
          <button 
            className="modal-nav modal-next"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Ảnh tiếp"
          >
            →
          </button>
        </>
      )}

      {/* Close button với class mới */}
      <button
        className="modal__close modal-close-enhanced"
        onClick={onClose}
        aria-label="Đóng"
      >
        ×
      </button>

      {/* Image info bar */}
      <div className="modal-info">
        <span className="modal-counter">{currentIndex + 1} / {images.length}</span>
        {scale !== 1 && <span className="modal-zoom">Zoom: {Math.round(scale * 100)}%</span>}
        <span className="modal-filename">{currentImage.name}</span>
      </div>

      {/* Zoom controls */}
      <div className="zoom-controls">
        <button
          className="zoom-btn zoom-in"
          onClick={(e) => { e.stopPropagation(); setScale(prev => Math.min(prev + 0.2, 4)); }}
          disabled={scale >= 4}
          aria-label="Phóng to"
        >
          +
        </button>
        <button
          className="zoom-btn zoom-out"
          onClick={(e) => { e.stopPropagation(); setScale(prev => Math.max(prev - 0.2, 0.5)); }}
          disabled={scale <= 0.5}
          aria-label="Thu nhỏ"
        >
          −
        </button>
        <button
          className="zoom-btn zoom-reset"
          onClick={(e) => { e.stopPropagation(); setScale(1); setPosition({ x: 0, y: 0 }); }}
          disabled={scale === 1 && position.x === 0 && position.y === 0}
          aria-label="Reset zoom"
        >
          ⌂
        </button>
      </div>

      {/* Main image container */}
      <div className="modal__content modal-content-enhanced">
        {!imageLoaded && !imageError && (
          <div className="modal-loading">
            <div className="modal-spinner"></div>
            <span>Đang tải...</span>
          </div>
        )}
        
        {imageError && (
          <div className="modal-error">
            <span>⚠️ Không thể tải ảnh</span>
            <button 
              className="modal-retry-btn"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        )}

        <img
          ref={imageRef}
          src={imageUrl}
          alt={currentImage.name}
          className={`modal-image ${imageLoaded && !imageError ? 'show' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onDoubleClick={handleDoubleClick}
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            cursor: scale > 1 ? 'move' : 'zoom-in',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ImageModal;