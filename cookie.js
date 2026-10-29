/* Olimp – gestione cookie (banner + blocco Google Maps finché non c'è il consenso).
   Il sito usa solo cookie tecnici; i cookie di terze parti arrivano dalla mappa Google Maps. */
(function(){
  var KEY='olimp_cookie_consent_v1';

  function getConsent(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
  function setConsent(maps){try{localStorage.setItem(KEY,JSON.stringify({maps:!!maps,ts:Date.now()}))}catch(e){}}

  /* --- stile --- */
  var css='\
#ck-banner{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:9999;max-width:440px;background:#fff;color:var(--ink,#051D34);border:1px solid #d2dce6;border-radius:14px;padding:1.3rem 1.4rem;box-shadow:0 14px 40px rgba(5,29,52,.28);font:400 .9rem/1.5 "Manrope",Arial,sans-serif}\
#ck-banner h2{font:700 1rem "Manrope",Arial,sans-serif;margin:0 0 .4rem;color:var(--ink,#051D34)}\
#ck-banner p{margin:0 0 1rem;color:#3c4f63;font-size:.85rem}\
#ck-banner .ck-btn{border:1.5px solid var(--ink,#051D34)}\
#ck-banner [data-ck=no]{background:#fff;color:var(--ink,#051D34)}\
#ck-banner [data-ck=no]:hover{background:var(--ice,#D5E3F2)}\
#ck-banner [data-ck=yes]{background:var(--ink,#051D34);color:#fff}\
#ck-banner [data-ck=yes]:hover{background:#1c3556;border-color:#1c3556}\
#ck-banner .ck-row{display:flex;gap:.6rem;flex-wrap:wrap}\
.ck-btn{flex:1 1 140px;border:0;border-radius:8px;padding:.75rem 1rem;font:700 .85rem "Manrope",Arial,sans-serif;cursor:pointer;background:var(--ice,#c9dcf5);color:var(--ink,#051D34)}\
.ck-btn:hover{background:#fff}\
.ck-btn:focus-visible,#ck-banner a:focus-visible{outline:2px solid currentColor;outline-offset:3px}\
#ck-banner a{color:var(--ink,#051D34);text-decoration:underline;white-space:nowrap}\
#ck-banner.ck-attn{animation:ckAttn .9s ease 2}\
@keyframes ckAttn{0%,100%{box-shadow:0 14px 40px rgba(5,29,52,.28)}50%{box-shadow:0 0 0 5px #aa372e,0 14px 40px rgba(5,29,52,.28)}}\
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

  /* Il modulo contatti si può inviare solo dopo aver accettato i cookie. */
  function syncPending(){var c=getConsent();document.documentElement.classList.toggle('ck-pending',!(c&&c.maps))}

  function choose(maps){setConsent(maps);closeBanner();apply();syncPending()}

  /* La finestra prende il nome del pulsante che la apre (es. «Gestisci cookie», «Gestione cookie»). */
  function openBanner(e){
    var t=(e&&e.currentTarget&&e.currentTarget.textContent.trim())||'Gestione cookie';
    var old=document.getElementById('ck-banner');
    if(old){old.querySelector('h2').textContent=t;old.classList.remove('ck-attn');void old.offsetWidth;old.classList.add('ck-attn');return}
    var b=document.createElement('div');
    b.id='ck-banner';b.setAttribute('role','region');b.setAttribute('aria-label','Cookie');
    b.innerHTML='<h2></h2><p>Usiamo solo cookie tecnici. La mappa di Google Maps ne aggiunge di terze parti: la carichiamo solo se accetti. <a href="privacy.html">Privacy e cookie</a></p><div class="ck-row"><button type="button" class="ck-btn" data-ck="no">Rifiuta</button><button type="button" class="ck-btn" data-ck="yes">Accetta</button></div>';
    b.querySelector('h2').textContent=t;
    b.querySelector('[data-ck=no]').addEventListener('click',function(){choose(false)});
    b.querySelector('[data-ck=yes]').addEventListener('click',function(){choose(true)});
    document.body.appendChild(b);padBody();
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
