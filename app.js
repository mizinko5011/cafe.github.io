// フォーム送信イベントを取得
document.getElementById("login-form").addEventListener("submit", async (event) => {

  // ページがリロードされるのを防ぐ
  event.preventDefault();

  // フォームの値を取得
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // ログインAPIにデータを送信
  const response = await fetch("/api/login", {
    method: "POST",                             // POSTメソッドで送信
    headers: {                                  // JSONとして送るための設定
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),  // 入力データをJSON化
  });

  // APIから返ってきたデータをJSONとして受け取る
  const result = await response.json();

  // メッセージ表示用の要素
  const message = document.getElementById("message");

  // 成功（ステータス200番台）
  if (response.ok) {
    message.style.color = "green";
    message.textContent = "ログイン成功！リダイレクト中…";

    // 1.2秒後にダッシュボードなどに遷移
    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 1200);

  } else {
    // エラー時のメッセージ
    message.style.color = "red";
    message.textContent = result.error || "ログインに失敗しました";
  }
});
