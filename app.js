'use strict';

/* =========================================================
   SportLive – app.js
   Full-featured sports results app
   ========================================================= */

/* ── Config ───────────────────────────────────────────────── */
const REFRESH_SEC = 15;

const ESPN_BASE  = 'https://site.api.espn.com/apis/site/v2/sports';
const ESPN2_BASE = 'https://site.api.espn.com/apis/v2/sports';
const JOLPICA    = 'https://api.jolpi.ca/ergast/f1';

/* ── Competitions ─────────────────────────────────────────── */
const COMPETITION_CATEGORIES = [
  {
    key: 'international',
    label: 'Internazionale',
    sport: 'football',
    leagues: [
      { id: 'UEFA.CHAMPIONS',    name: 'Champions League',     flag: '🏆' },
      { id: 'UEFA.EUROPA',       name: 'Europa League',        flag: '🌍' },
      { id: 'UEFA.EUROPA_CONF',  name: 'Conference League',    flag: '🌐' },
      { id: 'FIFA.WORLD',        name: 'Mondiale FIFA',        flag: '🌎' },
      { id: 'UEFA.EURO',         name: 'UEFA Euro',            flag: '🏅' },
      { id: 'UEFA.NATIONS',      name: 'Nations League',       flag: '🔵' },
    ],
  },
  {
    key: 'italy',
    label: 'Italia',
    sport: 'football',
    leagues: [
      { id: 'ita.1',             name: 'Serie A',              flag: '🇮🇹' },
      { id: 'ita.2',             name: 'Serie B',              flag: '🇮🇹' },
      { id: 'ita.coppa_italia',  name: 'Coppa Italia',         flag: '🇮🇹' },
    ],
  },
  {
    key: 'england',
    label: 'Inghilterra',
    sport: 'football',
    leagues: [
      { id: 'eng.1',             name: 'Premier League',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { id: 'eng.2',             name: 'Championship',         flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { id: 'eng.fa',            name: 'FA Cup',               flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { id: 'eng.league_cup',    name: 'EFL Cup',              flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    ],
  },
  {
    key: 'spain',
    label: 'Spagna',
    sport: 'football',
    leagues: [
      { id: 'esp.1',             name: 'La Liga',              flag: '🇪🇸' },
      { id: 'esp.2',             name: 'La Liga 2',            flag: '🇪🇸' },
      { id: 'esp.copa_del_rey',  name: 'Copa del Rey',         flag: '🇪🇸' },
    ],
  },
  {
    key: 'germany',
    label: 'Germania',
    sport: 'football',
    leagues: [
      { id: 'ger.1',             name: 'Bundesliga',           flag: '🇩🇪' },
      { id: 'ger.2',             name: '2. Bundesliga',        flag: '🇩🇪' },
      { id: 'ger.dfb_pokal',     name: 'DFB Pokal',            flag: '🇩🇪' },
    ],
  },
  {
    key: 'france',
    label: 'Francia',
    sport: 'football',
    leagues: [
      { id: 'fra.1',             name: 'Ligue 1',              flag: '🇫🇷' },
      { id: 'fra.2',             name: 'Ligue 2',              flag: '🇫🇷' },
      { id: 'fra.coupe_de_france', name: 'Coupe de France',    flag: '🇫🇷' },
    ],
  },
  {
    key: 'portugal',
    label: 'Portogallo',
    sport: 'football',
    leagues: [
      { id: 'por.1',             name: 'Primeira Liga',        flag: '🇵🇹' },
    ],
  },
  {
    key: 'netherlands',
    label: 'Olanda',
    sport: 'football',
    leagues: [
      { id: 'ned.1',             name: 'Eredivisie',           flag: '🇳🇱' },
    ],
  },
  {
    key: 'belgium',
    label: 'Belgio',
    sport: 'football',
    leagues: [
      { id: 'bel.1',             name: 'Pro League',           flag: '🇧🇪' },
    ],
  },
  {
    key: 'scotland',
    label: 'Scozia',
    sport: 'football',
    leagues: [
      { id: 'sco.1',             name: 'Scottish Premiership', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    ],
  },
  {
    key: 'turkey',
    label: 'Turchia',
    sport: 'football',
    leagues: [
      { id: 'tur.1',             name: 'Süper Lig',            flag: '🇹🇷' },
    ],
  },
  {
    key: 'greece',
    label: 'Grecia',
    sport: 'football',
    leagues: [
      { id: 'gre.1',             name: 'Super League',         flag: '🇬🇷' },
    ],
  },
  {
    key: 'argentina',
    label: 'Argentina',
    sport: 'football',
    leagues: [
      { id: 'arg.1',             name: 'Liga Profesional',     flag: '🇦🇷' },
    ],
  },
  {
    key: 'brazil',
    label: 'Brasile',
    sport: 'football',
    leagues: [
      { id: 'bra.1',             name: 'Brasileirão',          flag: '🇧🇷' },
    ],
  },
  {
    key: 'usa',
    label: 'USA',
    sport: 'football',
    leagues: [
      { id: 'usa.1',             name: 'MLS',                  flag: '🇺🇸' },
    ],
  },
  {
    key: 'basketball',
    label: 'Basket',
    sport: 'basketball',
    leagues: [
      { id: 'nba',               name: 'NBA',                  flag: '🏀' },
    ],
  },
  {
    key: 'formula1',
    label: 'Formula 1',
    sport: 'f1',
    leagues: [
      { id: 'f1',                name: 'F1 World Championship', flag: '🏁' },
    ],
  },
];

/* Flat map for quick lookup by leagueId */
const ALL_LEAGUES_MAP = {};
COMPETITION_CATEGORIES.forEach(cat => {
  cat.leagues.forEach(l => {
    ALL_LEAGUES_MAP[l.id] = { ...l, sport: cat.sport, category: cat.key };
  });
});

/* ── TV Broadcaster mapping ──────────────────────────────── */
const TV_MAP = {
  'UEFA.CHAMPIONS':    [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }, { name: 'Mediaset', cls: 'tv-mediaset', icon: '📺' }],
  'UEFA.EUROPA':       [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }, { name: 'TV8', cls: 'tv-tv8', icon: '📺' }],
  'UEFA.EUROPA_CONF':  [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }, { name: 'TV8', cls: 'tv-tv8', icon: '📺' }],
  'ita.1':             [{ name: 'DAZN', cls: 'tv-dazn', icon: '📱' }, { name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }],
  'ita.2':             [{ name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
  'ita.coppa_italia':  [{ name: 'Italia 1', cls: 'tv-mediaset', icon: '📺' }, { name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
  'eng.1':             [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }],
  'eng.2':             [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }],
  'eng.fa':            [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }],
  'eng.league_cup':    [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }],
  'esp.1':             [{ name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
  'esp.2':             [{ name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
  'esp.copa_del_rey':  [{ name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
  'ger.1':             [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }],
  'ger.2':             [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }],
  'ger.dfb_pokal':     [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }],
  'fra.1':             [{ name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
  'fra.2':             [{ name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
  'fra.coupe_de_france': [{ name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
  'por.1':             [{ name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
  'ned.1':             [{ name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
  'bel.1':             [{ name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
  'nba':               [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }, { name: 'DAZN', cls: 'tv-dazn', icon: '📱' }],
};
const TV_MAP_DEFAULT = [{ name: 'Sky Sport', cls: 'tv-sky', icon: '📡' }];

/* ── State ────────────────────────────────────────────────── */
const state = {
  sport:      'football',
  league:     'UEFA.CHAMPIONS',
  view:       'scores',
  f1sub:      'drivers',
  countdown:  REFRESH_SEC,
  timer:      null,
  cache:      {},
  favorites:  JSON.parse(localStorage.getItem('sl_favorites') || '[]'),
  modalData:  null,
  modalTab:   'events',
  notifGranted: Notification.permission === 'granted',
  prevScores: {},
};

/* ── Helpers ──────────────────────────────────────────────── */
const esc = s => String(s ?? '')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

function imgTag(src, alt, cls, w = 18, h = 18) {
  if (!src) return `<div class="mr-team-logo-ph">${esc((alt||'?')[0])}</div>`;
  return `<img class="${cls}" src="${esc(src)}" width="${w}" height="${h}" alt="${esc(alt||'')}" loading="lazy" `
       + `onerror="this.outerHTML='<div class=&quot;mr-team-logo-ph&quot;>${esc((alt||'?')[0])}</div>'">`;
}

function saveFavorites() {
  localStorage.setItem('sl_favorites', JSON.stringify(state.favorites));
}
function isFav(id)   { return state.favorites.includes(id); }
function toggleFav(id) {
  if (isFav(id)) {
    state.favorites = state.favorites.filter(x => x !== id);
  } else {
    state.favorites = [...state.favorites, id];
  }
  saveFavorites();
  buildSidebar();
}

/* ── Fetch / Cache ────────────────────────────────────────── */
async function fetchJSON(url, ttlMs = 12000) {
  const now = Date.now();
  const hit = state.cache[url];
  if (hit && now - hit.ts < ttlMs) return hit.data;
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    state.cache[url] = { data, ts: now };
    return data;
  } catch (e) {
    console.warn('[fetchJSON]', url, e.message);
    return null;
  }
}

function espnScoreboard(leagueId) {
  const info = ALL_LEAGUES_MAP[leagueId];
  if (!info) return Promise.resolve(null);
  const type = info.sport === 'basketball' ? 'basketball' : 'soccer';
  return fetchJSON(`${ESPN_BASE}/${type}/${leagueId}/scoreboard`);
}
function espnStandings(leagueId) {
  const info = ALL_LEAGUES_MAP[leagueId];
  if (!info) return Promise.resolve(null);
  const type = info.sport === 'basketball' ? 'basketball' : 'soccer';
  return fetchJSON(`${ESPN2_BASE}/${type}/${leagueId}/standings`);
}
function espnLeaders(leagueId) {
  const info = ALL_LEAGUES_MAP[leagueId];
  if (!info) return Promise.resolve(null);
  const type = info.sport === 'basketball' ? 'basketball' : 'soccer';
  return fetchJSON(`${ESPN2_BASE}/${type}/${leagueId}/leaders`);
}
function espnSummary(leagueId, eventId) {
  const info = ALL_LEAGUES_MAP[leagueId];
  if (!info) return Promise.resolve(null);
  const type = info.sport === 'basketball' ? 'basketball' : 'soccer';
  return fetchJSON(`${ESPN_BASE}/${type}/${leagueId}/summary?event=${eventId}`, 10000);
}

/* ── Match status helpers ──────────────────────────────────── */
function getStatus(ev) {
  const st = ev.status?.type;
  if (!st) return { label: '—', cls: 'post', isLive: false, isPre: false };
  if (st.state === 'in') {
    const clock = ev.status.displayClock || '';
    const min   = clock ? clock.replace(':00','') : 'LIVE';
    return { label: `${min}'`, cls: 'live', isLive: true, isPre: false };
  }
  if (st.completed || st.state === 'post') {
    return { label: 'FT', cls: 'post', isLive: false, isPre: false };
  }
  const d = new Date(ev.date);
  const t = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  return { label: t, cls: 'pre', isLive: false, isPre: true };
}

/* ── TV badges ─────────────────────────────────────────────── */
function tvBadges(leagueId) {
  const channels = TV_MAP[leagueId] || TV_MAP_DEFAULT;
  return channels.map(ch => `<span class="tv-badge ${ch.cls}">${esc(ch.name)}</span>`).join('');
}

/* ── Match row (Flashscore style) ──────────────────────────── */
function matchRow(ev, leagueId) {
  const comp = ev.competitions?.[0];
  if (!comp) return '';
  const cs   = comp.competitors || [];
  const home = cs.find(c => c.homeAway === 'home') || cs[0];
  const away = cs.find(c => c.homeAway === 'away') || cs[1];
  if (!home || !away) return '';

  const { label, cls, isLive, isPre } = getStatus(ev);
  const showScore = !isPre;
  const hs  = showScore ? (home.score ?? '-') : '-';
  const as_ = showScore ? (away.score ?? '-') : '-';

  // winner bold
  const homeWin = showScore && !isPre && !isLive && parseInt(hs) > parseInt(as_);
  const awayWin = showScore && !isPre && !isLive && parseInt(as_) > parseInt(hs);

  const homeLogo = imgTag(home.team?.logo, home.team?.abbreviation, 'mr-team-logo');
  const awayLogo = imgTag(away.team?.logo, away.team?.abbreviation, 'mr-team-logo');

  const timeHtml = isLive
    ? `<div class="mr-time live"><span class="live-min"><span class="live-dot"></span>${esc(label)}</span></div>`
    : `<div class="mr-time ${cls}">${esc(label)}</div>`;

  return `
<div class="match-row${isLive ? ' is-live' : ''}" data-event-id="${esc(ev.id)}" data-league="${esc(leagueId)}" onclick="openMatchModal('${esc(ev.id)}','${esc(leagueId)}')">
  ${timeHtml}
  <div class="mr-teams">
    <div class="mr-team">
      ${homeLogo}
      <span class="mr-team-name${homeWin ? ' winner' : ''}">${esc(home.team?.displayName || home.team?.shortDisplayName || '—')}</span>
    </div>
    <div class="mr-team">
      ${awayLogo}
      <span class="mr-team-name${awayWin ? ' winner' : ''}">${esc(away.team?.displayName || away.team?.shortDisplayName || '—')}</span>
    </div>
  </div>
  <div class="mr-scores">
    <div class="mr-score${isLive ? ' live' : ''}">${esc(hs)}</div>
    <div class="mr-score${isLive ? ' live' : ''}">${esc(as_)}</div>
  </div>
  <div class="mr-tv">${tvBadges(leagueId)}</div>
</div>`;
}

/* ── Render scores ─────────────────────────────────────────── */
function renderScores(data, leagueId) {
  if (!data) return errHTML('Dati non disponibili.');
  const evs = data.events || [];
  if (!evs.length) return emptyHTML();

  const live = evs.filter(e => e.status?.type?.state === 'in');
  const pre  = evs.filter(e => e.status?.type?.state === 'pre');
  const post = evs.filter(e => e.status?.type?.state === 'post' || e.status?.type?.completed);

  // Check score changes & notify
  checkScoreChanges(live, leagueId);

  function section(title, items) {
    if (!items.length) return '';
    return `<div class="section-block">
      <div class="section-label">${title} (${items.length})</div>
      <div class="matches-table">${items.map(e => matchRow(e, leagueId)).join('')}</div>
    </div>`;
  }

  return section('🔴 In corso', live)
       + section('📅 In programma', pre)
       + section('✅ Risultati', post)
       || emptyHTML();
}

/* ── Score change detection + notifications ────────────────── */
function checkScoreChanges(liveEvents, leagueId) {
  if (!state.notifGranted) return;
  liveEvents.forEach(ev => {
    const comp = ev.competitions?.[0];
    if (!comp) return;
    const cs   = comp.competitors || [];
    const home = cs.find(c => c.homeAway === 'home') || cs[0];
    const away = cs.find(c => c.homeAway === 'away') || cs[1];
    if (!home || !away) return;
    const key  = ev.id;
    const hs   = home.score ?? 0;
    const as_  = away.score ?? 0;
    const prev = state.prevScores[key];
    if (prev && (prev.hs !== hs || prev.as !== as_)) {
      const hn  = home.team?.shortDisplayName || 'Casa';
      const an  = away.team?.shortDisplayName || 'Ospite';
      new Notification(`GOL! ⚽ ${hn} ${hs} - ${as_} ${an}`, {
        body: `${hn} vs ${an}`,
        icon: home.team?.logo || undefined,
      });
    }
    state.prevScores[key] = { hs, as: as_ };
  });
}

/* ── Soccer standings ──────────────────────────────────────── */
function statVal(stats, name) {
  const s = stats.find(x => x.name === name || x.shortDisplayName === name);
  return s ? (s.displayValue ?? s.value ?? '—') : '—';
}

function soccerStandingsTable(entries, leagueId) {
  if (!entries?.length) return errHTML('Classifica non disponibile.');
  const rows = entries.map((entry, i) => {
    const rank  = i + 1;
    const stats = entry.stats || [];
    const gp    = statVal(stats, 'gamesPlayed');
    const w     = statVal(stats, 'wins');
    const d     = statVal(stats, 'ties') !== '—' ? statVal(stats, 'ties') : statVal(stats, 'draws');
    const l     = statVal(stats, 'losses');
    const gf    = statVal(stats, 'pointsFor');
    const ga    = statVal(stats, 'pointsAgainst');
    const gdRaw = statVal(stats, 'pointDifferential');
    const gd    = gdRaw !== '—' ? gdRaw
                : (gf !== '—' && ga !== '—' ? Number(gf) - Number(ga) : '—');
    const pts   = statVal(stats, 'points');
    const t     = entry.team;
    const logo  = t?.logos?.[0]?.href || t?.logo || '';
    const total = entries.length;

    let rankCls = '';
    if (rank === 1) rankCls = 'rank-1';
    else if (rank <= 4) rankCls = 'rank-cl';
    else if (rank === 5) rankCls = 'rank-el';
    else if (rank === 6) rankCls = 'rank-ecl';
    else if (rank >= total - 2) rankCls = 'rank-rl';

    return `<tr>
      <td class="num"><span class="rank-badge ${rankCls}">${rank}</span></td>
      <td><div class="logo-cell">${logo ? `<img src="${esc(logo)}" width="20" height="20" alt="" onerror="this.style.display='none'">` : ''}${esc(t?.displayName || t?.shortDisplayName || '?')}</div></td>
      <td class="num">${gp}</td>
      <td class="num">${w}</td>
      <td class="num">${d}</td>
      <td class="num">${l}</td>
      <td class="num">${gf}</td>
      <td class="num">${ga}</td>
      <td class="num">${gd}</td>
      <td class="num pts-cell">${pts}</td>
    </tr>`;
  }).join('');

  return `<div class="table-wrap"><table>
    <thead><tr>
      <th class="num">#</th><th>Squadra</th>
      <th class="num" title="Partite Giocate">PG</th>
      <th class="num" title="Vittorie">V</th>
      <th class="num" title="Pareggi">P</th>
      <th class="num" title="Sconfitte">S</th>
      <th class="num" title="Gol Fatti">GF</th>
      <th class="num" title="Gol Subiti">GS</th>
      <th class="num" title="Differenza Reti">DR</th>
      <th class="num" title="Punti">PT</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function renderSoccerStandings(data) {
  if (!data) return errHTML();
  const seek = obj => {
    if (!obj) return null;
    if (obj.standings?.entries?.length) return obj.standings.entries;
    if (obj.entries?.length) return obj.entries;
    if (Array.isArray(obj)) {
      for (const x of obj) { const r = seek(x); if (r) return r; }
    } else if (typeof obj === 'object') {
      for (const v of Object.values(obj)) { if (v && typeof v === 'object') { const r = seek(v); if (r) return r; } }
    }
    return null;
  };
  const entries = seek(data);
  return soccerStandingsTable(entries, state.league);
}

/* ── NBA standings ─────────────────────────────────────────── */
function renderNBAStandings(data) {
  if (!data) return errHTML();
  let html = '';

  const processGroup = group => {
    const entries = group.standings?.entries || [];
    if (!entries.length) {
      (group.children || []).forEach(processGroup);
      return;
    }
    const name = group.name || 'Conference';
    const rows = entries.map((entry, i) => {
      const rank  = i + 1;
      const stats = entry.stats || [];
      const w     = statVal(stats, 'wins');
      const l     = statVal(stats, 'losses');
      const pct   = statVal(stats, 'winPercent');
      const gb    = statVal(stats, 'gamesBehind');
      const streak= statVal(stats, 'streak');
      const l10   = statVal(stats, 'last10');
      const t     = entry.team;
      const logo  = t?.logos?.[0]?.href || t?.logo || '';
      return `<tr class="${rank === 8 ? 'playoff-divider' : ''}">
        <td class="num">${rank}</td>
        <td><div class="logo-cell">${logo ? `<img src="${esc(logo)}" width="20" height="20" alt="" onerror="this.style.display='none'">` : ''}${esc(t?.displayName || t?.shortDisplayName || '?')}</div></td>
        <td class="num">${w}</td><td class="num">${l}</td>
        <td class="num">${pct}</td><td class="num">${gb}</td>
        <td class="num">${streak}</td><td class="num">${l10}</td>
      </tr>`;
    }).join('');
    html += `<div class="table-wrap" style="margin-bottom:16px">
      <div class="conference-header">${esc(name)}</div>
      <table>
        <thead><tr>
          <th class="num">#</th><th>Squadra</th>
          <th class="num">V</th><th class="num">S</th>
          <th class="num">%</th><th class="num">GB</th>
          <th class="num">Streak</th><th class="num">Ult.10</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  };

  (data.children || data.groups || []).forEach(processGroup);
  return html || errHTML('Classifica NBA non disponibile.');
}

/* ── F1 helpers ────────────────────────────────────────────── */
const F1_COLORS = {
  'Red Bull': '#3671C6', 'Ferrari': '#E8002D', 'Mercedes': '#27F4D2',
  'McLaren': '#FF8000', 'Aston Martin': '#229971', 'Alpine': '#FF87BC',
  'Williams': '#64C4FF', 'Racing Bulls': '#6692FF', 'AlphaTauri': '#6692FF',
  'Kick Sauber': '#52E252', 'Sauber': '#52E252', 'Haas': '#B6BABD',
};
const f1Color = name => {
  if (!name) return '#aaa';
  for (const [k, v] of Object.entries(F1_COLORS)) if (name.includes(k)) return v;
  return '#aaa';
};

function renderF1DriverStandings(data) {
  if (!data) return errHTML('Dati F1 non disponibili.');
  const list = data?.MRData?.StandingsTable?.StandingsLists?.[0];
  if (!list) return errHTML('Classifica Piloti non disponibile.');
  const rows = (list.DriverStandings || []).map(ds => {
    const drv = ds.Driver || {};
    const con = (ds.Constructors || [])[0] || {};
    const col = f1Color(con.name);
    return `<tr>
      <td class="num"><strong>${ds.position}</strong></td>
      <td><span class="team-bar" style="background:${col}"></span>${esc(drv.givenName)} <strong>${esc(drv.familyName)}</strong></td>
      <td>${esc(drv.nationality || '')}</td>
      <td>${esc(con.name || '')}</td>
      <td class="num pts-cell">${esc(ds.points)}</td>
      <td class="num">${esc(ds.wins)}</td>
    </tr>`;
  }).join('');
  return `<div class="table-wrap"><table>
    <thead><tr>
      <th class="num">#</th><th>Pilota</th><th>Naz.</th>
      <th>Squadra</th><th class="num">Punti</th><th class="num">Vitt.</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function renderF1ConstructorStandings(data) {
  if (!data) return errHTML('Classifica Costruttori non disponibile.');
  const list = data?.MRData?.StandingsTable?.StandingsLists?.[0];
  if (!list) return errHTML();
  const rows = (list.ConstructorStandings || []).map(cs => {
    const con = cs.Constructor || {};
    const col = f1Color(con.name);
    return `<tr>
      <td class="num"><strong>${cs.position}</strong></td>
      <td><span class="team-bar" style="background:${col}"></span><strong>${esc(con.name || '')}</strong></td>
      <td>${esc(con.nationality || '')}</td>
      <td class="num pts-cell">${esc(cs.points)}</td>
      <td class="num">${esc(cs.wins)}</td>
    </tr>`;
  }).join('');
  return `<div class="table-wrap"><table>
    <thead><tr>
      <th class="num">#</th><th>Costruttore</th><th>Naz.</th>
      <th class="num">Punti</th><th class="num">Vitt.</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function renderF1Races(data) {
  if (!data) return errHTML('Risultati F1 non disponibili.');
  const races = data?.MRData?.RaceTable?.Races || [];
  if (!races.length) return emptyHTML();

  const cards = races.map(race => {
    const results = race.Results || [];
    const top3    = results.slice(0, 3);
    const d       = new Date((race.date || '') + 'T' + (race.time || '12:00:00'));
    const dateLbl = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });

    const podium = top3.length
      ? `<div class="f1-podium">${top3.map((r, i) => {
          const medals = ['🥇', '🥈', '🥉'];
          const drv = r.Driver || {};
          const con = r.Constructor || {};
          return `<div class="f1-pos">
            <span class="f1-medal">${medals[i]}</span>
            <div>
              <div class="f1-driver-name">${esc(drv.givenName)} ${esc(drv.familyName)}</div>
              <div class="f1-driver-meta">${esc(con.name || '')}${r.Time?.time ? ' · ' + esc(r.Time.time) : ''}</div>
            </div>
          </div>`;
        }).join('')}</div>` : '';

    return `<div class="f1-race">
      <div class="f1-race-top">
        <span class="f1-round">Round ${esc(race.round)}</span>
        <span class="f1-date">${esc(dateLbl)}</span>
      </div>
      <div class="f1-race-name">${esc(race.raceName)}</div>
      <div class="f1-circuit">${esc(race.Circuit?.circuitName || '')} · ${esc(race.Circuit?.Location?.country || '')}</div>
      ${podium}
    </div>`;
  }).join('');

  return `<div class="section-block">
    <div class="section-label">Stagione ${esc(races[0]?.season || '')}</div>
    <div class="f1-grid">${cards}</div>
  </div>`;
}

/* ── Leaders / Scorers ─────────────────────────────────────── */
function renderLeaders(data) {
  if (!data) return errHTML();
  const groups = data.leaders || [];
  const preferred = groups.find(g => /goal|scorer|point/i.test(g.name || g.displayName || '')) || groups[0];
  if (!preferred?.leaders?.length) return errHTML('Dati marcatori non disponibili per questa competizione.');

  const items = preferred.leaders.slice(0, 30).map((ldr, i) => {
    const rank  = i + 1;
    const rcls  = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
    const ath   = ldr.athlete || {};
    const team  = ldr.team    || {};
    const photo = ath.headshot?.href || ath.headshot || '';
    const tlogo = (team.logos || [])[0]?.href || team.logo || '';

    const avatar = photo
      ? `<img class="scorer-avatar" src="${esc(photo)}" alt="" onerror="this.style.display='none'">`
      : `<div class="scorer-avatar" style="display:flex;align-items:center;justify-content:center;font-size:1.2rem;background:var(--bg)">👤</div>`;

    return `<div class="scorer-card">
      <div class="scorer-rank ${rcls}">${rank}</div>
      ${avatar}
      <div class="scorer-info">
        <div class="scorer-name">${esc(ath.displayName || ath.fullName || '?')}</div>
        <div class="scorer-team">
          ${tlogo ? `<img src="${esc(tlogo)}" width="14" height="14" alt="" onerror="this.style.display='none'">` : ''}
          ${esc(team.displayName || team.shortDisplayName || '')}
        </div>
      </div>
      <div class="scorer-stat">
        <div class="stat-num">${esc(String(ldr.value ?? ldr.displayValue ?? 0))}</div>
        <div class="stat-lbl">${esc(preferred.displayName || preferred.name || 'Gol')}</div>
      </div>
    </div>`;
  }).join('');

  return `<div class="scorers-list">${items}</div>`;
}

/* ── News ──────────────────────────────────────────────────── */
async function renderNews() {
  const data = await fetchJSON('https://site.api.espn.com/apis/site/v2/sports/soccer/news?limit=30', 60000);
  if (!data || !data.articles?.length) return errHTML('Notizie non disponibili al momento.');

  const cards = data.articles.map(a => {
    const img   = a.images?.[0]?.url || '';
    const title = a.headline || a.title || '';
    const desc  = a.description || '';
    const cat   = a.categories?.[0]?.description || a.type || 'Calcio';
    const link  = a.links?.web?.href || '#';
    const date  = a.published ? new Date(a.published).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

    const imgHtml = img
      ? `<img class="news-card-img" src="${esc(img)}" alt="" loading="lazy" onerror="this.parentElement.querySelector('.news-card-img-ph').style.display='flex';this.style.display='none'">`
      : '';
    const phHtml = `<div class="news-card-img-ph" style="${img ? 'display:none' : ''}">📰</div>`;

    return `<a class="news-card" href="${esc(link)}" target="_blank" rel="noopener">
      ${imgHtml}${phHtml}
      <div class="news-card-body">
        <div class="news-card-cat">${esc(cat)}</div>
        <div class="news-card-title">${esc(title)}</div>
        <div class="news-card-desc">${esc(desc)}</div>
        <div class="news-card-date">${esc(date)}</div>
      </div>
    </a>`;
  }).join('');

  return `<div class="section-block">
    <div class="section-label">Ultime notizie sportive</div>
    <div class="news-grid">${cards}</div>
  </div>`;
}

/* ── Utility states ────────────────────────────────────────── */
function loadingHTML() {
  return `<div class="loading-state"><div class="spinner"></div><p>Caricamento in corso…</p></div>`;
}
function errHTML(msg) {
  return `<div class="error-state"><div class="state-icon">⚠️</div><p>${esc(msg || 'Dati non disponibili.')}</p></div>`;
}
function emptyHTML() {
  return `<div class="empty-state"><div class="state-icon">📅</div><p>Nessuna partita in programma.</p></div>`;
}

/* ── Main render ───────────────────────────────────────────── */
async function render() {
  const el = document.getElementById('content');
  el.innerHTML = loadingHTML();

  const { sport, league, view } = state;
  let html = '';

  try {
    if (sport === 'news') {
      html = await renderNews();
    } else if (sport === 'f1') {
      if (view === 'scores') {
        const d = await fetchJSON(`${JOLPICA}/current/results.json?limit=50`);
        html = renderF1Races(d);
      } else if (view === 'standings') {
        const [driverD, conD] = await Promise.all([
          fetchJSON(`${JOLPICA}/current/driverStandings.json`),
          fetchJSON(`${JOLPICA}/current/constructorStandings.json`),
        ]);
        const subtabs = `<div class="sub-tabs">
          <button class="sub-tab ${state.f1sub === 'drivers' ? 'active' : ''}" onclick="window.setF1sub('drivers')">Piloti</button>
          <button class="sub-tab ${state.f1sub === 'constructors' ? 'active' : ''}" onclick="window.setF1sub('constructors')">Costruttori</button>
        </div>`;
        html = subtabs + (state.f1sub === 'drivers'
          ? renderF1DriverStandings(driverD)
          : renderF1ConstructorStandings(conD));
      } else {
        html = errHTML('Statistiche individuali non disponibili per la F1.');
      }
    } else if (sport === 'basketball') {
      if (view === 'scores') {
        const d = await espnScoreboard(league);
        html = renderScores(d, league);
      } else if (view === 'standings') {
        const d = await espnStandings(league);
        html = renderNBAStandings(d);
      } else {
        const d = await espnLeaders(league);
        html = renderLeaders(d);
      }
    } else {
      // football
      if (view === 'scores') {
        const d = await espnScoreboard(league);
        html = renderScores(d, league);
      } else if (view === 'standings') {
        const d = await espnStandings(league);
        html = renderSoccerStandings(d);
      } else {
        const d = await espnLeaders(league);
        html = renderLeaders(d);
      }
    }
    el.innerHTML = html;
  } catch (err) {
    console.error('[render]', err);
    el.innerHTML = errHTML();
  }

  document.getElementById('updated-at').textContent =
    'Aggiornato: ' + new Date().toLocaleTimeString('it-IT');
}

/* ── Sidebar ───────────────────────────────────────────────── */
function buildSidebar(searchQuery) {
  const q = (searchQuery || '').toLowerCase().trim();
  const container = document.getElementById('league-sections');
  const favNav    = document.getElementById('fav-nav');
  const favSect   = document.getElementById('fav-section');

  // Favorites
  const favLeagues = state.favorites
    .map(id => ALL_LEAGUES_MAP[id])
    .filter(Boolean);

  if (favLeagues.length && !q) {
    favSect.style.display = '';
    favNav.innerHTML = favLeagues.map(l => leagueItemHtml(l)).join('');
  } else {
    favSect.style.display = 'none';
  }

  // Category sections
  let html = '';
  COMPETITION_CATEGORIES.forEach(cat => {
    const leagues = q
      ? cat.leagues.filter(l => l.name.toLowerCase().includes(q) || cat.label.toLowerCase().includes(q))
      : cat.leagues;
    if (!leagues.length) return;

    html += `<div class="sidebar-section">
      <div class="sidebar-section-header"><span>${esc(cat.label)}</span></div>
      <div class="league-nav">${leagues.map(l => leagueItemHtml(l)).join('')}</div>
    </div>`;
  });

  container.innerHTML = html;
}

function leagueItemHtml(l) {
  const active  = l.id === state.league ? 'active' : '';
  const favCls  = isFav(l.id) ? 'is-fav' : '';
  const favIcon = isFav(l.id) ? '★' : '☆';
  return `<button class="league-item ${active}" onclick="window.pickLeague('${esc(l.id)}')">
    <span class="league-flag">${l.flag}</span>
    <span class="league-name">${esc(l.name)}</span>
    <span class="league-fav ${favCls}" onclick="event.stopPropagation();window.toggleFavLeague('${esc(l.id)}')" title="Preferiti">${favIcon}</span>
  </button>`;
}

/* ── View tabs ─────────────────────────────────────────────── */
function buildViewTabs() {
  const isF1   = state.sport === 'f1';
  const isNews = state.sport === 'news';
  const vtDiv  = document.getElementById('view-tabs');
  if (isNews) {
    vtDiv.style.display = 'none';
    return;
  }
  vtDiv.style.display = '';
  document.querySelectorAll('.view-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.view === state.view);
    if (b.dataset.view === 'scorers' && isF1) {
      b.style.display = 'none';
    } else {
      b.style.display = '';
    }
  });
}

/* ── Sport tabs ────────────────────────────────────────────── */
function buildSportTabs() {
  document.querySelectorAll('.sport-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.sport === state.sport);
  });
  document.querySelectorAll('.msport-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.sport === state.sport);
  });
}

function updateTitle() {
  const l = ALL_LEAGUES_MAP[state.league];
  const ptEl = document.getElementById('page-title');
  if (state.sport === 'news') {
    ptEl.textContent = '📰 Notizie Sportive';
    return;
  }
  if (state.sport === 'f1') {
    ptEl.textContent = '🏁 Formula 1';
    return;
  }
  if (l) {
    ptEl.textContent = `${l.flag} ${l.name}`;
  }
}

/* ── Match detail modal ────────────────────────────────────── */
window.openMatchModal = async function(eventId, leagueId) {
  if (!eventId || !leagueId) return;

  const overlay = document.getElementById('modal-overlay');
  const infoEl  = document.getElementById('modal-match-info');
  const bodyEl  = document.getElementById('modal-body');

  state.modalTab = 'events';
  overlay.classList.add('open');
  bodyEl.innerHTML = loadingHTML();

  // Set modal tabs active state
  document.querySelectorAll('.modal-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.mtab === 'events');
  });

  const data = await espnSummary(leagueId, eventId);
  if (!data) {
    bodyEl.innerHTML = errHTML('Impossibile caricare i dettagli.');
    infoEl.innerHTML = '<div class="modal-meta">Dettaglio partita non disponibile</div>';
    return;
  }

  state.modalData  = { data, eventId, leagueId };

  // Header info
  const comp = data.header?.competitions?.[0] || data.boxscore?.teams;
  let homeTeam = {}, awayTeam = {};
  let homeScore = '-', awayScore = '-';
  let statusTxt = '';
  let isLive = false;

  if (data.header?.competitions?.[0]) {
    const hcomp = data.header.competitions[0];
    const cs = hcomp.competitors || [];
    const h  = cs.find(c => c.homeAway === 'home') || cs[0];
    const a  = cs.find(c => c.homeAway === 'away') || cs[1];
    if (h) { homeTeam = h.team || {}; homeScore = h.score ?? '-'; }
    if (a) { awayTeam = a.team || {}; awayScore = a.score ?? '-'; }
    const stType = hcomp.status?.type;
    isLive = stType?.state === 'in';
    statusTxt = isLive ? `${data.header.competitions[0].status?.displayClock || ''} - Live`
      : (stType?.completed ? 'Finale' : '');
  }

  infoEl.innerHTML = `
    <div class="modal-score-row">
      <span class="modal-team">${esc(homeTeam.shortDisplayName || homeTeam.displayName || 'Home')}</span>
      <span class="modal-score-badge${isLive ? ' live' : ''}">${esc(homeScore)} - ${esc(awayScore)}</span>
      <span class="modal-team">${esc(awayTeam.shortDisplayName || awayTeam.displayName || 'Away')}</span>
    </div>
    ${statusTxt ? `<div class="modal-meta">${esc(statusTxt)}</div>` : ''}
  `;

  renderModalTab('events');
};

function renderModalTab(tab) {
  state.modalTab = tab;
  document.querySelectorAll('.modal-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.mtab === tab);
  });

  const bodyEl = document.getElementById('modal-body');
  if (!state.modalData) return;

  const { data, leagueId } = state.modalData;

  if (tab === 'events') {
    bodyEl.innerHTML = buildEventsHTML(data);
  } else if (tab === 'lineups') {
    bodyEl.innerHTML = buildLineupsHTML(data);
  } else if (tab === 'stats') {
    bodyEl.innerHTML = buildStatsHTML(data);
  } else if (tab === 'tv') {
    bodyEl.innerHTML = buildTvHTML(leagueId, data);
  }
}

function buildEventsHTML(data) {
  const plays = data.plays || data.keyEvents || [];
  const scoring = data.scoringPlays || [];
  const all = [...(plays.length ? plays : scoring)];

  if (!all.length) {
    // Try drives / incidents
    const drivePlays = (data.drives?.previous || []).flatMap(d => d.plays || []);
    if (!drivePlays.length) return `<div class="empty-state"><div class="state-icon">📋</div><p>Nessun evento disponibile.</p></div>`;
    return buildEventsFromPlays(drivePlays);
  }
  return buildEventsFromPlays(all);
}

function buildEventsFromPlays(plays) {
  if (!plays.length) return `<div class="empty-state"><div class="state-icon">📋</div><p>Nessun evento disponibile.</p></div>`;

  const rows = plays.slice(0, 50).map(play => {
    const min  = play.clock?.displayValue || play.period?.displayValue || '';
    const text = play.text || play.description || '';
    const type = (play.type?.text || play.type?.id || '').toLowerCase();

    let icon = '▶';
    if (/goal|rete|gol/i.test(text + type)) icon = '⚽';
    else if (/yellow|giallo/i.test(text + type)) icon = '🟨';
    else if (/red|rosso/i.test(text + type)) icon = '🟥';
    else if (/subst|cambio|sostituz/i.test(text + type)) icon = '🔄';
    else if (/penalty|rigore/i.test(text + type)) icon = '🎯';
    else if (/var/i.test(text + type)) icon = '📺';
    else if (/whistle|fischio/i.test(text + type)) icon = '🔔';

    const team = play.team?.shortDisplayName || play.team?.displayName || '';

    return `<div class="event-row">
      <span class="event-min">${esc(min)}</span>
      <span class="event-icon">${icon}</span>
      <div class="event-text">
        <div class="event-player">${esc(text)}</div>
        ${team ? `<div class="event-team">${esc(team)}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  return `<div class="events-list">${rows}</div>`;
}

function buildLineupsHTML(data) {
  const teams = (data.boxscore?.players || data.rosters || []);
  if (!teams.length) {
    return `<div class="empty-state"><div class="state-icon">👕</div><p>Formazioni non disponibili.</p></div>`;
  }

  const cols = teams.slice(0, 2).map(teamData => {
    const teamName = teamData.team?.displayName || teamData.team?.shortDisplayName || 'Squadra';
    const roster   = teamData.roster || teamData.statistics || [];
    const starters = roster.filter(p => p.starter !== false && p.active !== false);
    const bench    = roster.filter(p => p.starter === false);

    const playerRow = p => {
      const ath  = p.athlete || p;
      const num  = ath.jersey || p.jersey || '';
      const name = ath.displayName || ath.fullName || ath.shortName || '';
      const pos  = ath.position?.abbreviation || p.position?.abbreviation || '';
      return `<div class="lineup-player">
        <span class="player-num">${esc(num)}</span>
        <span class="player-name">${esc(name)}</span>
        <span class="player-pos">${esc(pos)}</span>
      </div>`;
    };

    const startersHtml = starters.length
      ? `<div class="lineup-section-label">Titolari</div>${starters.slice(0, 11).map(playerRow).join('')}`
      : '';
    const benchHtml = bench.length
      ? `<div class="lineup-section-label">Panchina</div>${bench.slice(0, 10).map(playerRow).join('')}`
      : '';

    return `<div class="lineup-col">
      <div class="lineup-col-title">${esc(teamName)}</div>
      ${startersHtml}
      ${benchHtml}
    </div>`;
  }).join('');

  return `<div class="lineups-wrap">${cols}</div>`;
}

function buildStatsHTML(data) {
  const boxscore = data.boxscore;
  if (!boxscore) return `<div class="empty-state"><div class="state-icon">📊</div><p>Statistiche non disponibili.</p></div>`;

  // Soccer: gamepackage stats format
  const gameStats = data.standings?.groups?.[0]?.entries ||
                    data.pickcenter?.[0]?.statistics || [];

  // Try to extract stats from header
  const headerStats = data.header?.competitions?.[0];
  const teamStatsArr = boxscore.teams || [];

  if (!teamStatsArr.length) {
    return `<div class="empty-state"><div class="state-icon">📊</div><p>Statistiche non disponibili.</p></div>`;
  }

  const team0 = teamStatsArr[0];
  const team1 = teamStatsArr[1] || {};
  const stats0 = team0.statistics || team0.stats || [];
  const stats1 = team1.statistics || team1.stats || [];

  if (!stats0.length) {
    return `<div class="empty-state"><div class="state-icon">📊</div><p>Statistiche non disponibili.</p></div>`;
  }

  const statLabels = [
    { keys: ['possessionPct', 'possessionPct50', 'Possession'], label: 'Possesso palla', unit: '%' },
    { keys: ['totalShots', 'shots', 'Shots'], label: 'Tiri totali', unit: '' },
    { keys: ['shotsOnTarget', 'ShotsOnTarget', 'Shots On Target'], label: 'Tiri in porta', unit: '' },
    { keys: ['corners', 'Corners'], label: 'Calci d\'angolo', unit: '' },
    { keys: ['fouls', 'Fouls'], label: 'Falli', unit: '' },
    { keys: ['yellowCards', 'Yellow Cards'], label: 'Cartellini gialli', unit: '' },
    { keys: ['saves', 'Saves', 'Goalkeeper Saves'], label: 'Parate', unit: '' },
    { keys: ['blockedShots', 'Blocked Shots'], label: 'Tiri bloccati', unit: '' },
    { keys: ['offsides', 'Offsides'], label: 'Fuorigioco', unit: '' },
  ];

  const findStat = (arr, keys) => {
    for (const key of keys) {
      const found = arr.find(s => s.name === key || s.label === key || s.abbreviation === key);
      if (found) return parseFloat(found.displayValue ?? found.value ?? 0) || 0;
    }
    return null;
  };

  const rows = statLabels.map(({ keys, label, unit }) => {
    const v0 = findStat(stats0, keys);
    const v1 = findStat(stats1, keys);
    if (v0 === null && v1 === null) return '';

    const val0  = v0 ?? 0;
    const val1  = v1 ?? 0;
    const total = val0 + val1 || 1;
    const pct0  = Math.round((val0 / total) * 100);
    const pct1  = 100 - pct0;

    return `<div class="stat-row">
      <div class="stat-label">
        <span class="stat-val">${val0}${unit}</span>
        <span class="stat-label-name">${esc(label)}</span>
        <span class="stat-val away">${val1}${unit}</span>
      </div>
      <div class="stat-bar-wrap">
        <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct0}%"></div></div>
        <div class="stat-bar-track"><div class="stat-bar-fill away" style="width:${pct1}%"></div></div>
      </div>
    </div>`;
  }).filter(Boolean).join('');

  if (!rows) return `<div class="empty-state"><div class="state-icon">📊</div><p>Statistiche non ancora disponibili.</p></div>`;

  const ht = team0.team?.shortDisplayName || 'Casa';
  const at = team1.team?.shortDisplayName || 'Ospite';

  return `
    <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:700;margin-bottom:12px;color:var(--txt2)">
      <span>${esc(ht)}</span>
      <span>${esc(at)}</span>
    </div>
    <div class="stats-list">${rows}</div>`;
}

function buildTvHTML(leagueId, data) {
  const channels = TV_MAP[leagueId] || TV_MAP_DEFAULT;
  const items = channels.map(ch => `
    <div class="tv-item">
      <div class="tv-logo-wrap">${ch.icon}</div>
      <div>
        <div class="tv-name">${esc(ch.name)}</div>
        <div class="tv-desc">${esc(getTvDesc(ch.name))}</div>
      </div>
    </div>`).join('');

  return `<div class="tv-list">
    <p style="font-size:0.82rem;color:var(--txt3);margin-bottom:12px">
      Canali su cui seguire la partita in Italia:
    </p>
    ${items}
  </div>`;
}

function getTvDesc(name) {
  const descs = {
    'Sky Sport':  'Sky Sport Uno / Sky Sport Football / Sky Go',
    'DAZN':       'App DAZN · streaming on-demand',
    'TV8':        'TV8 · canale 8 del digitale terrestre',
    'Mediaset':   'Canale 5 · streaming su Mediaset Infinity',
    'Italia 1':   'Italia 1 · canale 6 del digitale terrestre',
    'Rai':        'RAI Sport · Rai Play streaming gratuito',
  };
  return descs[name] || 'Verifica la programmazione sulla piattaforma';
}

/* ── Timer ─────────────────────────────────────────────────── */
function resetTimer() {
  clearInterval(state.timer);
  state.countdown = REFRESH_SEC;
  updateRefreshLabel();
  state.timer = setInterval(() => {
    state.countdown--;
    updateRefreshLabel();
    if (state.countdown <= 0) {
      state.countdown = REFRESH_SEC;
      render();
    }
  }, 1000);
}

function updateRefreshLabel() {
  const lbl = document.getElementById('refresh-label');
  if (lbl) lbl.textContent = `${state.countdown}s`;
}

/* ── Notifications ─────────────────────────────────────────── */
async function requestNotifications() {
  if (!('Notification' in window)) return;
  const permission = await Notification.requestPermission();
  state.notifGranted = permission === 'granted';
  const btn = document.getElementById('notif-btn');
  if (btn) {
    btn.classList.toggle('active', state.notifGranted);
    btn.title = state.notifGranted ? 'Notifiche attive' : 'Attiva notifiche';
  }
}

/* ── Sidebar toggle ─────────────────────────────────────────── */
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('active');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
}

/* ── Public window handlers ────────────────────────────────── */
window.pickLeague = function(id) {
  const info = ALL_LEAGUES_MAP[id];
  if (!info) return;
  state.league = id;
  state.sport  = info.sport;
  state.view   = 'scores';
  buildSportTabs();
  buildSidebar();
  buildViewTabs();
  updateTitle();
  resetTimer();
  render();
  closeSidebar();
};

window.toggleFavLeague = function(id) {
  toggleFav(id);
};

window.setF1sub = function(tab) {
  state.f1sub = tab;
  render();
};

/* ── Init ──────────────────────────────────────────────────── */
function init() {
  /* Sport tabs (desktop) */
  document.getElementById('sport-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.sport-tab');
    if (!tab) return;
    const sp = tab.dataset.sport;
    setSport(sp);
  });

  /* Sport tabs (mobile bar) */
  document.getElementById('mobile-sport-bar').addEventListener('click', e => {
    const tab = e.target.closest('.msport-tab');
    if (!tab) return;
    setSport(tab.dataset.sport);
  });

  /* View tabs */
  document.getElementById('view-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.view-tab');
    if (!tab) return;
    state.view = tab.dataset.view;
    buildViewTabs();
    render();
  });

  /* Modal tabs */
  document.querySelector('.modal-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.modal-tab');
    if (!tab) return;
    renderModalTab(tab.dataset.mtab);
  });

  /* Modal close */
  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('modal-overlay').classList.remove('open');
    state.modalData = null;
  });
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) {
      document.getElementById('modal-overlay').classList.remove('open');
      state.modalData = null;
    }
  });

  /* Hamburger */
  document.getElementById('hamburger').addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    if (sb.classList.contains('open')) closeSidebar();
    else openSidebar();
  });

  /* Sidebar overlay */
  document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

  /* Sidebar search */
  document.getElementById('sidebar-search').addEventListener('input', e => {
    buildSidebar(e.target.value);
  });

  /* Notifications button */
  document.getElementById('notif-btn').addEventListener('click', requestNotifications);

  /* Init notif button state */
  if (state.notifGranted) {
    document.getElementById('notif-btn').classList.add('active');
  }

  /* Initial state for first-run */
  buildSportTabs();
  buildSidebar();
  buildViewTabs();
  updateTitle();
  resetTimer();
  render();
}

function setSport(sp) {
  if (sp === 'news') {
    state.sport = 'news';
    state.view  = 'scores';
    buildSportTabs();
    buildViewTabs();
    updateTitle();
    render();
    return;
  }

  // Find first league for this sport
  const cat = COMPETITION_CATEGORIES.find(c => c.sport === sp);
  if (!cat) return;

  state.sport  = sp;
  state.league = cat.leagues[0].id;
  state.view   = 'scores';

  buildSportTabs();
  buildSidebar();
  buildViewTabs();
  updateTitle();
  resetTimer();
  render();
  closeSidebar();
}

document.addEventListener('DOMContentLoaded', init);
