'use strict';

/* ── Competitions ─────────────────────────────────────────── */
const CATEGORIES = [
  { id:'fav',    label:'⭐ Preferiti',      comps:[] },
  { id:'intl',   label:'🌍 Internazionale', sport:'football', espnType:'soccer', comps:[
    {id:'UEFA.CHAMPIONS',  name:'Champions League',  flag:'🏆'},
    {id:'UEFA.EUROPA',     name:'Europa League',     flag:'🌍'},
    {id:'UEFA.EUROPA_CONF',name:'Conference League', flag:'🔶'},
    {id:'FIFA.WORLD',      name:'Mondiali FIFA',      flag:'🌐'},
    {id:'UEFA.EURO',       name:'Europei UEFA',       flag:'🏅'},
    {id:'UEFA.NATIONS',    name:'Nations League',     flag:'🌍'},
  ]},
  { id:'ita',    label:'🇮🇹 Italia',        sport:'football', espnType:'soccer', comps:[
    {id:'ita.1',           name:'Serie A',            flag:'🇮🇹'},
    {id:'ita.2',           name:'Serie B',            flag:'🇮🇹'},
    {id:'ita.coppa_italia',name:'Coppa Italia',       flag:'🏆'},
  ]},
  { id:'eng',    label:'🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inghilterra',  sport:'football', espnType:'soccer', comps:[
    {id:'eng.1',           name:'Premier League',     flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'},
    {id:'eng.2',           name:'Championship',       flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'},
    {id:'eng.fa',          name:'FA Cup',             flag:'🏆'},
    {id:'eng.league_cup',  name:'Carabao Cup',        flag:'🏆'},
  ]},
  { id:'esp',    label:'🇪🇸 Spagna',        sport:'football', espnType:'soccer', comps:[
    {id:'esp.1',           name:'La Liga',            flag:'🇪🇸'},
    {id:'esp.2',           name:'Segunda División',   flag:'🇪🇸'},
    {id:'esp.copa_del_rey',name:'Copa del Rey',       flag:'🏆'},
  ]},
  { id:'ger',    label:'🇩🇪 Germania',      sport:'football', espnType:'soccer', comps:[
    {id:'ger.1',           name:'Bundesliga',         flag:'🇩🇪'},
    {id:'ger.2',           name:'2. Bundesliga',      flag:'🇩🇪'},
    {id:'ger.dfb_pokal',   name:'DFB-Pokal',          flag:'🏆'},
  ]},
  { id:'fra',    label:'🇫🇷 Francia',       sport:'football', espnType:'soccer', comps:[
    {id:'fra.1',           name:'Ligue 1',            flag:'🇫🇷'},
    {id:'fra.2',           name:'Ligue 2',            flag:'🇫🇷'},
    {id:'fra.coupe_de_france',name:'Coupe de France', flag:'🏆'},
  ]},
  { id:'other',  label:'🌎 Altri',           sport:'football', espnType:'soccer', comps:[
    {id:'por.1',           name:'Primeira Liga',      flag:'🇵🇹'},
    {id:'ned.1',           name:'Eredivisie',         flag:'🇳🇱'},
    {id:'bel.1',           name:'Pro League',         flag:'🇧🇪'},
    {id:'sco.1',           name:'Scottish Prem.',     flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
    {id:'tur.1',           name:'Süper Lig',          flag:'🇹🇷'},
    {id:'gre.1',           name:'Super League',       flag:'🇬🇷'},
    {id:'arg.1',           name:'Liga Profesional',   flag:'🇦🇷'},
    {id:'bra.1',           name:'Brasileirão',        flag:'🇧🇷'},
    {id:'usa.1',           name:'MLS',                flag:'🇺🇸'},
    {id:'mex.1',           name:'Liga MX',            flag:'🇲🇽'},
  ]},
  { id:'bask',   label:'🏀 Basket',          sport:'basketball', espnType:'basketball', comps:[
    {id:'nba',             name:'NBA',                flag:'🇺🇸', sport:'basketball', espnType:'basketball'},
    {id:'wnba',            name:'WNBA',               flag:'🇺🇸', sport:'basketball', espnType:'basketball'},
  ]},
  { id:'f1cat',  label:'🏎️ Motorsport',     sport:'f1', comps:[
    {id:'f1',              name:'Formula 1',          flag:'🏁', sport:'f1'},
  ]},
];

const TV_MAP = {
  'UEFA.CHAMPIONS':'Sky Sport · Mediaset','UEFA.EUROPA':'Sky Sport · TV8',
  'UEFA.EUROPA_CONF':'Sky Sport · TV8','ita.1':'DAZN · Sky Sport',
  'ita.2':'DAZN','eng.1':'Sky Sport','esp.1':'DAZN','ger.1':'Sky Sport',
  'fra.1':'DAZN','nba':'Sky Sport · DAZN','f1':'Sky Sport',
  'ita.coppa_italia':'Mediaset · RAI','UEFA.EURO':'RAI · Sky Sport',
};

/* ── APIs ─────────────────────────────────────────────────── */
const ESPN   = 'https://site.api.espn.com/apis/site/v2/sports';
const ESPN2  = 'https://site.api.espn.com/apis/v2/sports';
const JOLPICA= 'https://api.jolpi.ca/ergast/f1';

const cache = {};
async function api(url, ttl=20000){
  const now=Date.now(), h=cache[url];
  if(h && now-h.ts<ttl) return h.data;
  try{
    const r=await fetch(url,{cache:'no-cache'});
    if(!r.ok) throw new Error(r.status);
    const data=await r.json();
    cache[url]={data,ts:now};
    return data;
  }catch(e){ console.warn('API',url,e.message); return null; }
}

/* ── State ────────────────────────────────────────────────── */
const S = {
  sport:'football', league:'UEFA.CHAMPIONS',
  view:'scores', f1sub:'drivers', newscat:'all',
  favorites: new Set(JSON.parse(localStorage.getItem('fav')||'[]')),
  collapsedCats: new Set(JSON.parse(localStorage.getItem('collapsed')||'[]')),
  timer:null, countdown:15,
  modalLeague:null, modalEventId:null, modalTab:'events',
};

function saveFavs(){ localStorage.setItem('fav', JSON.stringify([...S.favorites])); }
function saveCollapsed(){ localStorage.setItem('collapsed', JSON.stringify([...S.collapsedCats])); }

/* ── Helpers ──────────────────────────────────────────────── */
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const q=id=>document.getElementById(id);
const logo=(src,alt,cls='mr-crest')=>src
  ?`<img class="${cls}" src="${esc(src)}" alt="${esc(alt||'')}" onerror="this.outerHTML='<div class=mr-ph>${esc((alt||'?')[0])}</div>'">`
  :`<div class="mr-ph">${esc((alt||'?')[0])}</div>`;

function toast(msg,ms=2500){
  const d=document.createElement('div');
  d.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1c1e21;color:#fff;padding:9px 20px;border-radius:24px;font-size:.855rem;z-index:999;animation:none';
  d.textContent=msg; document.body.appendChild(d);
  setTimeout(()=>d.remove(),ms);
}

function getComp(id){
  for(const cat of CATEGORIES)
    for(const c of cat.comps) if(c.id===id) return {...c,catSport:cat.sport,catEspnType:cat.espnType};
  return null;
}

/* ── Sidebar ──────────────────────────────────────────────── */
function buildSidebar(filter=''){
  const nav=q('league-nav'); nav.innerHTML='';
  const fl=filter.toLowerCase().trim();

  // build fav comps list
  const favComps=[];
  for(const cat of CATEGORIES){
    if(cat.id==='fav') continue;
    for(const c of cat.comps)
      if(S.favorites.has(c.id)){
        favComps.push({...c,catSport:cat.sport,catEspnType:cat.espnType});
      }
  }

  for(const cat of CATEGORIES){
    const comps = cat.id==='fav'
      ? favComps
      : cat.comps.filter(c=>!fl||c.name.toLowerCase().includes(fl));
    if(!comps.length) continue;
    if(cat.id==='fav' && !comps.length) continue;

    const open = fl || !S.collapsedCats.has(cat.id);
    const sec=document.createElement('div');
    sec.className='sidebar-category';
    sec.innerHTML=`
      <div class="cat-header" data-cat="${esc(cat.id)}">
        <span>${esc(cat.label)}</span>
        <span class="cat-arrow ${open?'open':''}">›</span>
      </div>
      <div class="cat-items" style="display:${open?'flex':'none'}">
        ${comps.map(c=>`
          <button class="comp-btn ${S.league===c.id&&(S.sport===cat.sport||c.sport===S.sport)?'active':''} ${S.favorites.has(c.id)?'starred':''}"
            data-id="${esc(c.id)}" data-sport="${esc(c.sport||cat.sport)}" data-type="${esc(c.espnType||cat.espnType||'soccer')}">
            <span class="comp-flag">${c.flag}</span>
            <span class="comp-name">${esc(c.name)}</span>
            <span class="comp-star" data-star="${esc(c.id)}">${S.favorites.has(c.id)?'★':'☆'}</span>
          </button>`).join('')}
      </div>`;
    nav.appendChild(sec);
  }

  // category collapse toggle
  nav.querySelectorAll('.cat-header').forEach(h=>{
    h.addEventListener('click',()=>{
      const id=h.dataset.cat;
      const items=h.nextElementSibling;
      const arrow=h.querySelector('.cat-arrow');
      const open=items.style.display!=='none';
      items.style.display=open?'none':'flex';
      arrow.classList.toggle('open',!open);
      if(open) S.collapsedCats.add(id); else S.collapsedCats.delete(id);
      saveCollapsed();
    });
  });

  // comp click / star click
  nav.querySelectorAll('.comp-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      const star=e.target.closest('[data-star]');
      if(star){ e.stopPropagation(); toggleFav(star.dataset.star); return; }
      selectLeague(btn.dataset.id, btn.dataset.sport, btn.dataset.type);
    });
  });
}

function toggleFav(id){
  if(S.favorites.has(id)){ S.favorites.delete(id); toast('Rimosso dai preferiti'); }
  else { S.favorites.add(id); toast('Aggiunto ai preferiti ⭐'); }
  saveFavs(); buildSidebar(); updateFavBtn();
}

function updateFavBtn(){
  const btn=q('fav-btn');
  if(!btn) return;
  const starred=S.favorites.has(S.league);
  btn.textContent=starred?'★':'☆';
  btn.classList.toggle('starred',starred);
}

/* ── Select league ────────────────────────────────────────── */
function selectLeague(id, sport, type){
  S.league=id; S.sport=sport||'football'; S.view='scores';
  updateSportTabs(); buildSidebar(); updatePageTitle();
  updateViewTabs(); updateFavBtn(); resetTimer(); render();
  // close sidebar on mobile
  closeSidebar();
}

function updatePageTitle(){
  const c=getComp(S.league);
  q('page-title').textContent=c?`${c.flag} ${c.name}`:S.league;
}

function updateSportTabs(){
  document.querySelectorAll('.sport-tab,.msport-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.sport===S.sport);
  });
}

function updateViewTabs(){
  document.querySelectorAll('.view-tab').forEach(b=>{
    b.classList.toggle('active', b.dataset.view===S.view);
  });
}

/* ── Render main content ──────────────────────────────────── */
async function render(){
  const el=q('content');
  el.innerHTML='<div class="loading-state"><div class="spinner"></div><p>Caricamento…</p></div>';
  try{
    let html='';
    if(S.sport==='news'){ html=await renderNews(); }
    else if(S.sport==='f1'){
      if(S.view==='scores') html=await renderF1Races();
      else if(S.view==='standings') html=await renderF1Standings();
      else html='<div class="empty-state"><div class="state-icon">🏎️</div><p>Statistiche non disponibili per F1.</p></div>';
    }
    else if(S.sport==='basketball'){
      if(S.view==='scores')     html=await renderMatches();
      else if(S.view==='standings') html=await renderNBAStandings();
      else                          html=await renderLeaders();
    }
    else{
      if(S.view==='scores')     html=await renderMatches();
      else if(S.view==='standings') html=await renderSoccerStandings();
      else                          html=await renderLeaders();
    }
    el.innerHTML=html||'<div class="empty-state"><div class="state-icon">📅</div><p>Nessun dato disponibile.</p></div>';
    attachMatchClicks();
  }catch(e){
    console.error(e);
    el.innerHTML='<div class="error-state"><div class="state-icon">⚠️</div><p>Errore nel caricamento dei dati.</p></div>';
  }
  q('updated-at').textContent='Aggiornato: '+new Date().toLocaleTimeString('it-IT');
}

/* ── Matches ──────────────────────────────────────────────── */
function matchStatusInfo(ev){
  const st=ev.status?.type;
  if(!st) return{label:'—',cls:'fin',live:false};
  if(st.state==='in'){
    const clk=ev.status.displayClock||'';
    return{label:`● ${clk||'LIVE'}`,cls:'live',live:true};
  }
  if(st.completed||st.state==='post') return{label:'Finale',cls:'fin',live:false};
  const d=new Date(ev.date);
  return{label:d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'}),cls:'pre',live:false};
}

function buildMatchRow(ev, leagueId){
  const comp=ev.competitions?.[0]; if(!comp) return'';
  const cs=comp.competitors||[];
  const home=cs.find(c=>c.homeAway==='home')||cs[0];
  const away=cs.find(c=>c.homeAway==='away')||cs[1];
  if(!home||!away) return'';
  const{label,cls,live}=matchStatusInfo(ev);
  const shown=cls==='live'||cls==='fin';
  const hs=shown?(home.score??'-'):'-';
  const as_=shown?(away.score??'-'):'-';
  const tv=TV_MAP[leagueId]||'';
  const hsWin=shown&&parseInt(hs)>parseInt(as_);
  const asWin=shown&&parseInt(as_)>parseInt(hs);
  return `
<div class="match-row ${live?'is-live':''}" data-eid="${esc(ev.id)}" data-league="${esc(leagueId)}">
  <div class="mr-time"><span class="mr-badge ${cls}">${esc(label)}</span></div>
  <div class="mr-team home">
    <span class="mr-name ${hsWin?'bold':''}">${esc(home.team?.displayName||home.team?.shortDisplayName||'—')}</span>
    ${logo(home.team?.logo,home.team?.shortDisplayName)}
  </div>
  <div class="mr-score">
    <span class="mr-snum">${esc(String(hs))}</span>
    <span class="mr-ssep">-</span>
    <span class="mr-snum">${esc(String(as_))}</span>
  </div>
  <div class="mr-team away">
    ${logo(away.team?.logo,away.team?.shortDisplayName)}
    <span class="mr-name ${asWin?'bold':''}">${esc(away.team?.displayName||away.team?.shortDisplayName||'—')}</span>
  </div>
  <div class="mr-extra">
    <span class="mr-tv">${esc(tv)}</span>
    <span class="mr-notif" title="Notifica">🔔</span>
  </div>
</div>`;
}

async function renderMatches(){
  const type=S.sport==='basketball'?'basketball':'soccer';
  const data=await api(`${ESPN}/${type}/${S.league}/scoreboard`);
  if(!data) return errBox();
  const evs=data.events||[];
  if(!evs.length) return emptyBox();
  const live=evs.filter(e=>e.status?.type?.state==='in');
  const pre =evs.filter(e=>e.status?.type?.state==='pre');
  const post=evs.filter(e=>e.status?.type?.state==='post'||e.status?.type?.completed);
  const section=(title,items)=>items.length?`
<div class="match-section">
  <div class="match-section-head"><span class="msh-name">${title}</span><span class="msh-count">${items.length}</span></div>
  ${items.map(e=>buildMatchRow(e,S.league)).join('')}
</div>`:'';
  return section('🔴 In Corso',live)+section('📅 In Programma',pre)+section('✅ Risultati',post)||emptyBox();
}

function attachMatchClicks(){
  document.querySelectorAll('.match-row[data-eid]').forEach(row=>{
    row.addEventListener('click',e=>{
      if(e.target.classList.contains('mr-notif')){ reqNotif(); return; }
      openMatchModal(row.dataset.eid, row.dataset.league);
    });
  });
}

/* ── Soccer Standings ─────────────────────────────────────── */
async function renderSoccerStandings(){
  const data=await api(`${ESPN2}/soccer/${S.league}/standings`);
  if(!data) return errBox();
  const seek=obj=>{
    if(!obj) return null;
    if(obj.standings?.entries?.length) return obj.standings.entries;
    if(Array.isArray(obj)){for(const x of obj){const r=seek(x);if(r)return r;}}
    else if(typeof obj==='object'){for(const v of Object.values(obj)){const r=seek(v);if(r)return r;}}
    return null;
  };
  const entries=seek(data);
  if(!entries?.length) return errBox('Classifica non disponibile.');
  const sv=(stats,name)=>{const s=stats.find(x=>x.name===name);return s??(null);};
  const rows=entries.map((en,i)=>{
    const r=i+1; const stats=en.stats||[];
    const get=n=>{const s=stats.find(x=>x.name===n);return s?(s.displayValue??s.value??'—'):'—';};
    const gp=get('gamesPlayed'),w=get('wins');
    const d=get('ties')!=='—'?get('ties'):get('draws');
    const l=get('losses'),gf=get('pointsFor'),ga=get('pointsAgainst');
    const gd_raw=get('pointDifferential');
    const gd=gd_raw!=='—'?gd_raw:(gf!=='—'&&ga!=='—'?parseInt(gf)-parseInt(ga):'—');
    const pts=get('points');
    const t=en.team; const lg=t?.logos?.[0]?.href||t?.logo||'';
    let rk='';
    if(r===1)rk='r1';
    else if(r<=4)rk='ucl';
    else if(r===5||r===6)rk='uel';
    else if(r<=7)rk='conf';
    else if(r>=entries.length-2)rk='rel';
    return `<tr>
      <td><span class="rk ${rk}">${r}</span></td>
      <td class="left"><div class="td-team">${lg?`<img src="${esc(lg)}" alt="" onerror="this.style.display='none'">`:''}${esc(t?.displayName||t?.shortDisplayName||'?')}</div></td>
      <td>${gp}</td><td>${w}</td><td>${d}</td><td>${l}</td>
      <td>${gf}</td><td>${ga}</td><td>${gd}</td><td class="pts">${pts}</td>
    </tr>`;
  }).join('');
  return `<div class="table-wrap"><table>
    <thead><tr><th>#</th><th class="left">Squadra</th><th>PG</th><th>V</th><th>P</th><th>S</th><th>GF</th><th>GS</th><th>DR</th><th>PT</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

/* ── NBA Standings ────────────────────────────────────────── */
async function renderNBAStandings(){
  const data=await api(`${ESPN2}/basketball/${S.league}/standings`);
  if(!data) return errBox();
  let html='';
  const proc=g=>{
    const ens=g.standings?.entries||[];
    if(!ens.length){(g.children||[]).forEach(proc);return;}
    const get=(stats,n)=>{const s=stats.find(x=>x.name===n);return s?(s.displayValue??s.value??'—'):'—';};
    const rows=ens.map((en,i)=>{
      const r=i+1; const stats=en.stats||[];
      const t=en.team; const lg=t?.logos?.[0]?.href||t?.logo||'';
      return `<tr class="${r===8?'playoff-line':''}">
        <td>${r}</td>
        <td class="left"><div class="td-team">${lg?`<img src="${esc(lg)}" alt="" onerror="this.style.display='none'">`:''}${esc(t?.displayName||'?')}</div></td>
        <td>${get(stats,'wins')}</td><td>${get(stats,'losses')}</td>
        <td>${get(stats,'winPercent')}</td><td>${get(stats,'gamesBehind')}</td>
        <td>${get(stats,'streak')}</td><td>${get(stats,'last10')}</td>
      </tr>`;
    }).join('');
    html+=`<div class="table-wrap" style="margin-bottom:12px">
      <div class="conf-head">${esc(g.name||'Conference')}</div>
      <table><thead><tr><th>#</th><th class="left">Squadra</th><th>V</th><th>S</th><th>%</th><th>GB</th><th>Streak</th><th>Ult.10</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  };
  (data.children||data.groups||[]).forEach(proc);
  return html||errBox();
}

/* ── Scorers / Leaders ────────────────────────────────────── */
async function renderLeaders(){
  const type=S.sport==='basketball'?'basketball':'soccer';
  const data=await api(`${ESPN2}/${type}/${S.league}/leaders`);
  if(!data) return errBox('Marcatori non disponibili.');
  const groups=data.leaders||[];
  const grp=groups.find(g=>/goal|scorer|point/i.test(g.name||g.displayName||''))||groups[0];
  if(!grp?.leaders?.length) return errBox('Dati marcatori non disponibili per questa competizione.');
  const label=grp.displayName||grp.name||'Gol';
  const items=grp.leaders.slice(0,25).map((ldr,i)=>{
    const r=i+1;
    const ath=ldr.athlete||{}, team=ldr.team||{};
    const photo=ath.headshot?.href||ath.headshot||'';
    const tlogo=(team.logos||[])[0]?.href||team.logo||'';
    const pcls=r===1?'p1':r===2?'p2':r===3?'p3':'';
    return `<div class="scorer-row">
      <div class="sc-pos ${pcls}">${r}</div>
      ${photo?`<img class="sc-photo" src="${esc(photo)}" alt="" onerror="this.style.display='none'">`:'<div class="sc-photo" style="display:flex;align-items:center;justify-content:center;font-size:1.1rem">👤</div>'}
      <div class="sc-info">
        <div class="sc-name">${esc(ath.displayName||ath.fullName||'?')}</div>
        <div class="sc-club">${tlogo?`<img src="${esc(tlogo)}" alt="" onerror="this.style.display='none'">`:''}${esc(team.displayName||team.shortDisplayName||'')}</div>
      </div>
      <div class="sc-stat"><div class="sc-val">${esc(String(ldr.value??ldr.displayValue??0))}</div><div class="sc-lbl">${esc(label)}</div></div>
    </div>`;
  }).join('');
  return `<div class="scorers-wrap">${items}</div>`;
}

/* ── F1 Races ─────────────────────────────────────────────── */
async function renderF1Races(){
  const data=await api(`${JOLPICA}/current/results.json?limit=50`);
  if(!data) return errBox('Dati F1 non disponibili.');
  const races=data?.MRData?.RaceTable?.Races||[];
  if(!races.length) return emptyBox();
  const cards=races.map(race=>{
    const results=race.Results||[];
    const top3=results.slice(0,3);
    const d=new Date((race.date||'')+'T'+(race.time||'12:00:00'));
    const dateLbl=d.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});
    const podium=top3.map((r,i)=>{
      const medals=['🥇','🥈','🥉'];
      const drv=r.Driver||{}, con=r.Constructor||{};
      return `<div class="f1-pos">
        <span class="f1-medal">${medals[i]}</span>
        <span class="f1-drv">${esc(drv.givenName)} ${esc(drv.familyName)}</span>
        <span class="f1-team-txt">${esc(con.name||'')}${r.Time?.time?' · '+r.Time.time:''}</span>
      </div>`;
    }).join('');
    return `<div class="f1-card">
      <div class="f1-card-head">
        <span class="f1-round">Round ${esc(race.round)}</span>
        <span class="f1-date">${esc(dateLbl)}</span>
      </div>
      <div class="f1-race-name">${esc(race.raceName)}</div>
      <div class="f1-circuit">${esc(race.Circuit?.circuitName||'')} · ${esc(race.Circuit?.Location?.country||'')}</div>
      ${top3.length?`<div class="f1-podium">${podium}</div>`:''}
    </div>`;
  }).join('');
  return `<div class="f1-grid">${cards}</div>`;
}

/* ── F1 Standings ─────────────────────────────────────────── */
const F1C={'Red Bull':'#3671C6','Ferrari':'#E8002D','Mercedes':'#27F4D2','McLaren':'#FF8000','Aston Martin':'#229971','Alpine':'#FF87BC','Williams':'#64C4FF','Racing Bulls':'#6692FF','AlphaTauri':'#6692FF','Kick Sauber':'#52E252','Sauber':'#52E252','Haas':'#B6BABD'};
const f1col=n=>{if(!n)return'#888';for(const[k,v]of Object.entries(F1C))if(n.includes(k))return v;return'#888';};

async function renderF1Standings(){
  const [dd,cd]=await Promise.all([
    api(`${JOLPICA}/current/driverStandings.json`),
    api(`${JOLPICA}/current/constructorStandings.json`),
  ]);
  const subtabs=`<div class="sub-tabs">
    <button class="sub-tab ${S.f1sub==='drivers'?'active':''}" onclick="setF1sub('drivers')">Piloti</button>
    <button class="sub-tab ${S.f1sub==='constructors'?'active':''}" onclick="setF1sub('constructors')">Costruttori</button>
  </div>`;
  if(S.f1sub==='drivers'){
    const list=dd?.MRData?.StandingsTable?.StandingsLists?.[0];
    if(!list) return subtabs+errBox();
    const rows=(list.DriverStandings||[]).map(ds=>{
      const drv=ds.Driver||{},con=(ds.Constructors||[])[0]||{};
      const col=f1col(con.name);
      return `<tr><td><strong>${ds.position}</strong></td>
        <td class="left"><span class="tbar" style="background:${col}"></span>${esc(drv.givenName)} <strong>${esc(drv.familyName)}</strong></td>
        <td class="left">${esc(drv.nationality||'')}</td>
        <td class="left">${esc(con.name||'')}</td>
        <td class="pts">${esc(ds.points)}</td><td>${esc(ds.wins)}</td></tr>`;
    }).join('');
    return subtabs+`<div class="table-wrap"><table>
      <thead><tr><th>#</th><th class="left">Pilota</th><th class="left">Naz.</th><th class="left">Squadra</th><th>Punti</th><th>Vitt.</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  } else {
    const list=cd?.MRData?.StandingsTable?.StandingsLists?.[0];
    if(!list) return subtabs+errBox();
    const rows=(list.ConstructorStandings||[]).map(cs=>{
      const con=cs.Constructor||{};const col=f1col(con.name);
      return `<tr><td><strong>${cs.position}</strong></td>
        <td class="left"><span class="tbar" style="background:${col}"></span><strong>${esc(con.name)}</strong></td>
        <td class="left">${esc(con.nationality||'')}</td>
        <td class="pts">${esc(cs.points)}</td><td>${esc(cs.wins)}</td></tr>`;
    }).join('');
    return subtabs+`<div class="table-wrap"><table>
      <thead><tr><th>#</th><th class="left">Costruttore</th><th class="left">Naz.</th><th>Punti</th><th>Vitt.</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  }
}

/* ── News ─────────────────────────────────────────────────── */
async function renderNews(){
  const data=await api(`${ESPN}/soccer/news?limit=30`,60000);
  const arts=data?.articles||[];
  if(!arts.length) return errBox('Notizie non disponibili al momento.');
  const cats=['all','calciomercato','champions','serie a','premier','euro'];
  const catBtns=cats.map(c=>`<button class="news-cat ${S.newscat===c?'active':''}" onclick="setNewsCat('${c}')">${c==='all'?'Tutte':c.charAt(0).toUpperCase()+c.slice(1)}</button>`).join('');
  const filtered=S.newscat==='all'?arts:arts.filter(a=>{
    const txt=(a.headline||a.description||'').toLowerCase();
    return txt.includes(S.newscat);
  });
  const items=filtered.slice(0,20).map(a=>{
    const img=a.images?.[0]?.url||'';
    const src=a.source||'ESPN';
    const date=a.published?new Date(a.published).toLocaleDateString('it-IT',{day:'numeric',month:'short'}):'';
    return `<a class="news-item" href="${esc(a.links?.web?.href||'#')}" target="_blank" rel="noopener">
      ${img?`<img class="news-thumb" src="${esc(img)}" alt="" onerror="this.style.display='none'">`:''}
      <div class="news-body">
        <div class="news-hl">${esc(a.headline||a.description||'Articolo')}</div>
        <div class="news-meta"><span class="news-src">${esc(src)}</span> · ${esc(date)}</div>
      </div>
    </a>`;
  }).join('');
  return `<div class="news-section">
    <div class="news-cats">${catBtns}</div>
    <div class="news-list">${items||'<div class="empty-state"><div class="state-icon">📰</div><p>Nessun articolo in questa categoria.</p></div>'}</div>
  </div>`;
}

/* ── Match Detail Modal ───────────────────────────────────── */
async function openMatchModal(eventId, leagueId){
  const comp=getComp(leagueId);
  const type=comp?.espnType||comp?.catEspnType||'soccer';
  S.modalLeague=leagueId; S.modalEventId=eventId; S.modalTab='events';
  q('modal-title').textContent=comp?`${comp.flag} ${comp.name}`:leagueId;
  q('modal-score-banner').innerHTML='<div class="loading-state" style="padding:20px"><div class="spinner"></div></div>';
  q('modal-body').innerHTML='<div class="loading-state"><div class="spinner"></div></div>';
  q('modal-backdrop').classList.add('open');
  document.body.style.overflow='hidden';
  // set active modal tab
  document.querySelectorAll('.modal-tab').forEach(b=>b.classList.toggle('active',b.dataset.mtab==='events'));

  const data=await api(`${ESPN}/${type}/${leagueId}/summary?event=${eventId}`,10000);
  if(!data){ q('modal-body').innerHTML=errBox('Dettagli non disponibili.'); return; }

  renderModalBanner(data);
  renderModalTab(data,'events');

  document.querySelectorAll('.modal-tab').forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll('.modal-tab').forEach(b=>b.classList.toggle('active',b===btn));
      S.modalTab=btn.dataset.mtab;
      renderModalTab(data,S.modalTab);
    };
  });
}

function renderModalBanner(data){
  const hdr=data.header||{};
  const comps=(hdr.competitions||[])[0]||{};
  const cs=comps.competitors||[];
  const home=cs.find(c=>c.homeAway==='home')||cs[0]||{};
  const away=cs.find(c=>c.homeAway==='away')||cs[1]||{};
  const st=comps.status||{};
  const live=st.type?.state==='in';
  const fin=st.type?.completed;
  const statusTxt=live?`● ${st.displayClock||'LIVE'}`:fin?'Finale':new Date(comps.date||Date.now()).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
  q('modal-score-banner').innerHTML=`
    <div class="msb-status ${live?'live':''}">${esc(statusTxt)}</div>
    <div class="msb-teams">
      <div class="msb-team">
        ${home.team?.logo?`<img class="msb-crest" src="${esc(home.team.logo)}" alt="" onerror="this.style.display='none'">`: ''}
        <div class="msb-name">${esc(home.team?.displayName||home.team?.shortDisplayName||'—')}</div>
      </div>
      <div class="msb-score-center">
        <span class="msb-score">${esc(String(home.score??'—'))}</span>
        <span class="msb-sep">-</span>
        <span class="msb-score">${esc(String(away.score??'—'))}</span>
      </div>
      <div class="msb-team">
        ${away.team?.logo?`<img class="msb-crest" src="${esc(away.team.logo)}" alt="" onerror="this.style.display='none'">`: ''}
        <div class="msb-name">${esc(away.team?.displayName||away.team?.shortDisplayName||'—')}</div>
      </div>
    </div>`;
}

function renderModalTab(data, tab){
  const body=q('modal-body');
  if(tab==='events') body.innerHTML=renderEvents(data);
  else if(tab==='lineups') body.innerHTML=renderLineups(data);
  else if(tab==='stats') body.innerHTML=renderStats(data);
  else if(tab==='tv') body.innerHTML=renderTV(data);
}

function renderEvents(data){
  const plays=(data.plays||[]).filter(p=>p.scoringPlay||p.type?.id==='45'||p.type?.id==='46'||/card|goal|sub|pen/i.test(p.type?.text||p.text||''));
  if(!plays.length) return '<div class="empty-state"><div class="state-icon">📋</div><p>Nessun evento disponibile.</p></div>';
  const icons={'goal':'⚽','yellow card':'🟨','red card':'🟥','substitution':'🔄','penalty':'🎯'};
  const getIcon=p=>{
    const txt=(p.type?.text||p.text||'').toLowerCase();
    if(p.scoringPlay) return'⚽';
    if(txt.includes('yellow')) return'🟨';
    if(txt.includes('red')) return'🟥';
    if(txt.includes('sub')) return'🔄';
    return'📌';
  };
  const hdr=data.header||{};
  const comps=(hdr.competitions||[])[0]||{};
  const homeTeamId=(comps.competitors||[]).find(c=>c.homeAway==='home')?.id;
  const rows=plays.map(p=>{
    const isHome=p.team?.id===homeTeamId;
    const icon=getIcon(p);
    const player=(p.participants||[])[0]?.athlete?.displayName||'';
    const clock=p.clock?.displayValue||p.period?.number?`${p.clock?.displayValue||''}`:'';
    return `<div class="ev-row ${isHome?'home':'away'}">
      <span class="ev-time">${esc(clock)}</span>
      <span class="ev-icon">${icon}</span>
      <div class="ev-txt">${esc(player||p.text||'Evento')}</div>
    </div>`;
  }).join('');
  return `<div class="m-section"><div class="m-section-title">Cronaca</div><div class="events-list">${rows}</div></div>`;
}

function renderLineups(data){
  const box=data.boxscore||{};
  const teams=(box.players||[]);
  if(!teams.length) return '<div class="empty-state"><div class="state-icon">👥</div><p>Formazioni non disponibili.</p></div>';
  const teamBlocks=teams.map(t=>{
    const tname=t.team?.displayName||'Squadra';
    const athletes=t.athletes||[];
    const starters=athletes.filter(a=>a.starter);
    const bench=athletes.filter(a=>!a.starter);
    const playerRow=a=>{
      const ath=a.athlete||{};
      const photo=ath.headshot?.href||ath.headshot||'';
      const pos=ath.position?.abbreviation||'';
      return `<div class="lu-player">
        <span class="lu-num">${esc(ath.jersey||'')}</span>
        ${photo?`<img class="lu-photo" src="${esc(photo)}" alt="" onerror="this.style.display='none'">`: '<div class="lu-photo" style="display:flex;align-items:center;justify-content:center;font-size:.8rem">👤</div>'}
        <span class="lu-name">${esc(ath.displayName||ath.shortName||'—')}</span>
        ${pos?`<span class="lu-pos">${esc(pos)}</span>`:''}
      </div>`;
    };
    return `<div>
      <div class="lu-head">${esc(tname)}</div>
      ${starters.map(playerRow).join('')}
      ${bench.length?`<div class="bench-title">Panchina</div>${bench.map(playerRow).join('')}`:''}
    </div>`;
  }).join('');
  return `<div class="m-section"><div class="m-section-title">Formazioni</div><div class="lineup-split">${teamBlocks}</div></div>`;
}

function renderStats(data){
  const box=data.boxscore||{};
  const stats=box.teams||[];
  if(!stats.length) return '<div class="empty-state"><div class="state-icon">📊</div><p>Statistiche non disponibili.</p></div>';
  const t1=stats[0],t2=stats[1]||{};
  const s1=t1.statistics||[],s2=t2.statistics||[];
  const commonStats=['possessionPct','totalShots','shotsOnTarget','corners','fouls','yellowCards','redCards','offsides','saves'];
  const labels={'possessionPct':'Possesso (%)','totalShots':'Tiri totali','shotsOnTarget':'Tiri in porta','corners':'Calci d\'angolo','fouls':'Falli','yellowCards':'Cartellini gialli','redCards':'Cartellini rossi','offsides':'Fuorigioco','saves':'Parate'};
  const rows=commonStats.map(name=>{
    const a=s1.find(s=>s.name===name),b=s2.find(s=>s.name===name);
    if(!a&&!b) return'';
    const va=parseFloat(a?.displayValue||a?.value||0);
    const vb=parseFloat(b?.displayValue||b?.value||0);
    const tot=va+vb||1;
    const pct=Math.round(va/tot*100);
    return `<div class="stat-row">
      <span class="stat-v">${esc(String(a?.displayValue||0))}</span>
      <div class="stat-bar"><div class="stat-h" style="width:${pct}%"></div><div class="stat-a" style="width:${100-pct}%"></div></div>
      <span class="stat-v">${esc(String(b?.displayValue||0))}</span>
    </div>
    <div style="font-size:.72rem;color:var(--txt3);text-align:center;margin-bottom:6px">${esc(labels[name]||name)}</div>`;
  }).join('');
  return `<div class="m-section"><div class="m-section-title">Statistiche</div><div class="stat-list">${rows||'<p style="color:var(--txt3);font-size:.875rem">Nessuna statistica disponibile.</p>'}</div></div>`;
}

function renderTV(data){
  const broadcasts=data.header?.competitions?.[0]?.broadcasts||data.broadcasts||[];
  const leagueTV=TV_MAP[S.modalLeague||S.league];
  const items=broadcasts.length?broadcasts.map(b=>`<span class="tv-badge">📺 ${esc(b.market?.shortName||b.names?.join(', ')||b)}</span>`).join('')
    :leagueTV?leagueTV.split('·').map(c=>`<span class="tv-badge">📺 ${esc(c.trim())}</span>`).join('')
    :'<p style="color:var(--txt3)">Informazioni TV non disponibili.</p>';
  return `<div class="m-section"><div class="m-section-title">Dove Vedere</div><div class="tv-list">${items}</div></div>`;
}

/* ── Helpers ──────────────────────────────────────────────── */
function errBox(msg='Dati non disponibili.'){return`<div class="error-state"><div class="state-icon">⚠️</div><p>${esc(msg)}</p></div>`;}
function emptyBox(){return`<div class="empty-state"><div class="state-icon">📅</div><p>Nessuna partita disponibile.</p></div>`;}

/* ── Notifications ────────────────────────────────────────── */
async function reqNotif(){
  if(!('Notification' in window)){toast('Notifiche non supportate da questo browser.');return;}
  if(Notification.permission==='granted'){toast('Notifiche già attive ✓');return;}
  const perm=await Notification.requestPermission();
  if(perm==='granted') toast('Notifiche attivate! 🔔');
  else toast('Notifiche non autorizzate.');
}

/* ── Timer ────────────────────────────────────────────────── */
function resetTimer(){
  clearInterval(S.timer);
  S.countdown=15;
  S.timer=setInterval(()=>{
    S.countdown--;
    const el=q('refresh-label');
    if(el) el.textContent=`${S.countdown}s`;
    if(S.countdown<=0){ S.countdown=15; render(); }
  },1000);
}

/* ── Global handlers ──────────────────────────────────────── */
window.setF1sub=tab=>{S.f1sub=tab;render()};
window.setNewsCat=cat=>{S.newscat=cat;render()};

/* ── Init ─────────────────────────────────────────────────── */
function init(){
  // Sport tabs
  const switchSport=sport=>{
    if(sport==='news'){ S.sport='news'; updateSportTabs(); buildSidebar(); render(); return; }
    S.sport=sport;
    const cat=CATEGORIES.find(c=>c.sport===sport&&c.id!=='fav');
    if(cat&&cat.comps[0]){ S.league=cat.comps[0].id; }
    S.view='scores';
    updateSportTabs(); buildSidebar(); updatePageTitle(); updateViewTabs(); updateFavBtn();
    resetTimer(); render();
  };
  document.getElementById('sport-tabs').addEventListener('click',e=>{
    const t=e.target.closest('.sport-tab');if(t) switchSport(t.dataset.sport);
  });
  document.getElementById('mobile-sport-bar').addEventListener('click',e=>{
    const t=e.target.closest('.msport-btn');if(t) switchSport(t.dataset.sport);
  });

  // View tabs
  document.getElementById('view-tabs').addEventListener('click',e=>{
    const t=e.target.closest('.view-tab');if(!t) return;
    S.view=t.dataset.view; updateViewTabs(); render();
  });

  // Fav btn
  q('fav-btn').addEventListener('click',()=>toggleFav(S.league));

  // Notif btn
  q('notif-btn').addEventListener('click',reqNotif);

  // Sidebar search
  q('league-search').addEventListener('input',e=>buildSidebar(e.target.value));

  // Hamburger
  const openSidebar=()=>{q('sidebar').classList.add('open');q('sidebar-overlay').classList.add('visible');};
  const closeSidebarFn=()=>{q('sidebar').classList.remove('open');q('sidebar-overlay').classList.remove('visible');};
  window.closeSidebar=closeSidebarFn;
  q('hamburger').addEventListener('click',openSidebar);
  q('sidebar-close').addEventListener('click',closeSidebarFn);
  q('sidebar-overlay').addEventListener('click',closeSidebarFn);

  // Modal close
  q('modal-close').addEventListener('click',closeModal);
  q('modal-backdrop').addEventListener('click',e=>{if(e.target===q('modal-backdrop'))closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

  // Content header hide on news
  function updateContentHeader(){
    const isNews=S.sport==='news';
    q('content-header').style.display=isNews?'none':'block';
  }

  // Patch render to update header visibility
  const origRender=render;
  window.renderWithHeader=async()=>{updateContentHeader();await origRender();};

  buildSidebar();
  updatePageTitle();
  updateFavBtn();
  resetTimer();
  render();
}

function closeModal(){
  q('modal-backdrop').classList.remove('open');
  document.body.style.overflow='';
}

document.addEventListener('DOMContentLoaded',init);
