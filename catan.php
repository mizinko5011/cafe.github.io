<?php
// データベース接続設定
$host = 'localhost';
$dbname = 'cafe1'; // データベース名を設定
$username = 'root';     // ユーザー名を設定
$password = '';     // パスワードを設定

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("データベース接続エラー: " . $e->getMessage());
}

// カタンのgame_idを設定（gamesテーブルで確認してください）
$game_id = 1; // カタンのIDに変更してください

// ゲーム情報を取得
$stmt_game = $pdo->prepare("SELECT * FROM game WHERE game_id = :game_id");
$stmt_game->bindParam(':game_id', $game_id, PDO::PARAM_INT);
$stmt_game->execute();
$game = $stmt_game->fetch(PDO::FETCH_ASSOC);

// レビューを取得（新しい順）
$stmt_reviews = $pdo->prepare("
    SELECT r.*, u.name as user_name 
    FROM reviews r 
    LEFT JOIN users u ON r.user_id = u.id 
    WHERE r.game_id = :game_id 
    ORDER BY r.created_at DESC
");
$stmt_reviews->bindParam(':game_id', $game_id, PDO::PARAM_INT);
$stmt_reviews->execute();
$reviews = $stmt_reviews->fetchAll(PDO::FETCH_ASSOC);

// 平均評価を計算
$avg_rating = 0;
if (count($reviews) > 0) {
    $total = 0;
    foreach ($reviews as $review) {
        $total += $review['rating'];
    }
    $avg_rating = round($total / count($reviews), 1);
}

// 星を生成する関数
function getStars($rating) {
    $stars = '';
    for ($i = 1; $i <= 5; $i++) {
        $stars .= ($i <= $rating) ? '★' : '☆';
    }
    return $stars;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ゲーム情報 - カタン</title>
  <!-- Google Fontsから日本語対応フォントを読み込み -->
  <link href="https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&family=Hachi+Maru+Pop&display=swap" rel="stylesheet">
  <!-- 背景スタイルシート -->
  <link rel="stylesheet" href="styles/bg-styles.css" />
  <!-- ゲーム詳細ページ専用スタイルシート -->
  <link rel="stylesheet" href="styles/gamestyles.css" />
</head>
<body>
  <!-- 背景レイヤー（bg-styles.jsがアニメーションを自動生成） -->
  <div class="boardgame-background">
    <div class="overlay-pattern"></div>
    <div class="particle-container"></div>
  </div>
  
  <!-- ホームページへ戻るナビゲーションボタン -->
  <a href="home.html" class="back-btn">← ホームに戻る</a>
  
  <!-- メインコンテンツコンテナ -->
  <div class="container">
    <!-- ゲーム基本情報セクション -->
    <div class="game-header">
      <!-- ゲーム画像 -->
      <div class="image-box">
        <img src="images/catan.jpg" class="game-img" alt="カタンゲーム画像">
      </div>
      <!-- ゲーム基本情報 -->
      <div class="info">
        <h2>カタン</h2>
        <p>ジャンル：戦略系/運要素/交渉・協力要素</p>
        <p>人数：3〜4人</p>
        <p>時間：60分-120分</p>
        <p>対象年齢：10歳以上</p>
        <p>評価：<?php echo getStars(round($avg_rating)); ?> (<?php echo $avg_rating; ?>/5.0 - <?php echo count($reviews); ?>件のレビュー)</p>

        <!-- アクションボタン群 -->
        <div class="btn-row">
          <button class="btn" id="rateBtn">⭐ 評価する</button>
          <button class="btn" id="favoriteBtn">🤍 お気に入り</button>
     <a href="reservation.html" class="btn">👜 今すぐ借りる</a>

        </div>
      </div>
    </div>

    <!-- ゲーム詳細説明セクション -->
    <div class="game-description">
      <h3>説明</h3>
      <p>
        カタンは、プレイヤーが島の開拓者となり、資源を集めて道路や集落、都市を建設し、発展を競うボードゲームです。
        サイコロで資源が得られ、資源の交易や交渉も重要な戦略要素です。最初に一定数の勝利ポイントを獲得したプレイヤーが勝利します。
        運と戦略、交渉のバランスが楽しめる名作ゲームです。
      </p>
    </div>

    <!-- 評価投稿モーダルダイアログ（初期状態は非表示） -->
    <div class="rating-modal" id="ratingModal">
      <div class="modal-content">
        <h3>レビューを投稿</h3>
        <!-- 星評価入力 -->
        <div class="star-rating">
          <span class="star" data-value="1">☆</span>
          <span class="star" data-value="2">☆</span>
          <span class="star" data-value="3">☆</span>
          <span class="star" data-value="4">☆</span>
          <span class="star" data-value="5">☆</span>
        </div>
        <!-- 選択された評価値を表示 -->
        <div class="rating-value" id="ratingValue">評価: 0/5</div>
        
        <!-- レビュー投稿フォーム -->
        <form id="reviewForm" method="POST" action="submit_review.php">
          <input type="hidden" name="game_id" value="<?php echo $game_id; ?>">
          <input type="hidden" name="rating" id="ratingInput" value="0">
          <input type="hidden" name="user_id" value="1"> <!-- 仮のユーザーID、ログイン機能実装後に変更 -->
          
          <div class="form-group">
            <label for="comment">コメント:</label>
            <textarea name="comment" id="comment" rows="4" placeholder="レビューを入力してください..."></textarea>
          </div>
          
          <!-- モーダル操作ボタン -->
          <div class="modal-buttons">
            <button type="submit" class="btn submit-btn" id="submitReview">送信</button>
            <button type="button" class="btn cancel-btn" id="cancelReview">キャンセル</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ユーザーレビュー表示セクション -->
    <div class="review-section">
      <div class="review-title">レビュー (<?php echo count($reviews); ?>件)</div>

      <?php if (count($reviews) > 0): ?>
        <?php foreach ($reviews as $review): ?>
          <!-- レビューカード -->
          <div class="review-card">
            <div class="icon"></div>
            <div class="review-body">
              <span class="reviewer-name"><?php echo htmlspecialchars($review['user_name'] ?? '匿名'); ?></span><br />
              <span class="review-content"><?php echo htmlspecialchars($review['comment']); ?></span>
            </div>
            <div class="review-meta">
              <span class="review-stars"><?php echo getStars($review['rating']); ?></span><br />
              <span class="review-date"><?php echo date('Y/m/d', strtotime($review['created_at'])); ?></span>
            </div>
          </div>
        <?php endforeach; ?>
      <?php else: ?>
        <p style="text-align: center; color: #999; padding: 40px;">まだレビューがありません。最初のレビューを投稿してみませんか？</p>
      <?php endif; ?>
    </div>
  </div>

  <!-- ゲーム詳細ページ専用JavaScript（評価機能など） -->
  <script src="scripts/game.js"></script>
  <!-- 背景アニメーション制御JavaScript -->
  <script src="scripts/bg-styles.js"></script>
  
  <script>
    // モーダル表示・非表示
    const rateBtn = document.getElementById('rateBtn');
    const modal = document.getElementById('ratingModal');
    const cancelBtn = document.getElementById('cancelReview');
    
    // 評価するボタンをクリック
    rateBtn.addEventListener('click', function() {
      modal.style.display = 'flex';
    });
    
    // キャンセルボタンをクリック
    cancelBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // モーダル外をクリックで閉じる
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // 星評価の選択処理
    document.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', function() {
        const value = this.dataset.value;
        document.getElementById('ratingInput').value = value;
        document.getElementById('ratingValue').textContent = `評価: ${value}/5`;
        
        // 星の表示を更新
        document.querySelectorAll('.star').forEach((s, index) => {
          s.textContent = (index < value) ? '★' : '☆';
        });
      });
    });
    
    // フォーム送信前のチェック
    document.getElementById('reviewForm').addEventListener('submit', function(e) {
      const rating = document.getElementById('ratingInput').value;
      if (rating == 0) {
        e.preventDefault();
        alert('星評価を選択してください');
        return false;
      }
    });
  </script>
</body>
</html>