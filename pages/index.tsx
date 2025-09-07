/* eslint-disable @next/next/no-img-element */
// pages/index.tsx - Trang chủ hiện đại theo phong cách Ignant
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Head>
        <title>IEN 📸 - Photographer in Da Nang</title>
        <meta name="description" content="IEN Photographer tại Đà Nẵng - Chuyên chụp ảnh chân dung, couple, kỷ yếu và concept nghệ thuật" />
      </Head>
      
      <Navigation />

      {/* Hero Section */}
      <section className={`hero-section ${isLoaded ? 'hero-loaded' : ''}`}>
        <div className="hero-container">
          <div className="hero-image">
            <img src="/assets/ien.jpg" alt="IEN Photography Portfolio" />
          </div>
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-category">PHOTOGRAPHY</span>
              <h1 className="hero-title">Capturing Life&apos;s Beautiful Moments</h1>
              <p className="hero-description">
                Photographer tại Đà Nẵng, chuyên về chân dung, couple và concept nghệ thuật. 
                Mỗi bức ảnh là một câu chuyện được kể qua ánh sáng và cảm xúc.
              </p>
              <div className="hero-actions">
                <a className="btn-primary" href="#about">Xem Portfolio</a>
                <a className="btn-secondary" href="#contact">Liên hệ</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Work Section */}
      <section className="latest-section" id="about">
        <div className="section-container">
          <div className="section-header">
            <span className="section-category">PORTFOLIO</span>
            <h2 className="section-title">Latest Work</h2>
          </div>
          
          <div className="work-grid">
            {/* <Link href="/album/couple" className="work-item-link"> */}
              <Link href="/album/couple" className="work-item work-featured work-item-link">
                <div className="work-image">
                  <img src="/assets/couple.jpg" alt="Featured Photography Work" />
                </div>
                <div className="work-content">
                  <span className="work-category">COUPLE · CONCEPT</span>
                  <h3 className="work-title">Summer Love Story: A Journey Through Light and Shadow</h3>
                  <p className="work-excerpt">
                    Bộ ảnh concept về tình yêu mùa hè, chụp tại những góc phố yên tĩnh của Đà Nẵng. 
                    Ánh sáng tự nhiên và cảm xúc chân thật...
                  </p>
                </div>
              </Link>
            {/* </Link> */}

            <Link href="/album/nangtho" className="work-item work-item-link">
              <div className="work-image">
                <img src="/assets/portrait.jpg" alt="Portrait Photography" />
              </div>
              <div className="work-content">
                <span className="work-category">PORTRAIT</span>
                <h3 className="work-title">Chân Dung Nghệ Thuật</h3>
              </div>
            </Link>

            <Link href="/album/wedding" className="work-item work-item-link">
              <div className="work-image">
                <img src="/assets/wedding.jpg" alt="Wedding Photography" />
              </div>
              <div className="work-content">
                <span className="work-category">WEDDING</span>
                <h3 className="work-title">Khoảnh Khắc Hạnh Phúc</h3>
              </div>
            </Link>

            <Link href="/album/studio" className="work-item work-item-link">
              <div className="work-image">
                <img src="/assets/studio.jpg" alt="Studio Photography" />
              </div>
              <div className="work-content">
                <span className="work-category">STUDIO</span>
                <h3 className="work-title">Ánh Sáng Studio</h3>
              </div>
            </Link>

            <Link href="/album/totnghiep" className="work-item work-item-link">
              <div className="work-image">
                <img src="/assets/totnghiep.jpg" alt="Studio Photography" />
              </div>
              <div className="work-content">
                <span className="work-category">YEARBOOK</span>
                <h3 className="work-title">Kỷ yếu học đường</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Redesigned */}
      <section className="about-modern" id="contact">
        <div className="about-container">
          <div className="about-content">
            <span className="about-category">ABOUT</span>
            <h2 className="about-title">Xin chào, mình là IEN 📸</h2>
            <div className="about-text">
              <p>
                Bắt đầu từ niềm yêu thích ghi lại cảm xúc thật qua khung hình, mỗi bộ ảnh mình thực hiện 
                đều là sự kết hợp giữa ánh sáng, bố cục và một chút chất riêng.
              </p>
              <p>
                Mình tin rằng một bức ảnh đẹp không chỉ để lưu giữ khoảnh khắc, mà còn để kể lại 
                một câu chuyện bằng cảm xúc.
              </p>
            </div>
            <div className="about-contact-info">
              <div className="contact-item">
                <span className="contact-label">Location</span>
                <span className="contact-value">Đà Nẵng, Vietnam</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Email</span>
                <span className="contact-value">yenvoi204200@gmail.com</span>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src="/assets/work-sample-3xx.jpg" alt="IEN Photographer Portrait" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}