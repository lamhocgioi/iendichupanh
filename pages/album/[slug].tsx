/* eslint-disable @next/next/no-img-element */
// pages/album/[slug].tsx - Trang gallery động cho từng album
import { useState, useEffect, useRef } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ImageModal from '../../components/ImageModal';
import { getFolderId, getAlbumTitle, isValidAlbumSlug } from '../../albumFolders';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/router';

// Interface cho dữ liệu từ Google Drive API
interface DriveFile {
    id: string;
    name: string;
    thumbnailLink?: string;
    webContentLink?: string;
}

interface DriveApiResponse {
    files: DriveFile[];
}

interface AlbumPageProps {
    slug: string;
    folderId: string;
    title: string;
}

export default function AlbumPage({ folderId, title }: AlbumPageProps) {
    const [images, setImages] = useState<DriveFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Thêm state cho hero image
    const [heroImage, setHeroImage] = useState<DriveFile | null>(null);

    // Fetch ảnh từ Google Drive API v3 - giữ nguyên logic từ code cũ
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
                if (!API_KEY) {
                    throw new Error('API Key chưa được cấu hình');
                }

                // URL API giống hệt code JavaScript gốc
                const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webContentLink)&orderBy=name`;

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: DriveApiResponse = await response.json();
                console.log('Drive API Response:', data); // Debug log

                if (data.files && data.files.length > 0) {
                    setImages(data.files);
                    setHeroImage(data.files[0]);
                } else {
                    setError('Không tìm thấy ảnh nào trong album này');
                }
            } catch (err) {
                console.error('Drive API Error:', err);
                setError(err instanceof Error ? err.message : 'Lỗi không xác định');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [folderId]);

    // Setup Intersection Observer cho lazy loading - giữ nguyên logic cũ
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        const src = img.dataset.src;
                        if (src) {
                            img.src = src;
                            observerRef.current?.unobserve(img);
                        }
                    }
                });
            },
            { rootMargin: '200px' }
        );

        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);
    }, [router.asPath, folderId]);

    // Tính toán URL thumbnail cho gallery - giữ nguyên logic từ JS gốc
    const getThumbnailUrl = (file: DriveFile): string => {
        if (file.thumbnailLink) {
            return file.thumbnailLink.replace(/=s\d+$/, "=s400");
        } else {
            return `https://drive.google.com/uc?export=view&id=${file.id}`;
        }
    };

    // Modal handlers
    const openModal = (index: number) => {
        setCurrentImageIndex(index);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const showNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const showPrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Render loading spinner - sử dụng component mới
    const renderLoading = () => <LoadingSpinner show={loading} />;

    // Render error state
    const renderError = () => (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            <h3>❌ Lỗi khi tải ảnh</h3>
            <p><strong>Lỗi:</strong> {error}</p>
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p><strong>Các nguyên nhân có thể:</strong></p>
                <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                    <li>API Key sai hoặc chưa được cấu hình</li>
                    <li>Google Drive API chưa được bật</li>
                    <li>Folder không tồn tại hoặc chưa public</li>
                    <li>Vượt quota API (100 requests/100s/user)</li>
                </ul>
            </div>
        </div>
    );

    // Render gallery - giữ nguyên HTML structure và className
    const renderGallery = () => (
        <div id="gallery" className="gallery">
            {images.map((file, index) => (
                <img
                    key={file.id}
                    data-src={getThumbnailUrl(file)}
                    alt={file.name}
                    loading="lazy"
                    onClick={() => openModal(index)}
                    ref={(el) => {
                        if (el && observerRef.current) {
                            observerRef.current.observe(el);
                        }
                    }}
                />
            ))}
        </div>
    );

    return (
        <>
            <Head>
                <title>{`IEN 📸 - ${title}`}</title>
                <meta name="description" content={`Bộ sưu tập ${title} của IEN Photographer`} />
            </Head>

            <Navigation />

            {/* Album Hero Section */}
            {!loading && !error && heroImage && (
                <section className="album-hero">
                    <div className="album-hero-image">
                        <img
                            src={getThumbnailUrl(heroImage).replace('=s400', '=s800')}
                            alt={title}
                        />
                        <div className="album-hero-overlay"></div>
                    </div>
                    <div className="album-hero-content">
                        <span className="album-category">ALBUM</span>
                        <h1 className="album-title">{title}</h1>
                        <p className="album-info">{images.length} ảnh</p>
                    </div>
                </section>
            )}

            {/* Gallery Section với header mới */}
            {!loading && !error && images.length > 0 && (
                <section className="album-gallery-section">
                    <div className="section-container">
                        {renderGallery()}
                    </div>
                </section>
            )}

            {/* Các phần còn lại giữ nguyên */}
            {loading && renderLoading()}
            {error && !loading && renderError()}

            <Footer />

            <ImageModal
                isOpen={modalOpen}
                images={images}
                currentIndex={currentImageIndex}
                onClose={closeModal}
                onNext={showNext}
                onPrev={showPrev}
            />
        </>
    );
}

// GetServerSideProps để validate slug và redirect 404 nếu không hợp lệ
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params!;
    const slugStr = Array.isArray(slug) ? slug[0] : slug;

    if (!slugStr || !isValidAlbumSlug(slugStr)) {
        return {
            notFound: true,
        };
    }

    const folderId = getFolderId(slugStr);
    const title = getAlbumTitle(slugStr);

    return {
        props: {
            slug: slugStr,
            folderId: folderId!,
            title,
        },
    };
};