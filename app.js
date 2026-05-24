'use strict';
/* ── CONFIG ───────────────────────────────────────────────── */
const ESPN = 'https://site.api.espn.com/apis/site/v2/sports';
const JOLPI = 'https://api.jolpi.ca/ergast/f1';
const RSS2J = 'https://api.rss2json.com/v1/api.json?rss_url=';
const REFRESH_MS = 30000;

/* ── TRANSLATIONS ─────────────────────────────────────────── */
const LANGS = {
  it: {
    calcio:'Calcio',basket:'Basket',f1:'Formula 1',notizie:'Notizie',
    risultati:'Risultati',classifica:'Classifica',marcatori:'Marcatori',
    caricamento:'Caricamento...',nessuna_partita:'Nessuna partita disponibile',
    classifica_nd:'Classifica non disponibile',marcatori_nd:'Marcatori non disponibili',
    notizie_nd:'Notizie non disponibili',errore:'Errore nel caricamento',riprova:'Riprova',
    finale:'Finale',intervallo:'Intervallo',rinviata:'Rinv.',cancellata:'Canc.',
    gol:'GOL',amm:'AMM.',esp:'ESP.',cam:'CAM.',rig:'RIG.',aut:'AUT.',var:'VAR',
    titolari:'Titolari',panchina:'Panchina',formazioni_nd:'Formazioni non disponibili',
    statistiche_nd:'Statistiche non disponibili',nessun_evento:'Nessun evento disponibile',
    disponibile_su:'Disponibile su',cerca:'Cerca squadra, competizione...',chiudi:'Chiudi',
    vedi:'Vedi',nessun_risultato:'Nessun risultato',squadre:'Squadre',competizioni:'Competizioni',
    ass:'Ass',pref:'Pref.',rimuovi:'Rimuovi',reimposta:'Reimposta preferenze',
    cerca_comp:'Cerca competizione...',aggiornato:'Aggiornato',partite:'partite',
    ultime_partite:'Ultime partite',dati_nd:'Dati non disponibili',
    seleziona_comp:'Seleziona le tue competizioni preferite',scegli_camp:'Scegli i campionati che vuoi seguire.',
    cerca_squadre:'Cerca le tue squadre del cuore',aggiungi_squadre:'Aggiungi le squadre che vuoi seguire.',
    avanti:'Avanti',indietro:'Indietro',inizia:'Inizia',aggiungi:'Aggiungi',
    lingua:'Lingua',internazionale:'Internazionale',italia:'Italia',inghilterra:'Inghilterra',
    spagna:'Spagna',germania:'Germania',francia:'Francia',altri:'Altri',basket_cat:'Basket',
    preferiti:'Preferiti',cerca_squadra:'Cerca una squadra...',
    classifica_piloti:'Classifica Piloti',classifica_costruttori:'Classifica Costruttori',
    gare_nd:'Dati F1 non disponibili',round:'Round',
  },
  en: {
    calcio:'Football',basket:'Basketball',f1:'Formula 1',notizie:'News',
    risultati:'Results',classifica:'Standings',marcatori:'Top Scorers',
    caricamento:'Loading...',nessuna_partita:'No matches available',
    classifica_nd:'Standings not available',marcatori_nd:'Scorers not available',
    notizie_nd:'News not available',errore:'Loading error',riprova:'Retry',
    finale:'Full Time',intervallo:'Half Time',rinviata:'Postponed',cancellata:'Cancelled',
    gol:'GOAL',amm:'YEL.',esp:'RED',cam:'SUB.',rig:'PEN.',aut:'OWN G.',var:'VAR',
    titolari:'Starters',panchina:'Bench',formazioni_nd:'Lineups not available',
    statistiche_nd:'Statistics not available',nessun_evento:'No events available',
    disponibile_su:'Available on',cerca:'Search team, competition...',chiudi:'Close',
    vedi:'View',nessun_risultato:'No results',squadre:'Teams',competizioni:'Competitions',
    ass:'Ast',pref:'Fav.',rimuovi:'Remove',reimposta:'Reset preferences',
    cerca_comp:'Search competition...',aggiornato:'Updated',partite:'matches',
    ultime_partite:'Recent matches',dati_nd:'Data not available',
    seleziona_comp:'Select your favourite competitions',scegli_camp:'Choose the leagues you want to follow.',
    cerca_squadre:'Search your favourite teams',aggiungi_squadre:'Add teams you want to follow.',
    avanti:'Next',indietro:'Back',inizia:'Start',aggiungi:'Add',
    lingua:'Language',internazionale:'International',italia:'Italy',inghilterra:'England',
    spagna:'Spain',germania:'Germany',francia:'France',altri:'Others',basket_cat:'Basketball',
    preferiti:'Favourites',cerca_squadra:'Search a team...',
    classifica_piloti:'Driver Standings',classifica_costruttori:'Constructor Standings',
    gare_nd:'F1 data not available',round:'Round',
  },
  es: {
    calcio:'Futbol',basket:'Baloncesto',f1:'Formula 1',notizie:'Noticias',
    risultati:'Resultados',classifica:'Clasificacion',marcatori:'Goleadores',
    caricamento:'Cargando...',nessuna_partita:'No hay partidos disponibles',
    classifica_nd:'Clasificacion no disponible',marcatori_nd:'Goleadores no disponibles',
    notizie_nd:'Noticias no disponibles',errore:'Error de carga',riprova:'Reintentar',
    finale:'Final',intervallo:'Descanso',rinviata:'Aplazado',cancellata:'Cancelado',
    gol:'GOL',amm:'AMO.',esp:'EXP.',cam:'CAM.',rig:'PEN.',aut:'A.P.',var:'VAR',
    titolari:'Titulares',panchina:'Suplentes',formazioni_nd:'Alineaciones no disponibles',
    statistiche_nd:'Estadisticas no disponibles',nessun_evento:'Sin eventos',
    disponibile_su:'Disponible en',cerca:'Buscar equipo, competicion...',chiudi:'Cerrar',
    vedi:'Ver',nessun_risultato:'Sin resultados',squadre:'Equipos',competizioni:'Competiciones',
    ass:'Asis',pref:'Fav.',rimuovi:'Quitar',reimposta:'Restablecer preferencias',
    cerca_comp:'Buscar competicion...',aggiornato:'Actualizado',partite:'partidos',
    ultime_partite:'Ultimos partidos',dati_nd:'Datos no disponibles',
    seleziona_comp:'Selecciona tus competiciones favoritas',scegli_camp:'Elige las ligas que quieres seguir.',
    cerca_squadre:'Busca tus equipos favoritos',aggiungi_squadre:'Agrega los equipos que quieres seguir.',
    avanti:'Siguiente',indietro:'Atras',inizia:'Empezar',aggiungi:'Agregar',
    lingua:'Idioma',internazionale:'Internacional',italia:'Italia',inghilterra:'Inglaterra',
    spagna:'Espana',germania:'Alemania',francia:'Francia',altri:'Otros',basket_cat:'Baloncesto',
    preferiti:'Favoritos',cerca_squadra:'Buscar un equipo...',
    classifica_piloti:'Clasificacion Pilotos',classifica_costruttori:'Clasificacion Constructores',
    gare_nd:'Datos F1 no disponibles',round:'Ronda',
  },
  fr: {
    calcio:'Football',basket:'Basketball',f1:'Formule 1',notizie:'Actualites',
    risultati:'Resultats',classifica:'Classement',marcatori:'Buteurs',
    caricamento:'Chargement...',nessuna_partita:'Aucun match disponible',
    classifica_nd:'Classement non disponible',marcatori_nd:'Buteurs non disponibles',
    notizie_nd:'Actualites non disponibles',errore:'Erreur de chargement',riprova:'Reessayer',
    finale:'Fin du match',intervallo:'Mi-temps',rinviata:'Reporte',cancellata:'Annule',
    gol:'BUT',amm:'AV.',esp:'EXP.',cam:'REMPL.',rig:'PEN.',aut:'CSC.',var:'VAR',
    titolari:'Titulaires',panchina:'Remplacants',formazioni_nd:'Compositions non disponibles',
    statistiche_nd:'Statistiques non disponibles',nessun_evento:'Pas d evenements',
    disponibile_su:'Disponible sur',cerca:'Rechercher equipe, competition...',chiudi:'Fermer',
    vedi:'Voir',nessun_risultato:'Aucun resultat',squadre:'Equipes',competizioni:'Competitions',
    ass:'Passe',pref:'Fav.',rimuovi:'Retirer',reimposta:'Reinitialiser les preferences',
    cerca_comp:'Rechercher une competition...',aggiornato:'Mis a jour',partite:'matchs',
    ultime_partite:'Derniers matchs',dati_nd:'Donnees non disponibles',
    seleziona_comp:'Selectionnez vos competitions favorites',scegli_camp:'Choisissez les ligues que vous souhaitez suivre.',
    cerca_squadre:'Recherchez vos equipes favorites',aggiungi_squadre:'Ajoutez les equipes que vous souhaitez suivre.',
    avanti:'Suivant',indietro:'Retour',inizia:'Commencer',aggiungi:'Ajouter',
    lingua:'Langue',internazionale:'International',italia:'Italie',inghilterra:'Angleterre',
    spagna:'Espagne',germania:'Allemagne',francia:'France',altri:'Autres',basket_cat:'Basket',
    preferiti:'Favoris',cerca_squadra:'Rechercher une equipe...',
    classifica_piloti:'Classement Pilotes',classifica_costruttori:'Classement Constructeurs',
    gare_nd:'Donnees F1 non disponibles',round:'Manche',
  },
  de: {
    calcio:'Fussball',basket:'Basketball',f1:'Formel 1',notizie:'Nachrichten',
    risultati:'Ergebnisse',classifica:'Tabelle',marcatori:'Torschuetzen',
    caricamento:'Laden...',nessuna_partita:'Keine Spiele verfugbar',
    classifica_nd:'Tabelle nicht verfugbar',marcatori_nd:'Torschuetzen nicht verfugbar',
    notizie_nd:'Nachrichten nicht verfugbar',errore:'Ladefehler',riprova:'Erneut versuchen',
    finale:'Abpfiff',intervallo:'Halbzeit',rinviata:'Verschoben',cancellata:'Abgesagt',
    gol:'TOR',amm:'GELB',esp:'ROT',cam:'WECHS.',rig:'ELF.',aut:'ET.',var:'VAR',
    titolari:'Startelf',panchina:'Bank',formazioni_nd:'Aufstellungen nicht verfugbar',
    statistiche_nd:'Statistiken nicht verfugbar',nessun_evento:'Keine Ereignisse',
    disponibile_su:'Verfugbar auf',cerca:'Mannschaft, Wettbewerb suchen...',chiudi:'Schliessen',
    vedi:'Ansehen',nessun_risultato:'Keine Ergebnisse',squadre:'Mannschaften',competizioni:'Wettbewerbe',
    ass:'Assist',pref:'Fav.',rimuovi:'Entfernen',reimposta:'Einstellungen zurucksetzen',
    cerca_comp:'Wettbewerb suchen...',aggiornato:'Aktualisiert',partite:'Spiele',
    ultime_partite:'Letzte Spiele',dati_nd:'Daten nicht verfugbar',
    seleziona_comp:'Wahle deine Lieblingswettbewerbe',scegli_camp:'Wahle die Ligen, denen du folgen mochtest.',
    cerca_squadre:'Suche deine Lieblingsmannschaften',aggiungi_squadre:'Fuge Mannschaften hinzu, denen du folgen mochtest.',
    avanti:'Weiter',indietro:'Zuruck',inizia:'Starten',aggiungi:'Hinzufugen',
    lingua:'Sprache',internazionale:'International',italia:'Italien',inghilterra:'England',
    spagna:'Spanien',germania:'Deutschland',francia:'Frankreich',altri:'Andere',basket_cat:'Basketball',
    preferiti:'Favoriten',cerca_squadra:'Mannschaft suchen...',
    classifica_piloti:'Fahrerwertung',classifica_costruttori:'Konstrukteurswertung',
    gare_nd:'F1-Daten nicht verfugbar',round:'Runde',
  },
};

let LANG = 'it';
function t(key) { return (LANGS[LANG]||LANGS.it)[key] || key; }

const NEWS_FEEDS = [
  { name: 'Gazzetta', url: 'https://www.gazzetta.it/rss/home.xml' },
  { name: 'Corriere Sport', url: 'https://www.corrieredellosport.it/rss/calcio.xml' },
  { name: 'TuttoSport', url: 'https://www.tuttosport.com/rss/calcio.xml' },
  { name: 'Sky Sport', url: 'https://sport.sky.it/rss/calcio' },
];

const TV_MAP = {
  'UEFA.CHAMPIONS':'Sky Sport · Mediaset','UEFA.EUROPA':'Sky Sport · TV8',
  'UEFA.EUROPA_CONF':'Sky Sport','UEFA.NATIONS':'Rai · Sky Sport',
  'ita.1':'DAZN · Sky Sport','ita.2':'DAZN','ita.coppa_italia':'Mediaset · Rai',
  'eng.1':'Sky Sport · NOW','esp.1':'DAZN','ger.1':'Sky Sport','fra.1':'DAZN',
  'FIFA.WORLD':'Rai · Mediaset','UEFA.EURO':'Rai · Sky Sport',
};

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

/* ── CATEGORIES ───────────────────────────────────────────── */
const CATS = [
  { id:'fav', label:'preferiti', comps:[] },
  { id:'intl', label:'internazionale', sport:'football', et:'soccer', comps:[
    {id:'UEFA.CHAMPIONS',name:'Champions League'},
    {id:'UEFA.EUROPA',name:'Europa League'},
    {id:'UEFA.EUROPA_CONF',name:'Conference League'},
    {id:'FIFA.WORLD',name:'Mondiali FIFA'},
    {id:'UEFA.EURO',name:'Europei UEFA'},
    {id:'UEFA.NATIONS',name:'Nations League'},
  ]},
  { id:'ita', label:'italia', sport:'football', et:'soccer', comps:[
    {id:'ita.1',name:'Serie A'},{id:'ita.2',name:'Serie B'},{id:'ita.coppa_italia',name:'Coppa Italia'},
  ]},
  { id:'eng', label:'inghilterra', sport:'football', et:'soccer', comps:[
    {id:'eng.1',name:'Premier League'},{id:'eng.2',name:'Championship'},
    {id:'eng.fa',name:'FA Cup'},{id:'eng.league_cup',name:'Carabao Cup'},
  ]},
  { id:'esp', label:'spagna', sport:'football', et:'soccer', comps:[
    {id:'esp.1',name:'La Liga'},{id:'esp.2',name:'Segunda Division'},
    {id:'esp.copa_del_rey',name:'Copa del Rey'},
  ]},
  { id:'ger', label:'germania', sport:'football', et:'soccer', comps:[
    {id:'ger.1',name:'Bundesliga'},{id:'ger.2',name:'2. Bundesliga'},
    {id:'ger.dfb_pokal',name:'DFB-Pokal'},
  ]},
  { id:'fra', label:'francia', sport:'football', et:'soccer', comps:[
    {id:'fra.1',name:'Ligue 1'},{id:'fra.2',name:'Ligue 2'},
    {id:'fra.coupe_de_france',name:'Coupe de France'},
  ]},
  { id:'other', label:'altri', sport:'football', et:'soccer', comps:[
    {id:'por.1',name:'Primeira Liga'},{id:'ned.1',name:'Eredivisie'},
    {id:'bel.1',name:'Pro League'},{id:'tur.1',name:'Super Lig'},
    {id:'arg.1',name:'Liga Profesional'},{id:'bra.1',name:'Brasileirao'},
    {id:'usa.1',name:'MLS'},
  ]},
  { id:'basket', label:'basket_cat', sport:'basketball', comps:[
    {id:'nba',name:'NBA',et:'nba'},{id:'euroleague',name:'Eurolega',et:'mens-euroleague'},
  ]},
  { id:'f1', label:'f1', sport:'f1', comps:[
    {id:'f1.current',name:'Formula 1 2025',et:'f1'},
  ]},
];

/* ── STATE ────────────────────────────────────────────────── */
const S = {
  sport:'football', compId:'UEFA.CHAMPIONS', et:'soccer', view:'scores',
  favLeagues:[], favTeams:[], onboarded:false, timer:null, prevScores:{},
};

/* ── UTILS ────────────────────────────────────────────────── */
const $id = id => document.getElementById(id);
const qs = (s, c=document) => c.querySelector(s);
const qsa = (s, c=document) => [...c.querySelectorAll(s)];
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmtTime(d) { try{return new Date(d).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});}catch{return '--';} }
function fmtDate(d) { try{return new Date(d).toLocaleDateString('it-IT',{weekday:'short',day:'numeric',month:'short'});}catch{return '--';} }
function statusInfo(ev) {
  const n=ev.status?.type?.name, detail=ev.status?.type?.shortDetail||ev.status?.displayClock||'';
  if (n==='STATUS_IN_PROGRESS') return {label:detail||'LIVE',cls:'live'};
  if (n==='STATUS_HALFTIME') return {label:t('intervallo'),cls:'live'};
  if (n==='STATUS_FULL_TIME'||n==='STATUS_FINAL') return {label:t('finale'),cls:'fin'};
  if (n==='STATUS_POSTPONED') return {label:t('rinviata'),cls:'fin'};
  if (n==='STATUS_CANCELED') return {label:t('cancellata'),cls:'fin'};
  if (ev.status?.type?.state==='pre') return {label:fmtTime(ev.date),cls:'pre'};
  return {label:detail||'--',cls:'pre'};
}
function compInfo(id) {
  for (const cat of CATS) { const c=(cat.comps||[]).find(x=>x.id===id); if(c) return {name:c.name,sport:cat.sport||'football',et:c.et||cat.et||'soccer'}; }
  return {name:id,sport:'football',et:'soccer'};
}

/* ── PREFS & LANGUAGE ─────────────────────────────────────── */
function loadPrefs() {
  S.onboarded = localStorage.getItem('sl_ob')==='1';
  LANG = localStorage.getItem('sl_lang')||'it';
  try { S.favLeagues=JSON.parse(localStorage.getItem('sl_fl')||'["UEFA.CHAMPIONS","ita.1"]'); } catch { S.favLeagues=['UEFA.CHAMPIONS']; }
  try { S.favTeams=JSON.parse(localStorage.getItem('sl_ft')||'[]'); } catch { S.favTeams=[]; }
  S.compId = S.favLeagues[0]||'UEFA.CHAMPIONS';
  const ci=compInfo(S.compId); S.sport=ci.sport; S.et=ci.et;
}
function savePrefs() {
  localStorage.setItem('sl_ob','1'); localStorage.setItem('sl_lang',LANG);
  localStorage.setItem('sl_fl',JSON.stringify(S.favLeagues));
  localStorage.setItem('sl_ft',JSON.stringify(S.favTeams));
}
function setLang(l) {
  LANG=l; localStorage.setItem('sl_lang',l);
  applyLangToDOM(); renderSidebar();
}
function applyLangToDOM() {
  // Sport tabs
  const tabMap={football:'calcio',basketball:'basket',f1:'f1',news:'notizie'};
  qsa('.sport-tab').forEach(b=>{ const lbl=b.querySelector('.tab-label'); if(lbl) lbl.textContent=t(tabMap[b.dataset.sport]||b.dataset.sport); });
  qsa('.msport-btn').forEach(b=>{ b.textContent=t(tabMap[b.dataset.sport]||b.dataset.sport); });
  // View tabs
  const vtMap={scores:'risultati',standings:'classifica',scorers:'marcatori'};
  qsa('.view-tab').forEach(b=>{ b.textContent=t(vtMap[b.dataset.view]||b.dataset.view); });
  // Sidebar search placeholder
  const ls=$id('league-search'); if(ls) ls.placeholder=t('cerca_comp');
  // Reset btn
  const rb=$id('reset-prefs-btn'); if(rb) rb.textContent=t('reimposta');
  // Search input
  const si=$id('global-search-input'); if(si) si.placeholder=t('cerca');
  const scb=$id('search-close-btn'); if(scb) scb.textContent=t('chiudi');
}

function buildLangSelector() {
  const langNames = {it:'Italiano',en:'English',es:'Espanol',fr:'Francais',de:'Deutsch'};
  const wrap = document.createElement('div');
  wrap.className = 'lang-selector';
  wrap.innerHTML = `<div class="lang-label">${t('lingua')}</div>
    <div class="lang-btns">${Object.entries(langNames).map(([code,name])=>
      `<button class="lang-btn${LANG===code?' active':''}" data-lang="${code}">${name}</button>`
    ).join('')}</div>`;
  wrap.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.onclick=()=>{ wrap.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b===btn)); setLang(btn.dataset.lang); };
  });
  return wrap;
}

/* ── ONBOARDING ───────────────────────────────────────────── */
function initOnboarding() {
  const overlay=$id('onboarding-overlay'); overlay.style.display='flex';
  // Update texts
  const obTitle=qs('#ob-step-1 .ob-title'); if(obTitle) obTitle.textContent=t('seleziona_comp');
  const obSub=qs('#ob-step-1 .ob-subtitle'); if(obSub) obSub.textContent=t('scegli_camp');
  const obTitle2=qs('#ob-step-2 .ob-title'); if(obTitle2) obTitle2.textContent=t('cerca_squadre');
  const obSub2=qs('#ob-step-2 .ob-subtitle'); if(obSub2) obSub2.textContent=t('aggiungi_squadre');
  const obSearch=$id('ob-team-search'); if(obSearch) obSearch.placeholder=t('cerca_squadra');
  const obNext=$id('ob-next'); if(obNext) obNext.textContent=t('avanti');
  const obBack=$id('ob-back'); if(obBack) obBack.textContent=t('indietro');
  const obFinish=$id('ob-finish'); if(obFinish) obFinish.textContent=t('inizia');

  const grid=$id('ob-comp-grid');
  let html='';
  CATS.filter(c=>c.id!=='fav'&&c.comps?.length).forEach(cat=>{
    html+=`<div class="ob-group-label">${t(cat.label)||cat.label}</div>`;
    cat.comps.forEach(comp=>{
      const sel=S.favLeagues.includes(comp.id);
      html+=`<div class="ob-comp-item${sel?' selected':''}" data-id="${comp.id}">
        <div class="ob-comp-check">${sel?'&#10003;':''}</div>
        ${LL[comp.id]?`<img src="${LL[comp.id]}" class="ob-comp-logo-img" onerror="this.style.display='none'">`:''}
        <span class="ob-comp-name">${comp.name}</span>
      </div>`;
    });
  });
  grid.innerHTML=html;
  grid.addEventListener('click',e=>{
    const item=e.target.closest('.ob-comp-item'); if(!item) return;
    item.classList.toggle('selected');
    item.querySelector('.ob-comp-check').innerHTML=item.classList.contains('selected')?'&#10003;':'';
  });

  $id('ob-next').onclick=()=>{
    const sel=qsa('.ob-comp-item.selected',grid).map(el=>el.dataset.id);
    S.favLeagues=sel.length?sel:['UEFA.CHAMPIONS']; obStep(2);
  };
  $id('ob-back').onclick=()=>obStep(1);
  $id('ob-finish').onclick=()=>{
    S.onboarded=true; savePrefs(); overlay.style.display='none';
    renderSidebar(); const ci=compInfo(S.compId); selectComp(S.compId,ci.et,ci.sport);
  };
  let obTmr;
  $id('ob-team-search').addEventListener('input',e=>{clearTimeout(obTmr);obTmr=setTimeout(()=>searchTeamsOb(e.target.value),350);});
}

function obStep(n) {
  qsa('.ob-step-panel').forEach(p=>p.classList.toggle('active',false));
  qsa('.ob-step-dot').forEach(d=>d.classList.toggle('active',false));
  $id(`ob-step-${n}`).classList.add('active');
  document.querySelector(`.ob-step-dot[data-step="${n}"]`).classList.add('active');
}
async function searchTeamsOb(q) {
  if(!q||q.length<2){$id('ob-team-results').innerHTML='';return;}
  try {
    const d=await (await fetch(`${ESPN}/soccer/search?query=${encodeURIComponent(q)}&limit=8`)).json();
    const teams=(d.teams||[]).slice(0,8);
    $id('ob-team-results').innerHTML=teams.length
      ?teams.map(t2=>`<div class="ob-team-row">
          <img src="${t2.logos?.[0]?.href||''}" class="ob-team-logo" onerror="this.style.display='none'">
          <span class="ob-team-name">${esc(t2.displayName)}</span>
          <button class="ob-team-add" data-id="${t2.id}" data-name="${esc(t2.displayName)}">${t('aggiungi')}</button>
        </div>`).join('')
      :`<p style="padding:8px;color:var(--txt3);font-size:.85rem">${t('nessun_risultato')}</p>`;
    qsa('.ob-team-add',$id('ob-team-results')).forEach(btn=>{
      btn.onclick=()=>addFavTeam({id:btn.dataset.id,name:btn.dataset.name});
    });
  } catch { $id('ob-team-results').innerHTML=''; }
}
function addFavTeam(tm){if(!S.favTeams.find(x=>x.id===tm.id)){S.favTeams.push(tm);renderObChips();}}
function removeFavTeam(id){S.favTeams=S.favTeams.filter(t2=>t2.id!==id);renderObChips();}
function renderObChips(){
  $id('ob-selected-teams').innerHTML=S.favTeams.map(tm=>
    `<span class="ob-sel-tag">${esc(tm.name)}<button class="ob-sel-remove" onclick="removeFavTeam('${tm.id}')">x</button></span>`
  ).join('');
}

/* ── SIDEBAR ──────────────────────────────────────────────── */
function renderSidebar() {
  const favCat=CATS.find(c=>c.id==='fav');
  favCat.comps=[];
  CATS.forEach(cat=>{
    if(cat.id==='fav'||!cat.comps) return;
    cat.comps.forEach(comp=>{ if(S.favLeagues.includes(comp.id)) favCat.comps.push({...comp,_sport:cat.sport,_et:comp.et||cat.et}); });
  });
  const nav=$id('league-nav'); nav.innerHTML='';
  CATS.forEach(cat=>{
    const comps=cat.comps||[]; if(!comps.length) return;
    const sec=document.createElement('div'); sec.className='cat-section';
    const hdr=document.createElement('div'); hdr.className='cat-header';
    hdr.innerHTML=`<span>${t(cat.label)||cat.label}</span>`;
    sec.appendChild(hdr);
    const items=document.createElement('div'); items.className='cat-items';
    comps.forEach(comp=>{
      const sport=comp._sport||cat.sport||'football';
      const et=comp._et||comp.et||cat.et||'soccer';
      const btn=document.createElement('button');
      btn.className='comp-btn'+(comp.id===S.compId?' active':'')+(S.favLeagues.includes(comp.id)?' starred':'');
      btn.dataset.id=comp.id;
      const logo=LL[comp.id];
      btn.innerHTML=`${logo?`<img src="${logo}" width="16" height="16" style="object-fit:contain;flex-shrink:0;margin-right:2px" onerror="this.style.display='none'">`:''}
        <span class="comp-name">${comp.name}</span><span class="comp-star">&#9733;</span>`;
      btn.onclick=()=>{selectComp(comp.id,et,sport);closeSidebar();};
      items.appendChild(btn);
    });
    sec.appendChild(items); nav.appendChild(sec);
  });

  // Language selector in sidebar footer
  const footer=$id('sidebar-footer') || qs('.sidebar-footer');
  if (footer) {
    const existing=footer.querySelector('.lang-selector');
    if (existing) existing.remove();
    footer.insertBefore(buildLangSelector(), footer.firstChild);
  }

  const si=$id('league-search');
  si.oninput=()=>{const q=si.value.toLowerCase();qsa('.comp-btn',nav).forEach(b=>{b.style.display=b.textContent.toLowerCase().includes(q)?'':'none';});};
}

/* ── TABS ─────────────────────────────────────────────────── */
function setupTabs() { qsa('.sport-tab,.msport-btn').forEach(btn=>{btn.onclick=()=>switchSport(btn.dataset.sport);}); }
function switchSport(sport) {
  qsa('.sport-tab').forEach(b=>b.classList.toggle('active',b.dataset.sport===sport));
  qsa('.msport-btn').forEach(b=>b.classList.toggle('active',b.dataset.sport===sport));
  if(sport==='news'){S.sport='news';$id('view-tabs').style.display='none';loadNews();return;}
  if(sport==='f1'){selectComp('f1.current','f1','f1');return;}
  if(sport==='basketball'){selectComp('nba','nba','basketball');return;}
  const ffl=S.favLeagues.find(id=>compInfo(id).sport==='football')||'UEFA.CHAMPIONS';
  const ci=compInfo(ffl); selectComp(ffl,ci.et,'football');
}

/* ── COMP SELECT ──────────────────────────────────────────── */
function selectComp(compId,et,sport) {
  S.compId=compId;S.et=et||'soccer';S.sport=sport||'football';S.view='scores';
  qsa('.comp-btn').forEach(b=>b.classList.toggle('active',b.dataset.id===compId));
  const ci=compInfo(compId); $id('page-title').textContent=ci.name||compId;
  const isFav=S.favLeagues.includes(compId);
  $id('fav-btn').textContent=isFav?t('rimuovi'):t('pref');
  $id('fav-btn').classList.toggle('starred',isFav);
  const showTabs=sport!=='f1'&&sport!=='news';
  $id('view-tabs').style.display=showTabs?'':'none';
  if(showTabs) qsa('.view-tab').forEach(b=>b.classList.toggle('active',b.dataset.view==='scores'));
  if(S.timer){clearInterval(S.timer);S.timer=null;}
  loadContent(); S.timer=setInterval(loadContent,REFRESH_MS);
}

/* ── CONTENT ROUTING ──────────────────────────────────────── */
function loadContent() {
  if(S.sport==='news'){loadNews();return;}
  if(S.sport==='f1'){loadF1();return;}
  if(S.view==='scores') loadScores();
  else if(S.view==='standings') loadStandings();
  else if(S.view==='scorers') loadScorers();
}

/* ── SCORES ───────────────────────────────────────────────── */
async function loadScores() {
  const el=$id('content');
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  try {
    const sp=S.sport==='basketball'?'basketball':'soccer';
    const data=await (await fetch(`${ESPN}/${sp}/${S.et}/scoreboard`)).json();
    const events=data.events||[];
    checkGoals(events);
    const liveCount=events.filter(e=>e.status?.type?.state==='in').length;
    $id('live-pill').style.display=liveCount?'flex':'none';
    if(!events.length){el.innerHTML=`<div class="empty-state"><p>${t('nessuna_partita')}</p></div>`;updateTs();return;}
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
  } catch {
    el.innerHTML=`<div class="error-state"><p>${t('errore')}</p>
      <button onclick="loadContent()" style="margin-top:8px;padding:8px 20px;background:var(--blue);color:#fff;border-radius:6px;font-size:.85rem">${t('riprova')}</button></div>`;
  }
}

function matchCard(ev) {
  const comp=ev.competitions?.[0];if(!comp)return'';
  const home=comp.competitors?.find(c=>c.homeAway==='home');
  const away=comp.competitors?.find(c=>c.homeAway==='away');
  if(!home||!away)return'';
  const st=statusInfo(ev);
  const isLive=ev.status?.type?.state==='in';
  const hasScore=home.score!==undefined&&away.score!==undefined&&ev.status?.type?.state!=='pre';
  const hL=home.team?.logo||`https://a.espncdn.com/i/teamlogos/soccer/500/${home.team?.id}.png`;
  const aL=away.team?.logo||`https://a.espncdn.com/i/teamlogos/soccer/500/${away.team?.id}.png`;
  const tv=TV_MAP[S.compId]||'';
  const goalsHtml=matchGoals(comp);
  return `<div class="match-card${isLive?' is-live':''}" data-eid="${ev.id}">
    <div class="match-row${isLive?' is-live':''}">
      <div class="mr-time"><span class="mr-badge ${st.cls}">${st.label}</span></div>
      <div class="mr-team home">
        <span class="mr-name${home.winner?' bold':''}">${esc(home.team?.shortDisplayName||home.team?.displayName||'')}</span>
        <img src="${hL}" class="mr-crest" onerror="this.style.display='none'">
      </div>
      <div class="mr-score">${hasScore
        ?`<span class="mr-snum${home.winner?' bold':''}">${home.score}</span><span class="mr-ssep">-</span><span class="mr-snum${away.winner?' bold':''}">${away.score}</span>`
        :`<span class="mr-ssep" style="font-size:.75rem;color:var(--txt3)">vs</span>`}</div>
      <div class="mr-team away">
        <img src="${aL}" class="mr-crest" onerror="this.style.display='none'">
        <span class="mr-name${away.winner?' bold':''}">${esc(away.team?.shortDisplayName||away.team?.displayName||'')}</span>
      </div>
      <div class="mr-extra">${tv?`<span class="mr-tv">${tv}</span>`:''}</div>
    </div>
    ${goalsHtml?`<div class="match-goals-bar">${goalsHtml}</div>`:''}
  </div>`;
}
function matchGoals(comp) {
  const details=comp?.details||[];
  const goals=details.filter(d=>d.type?.text==='Goal'||d.type?.text==='PenaltyScored'||d.type?.text==='OwnGoal');
  if(!goals.length)return'';
  return goals.map(g=>{
    const min=g.clock?.displayValue||'';
    const scorer=g.athletesInvolved?.[0]?.displayName||'';
    const assist=g.athletesInvolved?.[1]?.displayName||'';
    const isOwn=g.type?.text==='OwnGoal';
    return `<span class="mg-item${isOwn?' mg-own':''}">
      ${min?`<span class="mg-min">${min}'</span>`:''}
      <span class="mg-scorer">${esc(scorer)}${isOwn?' (Aut.)':''}</span>
      ${assist?`<span class="mg-assist">${t('ass')}: ${esc(assist)}</span>`:''}
    </span>`;
  }).join('');
}
function adBanner(pos){return `<div class="ad-banner ad-${pos}"><div class="ad-inner"><span class="ad-label">Annuncio</span></div></div>`;}

/* ── GOAL NOTIFICATIONS ───────────────────────────────────── */
function checkGoals(events) {
  events.forEach(ev=>{
    if(ev.status?.type?.state!=='in')return;
    const comp=ev.competitions?.[0];
    const home=comp?.competitors?.find(c=>c.homeAway==='home');
    const away=comp?.competitors?.find(c=>c.homeAway==='away');
    if(!home||!away)return;
    const cH=parseInt(home.score)||0,cA=parseInt(away.score)||0;
    const prev=S.prevScores[ev.id];
    if(prev&&(cH>prev.h||cA>prev.a)){
      const details=comp?.details||[];
      const goals=details.filter(d=>d.type?.text==='Goal'||d.type?.text==='PenaltyScored');
      const last=goals[goals.length-1];
      const scorer=last?.athletesInvolved?.[0]?.displayName||'';
      const assist=last?.athletesInvolved?.[1]?.displayName||'';
      const body=`${home.team?.shortDisplayName||''} ${cH}-${cA} ${away.team?.shortDisplayName||''}\n${scorer}${assist?` (${t('ass')}. ${assist})`:''}`;
      if(Notification.permission==='granted') new Notification('SportLive - '+t('gol'),{body,icon:'/icons/icon-192.png'});
    }
    S.prevScores[ev.id]={h:cH,a:cA};
  });
}

/* ── STANDINGS ────────────────────────────────────────────── */
async function loadStandings() {
  const el=$id('content');
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  try {
    const sp=S.sport==='basketball'?'basketball':'soccer';
    const data=await (await fetch(`${ESPN}/${sp}/${S.et}/standings`)).json();
    let entries=data.standings?.entries||data.children?.[0]?.standings?.entries||data.standings?.[0]?.entries||[];
    if(!entries.length){el.innerHTML=`<div class="empty-state"><p>${t('classifica_nd')}</p></div>`;return;}
    const rows=entries.map((entry,i)=>{
      const team=entry.team||{};
      const stats=Object.fromEntries((entry.stats||[]).map(s=>[s.name,s]));
      const logo=team.logos?.[0]?.href||`https://a.espncdn.com/i/teamlogos/soccer/500/${team.id}.png`;
      const pts=stats.points?.value??stats.pts?.value??'-';
      const gp=stats.gamesPlayed?.value??stats.played?.value??'-';
      const w=stats.wins?.value??'-';
      const d2=stats.ties?.value??stats.draws?.value??'-';
      const l=stats.losses?.value??'-';
      const gf=stats.pointsFor?.value??stats.gf?.value??'-';
      const ga=stats.pointsAgainst?.value??stats.ga?.value??'-';
      const gd=stats.pointDifferential?.value??stats.gd?.value??'-';
      const n=entries.length;
      const rkCls=i<1?'rk ucl r1':i<4?'rk ucl':i<6?'rk uel':i>=n-3?'rk rel':'rk';
      return `<tr>
        <td class="left"><span class="${rkCls}">${i+1}</span></td>
        <td class="left"><div class="td-team"><img src="${logo}" onerror="this.style.display='none'"><span>${esc(team.shortDisplayName||team.displayName||'')}</span></div></td>
        <td>${gp}</td><td>${w}</td><td>${d2}</td><td>${l}</td><td>${gf}</td><td>${ga}</td>
        <td>${typeof gd==='number'?(gd>0?'+':'')+gd:gd}</td><td class="pts">${pts}</td>
      </tr>`;
    }).join('');
    el.innerHTML=`<div class="table-wrap"><table>
      <thead><tr><th class="left">#</th><th class="left" style="min-width:160px">Squadra</th>
        <th title="Giocate">G</th><th title="Vinte">V</th><th title="Pari">N</th><th title="Perse">P</th>
        <th>GF</th><th>GS</th><th>DR</th><th>Pts</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;padding:10px 0;font-size:.72rem;color:var(--txt3)">
        <span><span class="rk ucl r1">1</span> 1° posto</span>
        <span><span class="rk ucl">2-4</span> Champions League</span>
        <span><span class="rk uel">5-6</span> Europa League</span>
        <span><span class="rk rel">18+</span> Retrocessione</span>
      </div>`;
    updateTs();
  } catch { el.innerHTML=`<div class="error-state"><p>${t('classifica_nd')}</p></div>`; }
}

/* ── SCORERS ──────────────────────────────────────────────── */
async function loadScorers() {
  const el=$id('content');
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  try {
    const sp=S.sport==='basketball'?'basketball':'soccer';
    const data=await (await fetch(`${ESPN}/${sp}/${S.et}/leaders`)).json();
    const cats=data.leaders||[];
    const gl=cats.find(c=>c.name==='goals'||c.name==='goalsScoredTotal')||cats.find(c=>c.name==='points'||c.name==='scoring')||cats[0];
    const leaders=(gl?.leaders||[]).slice(0,20);
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
  } catch { el.innerHTML=`<div class="error-state"><p>${t('marcatori_nd')}</p></div>`; }
}

/* ── FORMULA 1 ────────────────────────────────────────────── */
async function loadF1() {
  const el=$id('content'); $id('view-tabs').style.display='none';
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  try {
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
  } catch { el.innerHTML=`<div class="error-state"><p>${t('gare_nd')}</p></div>`; }
}

/* ── NEWS ─────────────────────────────────────────────────── */
async function loadNews() {
  const el=$id('content');
  el.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  try {
    const feeds=await Promise.all(NEWS_FEEDS.map(f=>
      fetch(`${RSS2J}${encodeURIComponent(f.url)}&count=6`)
        .then(r=>r.json()).then(d=>(d.items||[]).map(i=>({...i,source:f.name}))).catch(()=>[])
    ));
    const items=feeds.flat().sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));
    if(!items.length){el.innerHTML=`<div class="empty-state"><p>${t('notizie_nd')}</p></div>`;return;}
    el.innerHTML=`<div class="news-list">${items.slice(0,30).map(item=>{
      const img=item.thumbnail||item.enclosure?.url||'';
      return `<a class="news-item" href="${esc(item.link||'#')}" target="_blank" rel="noopener noreferrer">
        ${img?`<img src="${esc(img)}" class="news-thumb" onerror="this.style.display='none'" loading="lazy">`:''}
        <div class="news-body">
          <div class="news-meta"><span class="news-src">${esc(item.source)}</span> · ${item.pubDate?fmtDate(item.pubDate):''}</div>
          <div class="news-hl">${esc(item.title||'')}</div>
        </div>
      </a>`;
    }).join('')}</div>`;
    updateTs();
  } catch { el.innerHTML=`<div class="empty-state"><p>${t('notizie_nd')}</p></div>`; }
}

/* ── MATCH MODAL ──────────────────────────────────────────── */
async function openModal(eventId) {
  const bd=$id('modal-backdrop'),body=$id('modal-body'),banner=$id('modal-score-banner');
  bd.classList.add('open');
  body.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  banner.innerHTML='';
  qsa('.modal-tab').forEach(t2=>t2.classList.toggle('active',t2.dataset.mtab==='events'));
  try {
    const sp=S.sport==='basketball'?'basketball':'soccer';
    const data=await (await fetch(`${ESPN}/${sp}/${S.et}/summary?event=${eventId}`)).json();
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
            <div class="msb-team"><img src="${hL}" class="msb-crest" onerror="this.style.display='none'"><span class="msb-name">${esc(home.team?.displayName||'')}</span></div>
            <div class="msb-score-center">
              <span class="msb-score">${home.score??'-'}</span><span class="msb-sep">-</span><span class="msb-score">${away.score??'-'}</span>
            </div>
            <div class="msb-team"><img src="${aL}" class="msb-crest" onerror="this.style.display='none'"><span class="msb-name">${esc(away.team?.displayName||'')}</span></div>
          </div>`;
        $id('modal-title').textContent=`${home.team?.shortDisplayName||''} - ${away.team?.shortDisplayName||''}`;
      }
    }
    bd._data=data;
    renderMTab('events',data);
    qsa('.modal-tab').forEach(tab=>{
      tab.onclick=()=>{qsa('.modal-tab').forEach(t2=>t2.classList.toggle('active',t2===tab));renderMTab(tab.dataset.mtab,bd._data);};
    });
  } catch { body.innerHTML=`<div class="error-state"><p>${t('dati_nd')}</p></div>`; }
}

function renderMTab(tab,data) {
  const body=$id('modal-body');
  if(tab==='events') renderMEvents(data,body);
  else if(tab==='lineups') renderMLineups(data,body);
  else if(tab==='stats') renderMStats(data,body);
  else if(tab==='tv'){
    const tv=TV_MAP[S.compId]||t('dati_nd');
    body.innerHTML=`<div class="m-section"><div class="m-section-title">${t('disponibile_su')}</div>
      <div class="tv-list">${tv.split('·').map(s=>`<span class="tv-badge">${esc(s.trim())}</span>`).join('')}</div></div>`;
  }
}

function renderMEvents(data,body) {
  const details=data.header?.competitions?.[0]?.details||[];
  if(!details.length){body.innerHTML=`<div class="empty-state"><p>${t('nessun_evento')}</p></div>`;return;}
  const sorted=[...details].sort((a,b)=>(parseInt(a.clock?.displayValue)||0)-(parseInt(b.clock?.displayValue)||0));
  const EVT={'Goal':{label:t('gol'),cls:'goal'},'PenaltyScored':{label:t('rig'),cls:'goal'},
    'OwnGoal':{label:t('aut'),cls:'goal'},'YellowCard':{label:t('amm'),cls:'yellow'},
    'RedCard':{label:t('esp'),cls:'red'},'YellowRedCard':{label:t('esp'),cls:'red'},
    'Substitution':{label:t('cam'),cls:'sub'},'PenaltyMissed':{label:t('rig')+'X',cls:'pen'},'VAR':{label:'VAR',cls:'other'}};
  body.innerHTML=`<div class="events-list">${sorted.map(ev=>{
    const type=ev.type?.text||'';
    const info=EVT[type]||{label:type.substring(0,4).toUpperCase()||'?',cls:'other'};
    const min=ev.clock?.displayValue?`${ev.clock.displayValue}'`:'';
    const player=ev.athletesInvolved?.[0]?.displayName||'';
    const assist=ev.athletesInvolved?.[1]?.displayName||'';
    const team=ev.team?.shortDisplayName||'';
    return `<div class="ev-row"><span class="ev-time">${min}</span>
      <span class="ev-badge ${info.cls}">${info.label}</span>
      <div class="ev-txt"><strong>${esc(player)}</strong>
        ${assist?`<div class="ev-sub">${t('ass')}: ${esc(assist)}</div>`:''}
        ${team?`<div class="ev-sub">${esc(team)}</div>`:''}
      </div></div>`;
  }).join('')}</div>`;
}

function renderMLineups(data,body) {
  const rosters=data.rosters||data.boxscore?.players||[];
  if(!rosters.length){body.innerHTML=`<div class="empty-state"><p>${t('formazioni_nd')}</p></div>`;return;}
  const renderP=p=>{
    const a=p.athlete||p;
    const photo=`https://a.espncdn.com/i/headshots/soccer/players/full/${a.id}.png`;
    const num=a.jersey||p.jersey||'',pos=a.position?.abbreviation||p.position?.abbreviation||'';
    return `<div class="lu-player"><span class="lu-num">${num}</span>
      <img src="${photo}" class="lu-photo" onerror="this.className='lu-photo-ph';this.removeAttribute('src')">
      <span class="lu-name">${esc(a.displayName||a.fullName||'')}</span>
      ${pos?`<span class="lu-pos">${pos}</span>`:''}</div>`;
  };
  body.innerHTML=`<div class="lineup-split">${rosters.slice(0,2).map(tr=>{
    const tname=tr.team?.displayName||tr.team?.shortDisplayName||'';
    const tlogo=tr.team?.logos?.[0]?.href||'';
    const players=tr.roster||tr.athletes||[];
    const starters=players.filter(p=>p.starter!==false&&p.active!==false);
    const bench=players.filter(p=>p.starter===false);
    return `<div><div class="lu-head">${tlogo?`<img src="${tlogo}" style="width:18px;height:18px;object-fit:contain;margin-right:6px;vertical-align:middle" onerror="this.style.display='none'">`:''}${esc(tname)}</div>
      ${(starters.length?starters:players.slice(0,11)).map(renderP).join('')}
      ${bench.length?`<div class="bench-title">${t('panchina')}</div>${bench.slice(0,7).map(renderP).join('')}`:''}
    </div>`;
  }).join('')}</div>`;
}

function renderMStats(data,body) {
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

/* ── GLOBAL SEARCH ────────────────────────────────────────── */
function setupSearch() {
  $id('search-btn').onclick=()=>{$id('search-overlay').classList.add('open');$id('global-search-input').focus();};
  $id('search-close-btn').onclick=closeSearch;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSearch();$id('modal-backdrop').classList.remove('open');}});
  let tmr;
  $id('global-search-input').addEventListener('input',e=>{clearTimeout(tmr);tmr=setTimeout(()=>doSearch(e.target.value),350);});
}
function closeSearch(){$id('search-overlay').classList.remove('open');$id('global-search-input').value='';$id('search-results').innerHTML='';}
async function doSearch(q) {
  const res=$id('search-results');
  if(!q||q.length<2){res.innerHTML='';return;}
  res.innerHTML='<div class="loading-state" style="padding:20px"><div class="spinner"></div></div>';
  try {
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
  } catch { res.innerHTML=`<p style="padding:16px;color:var(--txt3)">${t('errore')}</p>`; }
}

/* ── TEAM VIEW ────────────────────────────────────────────── */
async function openTeamView(teamId,name,logo) {
  closeSearch();
  const ov=$id('team-view-overlay'),body=$id('team-view-body');
  ov.classList.add('open');$id('tv-title').textContent=name;
  body.innerHTML=`<div class="loading-state"><div class="spinner"></div><p>${t('caricamento')}</p></div>`;
  try {
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
        if(!home||!away)return;
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
    } else { html+=`<div class="empty-state" style="padding:30px"><p>${t('dati_nd')}</p></div>`; }
    body.innerHTML=html;
  } catch {
    body.innerHTML=`<div class="tv-hero">${logo?`<img src="${esc(logo)}" class="tv-hero-logo" onerror="this.style.display='none'">`:''}
      <div class="tv-hero-info"><div class="tv-hero-name">${esc(name)}</div></div></div>
      <div class="empty-state"><p>${t('dati_nd')}</p></div>`;
  }
}

/* ── SIDEBAR / UI ─────────────────────────────────────────── */
function setupSidebar() {
  $id('hamburger').onclick=()=>toggleSidebar();
  $id('sidebar-close').onclick=()=>closeSidebar();
  $id('sidebar-overlay').onclick=()=>closeSidebar();
  $id('settings-btn').onclick=()=>toggleSidebar();
}
function toggleSidebar(){const open=$id('sidebar').classList.toggle('open');$id('sidebar-overlay').classList.toggle('visible',open);}
function closeSidebar(){$id('sidebar').classList.remove('open');$id('sidebar-overlay').classList.remove('visible');}
function setupFavBtn(){
  $id('fav-btn').onclick=()=>{
    const id=S.compId,i=S.favLeagues.indexOf(id);
    if(i>=0)S.favLeagues.splice(i,1);else S.favLeagues.push(id);
    savePrefs();
    const isFav=S.favLeagues.includes(id);
    $id('fav-btn').textContent=isFav?t('rimuovi'):t('pref');
    $id('fav-btn').classList.toggle('starred',isFav);
    renderSidebar();
  };
}
function setupViewTabs(){
  qsa('.view-tab').forEach(btn=>{
    btn.onclick=()=>{S.view=btn.dataset.view;qsa('.view-tab').forEach(b=>b.classList.toggle('active',b===btn));loadContent();};
  });
}
function setupModal(){
  $id('modal-close').onclick=()=>$id('modal-backdrop').classList.remove('open');
  $id('modal-backdrop').onclick=e=>{if(e.target===$id('modal-backdrop'))$id('modal-backdrop').classList.remove('open');};
}
function setupTeamView(){$id('tv-back-btn').onclick=()=>$id('team-view-overlay').classList.remove('open');}
function setupResetBtn(){
  $id('reset-prefs-btn').onclick=()=>{
    if(confirm(t('reimposta')+'?')){['sl_ob','sl_fl','sl_ft','sl_lang'].forEach(k=>localStorage.removeItem(k));location.reload();}
  };
}
function updateTs(){$id('updated-at').textContent=t('aggiornato')+': '+new Date().toLocaleTimeString('it-IT');}
async function requestNotifs(){if('Notification'in window&&Notification.permission==='default')await Notification.requestPermission();}
function registerSW(){if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});}

/* ── INIT ─────────────────────────────────────────────────── */
function init() {
  loadPrefs();
  applyLangToDOM();
  renderSidebar();
  setupTabs();
  setupSidebar();
  setupFavBtn();
  setupViewTabs();
  setupModal();
  setupTeamView();
  setupSearch();
  setupResetBtn();
  requestNotifs();
  registerSW();
  if(!S.onboarded){
    initOnboarding();
  } else {
    $id('onboarding-overlay').style.display='none';
    selectComp(S.compId,S.et,S.sport);
  }
  const sp=S.sport||'football';
  qsa('.sport-tab').forEach(b=>b.classList.toggle('active',b.dataset.sport===sp));
  qsa('.msport-btn').forEach(b=>b.classList.toggle('active',b.dataset.sport===sp));
}

document.addEventListener('DOMContentLoaded',init);
