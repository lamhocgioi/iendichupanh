// 📌 1. Cấu hình folderId theo từng album
const albumFolders = {
  totnghiep: "1ekwV4Em3hYYJd2poJrrRXON9Q9F5pTQ6",
  nangtho: "1NF0pDrNcoEaZY-L72jTjjvRBAYKOBB-M",
  couple: "1Gu7coU0blGlPoOKD5rhBNIbX0geBctfM",
  sinhnhat: "1rav3R14nehNpkvehpUm4auFmnqSbjyk0",
  noel: "1PMRxP8sCDS6KhMNEeLJfP6suUewC5l-a",
  tet: "1IUc0QjYfKOMZozkxvdV_XlXZEJuVkzUj",
};

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

  const apiUrl = `https://script.google.com/macros/s/AKfycbzTr7vvOhUI77s1Rn0bv6C1jk1Ubn4n9gRfst_v-NpGzwF9zN718slCMFPpdH0VtYE33Q/exec?folder=${folderId}`;

  // 📌 3. Set tiêu đề trang và gallery
  const titles = {
    totnghiep: "Kỷ Yếu Tốt Nghiệp 🎓",
    nangtho: "Nàng Thơ 🌸",
    couple: "Couple 💑",
    sinhnhat: "Sinh nhật 🎈🎂",
    noel: "Giáng sinh 🎄",
    tet: "Tết 🎆"
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

  function closeModal() {
    modal.classList.remove("is-open");
    modalImage.src = "";
  }

  function openModal(index) {
    currentIndex = index;
    const newSrc = `https://drive.google.com/thumbnail?id=${images[index].id}&sz=w2048`;

    modalImage.classList.remove("show");
    modalImage.onload = () => modalImage.classList.add("show");
    modalImage.src = newSrc;
    modal.classList.add("is-open");

    // 🛑 Chặn cuộn trang chính
    document.body.classList.add("body-no-scroll");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modalImage.src = "";

    // ✅ Cho phép cuộn lại
    document.body.classList.remove("body-no-scroll");
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

  // 📌 6. Fetch ảnh từ API
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      images = data;
      const loader = document.getElementById("gallery-loading");

      loader.style.display = "none";
      gallery.style.display = "block";
      gallery.innerHTML = "";

      data.forEach((img, i) => {
        const el = document.createElement("img");
        el.dataset.src = `https://drive.google.com/thumbnail?id=${img.id}&sz=w256`;
        el.alt = img.name;
        el.loading = "lazy";

        el.addEventListener("click", () => openModal(i));
        gallery.appendChild(el);
        observer.observe(el);
      });
    })
    .catch((err) => {
      document.getElementById("gallery-loading").innerText = "Lỗi khi tải ảnh.";
      console.error(err);
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

