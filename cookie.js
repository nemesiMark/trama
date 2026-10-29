/* Olimp – gestione cookie (banner + blocco Google Maps finché non c'è il consenso).
   Il sito usa solo cookie tecnici; i cookie di terze parti arrivano dalla mappa Google Maps. */
(function(){
  var KEY='olimp_cookie_consent_v1';

  function getConsent(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
  function setConsent(maps){try{localStorage.setItem(KEY,JSON.stringify({maps:!!maps,ts:Date.now()}))}catch(e){}}

  /* --- stile --- */
  var css='\
/* Barra a tutta larghezza in fondo alla pagina (proposta C): blu scuro con linea bordeaux sopra, testo a sinistra e pulsanti a destra. */\
#ck-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:var(--ink,#051D34);color:#fff;border-top:3px solid #aa372e;box-shadow:0 -8px 30px rgba(5,29,52,.25);font:400 .9rem/1.55 "Manrope",Arial,sans-serif}\
#ck-banner .ck-in{max-width:1360px;margin:0 auto;padding:1rem 3.5rem;display:flex;align-items:center;gap:1rem 2.5rem}\
#ck-banner .ck-txt{flex:1 1 auto;min-width:0;margin:0;color:#dbe4ef;font-size:.85rem}\
#ck-banner h2{display:inline;font:700 .85rem "Manrope",Arial,sans-serif;margin:0;color:#fff}\
#ck-banner .ck-row{display:flex;gap:.6rem;flex:0 0 auto}\
#ck-banner .ck-btn{flex:0 0 auto;min-width:120px;border:1.5px solid transparent}\
#ck-banner [data-ck=no]{background:transparent;color:#fff;border-color:rgba(255,255,255,.6)}\
#ck-banner [data-ck=no]:hover{background:rgba(255,255,255,.12);border-color:#fff}\
#ck-banner [data-ck=yes]{background:var(--ice,#D5E3F2);color:var(--ink,#051D34)}\
#ck-banner [data-ck=yes]:hover{background:#fff}\
.ck-btn{flex:1 1 140px;border:0;border-radius:8px;padding:.75rem 1rem;font:700 .85rem "Manrope",Arial,sans-serif;cursor:pointer;background:var(--ice,#c9dcf5);color:var(--ink,#051D34)}\
.ck-btn:hover{background:#fff}\
.ck-btn:focus-visible,#ck-banner a:focus-visible{outline:2px solid currentColor;outline-offset:3px}\
#ck-banner a{color:#fff;text-decoration:underline;white-space:nowrap}\
#ck-banner.ck-attn{animation:ckAttn .7s ease 1s 2}\
@keyframes ckAttn{0%,100%{background:var(--ink,#051D34)}50%{background:#aa372e}}\
.ck-map-ph{width:100%;height:100%;min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;text-align:center;padding:2rem;background:var(--paper,#f3f1ee);color:var(--ink,#051D34);box-sizing:border-box}\
.ck-map-ph p{margin:0;max-width:38ch;font-size:.95rem}\
.ck-map-ph .ck-btn{flex:none;background:var(--ink,#051D34);color:#fff}\
.ck-map-ph .ck-btn:hover{background:#1c3556}\
@media(max-width:800px){#ck-banner .ck-in{flex-direction:column;align-items:stretch;padding:.9rem 1.2rem;gap:.8rem}#ck-banner .ck-btn{flex:1 1 0;min-width:0}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  /* --- iframe Google Maps: nessuna richiesta a Google senza consenso --- */
  function mapFrames(){
    var all=document.querySelectorAll('iframe'),out=[];
    for(var i=0;i<all.length;i++){
      var f=all[i],s=f.getAttribute('data-src')||f.getAttribute('src')||'';
      if(/google\.[a-z.]+\/maps/.test(s)){
        if(!f.getAttribute('data-src')){f.setAttribute('data-src',s);f.removeAttribute('src')}
        out.push(f);
      }
    }
    return out;
  }

  function showMaps(){
    mapFrames().forEach(function(f){
      var ph=f.parentNode.querySelector('.ck-map-ph');if(ph)ph.remove();
      f.style.display='';
      if(!f.getAttribute('src'))f.setAttribute('src',f.getAttribute('data-src'));
    });
  }

  function hideMaps(){
    mapFrames().forEach(function(f){
      f.removeAttribute('src');f.style.display='none';
      if(f.parentNode.querySelector('.ck-map-ph'))return;
      var d=document.createElement('div');d.className='ck-map-ph';
      d.innerHTML='<p>Per mostrare la mappa servono cookie di terze parti (Google Maps). Puoi caricarla solo se vuoi.</p><button type="button" class="ck-btn">Accetta e mostra la mappa</button>';
      d.querySelector('button').addEventListener('click',function(){choose(true)});
      f.parentNode.appendChild(d);
    });
  }

  function apply(){var c=getConsent();if(c&&c.maps)showMaps();else hideMaps()}

  /* --- banner --- */
  /* Spazio in fondo alla pagina alto esattamente quanto la barra: la barra lo copre del tutto,
     quindi il footer resta della sua altezza normale e niente (es. il pulsante del modulo) resta nascosto. */
  function padBody(){var b=document.getElementById('ck-banner');document.body.style.paddingBottom=b?b.offsetHeight+'px':''}
  window.addEventListener('resize',padBody);

  function closeBanner(){var b=document.getElementById('ck-banner');if(b)b.remove();padBody()}

  /* Il modulo contatti si può inviare solo dopo aver accettato i cookie. */
  function syncPending(){var c=getConsent();document.documentElement.classList.toggle('ck-pending',!(c&&c.maps))}

  function choose(maps){setConsent(maps);closeBanner();apply();syncPending()}

  /* Ogni volta che la finestra si apre lampeggia due volte di rosso, a partire da 1 secondo dopo l'apertura. */
  function flash(b){b.classList.remove('ck-attn');void b.offsetWidth;b.classList.add('ck-attn')}

  /* La finestra prende il nome del pulsante che la apre (es. «Gestisci cookie», «Gestione cookie»). */
  function openBanner(e){
    var t=(e&&e.currentTarget&&e.currentTarget.textContent.trim())||'Gestione cookie';
    var old=document.getElementById('ck-banner');
    if(old){old.querySelector('h2').textContent=t+'.';flash(old);return}
    var b=document.createElement('div');
    b.id='ck-banner';b.setAttribute('role','region');b.setAttribute('aria-label','Cookie');
    b.innerHTML='<div class="ck-in"><div class="ck-txt"><h2></h2> Usiamo solo cookie tecnici; la mappa di Google Maps si carica solo se accetti. <a href="privacy.html">Privacy e cookie</a></div><div class="ck-row"><button type="button" class="ck-btn" data-ck="no">Rifiuta</button><button type="button" class="ck-btn" data-ck="yes">Accetta</button></div></div>';
    b.querySelector('h2').textContent=t+'.';
    b.querySelector('[data-ck=no]').addEventListener('click',function(){choose(false)});
    b.querySelector('[data-ck=yes]').addEventListener('click',function(){choose(true)});
    document.body.appendChild(b);padBody();
    /* La barra cambia altezza quando arrivano i caratteri o si ruota il telefono: lo spazio la segue. */
    if(window.ResizeObserver)new ResizeObserver(padBody).observe(b);
    flash(b);
  }

  /* --- pulsanti che aprono la finestra: footer, avviso del modulo, pagina Privacy e cookie --- */
  function bindOpeners(){
    var bs=document.querySelectorAll('.ck-open');
    for(var i=0;i<bs.length;i++)bs[i].addEventListener('click',openBanner);
  }

  function init(){bindOpeners();apply();syncPending();if(!getConsent())openBanner()}
  window.olimpOpenCookies=openBanner;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
