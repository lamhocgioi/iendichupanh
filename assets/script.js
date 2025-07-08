const apiUrl = 'https://script.google.com/macros/s/AKfycbzTr7vvOhUI77s1Rn0bv6C1jk1Ubn4n9gRfst_v-NpGzwF9zN718slCMFPpdH0VtYE33Q/exec?folder=1ekwV4Em3hYYJd2poJrrRXON9Q9F5pTQ6';
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');

    let images = [];
    let currentIndex = 0;

    // Modal control
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    function closeModal() {
      modal.classList.remove('is-open');
      modalImage.src = '';
    }

    function openModal(index) {
      currentIndex = index;
      const newSrc = `https://drive.google.com/thumbnail?id=${images[index].id}&sz=w2048`;

      modalImage.classList.remove('show'); // Ẩn ảnh cũ

      // Đợi ảnh load rồi mới fade-in
      modalImage.onload = () => {
        modalImage.classList.add('show');
      };

      modalImage.src = newSrc;
      modal.classList.add('is-open');
    }

    // IntersectionObserver lazy loading
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    // Fetch and render gallery
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        images = data;
        const gallery = document.getElementById('gallery');
        const loader = document.getElementById('gallery-loading');

        loader.style.display = 'none';       // Ẩn spinner
        gallery.style.display = 'block';     // Hiện gallery
        gallery.innerHTML = '';

        data.forEach((img, i) => {
          const el = document.createElement('img');
          el.dataset.src = `https://drive.google.com/thumbnail?id=${img.id}&sz=w2048`;
          el.alt = img.name;
          el.loading = 'lazy';

          el.addEventListener('click', () => openModal(i));
          gallery.appendChild(el);
          observer.observe(el);
        });
      })
      .catch(err => {
        document.getElementById('gallery-loading').innerText = 'Lỗi khi tải ảnh.';
        console.error(err);
      });


    // Navigation: arrow keys
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;

      if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    });

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      openModal(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      openModal(currentIndex);
    }

    // Touch swipe for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    modal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) < 50) return;

      if (diff < 0) showNext();  // Vuốt trái → Next
      else showPrev();           // Vuốt phải → Prev
    }