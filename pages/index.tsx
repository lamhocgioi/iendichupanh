/* eslint-disable @next/next/no-img-element */
// pages/index.tsx - Trang chủ với phần giới thiệu
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Giới thiệu về IEN 📸</title>
        <meta name="description" content="IEN Photographer tại Đà Nẵng - Chuyên chụp ảnh chân dung, couple, kỷ yếu và concept nghệ thuật" />
      </Head>
      
      <Navigation />

      {/* About Section - giữ nguyên structure từ HTML gốc */}
      <section className="about-section" style={{ display: 'block' }}>
        <div className="about-container">
          <div className="about-image">
            <img src="/assets/ien.jpg" alt="IEN Photographer" />
          </div>
          <div className="about-text">
            <h2>Xin chào, mình là IEN 📸</h2>
            <p>
              <strong>Photographer tại Đà Nẵng</strong> – đam mê nhiếp ảnh chân dung, couple, kỷ yếu và concept nghệ thuật.
            </p>
            <p>
              Bắt đầu từ niềm yêu thích ghi lại cảm xúc thật qua khung hình, mỗi bộ ảnh mình thực hiện đều là sự kết hợp
              giữa ánh sáng, bố cục và một chút chất riêng.
            </p>
            <p>
              Mình tin rằng một bức ảnh đẹp không chỉ để lưu giữ khoảnh khắc, mà còn để kể lại một câu chuyện bằng cảm xúc.
            </p>
            <p>
              Nếu bạn cũng yêu cái đẹp nhẹ nhàng, tone màu tình cảm, thì chắc chúng ta hợp gu nhau rồi đấy 😄
            </p>
            <p className="about-contact">
              📍 Hiện tại chụp chủ yếu ở <strong>Đà Nẵng</strong>. Đừng ngại inbox để hẹn lịch chụp nhé!
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}