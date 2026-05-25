'use strict';
/* ── CONFIG ───────────────────────────────────────────────── */
const ESPN = 'https://site.api.espn.com/apis/site/v2/sports';
const JOLPI = 'https://api.jolpi.ca/ergast/f1';
const RSS2J = 'https://api.rss2json.com/v1/api.json?rss_url=';
const REFRESH_MS = 30000;

/* ── TRANSLATIONS ─────────────────────────────────────────── */
const LANGS = {
  it:{calcio:'Calcio',basket:'Basket',f1:'Formula 1',notizie:'Notizie',
    risultati:'Risultati',classifica:'Classifica',marcatori:'Marcatori',
    caricamento:'Caricamento...',nessuna_partita:'Nessuna partita in programma oggi',
    classifica_nd:'Classifica non disponibile',marcatori_nd:'Marcatori non disponibili',
    notizie_nd:'Notizie non disponibili',errore:'Errore nel caricamento',riprova:'Riprova',
    finale:'Finale',intervallo:'Intervallo',rinviata:'Rinv.',cancellata:'Canc.',
    gol:'GOL',amm:'AMM.',esp:'ESP.',cam:'CAM.',rig:'RIG.',aut:'AUT.',var:'VAR',
    titolari:'Titolari',panchina:'Panchina',formazioni_nd:'Formazioni non disponibili',
    statistiche_nd:'Statistiche non disponibili',nessun_evento:'Nessun evento disponibile',
    disponibile_su:'Disponibile su',cerca:'Cerca squadra, competizione...',chiudi:'Chiudi',
    vedi:'Vedi',nessun_risultato:'Nessun risultato',squadre:'Squadre',competizioni:'Competizioni',
    ass:'Ass',rimuovi:'Rimuovi',reimposta:'Reimposta lingua',
    cerca_comp:'Cerca competizione...',aggiornato:'Aggiornato',partite:'partite',
    ultime_partite:'Ultime partite',dati_nd:'Dati non disponibili',
    lingua:'Lingua',internazionale:'Internazionale',italia:'Italia',
    inghilterra:'Inghilterra',spagna:'Spagna',germania:'Germania',
    francia:'Francia',altri:'Altri',basket_cat:'Basket',
    classifica_piloti:'Classifica Piloti',classifica_costruttori:'Classifica Costruttori',
    gare_nd:'Dati F1 non disponibili',round:'Round',cerca_squadra:'Cerca una squadra...',
    aggiungi:'Aggiungi',nessun_team:'Nessuna squadra trovata',
  },
  en:{calcio:'Football',basket:'Basketball',f1:'Formula 1',notizie:'News',
    risultati:'Results',classifica:'Standings',marcatori:'Top Scorers',
    caricamento:'Loading...',nessuna_partita:'No matches scheduled today',
    classifica_nd:'Standings not available',marcatori_nd:'Scorers not available',
    notizie_nd:'News not available',errore:'Loading error',riprova:'Retry',
    finale:'Full Time',intervallo:'Half Time',rinviata:'Postponed',cancellata:'Cancelled',
    gol:'GOAL',amm:'YEL.',esp:'RED',cam:'SUB.',rig:'PEN.',aut:'OWN G.',var:'VAR',
    titolari:'Starters',panchina:'Bench',formazioni_nd:'Lineups not available',
    statistiche_nd:'Statistics not available',nessun_evento:'No events available',
    disponibile_su:'Available on',cerca:'Search team, competition...',chiudi:'Close',
    vedi:'View',nessun_risultato:'No results',squadre:'Teams',competizioni:'Competitions',
    ass:'Ast',rimuovi:'Remove',reimposta:'Reset language',
    cerca_comp:'Search competition...',aggiornato:'Updated',partite:'matches',
    ultime_partite:'Recent matches',dati_nd:'Data not available',
    lingua:'Language',internazionale:'International',italia:'Italy',
    inghilterra:'England',spagna:'Spain',germania:'Germany',
    francia:'France',altri:'Others',basket_cat:'Basketball',
    classifica_piloti:'Driver Standings',classifica_costruttori:'Constructor Standings',
    gare_nd:'F1 data not available',round:'Round',cerca_squadra:'Search a team...',
    aggiungi:'Add',nessun_team:'No team found',
  },
  es:{calcio:'Futbol',basket:'Baloncesto',f1:'Formula 1',notizie:'Noticias',
    risultati:'Resultados',classifica:'Clasificacion',marcatori:'Goleadores',
    caricamento:'Cargando...',nessuna_partita:'No hay partidos programados hoy',
    classifica_nd:'Clasificacion no disponible',marcatori_nd:'Goleadores no disponibles',
    notizie_nd:'Noticias no disponibles',errore:'Error de carga',riprova:'Reintentar',
    finale:'Final',intervallo:'Descanso',rinviata:'Aplazado',cancellata:'Cancelado',
    gol:'GOL',amm:'AMO.',esp:'EXP.',cam:'CAM.',rig:'PEN.',aut:'A.P.',var:'VAR',
    titolari:'Titulares',panchina:'Suplentes',formazioni_nd:'Alineaciones no disponibles',
    statistiche_nd:'Estadisticas no disponibles',nessun_evento:'Sin eventos',
    disponibile_su:'Disponible en',cerca:'Buscar equipo...',chiudi:'Cerrar',
    vedi:'Ver',nessun_risultato:'Sin resultados',squadre:'Equipos',competizioni:'Competiciones',
    ass:'Asis',rimuovi:'Quitar',reimposta:'Restablecer idioma',
    cerca_comp:'Buscar competicion...',aggiornato:'Actualizado',partite:'partidos',
    ultime_partite:'Ultimos partidos',dati_nd:'Datos no disponibles',
    lingua:'Idioma',internazionale:'Internacional',italia:'Italia',
    inghilterra:'Inglaterra',spagna:'Espana',germania:'Alemania',
    francia:'Francia',altri:'Otros',basket_cat:'Baloncesto',
    classifica_piloti:'Clasificacion Pilotos',classifica_costruttori:'Clasificacion Constructores',
    gare_nd:'Datos F1 no disponibles',round:'Ronda',cerca_squadra:'Buscar un equipo...',
    aggiungi:'Agregar',nessun_team:'No se encontro equipo',
  },
  fr:{calcio:'Football',basket:'Basketball',f1:'Formule 1',notizie:'Actualites',
    risultati:'Resultats',classifica:'Classement',marcatori:'Buteurs',
    caricamento:'Chargement...',nessuna_partita:'Aucun match programme aujourd\'hui',
    classifica_nd:'Classement non disponible',marcatori_nd:'Buteurs non disponibles',
    notizie_nd:'Actualites non disponibles',errore:'Erreur de chargement',riprova:'Reessayer',
    finale:'Fin du match',intervallo:'Mi-temps',rinviata:'Reporte',cancellata:'Annule',
    gol:'BUT',amm:'AV.',esp:'EXP.',cam:'REMPL.',rig:'PEN.',aut:'CSC.',var:'VAR',
    titolari:'Titulaires',panchina:'Remplacants',formazioni_nd:'Compositions non disponibles',
    statistiche_nd:'Statistiques non disponibles',nessun_evento:'Pas d evenements',
    disponibile_su:'Disponible sur',cerca:'Rechercher...',chiudi:'Fermer',
    vedi:'Voir',nessun_risultato:'Aucun resultat',squadre:'Equipes',competizioni:'Competitions',
    ass:'Passe D.',rimuovi:'Retirer',reimposta:'Reinitialiser la langue',
    cerca_comp:'Rechercher une competition...',aggiornato:'Mis a jour',partite:'matchs',
    ultime_partite:'Derniers matchs',dati_nd:'Donnees non disponibles',
    lingua:'Langue',internazionale:'International',italia:'Italie',
    inghilterra:'Angleterre',spagna:'Espagne',germania:'Allemagne',
    francia:'France',altri:'Autres',basket_cat:'Basket',
    classifica_piloti:'Classement Pilotes',classifica_costruttori:'Classement Constructeurs',
    gare_nd:'Donnees F1 non disponibles',round:'Manche',cerca_squadra:'Rechercher...',
    aggiungi:'Ajouter',nessun_team:'Equipe introuvable',
  },
  de:{calcio:'Fussball',basket:'Basketball',f1:'Formel 1',notizie:'Nachrichten',
    risultati:'Ergebnisse',classifica:'Tabelle',marcatori:'Torschuetzen',
    caricamento:'Laden...',nessuna_partita:'Heute keine Spiele',
    classifica_nd:'Tabelle nicht verfugbar',marcatori_nd:'Torschuetzen nicht verfugbar',
    notizie_nd:'Nachrichten nicht verfugbar',errore:'Ladefehler',riprova:'Erneut versuchen',
    finale:'Abpfiff',intervallo:'Halbzeit',rinviata:'Verschoben',cancellata:'Abgesagt',
    gol:'TOR',amm:'GELB',esp:'ROT',cam:'WECHSEL',rig:'ELFER',aut:'E.T.',var:'VAR',
    titolari:'Startelf',panchina:'Bank',formazioni_nd:'Aufstellungen nicht verfugbar',
    statistiche_nd:'Statistiken nicht verfugbar',nessun_evento:'Keine Ereignisse',
    disponibile_su:'Verfugbar auf',cerca:'Suchen...',chiudi:'Schliessen',
    vedi:'Ansehen',nessun_risultato:'Keine Ergebnisse',squadre:'Mannschaften',competizioni:'Wettbewerbe',
    ass:'Assist',rimuovi:'Entfernen',reimposta:'Sprache zurucksetzen',
    cerca_comp:'Wettbewerb suchen...',aggiornato:'Aktualisiert',partite:'Spiele',
    ultime_partite:'Letzte Spiele',dati_nd:'Daten nicht verfugbar',
    lingua:'Sprache',internazionale:'International',italia:'Italien',
    inghilterra:'England',spagna:'Spanien',germania:'Deutschland',
    francia:'Frankreich',altri:'Andere',basket_cat:'Basketball',
    classifica_piloti:'Fahrerwertung',classifica_costruttori:'Konstrukteurswertung',
    gare_nd:'F1-Daten nicht verfugbar',round:'Runde',cerca_squadra:'Suchen...',
    aggiungi:'Hinzufugen',nessun_team:'Keine Mannschaft gefunden',
  },
};
let LANG = localStorage.getItem('sl_lang') || 'it';
function t(k) { return (LANGS[LANG]||LANGS.it)[k] || k; }

/* ── NEWS FEEDS ───────────────────────────────────────────── */
const NEWS_FEEDS = [
  { name:'Gazzetta', url:'https://www.gazzetta.it/rss/home.xml' },
  { name:'Corriere Sport', url:'https://www.corrieredellosport.it/rss/calcio.xml' },
  { name:'TuttoSport', url:'https://www.tuttosport.com/rss/calcio.xml' },
  { name:'Sky Sport', url:'https://sport.sky.it/rss/calcio' },
];

/* ── TV MAP ───────────────────────────────────────────────── */
const TV_MAP = {
  'UEFA.CHAMPIONS':'Sky Sport · Mediaset','UEFA.EUROPA':'Sky Sport · TV8',
  'UEFA.EUROPA_CONF':'Sky Sport','UEFA.NATIONS':'Rai · Sky Sport',
  'ita.1':'DAZN · Sky Sport','ita.2':'DAZN','ita.coppa_italia':'Mediaset · Rai',
  'eng.1':'Sky Sport · NOW','esp.1':'DAZN','ger.1':'Sky Sport','fra.1':'DAZN',
  'FIFA.WORLD':'Rai · Mediaset','UEFA.EURO':'Rai · Sky Sport',
};

/* ── LEAGUE LOGOS ─────────────────────────────────────────── */
const LL = {
  'UEFA.CHAMPIONS':'https://a.espncdn.com/i/leaguelogos/soccer/500/2.png',
  'UEFA.EUROPA':'https://a.espncdn.com/i/leaguelogos/soccer/500/2310.png',
  'UEFA.EUROPA_CONF':'https://a.espncdn.com/i/leaguelogos/soccer/500/2660.png',
  'FIFA.WORLD':'https://a.espncdn.com/i/leaguelogos/soccer/500/46.png',
  'UEFA.EURO':'https://a.espncdn.com/i/leaguelogos/soccer/500/44.png',
  'UEFA.NATIONS':'https://a.espncdn.com/i/leaguelogos/soccer/500/2729.png',
  'ita.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/115.png',
  'ita.2':'https://a.espncdn.com/i/leaguelogos/soccer/500/116.png',
  'ita.coppa_italia':'https://a.espncdn.com/i/leaguelogos/soccer/500/360.png',
  'eng.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png',
  'eng.2':'https://a.espncdn.com/i/leaguelogos/soccer/500/24.png',
  'eng.fa':'https://a.espncdn.com/i/leaguelogos/soccer/500/28.png',
  'eng.league_cup':'https://a.espncdn.com/i/leaguelogos/soccer/500/30.png',
  'esp.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png',
  'esp.2':'https://a.espncdn.com/i/leaguelogos/soccer/500/16.png',
  'esp.copa_del_rey':'https://a.espncdn.com/i/leaguelogos/soccer/500/27.png',
  'ger.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/10.png',
  'ger.2':'https://a.espncdn.com/i/leaguelogos/soccer/500/11.png',
  'ger.dfb_pokal':'https://a.espncdn.com/i/leaguelogos/soccer/500/20.png',
  'fra.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/9.png',
  'fra.2':'https://a.espncdn.com/i/leaguelogos/soccer/500/182.png',
  'fra.coupe_de_france':'https://a.espncdn.com/i/leaguelogos/soccer/500/34.png',
  'por.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/19.png',
  'ned.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/11.png',
  'bel.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/142.png',
  'tur.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/52.png',
  'arg.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/112.png',
  'bra.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/83.png',
  'usa.1':'https://a.espncdn.com/i/leaguelogos/soccer/500/90.png',
};

/* ── ALL COMPETITIONS ─────────────────────────────────────── */
const CATS = [
  { id:'intl', labelKey:'internazionale', sport:'football', et:'soccer', comps:[
    {id:'UEFA.CHAMPIONS',name:'Champions League'},
    {id:'UEFA.EUROPA',name:'Europa League'},
    {id:'UEFA.EUROPA_CONF',name:'Conference League'},
    {id:'FIFA.WORLD',name:'Mondiali FIFA'},
    {id:'UEFA.EURO',name:'Europei UEFA'},
    {id:'UEFA.NATIONS',name:'Nations League'},
  ]},
  { id:'ita', labelKey:'italia', sport:'football', et:'soccer', comps:[
    {id:'ita.1',name:'Serie A'},
    {id:'ita.2',name:'Serie B'},
    {id:'ita.coppa_italia',name:'Coppa Italia'},
  ]},
  { id:'eng', labelKey:'inghilterra', sport:'football', et:'soccer', comps:[
    {id:'eng.1',name:'Premier League'},
    {id:'eng.2',name:'Championship'},
    {id:'eng.fa',name:'FA Cup'},
    {id:'eng.league_cup',name:'Carabao Cup'},
  ]},
  { id:'esp', labelKey:'spagna', sport:'football', et:'soccer', comps:[
    {id:'esp.1',name:'La Liga'},
    {id:'esp.2',name:'Segunda Division'},
    {id:'esp.copa_del_rey',name:'Copa del Rey'},
  ]},
  { id:'ger', labelKey:'germania', sport:'football', et:'soccer', comps:[
    {id:'ger.1',name:'Bundesliga'},
    {id:'ger.2',name:'2. Bundesliga'},
    {id:'ger.dfb_pokal',name:'DFB-Pokal'},
  ]},
  { id:'fra', labelKey:'francia', sport:'football', et:'soccer', comps:[
    {id:'fra.1',name:'Ligue 1'},
    {id:'fra.2',name:'Ligue 2'},
    {id:'fra.coupe_de_france',name:'Coupe de France'},
  ]},
  { id:'other', labelKey:'altri', sport:'football', et:'soccer', comps:[
    {id:'por.1',name:'Primeira Liga'},
    {id:'ned.1',name:'Eredivisie'},
    {id:'bel.1',name:'Pro League'},
    {id:'tur.1',name:'Super Lig'},
    {id:'arg.1',name:'Liga Profesional'},
    {id:'bra.1',name:'Brasileirao'},
    {id:'usa.1',name:'MLS'},
  ]},
  { id:'basket', labelKey:'basket_cat', sport:'basketball', comps:[
    {id:'nba',name:'NBA',et:'nba'},
    {id:'euroleague',name:'Eurolega',et:'mens-euroleague'},
  ]},
  { id:'f1', labelKey:'f1', sport:'f1', comps:[
    {id:'f1.current',name:'Formula 1 2025',et:'f1'},
  ]},
];

/* ── STATE ────────────────────────────────────────────────── */
const S = {
  sport:'football', compId:null, et:'soccer', view:'scores',
  timer:null, prevScores:{}, date:null,
};

/* ── CAT FLAGS & DATE NAV ─────────────────────────────────── */
const CAT_FLAGS={intl:'🇪🇺',ita:'🇮🇹',eng:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',esp:'🇪🇸',ger:'🇩🇪',fra:'🇫🇷',other:'🌍',basket:'🏀',f1:'🏎️'};
function compFlag(catId){return CAT_FLAGS[catId]||'🏆';}
function espnDateParam(){return S.date?`?dates=${S.date}`:'';}

function renderDateNav(){
  const el=$id('date-nav');if(!el) return;
  const show=S.sport==='football'||S.sport==='basketball';
  document.documentElement.style.setProperty('--dnh',show?'52px':'0px');
  el.style.display=show?'flex':'none';
  if(!show) return;
  const today=new Date();
  let html='';
  for(let i=-2;i<=7;i++){
    const d=new Date(today);d.setDate(today.getDate()+i);
    const isToday=i===0;
    const wd=d.toLocaleDateString('it-IT',{weekday:'short'}).replace('.','').toUpperCase();
    const dd=`${d.getDate().toString().padStart(2,'0')}.${(d.getMonth()+1).toString().padStart(2,'0')}`;
    const val=`${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getDate().toString().padStart(2,'0')}`;
    const active=(S.date===val)||(S.date===null&&isToday);
    html+=`<button class="dn-btn${active?' active':''}" data-date="${isToday?'':val}">
      <span class="dn-wd">${isToday?'OGGI':wd}</span>
      ${!isToday?`<span class="dn-dd">${dd}</span>`:''}
    </button>`;
  }
  el.innerHTML=html;
  el.querySelectorAll('.dn-btn').forEach(btn=>{
    btn.onclick=()=>{
      S.date=btn.dataset.date||null;
      renderDateNav();
      if(S.compId) loadContent(); else loadCompetitionsOverview();
    };
  });
  setTimeout(()=>{const a=el.querySelector('.dn-btn.active');if(a)a.scrollIntoView({inline:'center',block:'nearest',behavior:'instant'});},50);
}

async function loadCompetitionsOverview(){
  const el=$id('content');
  const ch=$id('content-header');const cbtn=$id('comp-back-btn');
  if(ch) ch.style.display='none';
  if(cbtn) cbtn.style.display='none';
  $id('view-tabs').style.display='none';
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;

  const cats=CATS.filter(cat=>cat.sport===S.sport||(S.sport==='football'&&(!cat.sport||cat.sport==='football')));
  const allComps=cats.flatMap(cat=>(cat.comps||[]).map(comp=>({
    id:comp.id,name:comp.name,
    et:comp.et||cat.et||'soccer',
    sport:cat.sport||'football',
    catId:cat.id
  })));

  const dateParam=espnDateParam();
  const results=await Promise.allSettled(allComps.map(async comp=>{
    const sp=comp.sport==='basketball'?'basketball':'soccer';
    const path=comp.sport==='basketball'?comp.et:comp.id;
    const res=await fetch(`${ESPN}/${sp}/${path}/scoreboard${dateParam}`);
    if(!res.ok) return {comp,events:[]};
    const data=await res.json();
    return {comp,events:data.events||[]};
  }));

  const withEvents=results
    .filter(r=>r.status==='fulfilled'&&r.value.events.length>0)
    .map(r=>r.value);

  const liveCount=withEvents.flatMap(r=>r.events).filter(e=>e.status?.type?.state==='in').length;
  const livePill=$id('live-pill');if(livePill)livePill.style.display=liveCount?'flex':'none';

  if(!withEvents.length){
    el.innerHTML=`<div class="empty-state"><p>${t('nessuna_partita')}</p></div>`;
    return;
  }

  let html='<div class="comp-overview">';
  withEvents.forEach(({comp,events})=>{
    const logo=LL[comp.id]||'';
    const flag=compFlag(comp.catId);
    const hasLive=events.some(e=>e.status?.type?.state==='in');
    html+=`<div class="ov-comp-block" data-cid="${comp.id}" data-cet="${comp.et}">
      <div class="ov-comp-header" onclick="selectComp('${comp.id}','${comp.et}','${comp.sport}')">
        ${logo?`<img src="${logo}" class="comp-ov-logo" onerror="this.style.display='none'">`:`<span class="comp-flag">${flag}</span>`}
        <span class="ov-comp-name">${esc(comp.name)}</span>
        ${hasLive?'<span class="ov-live-dot"></span>':''}
        <span class="ov-match-count">${events.length}</span>
        <svg class="comp-overview-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div class="ov-matches">
        ${events.map(ev=>matchCard(ev)).join('')}
      </div>
    </div>`;
  });
  html+='</div>';
  el.innerHTML=html;

  el.querySelectorAll('.ov-matches .match-card').forEach(card=>{
    card.onclick=()=>{
      const block=card.closest('.ov-comp-block');
      if(block){S.compId=block.dataset.cid;S.et=block.dataset.cet;}
      openModal(card.dataset.eid);
    };
  });

  updateTs();
}

function backToOverview(){
  S.compId=null; S.view='scores';
  if(S.timer){clearInterval(S.timer);S.timer=null;}
  const ch=$id('content-header');if(ch) ch.style.display='none';
  const ct=$id('comp-tabs');if(ct) ct.style.display='none';
  loadCompetitionsOverview();
}

/* ── FANTA SQUAD ──────────────────────────────────────────── */
let FANTA = JSON.parse(localStorage.getItem('sl_fanta')||'[]');
function saveFanta(){localStorage.setItem('sl_fanta',JSON.stringify(FANTA));}
function inFanta(name){
  const n=(name||'').toLowerCase().trim();
  return FANTA.some(p=>{
    const q=(typeof p==='object'?p.name:p).toLowerCase().trim();
    return q===n||n.includes(q)||q.includes(n);
  });
}

const FANTA_PRESETS={
  classico:{name:'Classico (Fantagazzetta)',roles:['P','D','C','A'],
    goal:{P:10,D:6.5,C:5,A:4.5},assist:{P:4,D:4.5,C:3,A:3},
    yellow:{P:-0.5,D:-0.5,C:-0.5,A:-0.5},red:{P:-1,D:-1,C:-1,A:-1},
    owngoal:-2,penaltySaved:3,penaltyMissed:-3},
  mantra:{name:'Mantra',roles:['P','Dc','Dd','Ds','E','M','C','T','W','A','Pc'],
    goal:{P:10,Dc:6,Dd:7.5,Ds:6,E:4.5,M:4.5,C:5,T:5,W:5,A:4.5,Pc:10},
    assist:{P:2,Dc:4,Dd:4,Ds:4,E:3,M:3,C:3,T:3,W:3,A:3,Pc:2},
    yellow:{P:-0.5,Dc:-0.5,Dd:-0.5,Ds:-0.5,E:-0.5,M:-0.5,C:-0.5,T:-0.5,W:-0.5,A:-0.5,Pc:-0.5},
    red:{P:-1,Dc:-1,Dd:-1,Ds:-1,E:-1,M:-1,C:-1,T:-1,W:-1,A:-1,Pc:-1},
    owngoal:-2,penaltySaved:3,penaltyMissed:-3},
  custom:{name:'Personalizzato',roles:['P','D','C','A'],
    goal:{P:10,D:6.5,C:5,A:4.5},assist:{P:4,D:4.5,C:3,A:3},
    yellow:{P:-0.5,D:-0.5,C:-0.5,A:-0.5},red:{P:-1,D:-1,C:-1,A:-1},
    owngoal:-2,penaltySaved:3,penaltyMissed:-3},
};
let FANTA_MODE=localStorage.getItem('sl_fanta_mode')||'classico';
function saveFantaMode(m){FANTA_MODE=m;localStorage.setItem('sl_fanta_mode',m);}
function fantaPreset(){return FANTA_PRESETS[FANTA_MODE]||FANTA_PRESETS.classico;}

function fantaRole(name){
  const p=FANTA.find(p=>typeof p==='object'&&(p.name||'').toLowerCase()===name.toLowerCase());
  const roles=fantaPreset().roles;
  return p?.role||roles[roles.length-1]||'A';
}

function fantaLivePoints(playerName){
  window._cachedEvents=window._cachedEvents||[];
  if(!window._cachedEvents.length) return 0;
  const bonus=fantaPreset();
  const role=fantaRole(playerName);
  let pts=0;
  const n=(playerName||'').toLowerCase();
  window._cachedEvents.forEach(ev=>{
    const type=(ev.type?.text||'').toLowerCase().replace(/\s/g,'');
    const scorer=(ev.athletesInvolved?.[0]?.displayName||'').toLowerCase();
    const assister=(ev.athletesInvolved?.[1]?.displayName||'').toLowerCase();
    const nameMatch=s=>n.includes(s)||s.includes(n);
    if(nameMatch(scorer)){
      if(type==='goal') pts+=bonus.goal[role]??4.5;
      if(type==='owngoal') pts+=bonus.owngoal;
      if(type.includes('yellow')) pts+=bonus.yellow[role]??-0.5;
      if(type.includes('red')&&!type.includes('yellow')) pts+=bonus.red[role]??-1;
      if(type==='penaltymissed') pts+=bonus.penaltyMissed;
      if(type==='penaltysaved') pts+=bonus.penaltySaved;
    }
    if(nameMatch(assister)&&type==='goal') pts+=bonus.assist[role]??3;
  });
  return pts;
}

async function loadFantaGiornata(){
  const el=$id('content');
  $id('view-tabs').style.display='none';
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;

  if(!FANTA.length){
    el.innerHTML=`<div class="fanta-giornata"><div class="fg-no-squad">
      <p style="font-size:1.1rem;font-weight:700;color:var(--txt);margin-bottom:8px">Rosa vuota</p>
      <p>Aggiungi i tuoi giocatori dalla barra laterale per vedere i punti live</p>
    </div></div>`;
    return;
  }

  // Load scoreboard for current competition
  try{
    const res=await fetch(`${ESPN}/${espnSport()}/${espnPath()}/scoreboard`);
    const data=await res.json();
    const events=data.events||[];
    // Cache all events globally
    window._cachedEvents=events.flatMap(ev=>ev.competitions?.[0]?.details||[]);

    // Calculate points per player
    const playerData=FANTA.map(p=>{
      const name=typeof p==='object'?p.name:p;
      const role=typeof p==='object'?p.role:'A';
      const pts=fantaLivePoints(name);
      // Find which match this player is in (from lineups in scoreboard)
      let matchInfo='';
      events.forEach(ev=>{
        const comp=ev.competitions?.[0];
        const home=comp?.competitors?.find(c=>c.homeAway==='home');
        const away=comp?.competitors?.find(c=>c.homeAway==='away');
        if(home&&away){
          const st=ev.status?.type?.state;
          if(st==='in'||st==='post'){
            matchInfo=`${home.team?.shortDisplayName||''} ${home.score??''}-${away.score??''} ${away.team?.shortDisplayName||''}`;
          }
        }
      });
      // Find events for this player
      const myEvents=(window._cachedEvents||[]).filter(ev=>{
        const n=name.toLowerCase();
        const s=(ev.athletesInvolved?.[0]?.displayName||'').toLowerCase();
        const a=(ev.athletesInvolved?.[1]?.displayName||'').toLowerCase();
        return s.includes(n)||n.includes(s)||a.includes(n)||n.includes(a);
      });
      const eventLabels=myEvents.map(ev=>{
        const type=ev.type?.text||'';
        const min=ev.clock?.displayValue?`${ev.clock.displayValue}'`:'';
        if(type==='Goal') return `${min} GOL`;
        if(type==='OwnGoal') return `${min} AUT.`;
        if(type==='YellowCard') return `${min} AMM.`;
        if(type==='RedCard') return `${min} ESP.`;
        const a=(ev.athletesInvolved?.[1]?.displayName||'').toLowerCase();
        const n2=name.toLowerCase();
        if((a.includes(n2)||n2.includes(a))&&type==='Goal') return `${min} ASS.`;
        return '';
      }).filter(Boolean);

      return {name,role,pts,eventLabels};
    });

    const total=playerData.reduce((s,p)=>s+p.pts,0);
    const totalStr=total>0?`+${total.toFixed(1)}`:total.toFixed(1);

    const rows=playerData.map(p=>{
      const ptsStr=p.pts>0?`+${p.pts.toFixed(1)}`:p.pts.toFixed(1);
      const ptsCls=p.pts>0?'pos':p.pts<0?'neg':'zero';
      return `<div class="fg-player-row">
        <span class="fg-role ${p.role}">${p.role}</span>
        <span class="fg-name">${esc(p.name)}</span>
        <span class="fg-event">${esc(p.eventLabels.join(' · '))}</span>
        <span class="fg-pts ${ptsCls}">${ptsStr}</span>
      </div>`;
    }).join('');

    el.innerHTML=`<div class="fanta-giornata">
      <div class="fg-header">
        <div class="fg-total">${totalStr}</div>
        <div class="fg-sub">Punti giornata in corso</div>
      </div>
      <div class="fg-players">${rows}</div>
    </div>`;
  }catch{
    el.innerHTML=`<div class="error-state"><p>${t('errore')}</p></div>`;
  }
}

/* ── UTILS ────────────────────────────────────────────────── */
const $id = id => document.getElementById(id);
const qsa = (s, c=document) => [...c.querySelectorAll(s)];
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function fmtTime(d){try{return new Date(d).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});}catch{return '--';}}
function fmtDate(d){try{return new Date(d).toLocaleDateString('it-IT',{weekday:'short',day:'numeric',month:'short'});}catch{return '--';}}

function statusInfo(ev) {
  const n=ev.status?.type?.name, detail=ev.status?.type?.shortDetail||ev.status?.displayClock||'';
  if(n==='STATUS_IN_PROGRESS') return {label:detail||'LIVE',cls:'live'};
  if(n==='STATUS_HALFTIME') return {label:t('intervallo'),cls:'live'};
  if(n==='STATUS_FULL_TIME'||n==='STATUS_FINAL') return {label:t('finale'),cls:'fin'};
  if(n==='STATUS_POSTPONED') return {label:t('rinviata'),cls:'fin'};
  if(n==='STATUS_CANCELED') return {label:t('cancellata'),cls:'fin'};
  if(ev.status?.type?.state==='pre') return {label:fmtTime(ev.date),cls:'pre'};
  return {label:detail||'--',cls:'pre'};
}
function compInfo(id){
  for(const cat of CATS){const c=(cat.comps||[]).find(x=>x.id===id);if(c)return{name:c.name,sport:cat.sport||'football',et:c.et||cat.et||'soccer'};}
  return{name:id,sport:'football',et:'soccer'};
}
// Returns the correct ESPN league path for URL building
// Football uses compId (ita.1, eng.1, UEFA.CHAMPIONS...)
// Basketball uses et (nba, mens-euroleague...)
function espnPath(){return S.sport==='basketball'?S.et:S.compId;}
function espnSport(){return S.sport==='basketball'?'basketball':'soccer';}

/* ── LANGUAGE ─────────────────────────────────────────────── */
function setLang(l){LANG=l;localStorage.setItem('sl_lang',l);applyLangToDOM();renderSidebar();}
function applyLangToDOM(){
  const tabMap={football:'calcio',basketball:'basket',f1:'f1',news:'notizie'};
  qsa('.sport-tab').forEach(b=>{const lbl=b.querySelector('.tab-label');if(lbl)lbl.textContent=t(tabMap[b.dataset.sport]||b.dataset.sport);});
  const vtMap={scores:'risultati',standings:'classifica',scorers:'marcatori'};
  qsa('.view-tab').forEach(b=>{b.textContent=t(vtMap[b.dataset.view]||b.dataset.view);});
  const ls=$id('league-search');if(ls)ls.placeholder=t('cerca_comp');
  const rb=$id('reset-prefs-btn');if(rb)rb.textContent=t('reimposta');
  const si=$id('global-search-input');if(si)si.placeholder=t('cerca');
  const scb=$id('search-close-btn');if(scb)scb.textContent=t('chiudi');
}

/* ── SIDEBAR ──────────────────────────────────────────────── */
function renderSidebar(){
  const nav=$id('league-nav'); nav.innerHTML='';

  // Sport switcher at top
  const sportWrap=document.createElement('div');
  sportWrap.className='sidebar-sports';
  const sportList=[
    {key:'football',icon:'⚽',label:'Calcio'},
    {key:'basketball',icon:'🏀',label:'Basket'},
    {key:'f1',icon:'🏎️',label:'F1'},
    {key:'news',icon:'📰',label:'Notizie'},
    {key:'fanta',icon:'⭐',label:'Fanta'},
  ];
  sportWrap.innerHTML=`<div class="ss-grid">${
    sportList.map(s=>`<button class="ss-btn${S.sport===s.key?' active':''}" data-sport="${s.key}">
      <span class="ss-icon">${s.icon}</span><span>${s.label}</span>
    </button>`).join('')
  }</div>`;
  sportWrap.querySelectorAll('.ss-btn').forEach(btn=>{
    btn.onclick=()=>{switchSport(btn.dataset.sport);closeSidebar();};
  });
  nav.appendChild(sportWrap);

  // Language selector at top
  const langWrap=document.createElement('div');
  langWrap.className='lang-selector';
  const langNames={it:'IT',en:'EN',es:'ES',fr:'FR',de:'DE'};
  langWrap.innerHTML=`<div class="lang-label">${t('lingua')}</div><div class="lang-btns">
    ${Object.entries(langNames).map(([code,name])=>
      `<button class="lang-btn${LANG===code?' active':''}" data-lang="${code}">${name}</button>`
    ).join('')}</div>`;
  langWrap.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.onclick=()=>{langWrap.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b===btn));setLang(btn.dataset.lang);};
  });
  nav.appendChild(langWrap);

  CATS.forEach(cat=>{
    const sec=document.createElement('div'); sec.className='cat-section';
    const hdr=document.createElement('div'); hdr.className='cat-header';
    hdr.innerHTML=`<span>${t(cat.labelKey)||cat.labelKey}</span>`;
    sec.appendChild(hdr);
    const items=document.createElement('div'); items.className='cat-items';
    (cat.comps||[]).forEach(comp=>{
      const sport=cat.sport||'football';
      const et=comp.et||cat.et||'soccer';
      const btn=document.createElement('button');
      btn.className='comp-btn'+(comp.id===S.compId?' active':'');
      btn.dataset.id=comp.id;
      const logo=LL[comp.id];
      btn.innerHTML=`${logo?`<img src="${logo}" width="16" height="16" style="object-fit:contain;flex-shrink:0;margin-right:4px" onerror="this.style.display='none'">`:''}
        <span class="comp-name">${comp.name}</span>`;
      btn.onclick=()=>{selectComp(comp.id,et,sport);closeSidebar();};
      items.appendChild(btn);
    });
    sec.appendChild(items); nav.appendChild(sec);
  });

  // Fanta squad section (not a cat-section, unaffected by search filter)
  const fantaSec=document.createElement('div');
  fantaSec.className='fanta-squad-sec';
  fantaSec.id='fanta-squad-sec';
  function renderFantaSection(){
    const preset=fantaPreset();
    const roles=preset.roles||['P','D','C','A'];
    const defRole=roles[roles.length-1];
    const posMap={GK:'P',G:'P',D:'D',CB:'D',LB:'D',RB:'D',WB:'D',M:'C',MF:'C',CM:'C',DM:'C',AM:'C',FW:'A',F:'A',W:'A',LW:'A',RW:'A',SS:'A'};
    fantaSec.innerHTML=`
      <div class="fanta-squad-header">
        <span style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--txt3)">Rosa Fantacalcio</span>
        <span class="fanta-cnt">${FANTA.length}</span>
      </div>
      <div class="fanta-mode-sel">
        ${Object.keys(FANTA_PRESETS).map(k=>`<button class="fanta-mode-btn${FANTA_MODE===k?' active':''}" data-mode="${k}">${FANTA_PRESETS[k].name}</button>`).join('')}
      </div>
      <div class="fanta-search-wrap">
        <div class="fanta-add-row">
          <select class="fanta-role-sel" id="fanta-role-sel">
            ${roles.map(r=>`<option value="${r}">${r}</option>`).join('')}
          </select>
          <input class="fanta-input" id="fanta-input" type="text" placeholder="Cerca giocatore..." autocomplete="off">
          <button class="fanta-add-btn" id="fanta-add-btn" title="Aggiungi">+</button>
        </div>
        <div class="fanta-search-drop" id="fanta-search-drop"></div>
      </div>
      <div class="fanta-players" id="fanta-players-list">
        ${FANTA.length===0?`<div class="fanta-empty">Nessun giocatore aggiunto</div>`:
          FANTA.map((p,i)=>{
            const name=typeof p==='object'?p.name:p;
            const role=typeof p==='object'?p.role:defRole;
            return `<div class="fanta-player" data-fi="${i}">
              <span class="fg-role ${role}">${role}</span>
              <span style="flex:1;margin:0 4px">${esc(name)}</span>
              <button class="fanta-remove" data-fi="${i}" title="Rimuovi">×</button>
            </div>`;
          }).join('')}
      </div>`;
    fantaSec.querySelectorAll('.fanta-mode-btn').forEach(btn=>{
      btn.onclick=()=>{saveFantaMode(btn.dataset.mode);renderFantaSection();};
    });
    const inp=fantaSec.querySelector('#fanta-input');
    const roleSel=fantaSec.querySelector('#fanta-role-sel');
    const addBtn=fantaSec.querySelector('#fanta-add-btn');
    const drop=fantaSec.querySelector('#fanta-search-drop');
    let searchTmr;
    function addPlayer(name,role){
      const v=(name||inp.value||'').trim();
      if(!v) return;
      const r=role||roleSel?.value||defRole;
      const nameLC=v.toLowerCase();
      if(!FANTA.some(p=>(typeof p==='object'?p.name:p).toLowerCase()===nameLC)){
        FANTA.push({name:v,role:r}); saveFanta();
      }
      inp.value=''; drop.innerHTML='';
      renderFantaSection();
    }
    addBtn.onclick=()=>addPlayer();
    inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addPlayer();}});
    inp.addEventListener('blur',()=>{setTimeout(()=>{drop.innerHTML='';},200);});
    inp.addEventListener('input',()=>{
      const q=(inp.value||'').trim();
      if(q.length<2){drop.innerHTML='';return;}
      clearTimeout(searchTmr);
      searchTmr=setTimeout(async()=>{
        try{
          const data=await fetch(`${ESPN}/soccer/search?query=${encodeURIComponent(q)}&limit=20`).then(r=>r.json());
          const athletes=(data.athletes||[]).slice(0,8);
          if(!athletes.length){drop.innerHTML='';return;}
          drop.innerHTML=athletes.map(a=>{
            const name=a.displayName||'';
            const pos=(a.position?.abbreviation||'').toUpperCase();
            const team=a.team?.shortDisplayName||a.team?.displayName||'';
            const photo=a.headshot?.href||'';
            return `<div class="fd-item" data-name="${esc(name)}" data-pos="${esc(pos)}">
              ${photo?`<img src="${esc(photo)}" class="fd-photo" onerror="this.style.display='none'">`:'<div class="fd-ph"></div>'}
              <div class="fd-info">
                <span class="fd-name">${esc(name)}</span>
                <span class="fd-meta">${[pos,team].filter(Boolean).join(' · ')}</span>
              </div>
              <span class="fd-pos-badge">${pos||'?'}</span>
            </div>`;
          }).join('');
          drop.querySelectorAll('.fd-item').forEach(item=>{
            item.addEventListener('mousedown',e=>{
              e.preventDefault();
              const name=item.dataset.name;
              const pos=item.dataset.pos;
              const guessed=posMap[pos]||defRole;
              const role=roles.includes(guessed)?guessed:defRole;
              if(roleSel) roleSel.value=role;
              addPlayer(name,role);
            });
          });
        }catch{drop.innerHTML='';}
      },300);
    });
    fantaSec.querySelectorAll('.fanta-remove').forEach(btn=>{
      btn.onclick=e=>{
        e.stopPropagation();
        const idx=parseInt(btn.dataset.fi);
        FANTA.splice(idx,1); saveFanta(); renderFantaSection();
      };
    });
  }
  renderFantaSection();
  nav.appendChild(fantaSec);

  const si=$id('league-search');
  si.oninput=()=>{
    const q=si.value.toLowerCase();
    qsa('.comp-btn',nav).forEach(b=>{b.style.display=b.textContent.toLowerCase().includes(q)?'':'none';});
    qsa('.cat-section',nav).forEach(sec=>{
      const vis=qsa('.comp-btn',sec).some(b=>b.style.display!=='none');
      sec.style.display=vis?'':'none';
    });
  };
}

/* ── SPORT TABS ───────────────────────────────────────────── */
function setupTabs(){qsa('.sport-tab,.msport-btn').forEach(btn=>{btn.onclick=()=>switchSport(btn.dataset.sport);});}
function switchSport(sport){
  qsa('.sport-tab').forEach(b=>b.classList.toggle('active',b.dataset.sport===sport));
  qsa('.ss-btn').forEach(b=>b.classList.toggle('active',b.dataset.sport===sport));
  if(S.timer){clearInterval(S.timer);S.timer=null;}
  if(sport==='news'){S.sport='news';S.compId=null;renderDateNav();const ch=$id('content-header');if(ch)ch.style.display='none';loadNews();return;}
  if(sport==='fanta'){S.sport='fanta';S.compId=null;renderDateNav();const ch=$id('content-header');if(ch)ch.style.display='none';loadFantaGiornata();return;}
  if(sport==='f1'){S.sport='f1';renderDateNav();selectComp('f1.current','f1','f1');return;}
  // Football/Basketball: show competition overview
  S.sport=sport;S.compId=null;
  const ch=$id('content-header');if(ch)ch.style.display='none';
  renderDateNav();
  loadCompetitionsOverview();
}

/* ── COMP SELECT ──────────────────────────────────────────── */
function selectComp(compId,et,sport){
  S.compId=compId; S.et=et||'soccer'; S.sport=sport||'football'; S.view='scores';
  qsa('.comp-btn').forEach(b=>b.classList.toggle('active',b.dataset.id===compId));
  const ci=compInfo(compId); $id('page-title').textContent=ci.name||compId;
  const ch=$id('content-header');const cbtn=$id('comp-back-btn');
  const ctabs=$id('comp-tabs');
  if(ch) ch.style.display='';
  if(cbtn) cbtn.style.display='flex';
  if(ctabs){
    ctabs.style.display=sport!=='f1'?'flex':'none';
    qsa('.comp-tab').forEach(b=>b.classList.toggle('active',b.dataset.view==='scores'));
  }
  if(S.timer){clearInterval(S.timer);S.timer=null;}
  loadContent();
  S.timer=setInterval(loadContent,REFRESH_MS);
}

/* ── CONTENT ROUTING ──────────────────────────────────────── */
function loadContent(){
  if(S.sport==='news'){loadNews();return;}
  if(S.sport==='f1'){loadF1();return;}
  if(S.sport==='fanta'){loadFantaGiornata();return;}
  if(!S.compId){loadCompetitionsOverview();return;}
  if(S.view==='calendar') loadCalendar();
  else if(S.view==='scorers') loadScorers();
  else loadScores();
}

/* ── SCORES ───────────────────────────────────────────────── */
async function loadScores(){
  const el=$id('content');
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  try{
    const url=`${ESPN}/${espnSport()}/${espnPath()}/scoreboard${espnDateParam()}`;
    const res=await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data=await res.json();
    const events=data.events||[];
    window._cachedEvents=events.flatMap(ev=>ev.competitions?.[0]?.details||[]);
    checkGoals(events);
    const liveCount=events.filter(e=>e.status?.type?.state==='in').length;
    $id('live-pill').style.display=liveCount?'flex':'none';
    if(!events.length){
      el.innerHTML=`<div class="empty-state"><p>${t('nessuna_partita')}</p></div>`;
      updateTs(); return;
    }
    const byDate={};
    events.forEach(ev=>{const d=fmtDate(ev.date);(byDate[d]??=[]).push(ev);});
    let html=adBanner('top');
    Object.entries(byDate).forEach(([date,evs])=>{
      html+=`<div class="match-section"><div class="match-section-head">
        <span class="msh-name">${date}</span>
        ${evs.some(e=>e.status?.type?.state==='in')?'<span class="msh-live-dot"></span>':''}
        <span class="msh-count">${evs.length} ${t('partite')}</span>
      </div>`;
      evs.forEach(ev=>{html+=matchCard(ev);});
      html+='</div>';
    });
    html+=adBanner('mid');
    el.innerHTML=html;
    el.querySelectorAll('.match-card').forEach(card=>{card.onclick=()=>openModal(card.dataset.eid);});
    updateTs();
  }catch(err){
    el.innerHTML=`<div class="error-state"><p>${t('errore')}</p>
      <button onclick="loadContent()" style="margin-top:8px;padding:8px 20px;background:var(--blue);color:#fff;border-radius:6px;font-size:.85rem">${t('riprova')}</button></div>`;
  }
}

function matchCard(ev){
  const comp=ev.competitions?.[0]; if(!comp) return '';
  const home=comp.competitors?.find(c=>c.homeAway==='home');
  const away=comp.competitors?.find(c=>c.homeAway==='away');
  if(!home||!away) return '';
  const st=statusInfo(ev);
  const isLive=ev.status?.type?.state==='in';
  const hasScore=home.score!==undefined&&away.score!==undefined&&ev.status?.type?.state!=='pre';
  const hL=home.team?.logo||`https://a.espncdn.com/i/teamlogos/soccer/500/${home.team?.id}.png`;
  const aL=away.team?.logo||`https://a.espncdn.com/i/teamlogos/soccer/500/${away.team?.id}.png`;
  const goalsHtml=matchGoals(comp);
  return `<div class="match-card${isLive?' is-live':''}" data-eid="${ev.id}">
    <div class="match-row${isLive?' is-live':''}">
      <div class="mr-time"><span class="mr-badge ${st.cls}">${st.label}</span></div>
      <div class="mr-teams">
        <div class="mr-team-row">
          <img src="${hL}" class="mr-crest" onerror="this.style.display='none'">
          <span class="mr-name${home.winner?' bold':''}">${esc(home.team?.shortDisplayName||home.team?.displayName||'')}</span>
          ${hasScore?`<span class="mr-tscore${home.winner?' bold':''}">${home.score}</span>`:''}
        </div>
        <div class="mr-team-row">
          <img src="${aL}" class="mr-crest" onerror="this.style.display='none'">
          <span class="mr-name${away.winner?' bold':''}">${esc(away.team?.shortDisplayName||away.team?.displayName||'')}</span>
          ${hasScore?`<span class="mr-tscore${away.winner?' bold':''}">${away.score}</span>`:''}
        </div>
      </div>
    </div>
    ${goalsHtml?`<div class="match-goals-bar">${goalsHtml}</div>`:''}
  </div>`;
}

/* ── CALENDAR ─────────────────────────────────────────────── */
async function loadCalendar(){
  const el=$id('content');
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  const today=new Date();
  const days=[];
  for(let i=-4;i<=14;i++){
    const d=new Date(today);d.setDate(today.getDate()+i);
    const val=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    days.push({val,label:fmtDate(d),isToday:i===0,isPast:i<0});
  }
  const results=await Promise.allSettled(days.map(async({val,label,isToday,isPast})=>{
    const res=await fetch(`${ESPN}/${espnSport()}/${espnPath()}/scoreboard?dates=${val}`);
    if(!res.ok) return {label,events:[],isToday,isPast};
    const data=await res.json();
    return {label,events:data.events||[],isToday,isPast};
  }));
  const withMatches=results
    .filter(r=>r.status==='fulfilled'&&r.value.events.length>0)
    .map(r=>r.value);
  if(!withMatches.length){
    el.innerHTML=`<div class="empty-state"><p>${t('nessuna_partita')}</p></div>`;return;
  }
  let html='';
  withMatches.forEach(({label,events,isToday,isPast})=>{
    const headLabel=isToday?`<span class="msh-today">OGGI</span> ${label}`:label;
    const hasLive=events.some(e=>e.status?.type?.state==='in');
    html+=`<div class="match-section${isPast?' cal-past':''}">
      <div class="match-section-head">
        <span class="msh-name">${headLabel}</span>
        ${hasLive?'<span class="msh-live-dot"></span>':''}
        <span class="msh-count">${events.length} ${t('partite')}</span>
      </div>
      ${events.map(ev=>matchCard(ev)).join('')}
    </div>`;
  });
  el.innerHTML=html;
  el.querySelectorAll('.match-card').forEach(card=>{card.onclick=()=>openModal(card.dataset.eid);});
  // Scroll to today's section
  const todayEl=el.querySelector('.msh-today');
  if(todayEl) setTimeout(()=>todayEl.closest('.match-section')?.scrollIntoView({behavior:'smooth',block:'start'}),100);
  updateTs();
}

function matchGoals(comp){
  const details=comp?.details||[];
  const goals=details.filter(d=>{
    const txt=(d.type?.text||'').toLowerCase();
    return txt.includes('goal')||txt==='penaltyscored'||txt==='owngoal';
  });
  if(!goals.length) return '';
  return goals.map(g=>{
    const min=g.clock?.displayValue||'';
    const scorer=g.athletesInvolved?.[0]?.displayName||'';
    const assist=g.athletesInvolved?.[1]?.displayName||'';
    const isOwn=(g.type?.text||'').toLowerCase()==='owngoal';
    const isFanta=inFanta(scorer);
    return `<span class="mg-item${isOwn?' mg-own':''}${isFanta?' mg-fanta':''}">
      ${min?`<span class="mg-min">${min}'</span>`:''}
      <span class="mg-scorer">${esc(scorer)}${isOwn?' (Aut.)':''}</span>
      ${isFanta?`<span class="mg-fanta-badge">TUO</span>`:''}
      ${assist?`<span class="mg-assist">${t('ass')}: ${esc(assist)}</span>`:''}
    </span>`;
  }).join('');
}

function adBanner(pos){
  return `<div class="ad-banner ad-${pos}"><div class="ad-inner"><span class="ad-label">Annuncio</span></div></div>`;
}

/* ── GOAL NOTIFICATIONS ───────────────────────────────────── */
function checkGoals(events){
  events.forEach(ev=>{
    if(ev.status?.type?.state!=='in') return;
    const comp=ev.competitions?.[0];
    const home=comp?.competitors?.find(c=>c.homeAway==='home');
    const away=comp?.competitors?.find(c=>c.homeAway==='away');
    if(!home||!away) return;
    const cH=parseInt(home.score)||0, cA=parseInt(away.score)||0;
    const prev=S.prevScores[ev.id];
    if(prev&&(cH>prev.h||cA>prev.a)){
      const goals=(comp?.details||[]).filter(d=>d.type?.text==='Goal'||d.type?.text==='PenaltyScored');
      const last=goals[goals.length-1];
      const scorer=last?.athletesInvolved?.[0]?.displayName||'';
      const assist=last?.athletesInvolved?.[1]?.displayName||'';
      const body=`${home.team?.shortDisplayName||''} ${cH}-${cA} ${away.team?.shortDisplayName||''}\n${scorer}${assist?` (${t('ass')}. ${assist})`:''}`;
      if(Notification.permission==='granted')
        new Notification('SportLive - '+t('gol'),{body,icon:'/icons/icon-192.png'});
    }
    S.prevScores[ev.id]={h:cH,a:cA};
  });
}

/* ── STANDINGS ────────────────────────────────────────────── */
function extractEntries(data){
  // Depth-first search for entries array anywhere in the response
  if(data.standings?.entries?.length) return data.standings.entries;
  if(Array.isArray(data.standings)) {
    const flat=data.standings.flatMap(s=>s.entries||[]);
    if(flat.length) return flat;
  }
  if(data.children?.length){
    const flat=data.children.flatMap(c=>c.standings?.entries||[]);
    if(flat.length) return flat;
    const deep=data.children.flatMap(c=>(c.children||[]).flatMap(cc=>cc.standings?.entries||[]));
    if(deep.length) return deep;
    const deeper=data.children.flatMap(c=>(c.children||[]).flatMap(cc=>(cc.children||[]).flatMap(ccc=>ccc.standings?.entries||[])));
    if(deeper.length) return deeper;
  }
  return [];
}

function statVal(stats,name,fallback='-'){
  const s=stats[name];
  if(!s) return fallback;
  return s.value??s.displayValue??fallback;
}

async function loadStandings(){
  const el=$id('content');
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  try{
    // Try two ESPN endpoints — site.api (primary) and site.web.api (fallback)
    const urls=[
      `${ESPN}/${espnSport()}/${espnPath()}/standings`,
      `https://site.web.api.espn.com/apis/v2/sports/${espnSport()}/${espnPath()}/standings`,
    ];
    let data=null;
    for(const url of urls){
      try{
        const res=await fetch(url);
        if(res.ok){data=await res.json();break;}
      }catch{}
    }
    if(!data) throw new Error('Tutti gli endpoint non hanno risposto');
    const entries=extractEntries(data);
    if(!entries.length){
      el.innerHTML=`<div class="error-state"><p>${t('classifica_nd')}</p>
        <small style="color:var(--txt3);font-size:.72rem">Dati non trovati nella risposta ESPN</small>
        <button onclick="loadContent()" style="margin-top:10px;padding:8px 20px;background:var(--blue);color:#fff;border-radius:6px;font-size:.85rem">${t('riprova')}</button>
      </div>`;
      return;
    }
    const rows=entries.map((entry,i)=>{
      const team=entry.team||{};
      const stats=Object.fromEntries((entry.stats||[]).map(s=>[s.name,s]));
      const logo=team.logos?.[0]?.href||`https://a.espncdn.com/i/teamlogos/soccer/500/${team.id}.png`;
      const pts=statVal(stats,'points',statVal(stats,'pts'));
      const gp=statVal(stats,'gamesPlayed',statVal(stats,'played'));
      const w=statVal(stats,'wins',statVal(stats,'W'));
      const dr=statVal(stats,'ties',statVal(stats,'draws',statVal(stats,'D')));
      const l=statVal(stats,'losses',statVal(stats,'L'));
      const gf=statVal(stats,'pointsFor',statVal(stats,'gf',statVal(stats,'GF')));
      const ga=statVal(stats,'pointsAgainst',statVal(stats,'ga',statVal(stats,'GA')));
      const gdRaw=statVal(stats,'pointDifferential',statVal(stats,'gd',statVal(stats,'GD')));
      const gdNum=parseFloat(gdRaw);
      const gdStr=!isNaN(gdNum)?(gdNum>0?'+':'')+gdNum:gdRaw;
      const n=entries.length;
      const rkCls=i<1?'rk ucl r1':i<4?'rk ucl':i<6?'rk uel':i>=n-3?'rk rel':'rk';
      return `<tr>
        <td class="left"><span class="${rkCls}">${i+1}</span></td>
        <td class="left"><div class="td-team"><img src="${logo}" onerror="this.style.display='none'">
          <span>${esc(team.shortDisplayName||team.displayName||'')}</span></div></td>
        <td>${gp}</td><td>${w}</td><td>${dr}</td><td>${l}</td><td>${gf}</td><td>${ga}</td>
        <td>${gdStr}</td><td class="pts">${pts}</td>
      </tr>`;
    }).join('');
    el.innerHTML=`<div class="table-wrap"><table>
      <thead><tr><th class="left">#</th><th class="left" style="min-width:160px">Squadra</th>
        <th>G</th><th>V</th><th>N</th><th>P</th><th>GF</th><th>GS</th><th>DR</th><th>Pts</th>
      </tr></thead><tbody>${rows}</tbody></table></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;padding:10px 0;font-size:.72rem;color:var(--txt3)">
        <span><span class="rk ucl r1" style="display:inline-flex">1</span> Primo</span>
        <span><span class="rk ucl" style="display:inline-flex">2-4</span> Champions</span>
        <span><span class="rk uel" style="display:inline-flex">5-6</span> Europa</span>
        <span><span class="rk rel" style="display:inline-flex">18+</span> Retrocessione</span>
      </div>`;
    updateTs();
  }catch(err){
    console.error('[SportLive] standings error:', err);
    el.innerHTML=`<div class="error-state"><p>${t('classifica_nd')}</p>
      <small style="color:var(--txt3);font-size:.72rem">${esc(err.message)}</small>
      <button onclick="loadContent()" style="margin-top:10px;padding:8px 20px;background:var(--blue);color:#fff;border-radius:6px;font-size:.85rem">${t('riprova')}</button>
    </div>`;
  }
}

/* ── SCORERS ──────────────────────────────────────────────── */
async function loadScorers(){
  const el=$id('content');
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  try{
    const urls=[
      `${ESPN}/${espnSport()}/${espnPath()}/leaders`,
      `https://site.web.api.espn.com/apis/v2/sports/${espnSport()}/${espnPath()}/leaders`,
    ];
    let data=null;
    for(const url of urls){
      try{
        const res=await fetch(url);
        if(res.ok){data=await res.json();break;}
      }catch{}
    }
    if(!data) throw new Error('Tutti gli endpoint non hanno risposto');
    const cats=data.leaders||data.categories||[];
    console.log('[SportLive] leader categories:', cats.map(c=>c.name));
    const gl=cats.find(c=>['goals','goalsScoredTotal','goalsScored'].includes(c.name))
      ||cats.find(c=>['points','scoring','assists'].includes(c.name))
      ||cats[0];
    const leaders=(gl?.leaders||gl?.athletes||[]).slice(0,20);
    if(!leaders.length){el.innerHTML=`<div class="empty-state"><p>${t('marcatori_nd')}</p></div>`;return;}
    const rows=leaders.map((l,i)=>{
      const a=l.athlete||{};
      const photo=`https://a.espncdn.com/i/headshots/soccer/players/full/${a.id}.png`;
      const teamLogo=a.team?.logos?.[0]?.href||'';
      const posCls=i===0?'sc-pos p1':i===1?'sc-pos p2':i===2?'sc-pos p3':'sc-pos';
      return `<div class="scorer-row">
        <span class="${posCls}">${i+1}</span>
        <img src="${photo}" class="sc-photo" onerror="this.className='sc-photo-ph';this.removeAttribute('src')">
        <div class="sc-info">
          <span class="sc-name">${esc(a.displayName||'-')}</span>
          <div class="sc-club">${teamLogo?`<img src="${teamLogo}" onerror="this.style.display='none'">`:''}
            <span>${esc(a.team?.shortDisplayName||a.team?.displayName||'')}</span></div>
        </div>
        <div class="sc-stat"><div class="sc-val">${l.value??l.displayValue??'-'}</div><div class="sc-lbl">${t('gol')}</div></div>
      </div>`;
    }).join('');
    el.innerHTML=`<div class="scorers-wrap">${rows}</div>`;
    updateTs();
  }catch(err){
    console.error('[SportLive] scorers error:', err);
    el.innerHTML=`<div class="error-state"><p>${t('marcatori_nd')}</p>
      <small style="color:var(--txt3);font-size:.72rem">${esc(err.message)}</small>
      <button onclick="loadContent()" style="margin-top:10px;padding:8px 20px;background:var(--blue);color:#fff;border-radius:6px;font-size:.85rem">${t('riprova')}</button>
    </div>`;
  }
}

/* ── FORMULA 1 ────────────────────────────────────────────── */
async function loadF1(){
  const el=$id('content'); $id('view-tabs').style.display='none';
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  try{
    const [rR,dR,cR]=await Promise.all([
      fetch(`${JOLPI}/current/results.json?limit=5`),
      fetch(`${JOLPI}/current/driverstandings.json`),
      fetch(`${JOLPI}/current/constructorstandings.json`),
    ]);
    const races=(await rR.json()).MRData?.RaceTable?.Races||[];
    const drivers=(await dR.json()).MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[];
    const cons=(await cR.json()).MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings||[];
    let html='';
    if(races.length){
      const last=races[races.length-1];
      html+=`<div class="match-section"><div class="match-section-head">
        <span class="f1-badge">${t('round')} ${last.round}</span>
        <span class="msh-name" style="flex:1;margin-left:8px">${last.raceName}</span>
        <span class="msh-count">${last.Circuit?.circuitName||''}</span>
      </div>`;
      (last.Results||[]).slice(0,10).forEach((r,i)=>{
        const mc=['p1','p2','p3'][i]||'';
        html+=`<div style="display:flex;align-items:center;gap:12px;padding:9px 14px;border-bottom:1px solid rgba(0,0,0,.04);font-size:.87rem">
          <div class="f1-medal${mc?' '+mc:''}" style="${!mc?'background:var(--bg);color:var(--txt3)':''}">${r.position}</div>
          <div style="flex:1"><strong>${r.Driver?.givenName} ${r.Driver?.familyName}</strong>
            <span style="color:var(--txt3);margin-left:6px;font-size:.78rem">${r.Constructor?.name}</span></div>
          <span style="color:var(--txt3);font-size:.8rem">${r.Time?.time||r.status||'-'}</span>
          <span style="font-weight:700;color:var(--blue);min-width:50px;text-align:right">+${r.points} pts</span>
        </div>`;
      });
      html+='</div>';
    }
    if(drivers.length){
      html+=`<div class="match-section" style="margin-top:12px"><div class="match-section-head"><span class="msh-name">${t('classifica_piloti')}</span></div>`;
      drivers.slice(0,20).forEach((d,i)=>{
        html+=`<div style="display:flex;align-items:center;gap:10px;padding:8px 14px;border-bottom:1px solid rgba(0,0,0,.04);font-size:.87rem">
          <span style="font-weight:700;min-width:24px;color:${i===0?'var(--blue)':'var(--txt3)'}">${d.position}</span>
          <div style="flex:1"><strong>${d.Driver?.givenName} ${d.Driver?.familyName}</strong>
            <span style="color:var(--txt3);margin-left:6px;font-size:.78rem">${d.Constructors?.[0]?.name||''}</span></div>
          <span style="font-weight:800;color:var(--blue)">${d.points}</span>
          <span style="color:var(--txt3);font-size:.78rem;min-width:28px">pts</span>
        </div>`;
      });
      html+='</div>';
    }
    if(cons.length){
      html+=`<div class="match-section" style="margin-top:12px"><div class="match-section-head"><span class="msh-name">${t('classifica_costruttori')}</span></div>`;
      cons.slice(0,10).forEach((c,i)=>{
        html+=`<div style="display:flex;align-items:center;gap:10px;padding:8px 14px;border-bottom:1px solid rgba(0,0,0,.04);font-size:.87rem">
          <span style="font-weight:700;min-width:24px;color:${i===0?'var(--blue)':'var(--txt3)'}">${c.position}</span>
          <span style="flex:1"><strong>${c.Constructor?.name}</strong></span>
          <span style="font-weight:800;color:var(--blue)">${c.points}</span>
          <span style="color:var(--txt3);font-size:.78rem">pts</span>
        </div>`;
      });
      html+='</div>';
    }
    el.innerHTML=html||`<div class="empty-state"><p>${t('gare_nd')}</p></div>`;
    updateTs();
  }catch{el.innerHTML=`<div class="error-state"><p>${t('gare_nd')}</p></div>`;}
}

/* ── NEWS ─────────────────────────────────────────────────── */
async function loadNews(){
  const el=$id('content');
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;

  let items=[];

  // Italian language: prioritize Italian RSS sources (Gazzetta, Corriere Sport, etc.)
  if(LANG==='it'){
    try{
      const feeds=await Promise.all(NEWS_FEEDS.map(f=>
        fetch(`${RSS2J}${encodeURIComponent(f.url)}&count=10`)
          .then(r=>r.json()).then(d=>(d.status==='ok'?(d.items||[]):[]).map(i=>({
            title:i.title||'', link:i.link||'#',
            thumbnail:i.thumbnail||i.enclosure?.url||'',
            pubDate:i.pubDate||'', source:f.name,
          }))).catch(()=>[])
      ));
      items=feeds.flat().filter(a=>a.title).sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));
    }catch{}
  }

  // For non-Italian or if Italian RSS had no results: use ESPN news
  if(items.length<5){
    try{
      const espnLeagues=['soccer/ita.1','soccer/UEFA.CHAMPIONS','soccer/eng.1','soccer/esp.1','soccer/ger.1'];
      const espnNews=await Promise.all(espnLeagues.map(l=>
        fetch(`${ESPN}/${l}/news?limit=5`)
          .then(r=>r.json())
          .then(d=>(d.articles||[]).map(a=>({
            title:a.headline||a.title||'',
            link:a.links?.web?.href||a.links?.mobile?.href||'#',
            thumbnail:a.images?.[0]?.url||'',
            pubDate:a.published||a.lastModified||'',
            source:a.categories?.[0]?.description||'ESPN',
          }))).catch(()=>[])
      ));
      const espnItems=espnNews.flat().filter(a=>a.title).sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));
      const seen=new Set(items.map(i=>i.title));
      espnItems.forEach(i=>{if(!seen.has(i.title)){items.push(i);seen.add(i.title);}});
    }catch{}
  }

  if(!items.length){el.innerHTML=`<div class="empty-state"><p>${t('notizie_nd')}</p></div>`;return;}
  const all=items.slice(0,30);
  const [hero,...rest]=all;
  const heroImg=hero.thumbnail||'';
  const catTabs=['TUTTE','CALCIO','SERIE A','BASKET','F1','TENNIS','MOTORI'];
  const catsHtml=`<div class="news-cats-bar">${catTabs.map((c,i)=>`<button class="ncat-btn${i===0?' active':''}">${c}</button>`).join('')}</div>`;
  const heroHtml=`<a class="news-hero" href="${esc(hero.link||'#')}" target="_blank" rel="noopener noreferrer">
    ${heroImg?`<img src="${esc(heroImg)}" class="news-hero-img" onerror="this.style.display='none'" loading="lazy">`:''}
    <div class="news-hero-body">
      <div class="news-meta"><span class="news-src">${esc(hero.source)}</span>${hero.pubDate?' · '+fmtDate(hero.pubDate):''}</div>
      <div class="news-hero-hl">${esc(hero.title||'')}</div>
    </div>
  </a>`;
  const restHtml=rest.map(item=>{
    const img=item.thumbnail||'';
    return `<a class="news-item" href="${esc(item.link||'#')}" target="_blank" rel="noopener noreferrer">
      ${img?`<img src="${esc(img)}" class="news-thumb" onerror="this.style.display='none'" loading="lazy">`:''}
      <div class="news-body">
        <div class="news-meta"><span class="news-src">${esc(item.source)}</span>${item.pubDate?' · '+fmtDate(item.pubDate):''}</div>
        <div class="news-hl">${esc(item.title||'')}</div>
      </div>
    </a>`;
  }).join('');
  el.innerHTML=`${catsHtml}${heroHtml}<div class="news-list">${restHtml}</div>`;
  el.querySelectorAll('.ncat-btn').forEach(btn=>{
    btn.onclick=()=>{el.querySelectorAll('.ncat-btn').forEach(b=>b.classList.toggle('active',b===btn));};
  });
  updateTs();
}

/* ── MATCH MODAL ──────────────────────────────────────────── */
async function openModal(eventId){
  const bd=$id('modal-backdrop'),body=$id('modal-body'),banner=$id('modal-score-banner');
  bd.classList.add('open');
  body.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  banner.innerHTML='';
  try{
    const data=await (await fetch(`${ESPN}/${espnSport()}/${espnPath()}/summary?event=${eventId}`)).json();
    const hComp=data.header?.competitions?.[0];
    if(hComp){
      const home=hComp.competitors?.find(c=>c.homeAway==='home');
      const away=hComp.competitors?.find(c=>c.homeAway==='away');
      if(home&&away){
        const hL=home.team?.logo||`https://a.espncdn.com/i/teamlogos/soccer/500/${home.team?.id}.png`;
        const aL=away.team?.logo||`https://a.espncdn.com/i/teamlogos/soccer/500/${away.team?.id}.png`;
        const st=statusInfo({status:hComp.status,date:hComp.date});
        banner.innerHTML=`
          <div class="msb-status${st.cls==='live'?' live':''}">
            ${st.cls==='live'?'<span class="msb-live-dot"></span>':''}${esc(st.label)}
          </div>
          <div class="msb-teams">
            <div class="msb-team"><img src="${hL}" class="msb-crest" onerror="this.style.display='none'">
              <span class="msb-name">${esc(home.team?.displayName||'')}</span></div>
            <div class="msb-score-center">
              <span class="msb-score">${home.score??'-'}</span>
              <span class="msb-sep">-</span>
              <span class="msb-score">${away.score??'-'}</span>
            </div>
            <div class="msb-team"><img src="${aL}" class="msb-crest" onerror="this.style.display='none'">
              <span class="msb-name">${esc(away.team?.displayName||'')}</span></div>
          </div>`;
        $id('modal-title').textContent=`${home.team?.shortDisplayName||''} - ${away.team?.shortDisplayName||''}`;
      }
    }
    bd._data=data;
    const matchState=hComp?.status?.type?.state;
    const defaultTab=matchState==='pre'?'preview':'events';
    qsa('.modal-tab').forEach(t2=>t2.classList.toggle('active',t2.dataset.mtab===defaultTab));
    renderMTab(defaultTab,data);
    qsa('.modal-tab').forEach(tab=>{
      tab.onclick=()=>{qsa('.modal-tab').forEach(t2=>t2.classList.toggle('active',t2===tab));renderMTab(tab.dataset.mtab,bd._data);};
    });
  }catch{body.innerHTML=`<div class="error-state"><p>${t('dati_nd')}</p></div>`;}
}

function renderMTab(tab,data){
  const body=$id('modal-body');
  if(tab==='preview') renderMPreview(data,body);
  else if(tab==='events') renderMEvents(data,body);
  else if(tab==='lineups') renderMLineups(data,body);
  else if(tab==='stats') renderMStats(data,body);
  else if(tab==='tv'){
    const tv=TV_MAP[S.compId]||t('dati_nd');
    body.innerHTML=`<div class="m-section"><div class="m-section-title">${t('disponibile_su')}</div>
      <div class="tv-list">${tv.split('·').map(s=>`<span class="tv-badge">${esc(s.trim())}</span>`).join('')}</div></div>`;
  }
}

function evtInfo(type){
  const lc=(type||'').toLowerCase().replace(/[\s\-_]/g,'');
  if(lc==='owngoal'||lc==='autogol') return {label:t('aut'),cls:'goal'};
  if(lc.includes('goal')||lc==='penaltyscored') return {label:t('gol'),cls:'goal'};
  if(lc.includes('yellowred')||lc.includes('secondyellow')) return {label:t('esp'),cls:'red'};
  if(lc.includes('yellow')||lc==='booking') return {label:t('amm'),cls:'yellow'};
  if(lc.includes('red')) return {label:t('esp'),cls:'red'};
  if(lc.includes('sub')||lc==='substitution') return {label:t('cam'),cls:'sub'};
  if(lc.includes('penaltymissed')) return {label:t('rig')+'X',cls:'pen'};
  if(lc.includes('penalty')&&!lc.includes('missed')) return {label:t('rig'),cls:'pen'};
  if(lc.includes('var')) return {label:'VAR',cls:'other'};
  return {label:(type||'').substring(0,5)||'?',cls:'other'};
}

function renderMEvents(data,body){
  const details=data.header?.competitions?.[0]?.details||[];
  if(!details.length){body.innerHTML=`<div class="empty-state"><p>${t('nessun_evento')}</p></div>`;return;}
  const hComp=data.header?.competitions?.[0];
  const homeId=hComp?.competitors?.find(c=>c.homeAway==='home')?.team?.id||'';
  const sorted=[...details].sort((a,b)=>(parseInt(a.clock?.displayValue)||0)-(parseInt(b.clock?.displayValue)||0));
  body.innerHTML=`<div class="events-list">${sorted.map(ev=>{
    const type=ev.type?.text||ev.type?.name||'';
    const info=evtInfo(type);
    const min=ev.clock?.displayValue?`${ev.clock.displayValue}'`:'';
    const player=ev.athletesInvolved?.[0]?.displayName||'';
    const assist=ev.athletesInvolved?.[1]?.displayName||'';
    const isAway=ev.team?.id&&homeId&&ev.team.id!==homeId;
    return `<div class="ev-row${isAway?' away':''}">
      <span class="ev-time">${min}</span>
      <span class="ev-badge ${info.cls}">${info.label}</span>
      <div class="ev-txt"><strong>${esc(player)}</strong>
        ${assist?`<div class="ev-sub">${t('ass')}: ${esc(assist)}</div>`:''}
      </div></div>`;
  }).join('')}</div>`;
}

function groupByLine(starters,formation){
  const parts=(formation||'').split('-').map(Number).filter(n=>!isNaN(n)&&n>0);
  if(parts.length>=2&&parts.reduce((s,n)=>s+n,0)===starters.length-1){
    const lines=[[starters[0]]];
    let idx=1;
    parts.forEach(n=>{lines.push(starters.slice(idx,idx+n));idx+=n;});
    return lines.filter(l=>l.length>0);
  }
  if(starters.length>=10){
    return[starters.slice(0,1),starters.slice(1,5),starters.slice(5,8),starters.slice(8,11)];
  }
  return[starters];
}

function renderPitchPlayer(p,isBench){
  const a=p.athlete||p;
  const name=a.displayName||a.fullName||'';
  const num=a.jersey||p.jersey||'';
  const pos=a.position?.abbreviation||p.position?.abbreviation||'';
  const isFanta=inFanta(name);
  const shortName=name.split(' ').slice(-1)[0]||name;
  if(isBench){
    return `<div class="bench-player${isFanta?' fanta-p':''}">
      ${num?`<span class="bench-num">${num}</span>`:''}
      <span class="bench-name">${esc(shortName)}</span>
      ${isFanta?'<span class="bench-fanta-badge">TUO</span>':''}
    </div>`;
  }
  return `<div class="pitch-player${isFanta?' fanta-p':''}">
    <div class="pitch-shirt">${num||pos}</div>
    <div class="pitch-name">${esc(shortName)}</div>
    ${isFanta?'<div class="pitch-pts">TUO</div>':''}
  </div>`;
}

function renderMLineups(data,body){
  const rosters=data.rosters||data.boxscore?.players||[];
  if(!rosters.length){body.innerHTML=`<div class="empty-state"><p>${t('formazioni_nd')}</p></div>`;return;}
  const teams=rosters.slice(0,2);
  let html='<div class="pitch-container">';
  teams.forEach((tr,ti)=>{
    const tname=tr.team?.shortDisplayName||tr.team?.displayName||'';
    const tlogo=tr.team?.logos?.[0]?.href||'';
    const formation=tr.formation?.description||tr.formation?.text||'';
    const players=tr.roster||tr.athletes||[];
    const starters=players.filter(p=>p.starter!==false&&p.active!==false).slice(0,11);
    const bench=players.filter(p=>p.starter===false).slice(0,7);
    const src=starters.length>0?starters:players.slice(0,11);
    const lines=groupByLine(src,formation);
    const orderedLines=ti===1?[...lines].reverse():lines;
    html+=`<div class="pitch-team-wrap">
      <div class="pitch-team-label">
        ${tlogo?`<img src="${tlogo}" style="width:16px;height:16px;object-fit:contain;vertical-align:middle;margin-right:5px" onerror="this.style.display='none'">`:''}
        ${esc(tname)}${formation?` <span style="color:var(--txt3);margin-left:6px;font-weight:400">(${formation})</span>`:''}
      </div>
      <div class="pitch-wrap"><div class="pitch-field">
        ${orderedLines.map(line=>`<div class="pitch-row">${line.map(p=>renderPitchPlayer(p,false)).join('')}</div>`).join('')}
      </div></div>
      ${bench.length?`<div class="bench-section"><div class="bench-title">${t('panchina')}</div>
        <div class="bench-row">${bench.map(p=>renderPitchPlayer(p,true)).join('')}</div></div>`:''}
    </div>`;
  });
  html+='</div>';
  body.innerHTML=html;
}

function renderMStats(data,body){
  const teams=data.boxscore?.teams||[];
  if(teams.length<2){body.innerHTML=`<div class="empty-state"><p>${t('statistiche_nd')}</p></div>`;return;}
  const hT=teams[0],aT=teams[1];
  const hS=Object.fromEntries((hT.statistics||[]).map(s=>[s.name,s]));
  const aS=Object.fromEntries((aT.statistics||[]).map(s=>[s.name,s]));
  const allNames=[...new Set([...Object.keys(hS),...Object.keys(aS)])];
  const rows=allNames.map(name=>{
    const hs=hS[name],as=aS[name],label=hs?.label||as?.label||name;
    const hV=hs?.displayValue??hs?.value??'-',aV=as?.displayValue??as?.value??'-';
    const hN=parseFloat(String(hV))||0,aN=parseFloat(String(aV))||0,tot=hN+aN;
    const hW=tot>0?Math.round(hN/tot*100):50;
    return `<div class="stat-row"><div class="stat-v">${hV}</div>
      <div><div class="stat-label">${esc(label)}</div>
        <div class="stat-bar"><div class="stat-h" style="width:${hW}%"></div><div class="stat-a" style="width:${100-hW}%"></div></div>
      </div><div class="stat-v">${aV}</div></div>`;
  }).join('');
  body.innerHTML=`<div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:.8rem;font-weight:700">
    <span>${esc(hT.team?.shortDisplayName||'Casa')}</span><span>${esc(aT.team?.shortDisplayName||'Ospite')}</span>
  </div><div class="stat-list">${rows||`<div class="empty-state"><p>${t('statistiche_nd')}</p></div>`}</div>`;
}

function renderMPreview(data,body){
  const venue=data.gameInfo?.venue;
  const predictor=data.predictor;
  const tv=TV_MAP[S.compId]||'';
  let html='<div class="m-section">';
  if(venue?.fullName||venue?.address?.city){
    html+=`<div class="m-section-title">Stadio</div>
      <div class="prev-venue">
        ${esc(venue.fullName||'')}${venue.address?.city?`<span style="color:var(--txt3);font-weight:400;margin-left:6px;font-size:.8rem">– ${esc(venue.address.city)}</span>`:''}
      </div>`;
  }
  if(predictor?.homeTeam||predictor?.awayTeam){
    const hp=parseFloat(predictor.homeTeam?.gameProjection||predictor.homeTeam?.chanceOfWinning||0);
    const ap=parseFloat(predictor.awayTeam?.gameProjection||predictor.awayTeam?.chanceOfWinning||0);
    const dp=Math.max(0,100-hp-ap);
    html+=`<div class="m-section-title" style="margin-top:14px">Probabilità vittoria</div>
      <div class="prev-prob">
        <div class="prev-prob-bar">
          <div class="prev-prob-h" style="width:${hp.toFixed(1)}%"></div>
          <div class="prev-prob-d" style="width:${dp.toFixed(1)}%"></div>
          <div class="prev-prob-a" style="width:${ap.toFixed(1)}%"></div>
        </div>
        <div class="prev-prob-labels">
          <span>${hp.toFixed(0)}%</span>
          <span style="color:var(--txt3)">${dp.toFixed(0)}%</span>
          <span>${ap.toFixed(0)}%</span>
        </div>
      </div>`;
  }
  if(tv){
    html+=`<div class="m-section-title" style="margin-top:14px">${t('disponibile_su')}</div>
      <div class="tv-list">${tv.split('·').map(s=>`<span class="tv-badge">${esc(s.trim())}</span>`).join('')}</div>`;
  }
  html+='</div>';
  if(!venue?.fullName&&!predictor&&!tv){
    body.innerHTML=`<div class="empty-state"><p>Anteprima non disponibile</p></div>`;
    return;
  }
  body.innerHTML=html;
}

/* ── GLOBAL SEARCH ────────────────────────────────────────── */
function setupSearch(){
  $id('search-btn').onclick=()=>{$id('search-overlay').classList.add('open');$id('global-search-input').focus();};
  $id('search-close-btn').onclick=closeSearch;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSearch();$id('modal-backdrop').classList.remove('open');}});
  let tmr;
  $id('global-search-input').addEventListener('input',e=>{clearTimeout(tmr);tmr=setTimeout(()=>doSearch(e.target.value),350);});
}
function closeSearch(){$id('search-overlay').classList.remove('open');$id('global-search-input').value='';$id('search-results').innerHTML='';}
async function doSearch(q){
  const res=$id('search-results');
  if(!q||q.length<2){res.innerHTML='';return;}
  res.innerHTML='<div class="loading-state" style="padding:20px"><div class="spinner"></div></div>';
  try{
    const data=await (await fetch(`${ESPN}/soccer/search?query=${encodeURIComponent(q)}&limit=10`)).json();
    const teams=data.teams||[],leagues=data.leagues||[];
    if(!teams.length&&!leagues.length){res.innerHTML=`<p style="padding:16px;color:var(--txt3)">${t('nessun_risultato')}</p>`;return;}
    let html='';
    if(teams.length){
      html+=`<div style="padding:8px 14px;font-size:.7rem;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.5px">${t('squadre')}</div>`;
      html+=teams.map(t2=>`<div class="sr-item" onclick="openTeamView('${t2.id}','${esc(t2.displayName)}','${t2.logos?.[0]?.href||''}')">
        <img src="${t2.logos?.[0]?.href||''}" class="sr-logo" onerror="this.style.display='none'">
        <div class="sr-info"><div class="sr-name">${esc(t2.displayName)}</div></div>
        <span class="sr-action">${t('vedi')}</span>
      </div>`).join('');
    }
    if(leagues.length){
      html+=`<div style="padding:8px 14px;font-size:.7rem;font-weight:700;color:var(--txt3);text-transform:uppercase;letter-spacing:.5px">${t('competizioni')}</div>`;
      html+=leagues.map(l=>`<div class="sr-item"><img src="${l.logos?.[0]?.href||''}" class="sr-logo" onerror="this.style.display='none'">
        <div class="sr-info"><div class="sr-name">${esc(l.name||l.displayName||'')}</div></div></div>`).join('');
    }
    res.innerHTML=html;
  }catch{res.innerHTML=`<p style="padding:16px;color:var(--txt3)">${t('errore')}</p>`;}
}

/* ── TEAM VIEW ────────────────────────────────────────────── */
async function openTeamView(teamId,name,logo){
  closeSearch();
  const ov=$id('team-view-overlay'),body=$id('team-view-body');
  ov.classList.add('open');$id('tv-title').textContent=name;
  body.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  try{
    const data=await (await fetch(`${ESPN}/soccer/ita.1/teams/${teamId}/schedule`)).json();
    const events=data.events||[],recent=events.slice(-5).reverse();
    let html=`<div class="tv-hero">${logo?`<img src="${esc(logo)}" class="tv-hero-logo" onerror="this.style.display='none'">`:''}
      <div class="tv-hero-info"><div class="tv-hero-name">${esc(name)}</div></div></div>`;
    if(recent.length){
      html+=`<div class="tv-section"><div class="tv-section-title">${t('ultime_partite')}</div>`;
      recent.forEach(ev=>{
        const comp=ev.competitions?.[0];
        const home=comp?.competitors?.find(c=>c.homeAway==='home');
        const away=comp?.competitors?.find(c=>c.homeAway==='away');
        if(!home||!away) return;
        const st=statusInfo(ev);
        html+=`<div class="tv-match-row"><span class="tv-match-date">${fmtDate(ev.date)}</span>
          <div class="tv-match-teams">
            <img src="${home.team?.logo||''}" style="width:16px;height:16px;object-fit:contain;vertical-align:middle;margin-right:4px" onerror="this.style.display='none'">
            ${esc(home.team?.shortDisplayName||'')}
            <strong class="tv-match-score"> ${home.score??'-'}-${away.score??'-'} </strong>
            ${esc(away.team?.shortDisplayName||'')}
            <img src="${away.team?.logo||''}" style="width:16px;height:16px;object-fit:contain;vertical-align:middle;margin-left:4px" onerror="this.style.display='none'">
          </div>
          <span class="tv-match-badge ${st.cls}">${st.label}</span></div>`;
      });
      html+='</div>';
    }else{html+=`<div class="empty-state" style="padding:30px"><p>${t('dati_nd')}</p></div>`;}
    body.innerHTML=html;
  }catch{
    body.innerHTML=`<div class="tv-hero">${logo?`<img src="${esc(logo)}" class="tv-hero-logo" onerror="this.style.display='none'">`:''}
      <div class="tv-hero-info"><div class="tv-hero-name">${esc(name)}</div></div></div>
      <div class="empty-state"><p>${t('dati_nd')}</p></div>`;
  }
}

/* ── UI SETUP ─────────────────────────────────────────────── */
function setupSidebar(){
  $id('hamburger').onclick=()=>toggleSidebar();
  $id('sidebar-close').onclick=()=>closeSidebar();
  $id('sidebar-overlay').onclick=()=>closeSidebar();
  const sb=$id('settings-btn');if(sb)sb.onclick=()=>toggleSidebar();
}
function toggleSidebar(){const open=$id('sidebar').classList.toggle('open');$id('sidebar-overlay').classList.toggle('visible',open);}
function closeSidebar(){$id('sidebar').classList.remove('open');$id('sidebar-overlay').classList.remove('visible');}

function setupCompTabs(){
  qsa('.comp-tab').forEach(btn=>{
    btn.onclick=()=>{
      S.view=btn.dataset.view;
      qsa('.comp-tab').forEach(b=>b.classList.toggle('active',b===btn));
      if(S.timer){clearInterval(S.timer);S.timer=null;}
      loadContent();
      if(S.view==='scores') S.timer=setInterval(loadContent,REFRESH_MS);
    };
  });
}
function setupModal(){
  $id('modal-close').onclick=()=>$id('modal-backdrop').classList.remove('open');
  $id('modal-backdrop').onclick=e=>{if(e.target===$id('modal-backdrop'))$id('modal-backdrop').classList.remove('open');};
}
function setupTeamView(){$id('tv-back-btn').onclick=()=>$id('team-view-overlay').classList.remove('open');}
function setupResetBtn(){
  $id('reset-prefs-btn').onclick=()=>{
    localStorage.removeItem('sl_lang'); location.reload();
  };
}
function updateTs(){$id('updated-at').textContent=t('aggiornato')+': '+new Date().toLocaleTimeString('it-IT');}
async function requestNotifs(){if('Notification'in window&&Notification.permission==='default')await Notification.requestPermission();}
function registerSW(){if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});}

/* ── INIT ─────────────────────────────────────────────────── */
function init(){
  const ob=$id('onboarding-overlay'); if(ob) ob.style.display='none';
  const fb=$id('fav-btn'); if(fb) fb.style.display='none';
  const ch=$id('content-header'); if(ch) ch.style.display='none';

  applyLangToDOM();
  renderSidebar();
  setupTabs();
  setupSidebar();
  setupCompTabs();
  setupModal();
  setupTeamView();
  setupSearch();
  setupResetBtn();
  requestNotifs();
  registerSW();

  // Start with football overview
  switchSport('football');
}

document.addEventListener('DOMContentLoaded',init);
