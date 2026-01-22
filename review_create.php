<?php
// ===============================
// レビュー投稿処理
// ===============================

// セッション開始（ログイン情報を使うため）
session_start();

// ログインしていない人はログインページへ
if (!isset($_SESSION["user_id"])) {
  header("Location: ../login.html");
  exit;
}

// DB接続
$pdo = new PDO(
  "mysql:host=localhost;dbname=cafe1;charset=utf8",
  "root",
  ""
);

// POSTで送られてきたデータを受け取る
$user_id = $_SESSION["user_id"];   // ログイン中のユーザーID
$game_id = $_POST["game_id"];      // どのゲームか
$rating  = $_POST["rating"];       // 星評価（1〜5）
$comment = $_POST["comment"];      // コメント本文

// SQL準備（レビューを追加）
$stmt = $pdo->prepare(
  "INSERT INTO reviews (user_id, game_id, rating, comment)
   VALUES (?, ?, ?, ?)"
);

// 実行
$stmt->execute([
  $user_id,
  $game_id,
  $rating,
  $comment
]);

// 投稿後は元のゲームページに戻す
header("Location: ../game.html");
exit;
