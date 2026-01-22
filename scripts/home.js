document.addEventListener('DOMContentLoaded', function() {
  // スライドショー
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.nav.prev');
  const nextBtn = document.querySelector('.nav.next');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    slides[currentSlide].classList.add('active');
  }

  function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
  }

  let slideInterval = setInterval(nextSlide, 5000);

  const bannerContainer = document.querySelector('.banner-container');
  if (bannerContainer) {
    // マウスがスライド上にあるときスライド自動切り替えを停止
    bannerContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    // マウスが離れたら再開
    bannerContainer.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));
  }

  showSlide(currentSlide);

  // カテゴリフィルターのモーダル機能
  const searchInput = document.getElementById('search-input');
  const categoryModal = document.getElementById('category-modal');
  const clearBtn = document.getElementById('clear-btn');
  const applyBtn = document.getElementById('apply-btn');
  const searchBtn = document.querySelector('.search-btn');

  // 検索入力欄をクリックでモーダル表示
  if (searchInput && categoryModal) {
    searchInput.addEventListener('click', function(e) {
      e.stopPropagation();
      categoryModal.classList.add('active');
    });

    // モーダル外をクリックで閉じる
    document.addEventListener('click', function(e) {
      if (!categoryModal.contains(e.target) && e.target !== searchInput) {
        categoryModal.classList.remove('active');
      }
    });

    // 検索ボタンをクリック
    if (searchBtn) {
      searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value;
        const selectedFilters = getSelectedFilters();
        performSearch(searchTerm, selectedFilters);
        categoryModal.classList.remove('active');
      });
    }

    // 全ての選択をクリア
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        const checkboxes = categoryModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.checked = false;
        });
      });
    }

    // フィルターを適用
    if (applyBtn) {
      applyBtn.addEventListener('click', function() {
        const selectedFilters = getSelectedFilters();
        console.log('フィルターを適用:', selectedFilters);
        categoryModal.classList.remove('active');
      });
    }

    // 選択されたフィルター条件を取得
    function getSelectedFilters() {
      const filters = {
        genre: [],
        players: [],
        time: [],
        age: []
      };
      
      document.querySelectorAll('.category-item input:checked').forEach(checkbox => {
        const category = checkbox.name;
        const value = checkbox.value;
        filters[category].push(value);
      });
      
      return filters;
    }

    // 検索を実行
    function performSearch(searchTerm, filters) {
      console.log('検索ワード:', searchTerm);
      console.log('フィルター条件:', filters);
      // 実際の検索ロジックはここに追加可能
      alert(`検索: ${searchTerm}\nフィルター条件が適用されました`);
    }

    // 入力欄でEnterキーでも検索可能
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const searchTerm = searchInput.value;
        const selectedFilters = getSelectedFilters();
        performSearch(searchTerm, selectedFilters);
        categoryModal.classList.remove('active');
      }
    });
  }
});
