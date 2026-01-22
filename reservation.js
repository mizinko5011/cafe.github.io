/* =========
   外部から呼ばれる想定の関数
   ========= */
function renderSelectedGames(games) {
    const gameList = document.getElementById("selected-games");
    gameList.innerHTML = "";

    if (!games || games.length === 0) {
        gameList.innerHTML = "<li>選択されたゲームはありません</li>";
        return;
    }

    games.forEach(game => {
        const li = document.createElement("li");
        li.textContent = game.name ?? game;
        gameList.appendChild(li);
    });
}


/* =========
   返却予定日計算
   ========= */
document.addEventListener("DOMContentLoaded", () => {

    const pickupInput = document.getElementById("pickup-date");
    const daysInput = document.getElementById("rental-days");
    const returnDisplay = document.getElementById("return-date");

    function updateReturnDate() {
        const pickup = pickupInput.value;
        const days = Number(daysInput.value);

        if (!pickup || days < 1) {
            returnDisplay.textContent = "受取日と日数を入力してください";
            return;
        }

        const date = new Date(pickup);
        date.setDate(date.getDate() + days);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        returnDisplay.textContent = `${yyyy}年${mm}月${dd}日`;
    }

    pickupInput.addEventListener("change", updateReturnDate);
    daysInput.addEventListener("input", updateReturnDate);
});


/* =========
   予約ボタン押下（API送信前提）
   ========= */
function goConfirm() {
    const pickup = document.getElementById("pickup-date").value;
    const days = document.getElementById("rental-days").value;

    if (!pickup || !days) {
        alert("受取日とレンタル日数を入力してください。");
        return;
    }

    // 実際はここで fetch などでDBに送信
    alert("予約しました");
}
