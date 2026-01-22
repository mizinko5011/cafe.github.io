<?php
// submit_review.php - レビュー投稿処理

// データベース接続設定
$host = 'localhost';
$dbname = 'cafe1'; // データベース名を設定
$username = 'root';     // ユーザー名を設定
$password = '';     // パスワードを設定

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // POSTデータを取得
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $game_id = intval($_POST['game_id']);
        $user_id = intval($_POST['user_id']);
        $rating = intval($_POST['rating']);
        $comment = trim($_POST['comment']);
        
        // バリデーション
        if ($rating < 1 || $rating > 5) {
            throw new Exception('評価は1〜5の範囲で選択してください');
        }
        
        if (empty($comment)) {
            throw new Exception('コメントを入力してください');
        }
        
        // レビューを保存
        $stmt = $pdo->prepare("
            INSERT INTO reviews (game_id, user_id, rating, comment, created_at) 
            VALUES (:game_id, :user_id, :rating, :comment, NOW())
        ");
        $stmt->bindParam(':game_id', $game_id, PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindParam(':rating', $rating, PDO::PARAM_INT);
        $stmt->bindParam(':comment', $comment, PDO::PARAM_STR);
        $stmt->execute();
        
        // 成功したら元のページにリダイレクト
        header('Location: catan.php?success=1');
        exit;
    }
    
} catch(PDOException $e) {
    die("データベースエラー: " . $e->getMessage());
} catch(Exception $e) {
    die("エラー: " . $e->getMessage());
}
?>