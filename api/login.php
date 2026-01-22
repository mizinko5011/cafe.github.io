<?php
session_start();

$pdo = new PDO(
  "mysql:host=localhost;dbname=cafe1;charset=utf8",
  "root",
  ""
);

$stmt = $pdo->prepare(
  "SELECT * FROM users WHERE email = ?"
);
$stmt->execute([$_POST["email"]]);

$user = $stmt->fetch();

if ($user && password_verify($_POST["password"], $user["password"])) {
  // ログイン成功
  $_SESSION["user_id"] = $user["id"];
  $_SESSION["user_name"] = $user["name"];

  header("Location: ../home.html"); // ← トップへ
  exit;
} else {
  echo "メールアドレスかパスワードが違います";
}
