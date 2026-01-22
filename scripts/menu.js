// モーダルを開く関数
function openModal(title, image, price, allergens, description) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalImage').src = image;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('modalAllergens').textContent = allergens;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('menuModal').style.display = 'block';
}

// モーダルを閉じる関数
function closeModal() {
    document.getElementById('menuModal').style.display = 'none';
}

// モーダル外をクリックしたら閉じる
window.onclick = function(event) {
    const modal = document.getElementById('menuModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// スクロール時に要素をフェードインさせる
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // 一度表示したら監視解除
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".scroll-fade").forEach(el => {
        observer.observe(el);
    });
});