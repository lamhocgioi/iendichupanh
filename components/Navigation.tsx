// components/Navigation.tsx - Component navbar tách riêng
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <div className="nav-logo">
            <Link href="/">IEN 📸</Link>
          </div>
          <div className="social-icons">
            <a href="https://www.facebook.com/nuhygz" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/ienxan_" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.tiktok.com/@iendichupanh_" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
        <ul className="nav-links">
          <li><Link href="/album/totnghiep">Tốt nghiệp</Link></li>
          <li><Link href="/album/nangtho">Nàng thơ</Link></li>
          <li><Link href="/album/couple">Couple</Link></li>
          <li><Link href="/album/sinhnhat">Sinh nhật</Link></li>
          <li><Link href="/album/noel">Noel</Link></li>
          <li><Link href="/album/tet">Tết</Link></li>
          <li><Link href="/album/ledoclap">Lễ độc lập</Link></li>
          <li><Link href="/album/anhcuoi">Wedding</Link></li>
          <li><Link href="/album/studio">Studio</Link></li>
          <li><Link href="/album/trungthu">Trung thu</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;