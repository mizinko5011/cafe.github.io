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

// ユーザーデータを取得
$stmt_users = $pdo->query("SELECT * FROM users ORDER BY id DESC");
$users = $stmt_users->fetchAll(PDO::FETCH_ASSOC);

// ゲームデータを取得
$stmt_games = $pdo->query("SELECT * FROM game ORDER BY game_id DESC");
$games = $stmt_games->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>管理者ページ - ボードゲームカフェ</title>
  <link rel="stylesheet" href="styles/admin.css">
  <link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- 背景レイヤー -->
  <div class="boardgame-background">
    <div class="overlay-pattern"></div>
    <div class="particle-container"></div>
  </div>
  
  <div class="admin-container">
    
    <!-- ヘッダー -->
    <header class="admin-header">
      <h1>🎮 管理者ダッシュボード</h1>
      <div class="user-info">
        <span>👤 管理者</span>
        <button class="logout-btn" onclick="logout()">ログアウト</button>
      </div>
    </header>
    
    <!-- タブメニュー -->
    <div class="tab-menu">
      <button class="tab-btn active" onclick="showTab('users')">👥 会員管理 (<?php echo count($users); ?>)</button>
      <button class="tab-btn" onclick="showTab('games')">🎲 ゲーム管理 (<?php echo count($games); ?>)</button>
    </div>
    
    <!-- メインコンテンツエリア -->
    <main class="main-content">
      
      <!-- 会員管理 -->
      <div id="users-tab" class="tab-content active">
        <h2>📋 会員一覧 (<?php echo count($users); ?>名)</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>ユーザー名</th>
                <th>メールアドレス</th>
                <th>パスワード</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <?php if (count($users) > 0): ?>
                <?php foreach ($users as $user): ?>
                  <tr>
                    <td><?php echo htmlspecialchars($user['id']); ?></td>
                    <td><?php echo htmlspecialchars($user['name']); ?></td>
                    <td><?php echo htmlspecialchars($user['email']); ?></td>
                    <td><?php echo htmlspecialchars($user['password']); ?></td>
                    <td>
                      <button class="action-btn btn-delete" onclick="deleteUser(<?php echo $user['id']; ?>)">削除</button>
                    </td>
                  </tr>
                <?php endforeach; ?>
              <?php else: ?>
                <tr>
                  <td colspan="5" style="text-align: center; padding: 40px; color: #999;">
                    登録されている会員はいません
                  </td>
                </tr>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- ゲーム管理 -->
      <div id="games-tab" class="tab-content">
        <h2>🎲 ゲーム一覧 (<?php echo count($games); ?>種類)</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ゲームID</th>
                <th>タイトル</th>
                <th>在庫数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <?php if (count($games) > 0): ?>
                <?php foreach ($games as $game): ?>
                  <tr>
                    <td><?php echo htmlspecialchars($game['game_id']); ?></td>
                    <td><?php echo htmlspecialchars($game['title']); ?></td>
                    <td><?php echo htmlspecialchars($game['stock']); ?></td>
                    <td>
                      <button class="action-btn btn-edit">編集</button>
                      <button class="action-btn btn-delete" onclick="deleteGame(<?php echo $game['game_id']; ?>)">削除</button>
                    </td>
                  </tr>
                <?php endforeach; ?>
              <?php else: ?>
                <tr>
                  <td colspan="4" style="text-align: center; padding: 40px; color: #999;">
                    登録されているゲームはありません
                  </td>
                </tr>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>
      
    </main>
    
  </div>
  
  <script>
    // タブ切り替え
    function showTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      document.getElementById(tabName + '-tab').classList.add('active');
      event.target.classList.add('active');
    }
    
    // ユーザー削除
    function deleteUser(userId) {
      if (confirm('このユーザーを削除してもよろしいですか？\nこの操作は取り消せません。')) {
        fetch('delete_user.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'user_id=' + userId
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('ユーザーを削除しました');
            location.reload();
          } else {
            alert('削除に失敗しました: ' + data.error);
          }
        })
        .catch(error => {
          alert('エラーが発生しました');
          console.error('Error:', error);
        });
      }
    }
    
    // ゲーム削除
    function deleteGame(gameId) {
      if (confirm('このゲームを削除してもよろしいですか？\nこの操作は取り消せません。')) {
        fetch('delete_game.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'game_id=' + gameId
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('ゲームを削除しました');
            location.reload();
          } else {
            alert('削除に失敗しました: ' + data.error);
          }
        })
        .catch(error => {
          alert('エラーが発生しました');
          console.error('Error:', error);
        });
      }
    }
    
    // ログアウト
    function logout() {
      if (confirm('ログアウトしますか?')) {
        window.location.href = 'index.html';
      }
    }
  </script>
  
  <script>
    // 背景パーティクル生成
    const container = document.querySelector('.particle-container');
    if (container) {
      const particleTypes = ['dice', 'card', 'token', 'meeple'];
      const particleCount = 15;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        const innerElement = document.createElement('div');
        innerElement.className = `${type}-particle`;
        particle.appendChild(innerElement);
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = (Math.random() * 120 + 20) + '%';
        particle.style.animationName = Math.random() > 0.5 ? 'float' : 'floatAlt';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particle.style.animationDelay = -(Math.random() * 20) + 's';
        particle.style.opacity = 0.3 + Math.random() * 0.3;
        
        container.appendChild(particle);
      }
    }
  </script>
</body>
</html>