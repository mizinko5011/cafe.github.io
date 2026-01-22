// search.js

// ゲームデータベース（カタンのみ残す）
const gameDatabase = [
  {
    id: 1,
    name: "カタン",
    englishName: "catan",
    image: "images/Catan.jpg",
    genres: ["strategy", "luck", "cooperation"],
    players: ["3-4"],
    time: ["60+"],
    age: ["7-12", "13-16"],
    description: "カタンは、プレイヤーが島の開拓者となり、資源を集めて道路や集落、都市を建設し、発展を競うボードゲームです。"
  }
];

// URLパラメータを解析
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get('q') || '',
    genre: params.get('genre') ? params.get('genre').split(',') : [],
    players: params.get('players') ? params.get('players').split(',') : [],
    time: params.get('time') ? params.get('time').split(',') : [],
    age: params.get('age') ? params.get('age').split(',') : []
  };
}

// ゲームがフィルター条件に合うか確認
function matchesFilters(game, filters) {
  if (filters.q) {
    const query = filters.q.toLowerCase();
    const nameMatch = game.name.toLowerCase().includes(query);
    const englishNameMatch = game.englishName && game.englishName.toLowerCase().includes(query);
    if (!nameMatch && !englishNameMatch) return false;
  }

  if (filters.genre.length > 0 && !filters.genre.some(g => game.genres.includes(g))) return false;
  if (filters.players.length > 0 && !filters.players.some(p => game.players.includes(p))) return false;
  if (filters.time.length > 0 && !filters.time.some(t => game.time.includes(t))) return false;
  if (filters.age.length > 0 && !filters.age.some(a => game.age.includes(a))) return false;

  return true;
}

// フィルタータグを表示
function displayFilters(filters) {
  const filterTags = document.getElementById('search-filters');
  filterTags.innerHTML = '';

  const filterLabels = {
    'strategy': '戦略系',
    'luck': '運要素',
    'cooperation': '協力',
    'party': 'パーティー',
    'card': 'カード',
    'rpg': 'ロールプレイング',
    'family': '教育・ファミリー',
    'logic': '推理・論理',
    '1-2': '1〜2人',
    '3-4': '3〜4人',
    '5-6': '5〜6人',
    '7+': '7人以上',
    '10-30': '10〜30分',
    '30-60': '30〜60分',
    '60+': '60分以上',
    '0-6': '～6歳',
    '7-12': '7～12歳',
    '13-16': '13～16歳',
    '17+': '17歳～'
  };

  if (filters.q) {
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.textContent = `キーワード: ${filters.q}`;
    filterTags.appendChild(tag);
  }

  [...filters.genre, ...filters.players, ...filters.time, ...filters.age].forEach(value => {
    if (filterLabels[value]) {
      const tag = document.createElement('span');
      tag.className = 'filter-tag';
      tag.textContent = filterLabels[value];
      filterTags.appendChild(tag);
    }
  });
}

// 検索を実行して結果を表示
function performSearch() {
  const filters = getUrlParams();
  const resultsContainer = document.getElementById('game-results');
  const noResultsDiv = document.getElementById('no-results');
  const resultCountDiv = document.getElementById('result-count');
  const title = document.getElementById('search-title');

  title.textContent = filters.q ? `"${filters.q}" の検索結果` : '検索結果';

  displayFilters(filters);

  resultsContainer.innerHTML = '';

  const matchedGames = gameDatabase.filter(game => matchesFilters(game, filters));

  resultCountDiv.textContent = `検索結果: ${matchedGames.length}件`;

  if (matchedGames.length > 0) {
    matchedGames.forEach(game => {
      const gameItem = document.createElement('div');
      gameItem.className = 'game-item';

      const link = document.createElement('a');
      link.href = 'catan.html'; // カタンのみのページ

      const img = document.createElement('img');
      img.src = game.image;
      img.alt = game.name;

      const p = document.createElement('p');
      p.textContent = game.name;

      link.appendChild(img);
      gameItem.appendChild(link);
      gameItem.appendChild(p);
      resultsContainer.appendChild(gameItem);
    });

    noResultsDiv.style.display = 'none';
    resultsContainer.style.display = 'flex';
  } else {
    resultsContainer.style.display = 'none';
    noResultsDiv.style.display = 'block';
  }
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', performSearch);
