// ページ読み込み完了イベント
window.addEventListener("DOMContentLoaded", async () => {

  // サマリーを書き込む領域を取得
  const summary = document.getElementById("summary");

  try {
    // 管理者専用API (/api/admin/summary) にデータ取得リクエスト
    const res = await fetch("/api/admin/summary");

    // JSONデータとして応答を受け取る
    const data = await res.json();

    // 取得したデータを画面に表示
    summary.innerHTML = `
      <h3>サマリー</h3>
      <p>ユーザー数: ${data.userCount}</p>
      <p>今日のログイン数: ${data.loginToday}</p>
    `;
  } catch (err) {
    // API通信に失敗した場合
    summary.innerHTML = "<p>データを取得できませんでした。</p>";
  }
});
