// game.js

document.addEventListener('DOMContentLoaded', function () {
  // ===== DOM要素の取得 =====
  const rateBtn = document.getElementById('rateBtn');
  const ratingModal = document.getElementById('ratingModal');
  const cancelBtn = document.getElementById('cancelReview');
  const submitBtn = document.getElementById('submitReview');
  const stars = document.querySelectorAll('.star');
  const ratingValue = document.getElementById('ratingValue');
  const userNameInput = document.getElementById('userName');
  const commentInput = document.getElementById('comment');
  const userReviewTemplate = document.getElementById('userReviewTemplate');
  const favoriteBtn = document.getElementById('favoriteBtn');

  let currentRating = 0;
  let isFavorite = false;

  // ===== お気に入りボタンの切り替え =====
  favoriteBtn.addEventListener('click', function () {
    isFavorite = !isFavorite;

    if (isFavorite) {
      favoriteBtn.innerHTML = '❤️ お気に入り';
      console.log('お気に入りに追加されました');
    } else {
      favoriteBtn.innerHTML = '🤍 お気に入り';
      console.log('お気に入りから削除されました');
    }
  });

  // ===== 評価モーダルを開く =====
  rateBtn.addEventListener('click', function () {
    ratingModal.style.display = 'flex';
    currentRating = 0; // 初期化
    updateStars();
    commentInput.value = '';
  });

  // ===== モーダルを閉じる =====
  cancelBtn.addEventListener('click', function () {
    ratingModal.style.display = 'none';
  });

  ratingModal.addEventListener('click', function (e) {
    // モーダル背景クリックで閉じる
    if (e.target === ratingModal) {
      ratingModal.style.display = 'none';
    }
  });

  // ===== 星評価の設定 =====
  stars.forEach(star => {
    // 星クリックで評価設定
    star.addEventListener('click', function () {
      currentRating = parseInt(this.dataset.value);
      updateStars();
    });

    // 星にマウスオーバーでハイライト
    star.addEventListener('mouseover', function () {
      highlightStars(parseInt(this.dataset.value));
    });

    // マウスアウトで元の評価に戻す
    star.addEventListener('mouseout', updateStars);
  });

  // 星表示を更新
  function updateStars() {
    stars.forEach(star => {
      const value = parseInt(star.dataset.value);
      if (value <= currentRating) {
        star.textContent = '★';
        star.style.color = '#ffc107';
      } else {
        star.textContent = '☆';
        star.style.color = '#ccc';
      }
    });
    ratingValue.textContent = `評価: ${currentRating}/5`;
  }

  // 星のハイライト表示
  function highlightStars(value) {
    stars.forEach(star => {
      const starValue = parseInt(star.dataset.value);
      if (starValue <= value) {
        star.textContent = '★';
        star.style.color = '#ffc107';
      } else {
        star.textContent = '☆';
        star.style.color = '#ccc';
      }
    });
  }

  // ===== レビュー送信処理 =====
  submitBtn.addEventListener('click', function () {
    if (currentRating === 0) {
      alert('星評価を選択してください');
      return;
    }

    const userName = userNameInput.value || '匿名ユーザー';
    const comment = commentInput.value.trim();

    if (!comment) {
      alert('コメントを入力してください');
      return;
    }

    const nameEl = userReviewTemplate.querySelector('.reviewer-name');
    const contentEl = userReviewTemplate.querySelector('.review-content');
    const starsEl = userReviewTemplate.querySelector('.review-stars');
    const dateEl = userReviewTemplate.querySelector('.review-date');

    // レビュー内容を反映
    nameEl.textContent = userName;
    contentEl.textContent = comment;

    // 星評価文字を生成
    let starsText = '';
    for (let i = 0; i < 5; i++) {
      starsText += i < currentRating ? '★' : '☆';
    }
    starsEl.textContent = starsText;

    // 現在日付を設定
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    dateEl.textContent = `${y}/${m}/${d}`;

    // モーダルを閉じる
    ratingModal.style.display = 'none';
    alert('レビューが投稿されました！');
  });
});
