/**

 * 
 * 使用方法：
 * 1. ページに bg-styles.css と bg-styles.js を読み込む
 * 2. 背景HTML構造を追加：
 *    <div class="boardgame-background">
 *      <div class="overlay-pattern"></div>
 *      <div class="particle-container"></div>
 *    </div>
 * 3. 初期化: BackgroundManager.init();
 */

class BackgroundManager {
  constructor() {
    // デフォルト設定
    this.config = {
      particleCount: 15, // パーティクル数
      particleTypes: ['dice', 'card', 'token', 'meeple'], // パーティクル種類
      maxSize: 50,
      minSize: 20,
      animationDuration: { min: 15, max: 25 }, // アニメーション速度範囲（秒）
      opacity: { min: 0.3, max: 0.6 }, // 透明度範囲
      animationTypes: ['float', 'floatAlt'], // アニメーション種類
      startPosition: { top: { min: 20, max: 120 }, left: { min: 0, max: 100 } }, // 初期位置範囲
      theme: 'default', // デフォルトテーマ
      showControls: false // コントロールパネル表示
    };

    // テーマ定義
    this.themes = {
      'default': { class: '' },
      'wood': { class: 'bg-variant-wood' },
      'green': { class: 'bg-variant-green' },
      'blue': { class: 'bg-variant-blue' },
      'purple': { class: 'bg-variant-purple' },
      'night': { class: 'bg-night' }
    };

    this.container = null; // パーティクルコンテナ
    this.background = null; // 背景コンテナ
    this.particles = []; // パーティクル配列
    this.controls = null; // コントロールパネル
    this.toggleBtn = null; // 切替ボタン

    // パーティクルタイプ設定
    this.particleConfigs = {
      'dice': { className: 'dice-particle', size: 40 },
      'card': { className: 'card-particle', size: { width: 35, height: 50 } },
      'token': { className: 'token-particle', size: 35 },
      'meeple': { className: 'meeple-particle', size: { width: 25, height: 40 } },
      'pawn': { className: 'pawn-particle', size: { width: 25, height: 35 } },
      'chip': { className: 'chip-particle', size: 30 }
    };
  }

  /**
   * 初期化
   * @param {Object} options - 設定オプション
   */
  init(options = {}) {
    // 設定をマージ
    this.config = { ...this.config, ...options };

    // 背景コンテナ取得
    this.container = document.querySelector('.particle-container');
    this.background = document.querySelector('.boardgame-background');

    if (!this.container || !this.background) {
      console.warn('背景要素が見つかりません、自動生成します...');
      this.createBackgroundElements();
    }

    // テーマ適用
    this.applyTheme(this.config.theme);

    // パーティクル生成
    this.generateParticles();

    // コントロールパネル作成
    this.createControls();

    // イベントバインド
    this.bindEvents();

    // グローバルに保存
    window.BackgroundManager = this;

    console.log('背景管理器が初期化されました');
    return this;
  }

  /**
   * 背景要素を作成（存在しない場合）
   */
  createBackgroundElements() {
    if (!this.background) {
      this.background = document.createElement('div');
      this.background.className = 'boardgame-background';
      document.body.insertBefore(this.background, document.body.firstChild);
    }

    const overlay = document.createElement('div');
    overlay.className = 'overlay-pattern';
    this.background.appendChild(overlay);

    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'particle-container';
      this.background.appendChild(this.container);
    }
  }

  /**
   * パーティクル生成
   */
  generateParticles() {
    this.clearParticles();

    for (let i = 0; i < this.config.particleCount; i++) {
      this.createParticle();
    }
  }

  /**
   * 単一パーティクル作成
   */
  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const type = this.config.particleTypes[Math.floor(Math.random() * this.config.particleTypes.length)];
    const config = this.particleConfigs[type];

    const innerElement = document.createElement('div');
    innerElement.className = config.className;

    if (typeof config.size === 'object') {
      innerElement.style.width = `${config.size.width}px`;
      innerElement.style.height = `${config.size.height}px`;
    } else {
      innerElement.style.width = `${config.size}px`;
      innerElement.style.height = `${config.size}px`;
    }

    particle.appendChild(innerElement);

    particle.style.left = `${this.getRandomNumber(this.config.startPosition.left.min, this.config.startPosition.left.max)}%`;
    particle.style.top = `${this.getRandomNumber(this.config.startPosition.top.min, this.config.startPosition.top.max)}%`;

    const animationType = this.config.animationTypes[Math.floor(Math.random() * this.config.animationTypes.length)];
    particle.style.animationName = animationType;
    particle.style.animationDuration = `${this.getRandomNumber(this.config.animationDuration.min, this.config.animationDuration.max)}s`;
    particle.style.animationDelay = `${-this.getRandomNumber(0, 20)}s`;
    particle.style.animationIterationCount = 'infinite';
    particle.style.animationTimingFunction = 'ease-in-out';

    particle.style.opacity = this.getRandomNumber(this.config.opacity.min, this.config.opacity.max);
    particle.style.transform = `rotate(${this.getRandomNumber(0, 360)}deg)`;

    this.container.appendChild(particle);
    this.particles.push(particle);

    return particle;
  }

  /**
   * パーティクル削除
   */
  clearParticles() {
    this.particles.forEach(p => {
      if (p.parentNode === this.container) this.container.removeChild(p);
    });
    this.particles = [];
  }

  /**
   * テーマ適用
   */
  applyTheme(themeName) {
    Object.values(this.themes).forEach(theme => {
      if (theme.class) this.background.classList.remove(theme.class);
    });

    const theme = this.themes[themeName];
    if (theme && theme.class) this.background.classList.add(theme.class);

    this.config.theme = themeName;
    localStorage.setItem('bg-theme', themeName);
  }

  /**
   * コントロールパネル作成
   */
  createControls() {
    this.controls = document.createElement('div');
    this.controls.className = 'bg-controls';
    this.controls.style.display = this.config.showControls ? 'block' : 'none';

    this.controls.innerHTML = `
      <h3>背景設定</h3>
      <div class="bg-control-group">
        <label>テーマ</label>
        <select id="bg-theme-select">
          <option value="default">デフォルト</option>
          <option value="wood">木目</option>
          <option value="green">緑</option>
          <option value="blue">青</option>
          <option value="purple">紫</option>
          <option value="night">夜間</option>
        </select>
      </div>
      <div class="bg-control-group">
        <label>パーティクル数: <span id="bg-particle-count">${this.config.particleCount}</span></label>
        <input type="range" id="bg-particle-slider" min="5" max="50" value="${this.config.particleCount}">
      </div>
      <div class="bg-control-group">
        <label>パーティクルタイプ</label>
        <select id="bg-particle-types" multiple>
          <option value="dice" selected>サイコロ</option>
          <option value="card" selected>カード</option>
          <option value="token" selected>トークン</option>
          <option value="meeple" selected>ミープル</option>
          <option value="pawn">ポーン</option>
          <option value="chip">チップ</option>
        </select>
      </div>
      <div class="bg-control-group">
        <label>アニメーション速度</label>
        <select id="bg-animation-speed">
          <option value="slow">遅い</option>
          <option value="normal" selected>普通</option>
          <option value="fast">速い</option>
        </select>
      </div>
      <button class="bg-control-btn" id="bg-apply-btn">適用</button>
      <button class="bg-control-btn" id="bg-reset-btn">リセット</button>
    `;

    document.body.appendChild(this.controls);

    // 切替ボタン
    this.toggleBtn = document.createElement('button');
    this.toggleBtn.className = 'bg-toggle-btn';
    this.toggleBtn.innerHTML = '🎨';
    this.toggleBtn.title = '背景設定';
    document.body.appendChild(this.toggleBtn);

    this.initControlValues();

    // 外部クリックでパネル閉じる
    document.addEventListener('click', (e) => {
      if (this.controls.style.display === 'block') {
        if (!this.controls.contains(e.target) && e.target !== this.toggleBtn) {
          this.controls.style.display = 'none';
          this.config.showControls = false;
          localStorage.setItem('bg-show-controls', 'false');
        }
      }
    });
  }

  /**
   * コントロールパネル初期値設定
   */
  initControlValues() {
    const themeSelect = document.getElementById('bg-theme-select');
    if (themeSelect) themeSelect.value = this.config.theme;

    const particleTypesSelect = document.getElementById('bg-particle-types');
    if (particleTypesSelect) {
      Array.from(particleTypesSelect.options).forEach(option => {
        option.selected = this.config.particleTypes.includes(option.value);
      });
    }
  }

  /**
   * イベントバインド
   */
  bindEvents() {
    if (this.toggleBtn) this.toggleBtn.addEventListener('click', () => this.toggleControls());

    const applyBtn = document.getElementById('bg-apply-btn');
    if (applyBtn) applyBtn.addEventListener('click', () => this.applySettings());

    const resetBtn = document.getElementById('bg-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetSettings());

    const particleSlider = document.getElementById('bg-particle-slider');
    if (particleSlider) {
      particleSlider.addEventListener('input', (e) => {
        const countDisplay = document.getElementById('bg-particle-count');
        if (countDisplay) countDisplay.textContent = e.target.value;
      });
    }

    const themeSelect = document.getElementById('bg-theme-select');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => this.applyTheme(e.target.value));
    }
  }

  toggleControls() {
    if (this.controls.style.display === 'none') {
      this.controls.style.display = 'block';
      this.config.showControls = true;
    } else {
      this.controls.style.display = 'none';
      this.config.showControls = false;
    }
    localStorage.setItem('bg-show-controls', this.config.showControls);
  }

  applySettings() {
    const particleSlider = document.getElementById('bg-particle-slider');
    if (particleSlider) this.config.particleCount = parseInt(particleSlider.value);

    const particleTypesSelect = document.getElementById('bg-particle-types');
    if (particleTypesSelect) {
      this.config.particleTypes = Array.from(particleTypesSelect.selectedOptions).map(o => o.value);
    }

    const animationSpeedSelect = document.getElementById('bg-animation-speed');
    if (animationSpeedSelect) {
      const speed = animationSpeedSelect.value;
      switch(speed) {
        case 'slow': this.config.animationDuration = { min: 20, max: 30 }; break;
        case 'fast': this.config.animationDuration = { min: 10, max: 20 }; break;
        default: this.config.animationDuration = { min: 15, max: 25 };
      }
    }

    this.generateParticles();
    this.saveSettings();
    console.log('背景設定を適用しました');
  }

  resetSettings() {
    this.config = {
      particleCount: 15,
      particleTypes: ['dice', 'card', 'token', 'meeple'],
      animationDuration: { min: 15, max: 25 },
      theme: 'default',
      showControls: this.config.showControls
    };
    this.applyTheme('default');
    this.initControlValues();
    this.generateParticles();
    localStorage.removeItem('bg-settings');
    console.log('背景設定をリセットしました');
  }

  saveSettings() {
    const settings = {
      particleCount: this.config.particleCount,
      particleTypes: this.config.particleTypes,
      animationDuration: this.config.animationDuration,
      theme: this.config.theme
    };
    localStorage.setItem('bg-settings', JSON.stringify(settings));
  }

  loadSettings() {
    const saved = localStorage.getItem('bg-settings');
    if (saved) {
      try { this.config = { ...this.config, ...JSON.parse(saved) }; }
      catch(e){ console.error('背景設定のロードに失敗しました:', e); }
    }
    const savedTheme = localStorage.getItem('bg-theme');
    if (savedTheme && this.themes[savedTheme]) this.config.theme = savedTheme;

    const showControls = localStorage.getItem('bg-show-controls');
    if (showControls !== null) this.config.showControls = showControls === 'true';
  }

  getRandomNumber(min, max) { return Math.random() * (max - min) + min; }

  setParticlesEnabled(enabled) { if (this.container) this.container.style.display = enabled ? 'block' : 'none'; }

  updateParticleCount(count) { this.config.particleCount = count; this.generateParticles(); }

  addParticleType(name, config) { this.particleConfigs[name] = config; }

  destroy() {
    this.clearParticles();
    if (this.controls && this.controls.parentNode) this.controls.parentNode.removeChild(this.controls);
    if (this.toggleBtn && this.toggleBtn.parentNode) this.toggleBtn.parentNode.removeChild(this.toggleBtn);
    window.BackgroundManager = null;
  }
}

// 初期化関数
function initBackground() {
  const bgManager = new BackgroundManager();
  bgManager.loadSettings();
  bgManager.init();
  window.BG = bgManager;
  return bgManager;
}

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.boardgame-background')) initBackground();
  });
} else {
  if (document.querySelector('.boardgame-background')) initBackground();
}

window.BackgroundManager = BackgroundManager;
window.initBackground = initBackground;
