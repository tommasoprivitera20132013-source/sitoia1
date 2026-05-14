'use strict';

/* ── Configuration ─────────────────────────────────────────── */
const REFRESH_SEC = 30;

const SPORTS = {
  football: {
    espnType: 'soccer',
    leagues: [
      { id: 'UEFA.CHAMPIONS', name: 'Champions League',  flag: '🏆' },
      { id: 'UEFA.EUROPA',    name: 'Europa League',     flag: '🌍' },
      { id: 'ita.1',          name: 'Serie A',           flag: '🇮🇹' },
      { id: 'eng.1',          name: 'Premier League',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { id: 'esp.1',          name: 'La Liga',           flag: '🇪🇸' },
      { id: 'ger.1',          name: 'Bundesliga',        flag: '🇩🇪' },
      { id: 'fra.1',          name: 'Ligue 1',           flag: '🇫🇷' },
      { id: 'por.1',          name: 'Primeira Liga',     flag: '🇵🇹' },
      { id: 'ned.1',          name: 'Eredivisie',        flag: '🇳🇱' },
    ],
  },
  basketball: {
    espnType: 'basketball',
    leagues: [
      { id: 'nba',       name: 'NBA',        flag: '🇺🇸' },
      { id: 'mens-college-basketball', name: 'NCAA', flag: '🎓' },
    ],
  },
  f1: {
    espnType: 'racing',
    leagues: [
      { id: 'f1', name: 'F1 World Championship', flag: '🏁' },
    ],
  },
};

const ESPN   = 'https://site.api.espn.com/apis/site/v2/sports';
const ESPN2  = 'https://site.api.espn.com/apis/v2/sports';
const JOLPICA = 'https://api.jolpi.ca/ergast/f1';

/* ── State ──────────────────────────────────────────────────── */
const state = {
  sport: 'football',
  league: 'UEFA.CHAMPIONS',
  view:   'scores',
  f1sub:  'drivers',
  countdown: REFRESH_SEC,
  timer: null,
  cache: {},
};

/* ── Fetch helpers ──────────────────────────────────────────── */
async function fetchJSON(url, ttl = 25000) {
  const now = Date.now();
  const hit = state.cache[url];
  if (hit && now - hit.ts < ttl) return hit.data;
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    state.cache[url] = { data, ts: now };
    return data;
  } catch (e) {
    console.warn('fetch error', url, e.message);
    return null;
  }
}

function espnScoreboard(sport, leagueId) {
  const t = SPORTS[sport].espnType;
  return fetchJSON(`${ESPN}/${t}/${leagueId}/scoreboard`);
}
function espnStandings(sport, leagueId) {
  const t = SPORTS[sport].espnType;
  return fetchJSON(`${ESPN2}/${t}/${leagueId}/standings`);
}
function espnLeaders(sport, leagueId) {
  const t = SPORTS[sport].espnType;
  return fetchJSON(`${ESPN2}/${t}/${leagueId}/leaders`);
}

/* ── Rendering helpers ──────────────────────────────────────── */
const esc = s => String(s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;');

function imgOrPlaceholder(src, alt, cls = 'team-crest') {
  if (!src) return `<div class="crest-placeholder">${esc((alt||'?')[0])}</div>`;
  return `<img class="${cls}" src="${esc(src)}" alt="${esc(alt||'')}" `
       + `onerror="this.outerHTML='<div class=crest-placeholder>${esc((alt||'?')[0])}</div>'">`;
}

function loading()     { return `<div class="loading"><div class="spinner"></div><p>Caricamento…</p></div>`; }
function errHTML(msg)  { return `<div class="error-state"><div class="state-icon">⚠️</div><p>${esc(msg||'Dati non disponibili.')}</p></div>`; }
function emptyHTML()   { return `<div class="empty-state"><div class="state-icon">📅</div><p>Nessuna partita in programma.</p></div>`; }

/* ── Match cards ────────────────────────────────────────────── */
function matchStatus(ev) {
  const st = ev.status?.type;
  if (!st) return { label: '—', cls: 'status-finished' };
  if (st.state === 'in') {
    const clock = ev.status.displayClock || '';
    return { label: `● ${clock || 'LIVE'}`, cls: 'status-live' };
  }
  if (st.completed || st.state === 'post') return { label: 'Finale', cls: 'status-finished' };
  const d = new Date(ev.date);
  const t = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  return { label: t, cls: 'status-pre' };
}

function matchCard(ev) {
  const comp  = ev.competitions?.[0];
  if (!comp) return '';
  const cs    = comp.competitors || [];
  const home  = cs.find(c => c.homeAway === 'home') || cs[0];
  const away  = cs.find(c => c.homeAway === 'away') || cs[1];
  if (!home || !away) return '';

  const { label, cls } = matchStatus(ev);
  const live   = cls === 'status-live';
  const shown  = live || cls === 'status-finished';
  const hs     = shown ? (home.score ?? '-') : '-';
  const as_    = shown ? (away.score ?? '-') : '-';

  const d      = new Date(ev.date);
  const dateLbl = d.toLocaleDateString('it-IT', { weekday:'short', day:'numeric', month:'short' });

  return `
<div class="match-card${live?' is-live':''}">
  <div class="card-top">
    <span class="status-badge ${cls}">${esc(label)}</span>
    <span class="card-date">${esc(dateLbl)}</span>
  </div>
  <div class="teams">
    <div class="team-row">
      ${imgOrPlaceholder(home.team?.logo, home.team?.shortDisplayName)}
      <span class="team-name">${esc(home.team?.displayName||home.team?.shortDisplayName||'—')}</span>
      <span class="team-score">${esc(hs)}</span>
    </div>
    <div class="team-row">
      ${imgOrPlaceholder(away.team?.logo, away.team?.shortDisplayName)}
      <span class="team-name">${esc(away.team?.displayName||away.team?.shortDisplayName||'—')}</span>
      <span class="team-score">${esc(as_)}</span>
    </div>
  </div>
</div>`;
}

function renderScores(data) {
  if (!data) return errHTML();
  const evs = data.events || [];
  if (!evs.length) return emptyHTML();

  const live  = evs.filter(e => e.status?.type?.state === 'in');
  const pre   = evs.filter(e => e.status?.type?.state === 'pre');
  const post  = evs.filter(e => e.status?.type?.state === 'post' || e.status?.type?.completed);

  const section = (title, items) => items.length
    ? `<div class="section-block"><div class="section-label">${title} (${items.length})</div><div class="matches-grid">${items.map(matchCard).join('')}</div></div>`
    : '';

  const html = section('🔴 In corso', live)
             + section('📅 In programma', pre)
             + section('✅ Risultati', post);

  return html || emptyHTML();
}

/* ── Soccer standings ───────────────────────────────────────── */
function statVal(stats, name) {
  const s = stats.find(x => x.name === name);
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
    const gd_raw = statVal(stats, 'pointDifferential');
    const gd    = gd_raw !== '—' ? gd_raw
                : (gf !== '—' && ga !== '—' ? parseInt(gf) - parseInt(ga) : '—');
    const pts   = statVal(stats, 'points');

    const t     = entry.team;
    const logo  = t?.logos?.[0]?.href || t?.logo || '';

    // rank decoration heuristic
    let rankCls = '';
    if (rank === 1) rankCls = 'rank-1';
    else if (rank <= 4) rankCls = 'rank-cl';
    else if (rank === 5 || rank === 6) rankCls = 'rank-el';
    else if (rank >= entries.length - 2) rankCls = 'rank-rl';

    return `<tr>
      <td class="num"><span class="rank-cell ${rankCls}">${rank}</span></td>
      <td><div class="logo-cell">${logo?`<img src="${esc(logo)}" alt="" onerror="this.style.display='none'">`:''}${esc(t?.displayName||t?.shortDisplayName||'?')}</div></td>
      <td class="num">${gp}</td><td class="num">${w}</td><td class="num">${d}</td>
      <td class="num">${l}</td><td class="num">${gf}</td><td class="num">${ga}</td>
      <td class="num">${gd}</td><td class="num pts-cell">${pts}</td>
    </tr>`;
  }).join('');

  return `<div class="table-wrap"><table>
    <thead><tr>
      <th class="num">#</th><th>Squadra</th>
      <th class="num">PG</th><th class="num">V</th><th class="num">P</th><th class="num">S</th>
      <th class="num">GF</th><th class="num">GS</th><th class="num">DR</th><th class="num">PT</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function renderSoccerStandings(data) {
  if (!data) return errHTML();
  // Traverse: data.children[*].standings.entries or data.standings.entries
  const seek = obj => {
    if (!obj) return null;
    if (obj.standings?.entries?.length) return obj.standings.entries;
    if (Array.isArray(obj)) {
      for (const x of obj) { const r = seek(x); if (r) return r; }
    } else if (typeof obj === 'object') {
      for (const v of Object.values(obj)) { const r = seek(v); if (r) return r; }
    }
    return null;
  };
  const entries = seek(data);
  return soccerStandingsTable(entries, state.league);
}

/* ── NBA standings ──────────────────────────────────────────── */
function renderNBAStandings(data) {
  if (!data) return errHTML();

  let html = '';
  const process = group => {
    const entries = group.standings?.entries || [];
    if (!entries.length) {
      (group.children || []).forEach(process);
      return;
    }
    const name = group.name || 'Conference';
    const rows = entries.map((entry, i) => {
      const rank   = i + 1;
      const stats  = entry.stats || [];
      const w      = statVal(stats, 'wins');
      const l      = statVal(stats, 'losses');
      const pct    = statVal(stats, 'winPercent');
      const gb     = statVal(stats, 'gamesBehind');
      const streak = statVal(stats, 'streak');
      const l10    = statVal(stats, 'last10');
      const t      = entry.team;
      const logo   = t?.logos?.[0]?.href || t?.logo || '';
      return `<tr class="${rank===8?'playoff-divider':''}">
        <td class="num">${rank}</td>
        <td><div class="logo-cell">${logo?`<img src="${esc(logo)}" alt="" onerror="this.style.display='none'">`:''}${esc(t?.displayName||t?.shortDisplayName||'?')}</div></td>
        <td class="num">${w}</td><td class="num">${l}</td>
        <td class="num">${pct}</td><td class="num">${gb}</td>
        <td class="num">${streak}</td><td class="num">${l10}</td>
      </tr>`;
    }).join('');

    html += `<div class="table-wrap" style="margin-bottom:20px">
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

  (data.children || data.groups || []).forEach(process);
  return html || errHTML('Classifica NBA non disponibile.');
}

/* ── F1 standings ───────────────────────────────────────────── */
const F1_COLORS = {
  'Red Bull':      '#3671C6',
  'Ferrari':       '#E8002D',
  'Mercedes':      '#27F4D2',
  'McLaren':       '#FF8000',
  'Aston Martin':  '#229971',
  'Alpine':        '#FF87BC',
  'Williams':      '#64C4FF',
  'Racing Bulls':  '#6692FF',
  'AlphaTauri':    '#6692FF',
  'Kick Sauber':   '#52E252',
  'Sauber':        '#52E252',
  'Haas':          '#B6BABD',
};
const f1color = name => {
  if (!name) return '#666';
  for (const [k,v] of Object.entries(F1_COLORS)) if (name.includes(k)) return v;
  return '#666';
};

function renderF1DriverStandings(data) {
  if (!data) return errHTML('Dati F1 non disponibili.');
  const list = data?.MRData?.StandingsTable?.StandingsLists?.[0];
  if (!list) return errHTML('Classifica Piloti non disponibile.');
  const rows = (list.DriverStandings || []).map(ds => {
    const drv  = ds.Driver || {};
    const con  = (ds.Constructors || [])[0] || {};
    const col  = f1color(con.name);
    return `<tr>
      <td class="num"><strong>${ds.position}</strong></td>
      <td><span class="team-bar" style="background:${col}"></span>${esc(drv.givenName)} <strong>${esc(drv.familyName)}</strong></td>
      <td>${esc(drv.nationality||'')}</td>
      <td>${esc(con.name||'')}</td>
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
    const col = f1color(con.name);
    return `<tr>
      <td class="num"><strong>${cs.position}</strong></td>
      <td><span class="team-bar" style="background:${col}"></span><strong>${esc(con.name||'')}</strong></td>
      <td>${esc(con.nationality||'')}</td>
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

/* ── F1 race results ────────────────────────────────────────── */
function renderF1Races(data) {
  if (!data) return errHTML('Risultati F1 non disponibili.');
  const races = data?.MRData?.RaceTable?.Races || [];
  if (!races.length) return emptyHTML();

  const cards = races.map(race => {
    const results = race.Results || [];
    const top3    = results.slice(0, 3);
    const d       = new Date((race.date||'')+'T'+(race.time||'00:00:00'));
    const dateLbl = d.toLocaleDateString('it-IT', { weekday:'long', day:'numeric', month:'long' });

    const podium  = top3.length ? `<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">
      ${top3.map((r,i) => {
        const medals = ['🥇','🥈','🥉'];
        const drv = r.Driver || {};
        const con = r.Constructor || {};
        return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:${i<2?6:0}px">
          <span style="font-size:1.1rem">${medals[i]}</span>
          <div>
            <span style="font-weight:600">${esc(drv.givenName)} ${esc(drv.familyName)}</span>
            <span style="color:var(--txt3);font-size:0.78rem;margin-left:6px">${esc(con.name||'')}${r.Time?.time?' · '+esc(r.Time.time):''}</span>
          </div>
        </div>`;
      }).join('')}
    </div>` : '';

    return `<div class="f1-race">
      <div class="f1-race-header">
        <span class="f1-round">Round ${esc(race.round)}</span>
        <span style="font-size:0.78rem;color:var(--txt3)">${esc(dateLbl)}</span>
      </div>
      <div class="f1-race-name">${esc(race.raceName)}</div>
      <div class="f1-circuit">${esc(race.Circuit?.circuitName||'')} · ${esc(race.Circuit?.Location?.country||'')}</div>
      ${podium}
    </div>`;
  }).join('');

  return `<div class="section-block">
    <div class="section-label">Stagione ${esc(races[0]?.season||'')}</div>
    <div class="matches-grid">${cards}</div>
  </div>`;
}

/* ── Scorers / Leaders ──────────────────────────────────────── */
function scorersList(leaders, statLabel) {
  if (!leaders?.length) return errHTML('Dati marcatori non disponibili.');
  const items = leaders.slice(0, 25).map((ldr, i) => {
    const rank  = i + 1;
    const rcls  = rank===1?'gold':rank===2?'silver':rank===3?'bronze':'';
    const ath   = ldr.athlete || {};
    const team  = ldr.team    || {};
    const photo = ath.headshot?.href || ath.headshot || '';
    const tlogo = (team.logos||[])[0]?.href || team.logo || '';

    const avatar = photo
      ? `<img class="scorer-avatar" src="${esc(photo)}" alt="" onerror="this.style.display='none'">`
      : `<div class="scorer-avatar" style="display:flex;align-items:center;justify-content:center;font-size:1.3rem">👤</div>`;

    return `<div class="scorer-card">
      <div class="scorer-rank ${rcls}">${rank}</div>
      ${avatar}
      <div class="scorer-info">
        <div class="scorer-name">${esc(ath.displayName||ath.fullName||'?')}</div>
        <div class="scorer-team">
          ${tlogo?`<img src="${esc(tlogo)}" alt="" onerror="this.style.display='none'">`:''}
          ${esc(team.displayName||team.shortDisplayName||'')}
        </div>
      </div>
      <div class="scorer-stat">
        <div class="stat-num">${esc(String(ldr.value??ldr.displayValue??0))}</div>
        <div class="stat-lbl">${esc(statLabel)}</div>
      </div>
    </div>`;
  }).join('');
  return `<div class="scorers-list">${items}</div>`;
}

function renderLeaders(data) {
  if (!data) return errHTML();
  const groups = data.leaders || [];
  // prefer goals / points
  const preferred = groups.find(g =>
    /goal|scorer|point/i.test(g.name||g.displayName||'')
  ) || groups[0];
  if (!preferred?.leaders?.length) return errHTML('Dati marcatori non disponibili per questa competizione.');
  return scorersList(preferred.leaders, preferred.displayName || preferred.name || 'Gol');
}

/* ── Main render ────────────────────────────────────────────── */
async function render() {
  const el = document.getElementById('content');
  el.innerHTML = loading();

  const { sport, league, view } = state;

  try {
    let html = '';

    if (sport === 'f1') {
      if (view === 'scores') {
        const d = await fetchJSON(`${JOLPICA}/current/results.json?limit=50`);
        html = renderF1Races(d);
      } else if (view === 'standings') {
        const [driverD, conD] = await Promise.all([
          fetchJSON(`${JOLPICA}/current/driverStandings.json`),
          fetchJSON(`${JOLPICA}/current/constructorStandings.json`),
        ]);
        const subtabs = `<div class="sub-tabs">
          <button class="sub-tab ${state.f1sub==='drivers'?'active':''}" onclick="f1sub('drivers')">Piloti</button>
          <button class="sub-tab ${state.f1sub==='constructors'?'active':''}" onclick="f1sub('constructors')">Costruttori</button>
        </div>`;
        html = subtabs + (state.f1sub === 'drivers'
          ? renderF1DriverStandings(driverD)
          : renderF1ConstructorStandings(conD));
      } else {
        html = errHTML('Statistiche individuali non disponibili per la F1.');
      }
    } else if (sport === 'basketball') {
      if (view === 'scores') {
        const d = await espnScoreboard('basketball', league);
        html = renderScores(d);
      } else if (view === 'standings') {
        const d = await espnStandings('basketball', league);
        html = renderNBAStandings(d);
      } else {
        const d = await espnLeaders('basketball', league);
        html = renderLeaders(d);
      }
    } else {
      // football
      if (view === 'scores') {
        const d = await espnScoreboard('football', league);
        html = renderScores(d);
      } else if (view === 'standings') {
        const d = await espnStandings('football', league);
        html = renderSoccerStandings(d);
      } else {
        const d = await espnLeaders('football', league);
        html = renderLeaders(d);
      }
    }

    el.innerHTML = html;
  } catch (err) {
    console.error(err);
    el.innerHTML = errHTML();
  }

  // update timestamp
  document.getElementById('updated-at').textContent =
    'Aggiornato: ' + new Date().toLocaleTimeString('it-IT');
}

/* ── UI helpers ─────────────────────────────────────────────── */
function buildLeagueNav() {
  const leagues = SPORTS[state.sport].leagues;

  // desktop sidebar
  document.getElementById('league-nav').innerHTML = leagues.map(l => `
    <button class="league-item ${l.id===state.league?'active':''}"
            onclick="pickLeague('${l.id}')">
      <span style="font-size:1rem">${l.flag}</span>
      <span>${esc(l.name)}</span>
    </button>`).join('');

  // mobile bar
  document.getElementById('mobile-leagues').innerHTML = leagues.map(l => `
    <button class="mobile-league-btn ${l.id===state.league?'active':''}"
            onclick="pickLeague('${l.id}')">
      ${l.flag} ${esc(l.name)}
    </button>`).join('');
}

function buildViewTabs() {
  document.querySelectorAll('.view-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.view === state.view);
  });
}

function buildSportTabs() {
  document.querySelectorAll('.sport-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.sport === state.sport);
  });
}

function updateTitle() {
  const l = SPORTS[state.sport].leagues.find(x => x.id === state.league);
  if (l) document.getElementById('page-title').textContent = `${l.flag} ${l.name}`;
}

/* ── Public handlers (called from onclick) ──────────────────── */
window.pickLeague = id => {
  state.league = id;
  state.view   = 'scores';
  buildLeagueNav();
  buildViewTabs();
  updateTitle();
  resetTimer();
  render();
};

window.f1sub = tab => {
  state.f1sub = tab;
  render();
};

/* ── Timer ──────────────────────────────────────────────────── */
function resetTimer() {
  clearInterval(state.timer);
  state.countdown = REFRESH_SEC;
  state.timer = setInterval(() => {
    state.countdown--;
    const lbl = document.getElementById('refresh-label');
    if (lbl) lbl.textContent = `Aggiorna in ${state.countdown}s`;
    if (state.countdown <= 0) {
      state.countdown = REFRESH_SEC;
      render();
    }
  }, 1000);
}

/* ── Init ───────────────────────────────────────────────────── */
function init() {
  // sport tabs
  document.getElementById('sport-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.sport-tab');
    if (!tab) return;
    state.sport  = tab.dataset.sport;
    state.league = SPORTS[state.sport].leagues[0].id;
    state.view   = 'scores';
    buildSportTabs();
    buildLeagueNav();
    buildViewTabs();
    updateTitle();
    resetTimer();
    render();
  });

  // view tabs
  document.getElementById('view-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.view-tab');
    if (!tab) return;
    state.view = tab.dataset.view;
    buildViewTabs();
    render();
  });

  buildSportTabs();
  buildLeagueNav();
  buildViewTabs();
  updateTitle();
  resetTimer();
  render();
}

document.addEventListener('DOMContentLoaded', init);
