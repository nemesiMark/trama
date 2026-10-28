/* Olimp – gestione cookie (banner + blocco Google Maps finché non c'è il consenso).
   Il sito usa solo cookie tecnici; i cookie di terze parti arrivano dalla mappa Google Maps. */
(function(){
  var KEY='olimp_cookie_consent_v1';

  function getConsent(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
  function setConsent(maps){try{localStorage.setItem(KEY,JSON.stringify({maps:!!maps,ts:Date.now()}))}catch(e){}}

  /* --- stile --- */
  var css='\
#ck-banner{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:9999;max-width:560px;background:var(--ink,#051D34);color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:1.2rem 1.3rem;box-shadow:0 12px 40px rgba(0,0,0,.35);font:400 .9rem/1.5 "Manrope",Arial,sans-serif}\
#ck-banner h2{font:700 1rem "Manrope",Arial,sans-serif;margin:0 0 .4rem;color:#fff}\
#ck-banner p{margin:0 0 1rem;color:#dbe4ef;font-size:.85rem}\
#ck-banner .ck-row{display:flex;gap:.6rem;flex-wrap:wrap}\
.ck-btn{flex:1 1 140px;border:0;border-radius:8px;padding:.75rem 1rem;font:700 .85rem "Manrope",Arial,sans-serif;cursor:pointer;background:var(--ice,#c9dcf5);color:var(--ink,#051D34)}\
.ck-btn:hover{background:#fff}\
.ck-btn:focus-visible,#ck-banner a:focus-visible{outline:2px solid currentColor;outline-offset:3px}\
#ck-banner a{color:#fff;text-decoration:underline}\
#ck-banner.ck-attn{animation:ckAttn .9s ease 2}\
@keyframes ckAttn{0%,100%{box-shadow:0 12px 40px rgba(0,0,0,.35)}50%{box-shadow:0 0 0 5px #aa372e,0 12px 40px rgba(0,0,0,.35)}}\
.ck-map-ph{width:100%;height:100%;min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;text-align:center;padding:2rem;background:var(--paper,#f3f1ee);color:var(--ink,#051D34);box-sizing:border-box}\
.ck-map-ph p{margin:0;max-width:38ch;font-size:.95rem}\
.ck-map-ph .ck-btn{flex:none;background:var(--ink,#051D34);color:#fff}\
.ck-map-ph .ck-btn:hover{background:#1c3556}\
@media(max-width:600px){#ck-banner{left:.6rem;right:.6rem;bottom:.6rem}}';
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
  /* Spazio in fondo alla pagina pari al banner: così niente (es. il pulsante del modulo) resta nascosto sotto. */
  function padBody(){var b=document.getElementById('ck-banner');document.body.style.paddingBottom=b?(b.offsetHeight+32)+'px':''}
  window.addEventListener('resize',padBody);

  function closeBanner(){var b=document.getElementById('ck-banner');if(b)b.remove();padBody()}

  function choose(maps){setConsent(maps);closeBanner();apply();document.documentElement.classList.remove('ck-pending')}

  function openBanner(){
    if(document.getElementById('ck-banner'))return;
    var b=document.createElement('div');
    b.id='ck-banner';b.setAttribute('role','region');b.setAttribute('aria-label','Cookie');
    b.innerHTML='<h2>Cookie</h2><p>Questo sito usa cookie tecnici, necessari al funzionamento. La mappa di Google Maps può installare cookie di terze parti: li carichiamo solo se accetti. Puoi cambiare scelta in qualsiasi momento da «Gestisci cookie» nella pagina <a href="privacy.html">Privacy e cookie</a>.</p><div class="ck-row"><button type="button" class="ck-btn" data-ck="no">Rifiuta</button><button type="button" class="ck-btn" data-ck="yes">Accetta</button></div>';
    b.querySelector('[data-ck=no]').addEventListener('click',function(){choose(false)});
    b.querySelector('[data-ck=yes]').addEventListener('click',function(){choose(true)});
    document.body.appendChild(b);padBody();
  }

  /* --- pulsanti "Gestisci cookie" (pagina Privacy e cookie) --- */
  function bindOpeners(){
    var bs=document.querySelectorAll('.ck-open');
    for(var i=0;i<bs.length;i++)bs[i].addEventListener('click',openBanner);
  }

  function init(){bindOpeners();apply();if(!getConsent()){document.documentElement.classList.add('ck-pending');openBanner()}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
