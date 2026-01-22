<?php
$pdo = new PDO(
  "mysql:host=localhost;dbname=cafe1;charset=utf8",
  "root",
  ""
);

$stmt = $pdo->prepare(
  "INSERT INTO users (name, email, password)
   VALUES (?, ?, ?)"
);

$stmt->execute([
  $_POST["name"],
  $_POST["email"],
  password_hash($_POST["password"], PASSWORD_DEFAULT)
]);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>登録完了</title>
</head>
<body>
  <h1>登録完了 ☕</h1>
  <p>会員登録が完了しました。</p>
  <a href="../login.html">ログインページへ</a>
</body>
</html>

