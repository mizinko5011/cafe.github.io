<?php
// delete_game.php - ゲーム削除処理

// データベース接続設定
$host = 'localhost';
$dbname = 'cafe1'; // データベース名を設定
$username = 'root';     // ユーザー名を設定
$password = '';     // パスワードを設定

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // POSTデータを取得
    if (!isset($_POST['game_id'])) {
        throw new Exception('ゲームIDが指定されていません');
    }
    
    $game_id = intval($_POST['game_id']);
    
    // ゲームを削除
    $stmt = $pdo->prepare("DELETE FROM game WHERE game_id = :game_id");
    $stmt->bindParam(':game_id', $game_id, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'ゲームを削除しました']);
    } else {
        throw new Exception('ゲームが見つかりませんでした');
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'データベースエラー: ' . $e->getMessage()]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>