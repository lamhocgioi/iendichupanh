// 📌 1. Cấu hình folderId theo từng album
const albumFolders = {
  totnghiep: "1ekwV4Em3hYYJd2poJrrRXON9Q9F5pTQ6",
  nangtho: "1NF0pDrNcoEaZY-L72jTjjvRBAYKOBB-M",
  couple: "1Gu7coU0blGlPoOKD5rhBNIbX0geBctfM",
  sinhnhat: "1rav3R14nehNpkvehpUm4auFmnqSbjyk0",
  noel: "1PMRxP8sCDS6KhMNEeLJfP6suUewC5l-a",
  tet: "1IUc0QjYfKOMZozkxvdV_XlXZEJuVkzUj",
  ledoclap: "1KoXO6GMLRTzkngIJ9inrKyZgRAwF6RYz",
  anhcuoi: "1lN1z0NXvzymlRpmQu58wJy5-l-V1ulJu",
  studio: "1tnsPA_M5s15owfJ1H2q8FVS9kz7pMrpE"
};

// 🔑 Google Drive API Key
const API_KEY = 'AIzaSyDLe4ETjlC1Rc016_toJWHzYTC45dhzhlw';

// 🆕 Cache để lưu ảnh đã load
const imageCache = new Map();

// 📌 2. Đọc album từ URL
const params = new URLSearchParams(window.location.search);
const page = params.get("page");
const folderId = albumFolders[page];

const aboutSection = document.querySelector(".about-section");

if (!page) {
  // Không có page param => hiển thị trang giới thiệu, ẩn gallery
  document.title = "Giới thiệu về IEN 📸";
  aboutSection.style.display = "block";
  document.querySelector(".gallery-title").style.display = "none";
  document.getElementById("gallery-loading").style.display = "none";
  document.getElementById("gallery").style.display = "none";
} else {
  // Có page param => ẩn phần giới thiệu
  aboutSection.style.display = "none";

  if (!folderId) {
    document.body.innerHTML = '<p style="text-align:center;margin:50px;">404 - Album không tồn tại</p>';
    throw new Error("Album không tồn tại");
  }

  // 🆕 Google Drive API v3 URL thay vì Google Apps Script
  const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name,thumbnailLink,webContentLink)&orderBy=name`;

  // 📌 3. Set tiêu đề trang và gallery
  const titles = {
    totnghiep: "Kỷ Yếu Tốt Nghiệp 🎓",
    nangtho: "Nàng Thơ 🌸",
    couple: "Couple 💑",
    sinhnhat: "Sinh nhật 🎈🎂",
    noel: "Giáng sinh 🎄",
    tet: "Tết 🎆",
    ledoclap: "Lễ độc lập 🎉",
    anhcuoi: "💍 Our Wedding Day",
    studio: "📸 Album Studio"
  };

  document.title = `IEN 📸 - ${titles[page] || 'Bộ Sưu Tập'}`;
  document.querySelector(".gallery-title").innerText = titles[page] || "Bộ Sưu Tập Ảnh 📸";

  // 📌 4. Khởi tạo modal
  const gallery = document.getElementById("gallery");
  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");
  const modalClose = document.getElementById("modal-close");

  let images = [];
  let currentIndex = 0;

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // 🆕 Hàm preload ảnh để cache
  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      if (imageCache.has(url)) {
        resolve(imageCache.get(url));
        return;
      }

      const img = new Image();
      img.onload = () => {
        imageCache.set(url, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  // 🆕 Preload ảnh modal kế tiếp và trước đó
  function preloadAdjacentImages(currentIdx) {
    const nextIdx = (currentIdx + 1) % images.length;
    const prevIdx = (currentIdx - 1 + images.length) % images.length;

    [nextIdx, prevIdx].forEach(idx => {
      const file = images[idx];
      let imageUrl;
      if (file.thumbnailLink) {
        imageUrl = file.thumbnailLink.replace(/=s\d+$/, "=s1024");
      } else if (file.webContentLink) {
        imageUrl = file.webContentLink;
      } else {
        imageUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
      }
      
      // Preload không đợi kết quả
      preloadImage(imageUrl).catch(() => {});
    });
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modalImage.src = "";
    // ✅ Cho phép cuộn lại
    document.body.classList.remove("body-no-scroll");
  }

  // 🆕 Cải thiện hàm openModal với cache
  function openModal(index) {
    currentIndex = index;
    
    // 🆕 Sử dụng thumbnailLink hoặc fallback về webContentLink
    let imageUrl;
    const file = images[index];
    if (file.thumbnailLink) {
      // Thay đổi size thumbnail thành w1024 để có chất lượng cao hơn
      imageUrl = file.thumbnailLink.replace(/=s\d+$/, "=s1024");
    } else if (file.webContentLink) {
      imageUrl = file.webContentLink;
    } else {
      // Fallback về direct link nếu không có thumbnailLink
      imageUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
    }

    // 🆕 Kiểm tra cache trước
    if (imageCache.has(imageUrl)) {
      // Nếu đã có trong cache, hiển thị ngay lập tức
      modalImage.classList.remove("show");
      modalImage.src = imageCache.get(imageUrl).src;
      modalImage.classList.add("show");
      modal.classList.add("is-open");
      document.body.classList.add("body-no-scroll");
      
      // Preload ảnh kế tiếp
      preloadAdjacentImages(index);
    } else {
      // Nếu chưa có trong cache, preload trước khi hiển thị
      modalImage.classList.remove("show");
      modal.classList.add("is-open");
      document.body.classList.add("body-no-scroll");

      preloadImage(imageUrl)
        .then(cachedImg => {
          modalImage.src = cachedImg.src;
          modalImage.classList.add("show");
          
          // Preload ảnh kế tiếp
          preloadAdjacentImages(index);
        })
        .catch(err => {
          console.error('Failed to load image:', err);
          // Fallback: load trực tiếp
          modalImage.onload = () => modalImage.classList.add("show");
          modalImage.src = imageUrl;
        });
    }
  }

  // 📌 5. Lazy load ảnh
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "200px" }
  );

  // 📌 6. 🆕 Fetch ảnh từ Google Drive API v3
  fetch(apiUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log('Drive API Response:', data); // Debug log
      
      const loader = document.getElementById("gallery-loading");
      loader.style.display = "none";
      gallery.style.display = "block";
      gallery.innerHTML = "";

      // 🆕 Xử lý data từ Drive API (khác với Apps Script)
      if (data.files && data.files.length > 0) {
        images = data.files;
        
        data.files.forEach((file, i) => {
          const el = document.createElement("img");
          
          // 🆕 Sử dụng thumbnailLink với size phù hợp cho gallery
          let thumbnailUrl;
          if (file.thumbnailLink) {
            thumbnailUrl = file.thumbnailLink.replace(/=s\d+$/, "=s400"); // Size nhỏ hơn cho gallery
          } else {
            // Fallback nếu không có thumbnailLink
            thumbnailUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
          }
          
          el.dataset.src = thumbnailUrl;
          el.alt = file.name;
          el.loading = "lazy";

          el.addEventListener("click", () => openModal(i));
          gallery.appendChild(el);
          observer.observe(el);
        });

        // 🆕 Preload một số ảnh đầu tiên để cache
        const preloadCount = Math.min(5, images.length);
        for (let i = 0; i < preloadCount; i++) {
          const file = images[i];
          let imageUrl;
          if (file.thumbnailLink) {
            imageUrl = file.thumbnailLink.replace(/=s\d+$/, "=s1024");
          } else if (file.webContentLink) {
            imageUrl = file.webContentLink;
          } else {
            imageUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
          }
          
          // Preload không đợi kết quả
          preloadImage(imageUrl).catch(() => {});
        }
      } else {
        // 🆕 Xử lý khi không có ảnh hoặc lỗi quyền truy cập
        gallery.innerHTML = `
          <div style="text-align: center; padding: 50px; color: #666;">
            <h3>Không tìm thấy ảnh</h3>
            <p>Có thể do:</p>
            <ul style="text-align: left; display: inline-block;">
              <li>Folder không có ảnh nào</li>
              <li>Folder chưa được chia sẻ công khai</li>
              <li>API Key chưa được cấu hình đúng</li>
              <li>Đã vượt quota Google Drive API</li>
            </ul>
          </div>
        `;
      }
    })
    .catch((err) => {
      console.error('Drive API Error:', err);
      
      // 🆕 Xử lý lỗi chi tiết hơn
      const loader = document.getElementById("gallery-loading");
      loader.innerHTML = `
        <div style="color: #e74c3c; text-align: center;">
          <h3>❌ Lỗi khi tải ảnh</h3>
          <p><strong>Lỗi:</strong> ${err.message}</p>
          <div style="margin-top: 20px; font-size: 14px; color: #666;">
            <p><strong>Các nguyên nhân có thể:</strong></p>
            <ul style="text-align: left; display: inline-block;">
              <li>API Key sai hoặc chưa được cấu hình</li>
              <li>Google Drive API chưa được bật</li>
              <li>Folder không tồn tại hoặc chưa public</li>
              <li>Vượt quota API (100 requests/100s/user)</li>
              <li>CORS issue (chạy từ file:// thay vì http://)</li>
            </ul>
            <p style="margin-top: 15px;">
              <strong>💡 Giải pháp:</strong> Kiểm tra console để xem lỗi chi tiết
            </p>
          </div>
        </div>
      `;
    });

  // 📌 7. Điều hướng phím
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;

    if (e.key === "ArrowRight") showNext();
    else if (e.key === "ArrowLeft") showPrev();
    else if (e.key === "Escape") closeModal();
  });

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    openModal(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openModal(currentIndex);
  }

  // 📌 8. Vuốt trên điện thoại
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  modal.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) < 50) return;

    if (diff < 0) showNext();
    else showPrev();
  }
}