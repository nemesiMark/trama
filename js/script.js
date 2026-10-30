(function(){
var h=document.querySelector('header'),nav=document.getElementById('nav'),b=document.querySelector('.burger');
function sc(){h.classList.toggle('solid',window.scrollY>40)}sc();window.addEventListener('scroll',sc,{passive:true});
b.addEventListener('click',function(){var o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o)});
var dropdowns=[].slice.call(nav.querySelectorAll('.dd'));
/* Su computer le voci sono centrate in spazi uguali: il menu a tendina parte dall'inizio della scritta. */
function alignDD(){var desk=matchMedia('(min-width:1101px)').matches,rem=parseFloat(getComputedStyle(document.documentElement).fontSize)||16;
[].slice.call(nav.querySelectorAll(':scope > ul > li.dd')).forEach(function(li){var a=li.querySelector(':scope > a'),ul=li.querySelector(':scope > ul');if(a&&ul)ul.style.left=desk?(a.offsetLeft-1.2*rem)+'px':''})}
alignDD();window.addEventListener('resize',alignDD);window.addEventListener('load',alignDD);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(alignDD);
dropdowns.forEach(function(item){
var toggle=item.querySelector(':scope > a, :scope > button');
function setOpen(open){item.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open))}
toggle.setAttribute('aria-expanded','false');
toggle.addEventListener('click',function(e){if(toggle.tagName==='BUTTON'||matchMedia('(max-width:1100px)').matches||matchMedia('(hover:none)').matches){e.preventDefault();setOpen(!item.classList.contains('open'))}});
item.addEventListener('keydown',function(e){if(e.key==='Escape'){setOpen(false);toggle.focus()}});
});
nav.querySelectorAll('a[href]').forEach(function(a){a.addEventListener('click',function(){if(!a.matches('.dd > a')){nav.classList.remove('open');b.setAttribute('aria-expanded','false');dropdowns.forEach(function(item){item.classList.remove('open');item.querySelector(':scope > a, :scope > button').setAttribute('aria-expanded','false')})}})});
/* Effetto «Sipario» (escluso il footer): titoli, testi, foto e riquadri salgono dal basso, come da dietro un bordo, quando entrano nello schermo. */
(function(){
var R=document.documentElement;function unpre(){R.classList.remove('fx-pre')}
if(matchMedia('(prefers-reduced-motion: reduce)').matches||!window.requestAnimationFrame)return unpre();
var sel='main h1, main h2, main h3, main .eyebrow, main p, main figure, main li, main form, main .btn, main .cta-go, main .stat, main .map';
/* Riquadri (schede, card, formati): salgono per primi, poi il loro contenuto elemento per elemento. */
var boxSel='main article, main .card, main .download-card, main .sec-head';
/* La foto della home (immagini che scorrono) resta ferma: si vede subito, senza sfondo blu. */
var skip=function(e){return e.closest('.hero-slideshow,.hero-slides,.hero-controls')};
var boxes=[].slice.call(document.querySelectorAll(boxSel)).filter(function(e){return !skip(e)&&!e.parentElement.closest(boxSel)});
var items=[].slice.call(document.querySelectorAll(sel)).filter(function(e){return !e.parentElement.closest(sel)&&!skip(e)});
var els=boxes.concat(items).sort(function(a,b){return a===b?0:(a.compareDocumentPosition(b)&4?-1:1)});
if(!els.length)return unpre();
boxes.forEach(function(e){e.classList.add('fx','fxb')});
items.forEach(function(e){
  e.classList.add('fx');
  var d=getComputedStyle(e).display;if(/flex|grid|none/.test(d))return;
  var w=document.createElement('span');w.className='fxi';
  if(e.matches('.ph'))w.classList.add('fxi-ph');else if(/inline/.test(d))w.style.display='inline-block';
  while(e.firstChild)w.appendChild(e.firstChild);e.appendChild(w);e.classList.add('fxw');
});
/* Foto della home: sale al suo posto partendo un po' più in basso e ingrandita, così riempie sempre il riquadro (niente sfondo blu). */
var hs=document.querySelector('.hero-slideshow .hero-slides');
if(hs){hs.classList.add('hs-pre');requestAnimationFrame(function(){requestAnimationFrame(function(){hs.classList.add('hs-in')})})}
R.classList.add('fx-on');unpre();
/* Elementi già visibili all'apertura: partono dopo un attimo, uno dopo l'altro, più distanziati. */
var pending=els.slice(),ticking=false,first=true;
function check(){
  ticking=false;var vh=window.innerHeight,k=0,end=window.scrollY+vh>=document.documentElement.scrollHeight-4;
  pending=pending.filter(function(e){
    var r=e.getBoundingClientRect();
    if(r.top<(end?vh:vh*0.92)&&r.bottom>0){
      var delay=first?120+Math.min(k++,10)*100:Math.min(k++,8)*80;e.style.setProperty('--fx-d',delay+'ms');e.classList.add('in');
      /* Safari (iPhone) non carica le foto «lazy» finché sono nascoste dal Sipario: le carica subito quando l'elemento parte. */
      [].forEach.call(e.querySelectorAll('img[loading="lazy"]'),function(i){i.loading='eager'});
      setTimeout(function(){e.classList.add('fx-done');if(!e.classList.contains('fxw')){e.classList.remove('fx','fxb','in','fx-done');e.style.removeProperty('--fx-d')}},delay+1100);return false}
    return true});
  first=false;
  if(!pending.length){document.removeEventListener('scroll',onScroll,true);window.removeEventListener('resize',onScroll)}
}
function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(check)}}
document.addEventListener('scroll',onScroll,{passive:true,capture:true});window.addEventListener('resize',onScroll);window.addEventListener('orientationchange',onScroll);
requestAnimationFrame(function(){requestAnimationFrame(check)});setTimeout(check,60);window.addEventListener('load',check);
})();
/* Numeri di Chi siamo: salgono da zero quando la striscia entra nello schermo. */
(function(){
/* Anni di attività: calcolati dall'anno di fondazione. */
[].slice.call(document.querySelectorAll('.stat-num[data-since]')).forEach(function(el){var y=new Date().getFullYear()-(+el.getAttribute('data-since'));el.setAttribute('data-count',y);el.textContent=y;var sr=el.parentNode.querySelector('.sr-only');if(sr)sr.textContent=y+' anni di attività'});
var nums=[].slice.call(document.querySelectorAll('.stat-num[data-count]'));
if(!nums.length||matchMedia('(prefers-reduced-motion: reduce)').matches||!window.requestAnimationFrame)return;
function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
nums.forEach(function(el){el.textContent=fmt(0)});
var so=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;so.unobserve(e.target);
var el=e.target,to=+el.getAttribute('data-count'),t0=null,dur=2000;
function step(t){if(!t0)t0=t;var k=Math.min((t-t0)/dur,1),v=1-Math.pow(1-k,3);el.textContent=fmt(Math.round(to*v));if(k<1)requestAnimationFrame(step)}
requestAnimationFrame(step)})},{threshold:.5});
nums.forEach(function(el){so.observe(el)});
})();
/* Foto mancante: si mostra l'immagine provvisoria indicata in data-fallback, altrimenti si nasconde. */
document.querySelectorAll('.ph img').forEach(function(i){function miss(){var fb=i.getAttribute('data-fallback');if(fb&&i.getAttribute('src')!==fb)i.src=fb;else i.style.display='none'}
i.addEventListener('error',miss);if(i.complete&&!i.naturalWidth&&i.getAttribute('src'))miss()});
/* Finestra di conferma con check verde. */
function openThanks(title,text){
var last=document.activeElement,m=document.createElement('div');
m.className='thanks';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-labelledby','thanks-t');
m.innerHTML='<div class="thanks-box"><div class="thanks-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><h2 id="thanks-t"></h2><p></p><button type="button" class="btn">Chiudi</button></div>';
m.querySelector('h2').textContent=title;m.querySelector('p').textContent=text;
document.body.appendChild(m);document.body.style.overflow='hidden';
var b=m.querySelector('button');b.focus();
function key(e){if(e.key==='Escape')close();else if(e.key==='Tab'){e.preventDefault();b.focus()}}
function close(){document.removeEventListener('keydown',key);m.remove();document.body.style.overflow='';if(last&&last.focus)last.focus()}
b.addEventListener('click',close);m.addEventListener('click',function(e){if(e.target===m)close()});
document.addEventListener('keydown',key);
}
/* Area download: il file viene scaricato dalla pagina, così si sa se è arrivato e si mostra la conferma. */
document.querySelectorAll('a.btn[download]').forEach(function(a){
var aText=a.textContent,st=document.createElement('p');st.className='form-msg';st.setAttribute('role','status');st.hidden=true;a.after(st);
/* Avviso sotto il pulsante: verde se il download è riuscito, rosso se no. */
function show(ok,text){st.textContent=text;st.classList.toggle('ok',ok);st.classList.toggle('err',!ok);st.hidden=false}
a.addEventListener('click',function(e){
var done=function(name){show(true,'Download completato.');openThanks('Download completato','Il file «'+name+'» è stato scaricato sul tuo dispositivo.')};
/* Sito aperto dal computer o browser vecchio: download normale, poi la conferma. */
if(location.protocol==='file:'||!window.fetch||!window.URL){setTimeout(function(){done(a.getAttribute('download')||'')},300);return}
e.preventDefault();if(a.getAttribute('aria-busy'))return;
a.setAttribute('aria-busy','true');a.textContent='Download in corso…';st.hidden=true;
fetch(a.href).then(function(r){if(!r.ok)throw new Error('dl');return r.blob()})
.then(function(blob){
var u=URL.createObjectURL(blob),t=document.createElement('a');t.href=u;t.download=a.getAttribute('download')||'';
document.body.appendChild(t);t.click();t.remove();setTimeout(function(){URL.revokeObjectURL(u)},10000);
done(t.download)})
.catch(function(){show(false,'Download non riuscito: riprova tra poco oppure contattaci al telefono.')})
.then(function(){a.removeAttribute('aria-busy');a.textContent=aText});
});
});
var f=document.getElementById('contact-form');
if(f){
var sb=f.querySelector('button[type=submit]'),sbText=sb.textContent;
var msg=document.createElement('p');msg.className='form-msg';msg.setAttribute('role','status');msg.hidden=true;f.appendChild(msg);
function resetForm(){f.reset();msg.hidden=true;sb.disabled=false;sb.textContent=sbText}
/* Invio senza lasciare la pagina: ringraziamento in italiano al posto del modulo. */
f.addEventListener('submit',function(e){
e.preventDefault();
/* Finché non si accettano i cookie l'invio resta bloccato: si apre la finestra dei cookie (che lampeggia). */
if(document.documentElement.classList.contains('ck-pending')){if(window.olimpOpenCookies)window.olimpOpenCookies();var ck=document.getElementById('ck-banner');if(ck){var cb=ck.querySelector('button');if(cb)cb.focus()}return}
sb.disabled=true;sb.textContent='Invio in corso…';msg.hidden=true;msg.classList.remove('err');
fetch(f.action,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(f)})
.then(function(r){return r.json().then(function(d){if(!r.ok||d.success===false)throw new Error('send')})})
.then(function(){resetForm();openThanks('Grazie!','La tua richiesta è stata inviata, ti risponderemo il prima possibile.')})
.catch(function(){msg.textContent='Non è stato possibile inviare la richiesta. Riprova tra poco oppure contattaci al telefono.';msg.classList.add('err');msg.hidden=false;sb.disabled=false;sb.textContent=sbText});
});
window.addEventListener('pageshow',function(){resetForm();setTimeout(resetForm,0)});
}
var y=document.getElementById('y');if(y)y.textContent=new Date().getFullYear();
/* Home: la voce Chi siamo / Dove / Contatti diventa bordeaux mentre si è nella sua sezione. */
if(document.body.classList.contains('home-page')){
var spy=['azienda','dove','contatti'].map(function(id){return{sec:document.getElementById(id),link:nav.querySelector('a[href="index.html#'+id+'"]')}}).filter(function(o){return o.sec&&o.link});
var spyTick=false;
function spyUpdate(){spyTick=false;var mid=window.innerHeight*.4;spy.forEach(function(o){var r=o.sec.getBoundingClientRect();o.link.classList.toggle('on',r.top<=mid&&r.bottom>mid)})}
window.addEventListener('scroll',function(){if(!spyTick){spyTick=true;requestAnimationFrame(spyUpdate)}},{passive:true});
window.addEventListener('resize',spyUpdate);spyUpdate();
}
})();
/* Lightbox: clic su una foto = schermo intero */
(function(){
if(document.body.classList.contains('home-page'))return;
/* La foto accanto alla descrizione (.split e .page-intro) non si ingrandisce. */
document.querySelectorAll('.split > .ph, .page-intro > .ph').forEach(function(f){f.classList.add('no-zoom')});
var imgs=[].slice.call(document.querySelectorAll('.ph img')).filter(function(i){return !i.closest('a,.no-zoom')});if(!imgs.length)return;
var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Foto a schermo intero');
lb.innerHTML='<button class="lb-x" aria-label="Chiudi">&times;</button><button class="lb-p" aria-label="Foto precedente">&#8249;</button><img alt=""><button class="lb-n" aria-label="Foto successiva">&#8250;</button><div class="lb-cap" aria-live="polite"><span class="lb-line"></span><strong class="lb-name"></strong></div><div class="lb-strip" aria-label="Tutte le foto"></div>';
document.body.appendChild(lb);
var im=lb.querySelector('img'),x=lb.querySelector('.lb-x'),cur=0,last=null;
/* Didascalia: nome della pagina e nome del modello (dalla scritta sulla foto o dalla sua descrizione). */
var h1=document.querySelector('main h1'),lineName=h1?h1.textContent.trim():'',capLine=lb.querySelector('.lb-line'),capName=lb.querySelector('.lb-name');
capLine.textContent=lineName;
var cap=lb.querySelector('.lb-cap');
/* Fascia con tutte le foto sotto quella ingrandita: si scorre in orizzontale, la miniatura attiva è evidenziata. */
var strip=lb.querySelector('.lb-strip'),thumbs=[];
if(imgs.length>1){lb.classList.add('has-strip');
imgs.forEach(function(el,i){var t=document.createElement('button');t.type='button';t.className='lb-th';t.setAttribute('aria-label','Mostra: '+(nameOf(el)||el.alt));t.innerHTML='<img alt="" loading="lazy">';t.firstChild.src=el.getAttribute('src');t.dataset.i=i;strip.appendChild(t);thumbs.push(t)});
strip.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){strip.scrollLeft+=e.deltaY;e.preventDefault()}},{passive:false})}
function markThumb(now){thumbs.forEach(function(t,k){var on=k===cur;t.classList.toggle('on',on);t.setAttribute('aria-current',on?'true':'false');t.style.display=imgs[k].style.display==='none'?'none':''});
var a=thumbs[cur];if(a){var l=a.offsetLeft-(strip.clientWidth-a.offsetWidth)/2;strip.scrollTo({left:l,behavior:now?'auto':'smooth'})}}
/* La didascalia sta a destra della foto, in alto; se lo spazio non basta va sotto la foto. */
function placeCap(){if(!lb.classList.contains('on'))return;var r=im.getBoundingClientRect();if(!r.width)return;
var gap=Math.max(24,innerWidth*.025),avail=innerWidth-r.right-gap-72;cap.style.bottom='auto';
if(avail>=220){cap.style.left=(r.right+gap)+'px';cap.style.top=r.top+'px';cap.style.maxWidth=Math.min(avail,420)+'px'}
else{cap.style.left=r.left+'px';cap.style.top=(r.bottom+14)+'px';cap.style.maxWidth=r.width+'px';
var lim=lb.classList.contains('has-strip')?strip.getBoundingClientRect().top:innerHeight,over=r.bottom+14+cap.offsetHeight+12-lim;
if(over>1&&r.height-over>120){im.style.maxHeight=Math.floor(r.height-over)+'px';requestAnimationFrame(placeCap);return}}
cap.style.visibility='visible'}
im.addEventListener('load',placeCap);window.addEventListener('resize',function(){im.style.maxHeight='';placeCap()});
function nameOf(el){var f=el.closest('figure'),c=f&&f.querySelector('figcaption, h3');if(c)return c.textContent.trim();var m=(el.alt||'').match(/^(Modello .+?) dell[ae] /);return m?m[1]:''}
if(imgs.length<2){lb.querySelector('.lb-p').style.display=lb.querySelector('.lb-n').style.display='none'}
function show(i,d){for(var k=0;k<imgs.length;k++){cur=(i+imgs.length)%imgs.length;if(imgs[cur].style.display!=='none')break;i=cur+(d||1)}
im.style.maxHeight='';im.src=imgs[cur].src.replace(/w=\d+/,'w=1800');im.alt=imgs[cur].alt;var n=nameOf(imgs[cur]);capName.textContent=n;capName.style.display=n?'':'none';if(im.complete)requestAnimationFrame(placeCap);markThumb()}
function open(i){last=document.activeElement;show(i,1);lb.classList.add('on');document.body.style.overflow='hidden';x.focus();requestAnimationFrame(function(){placeCap();markThumb(true)})}
function close(){lb.classList.remove('on');document.body.style.overflow='';im.removeAttribute('src');if(last&&last.focus)last.focus()}
imgs.forEach(function(el,i){
el.addEventListener('click',function(e){e.preventDefault();open(i)});
var f=el.closest('figure')||el.parentNode;if(!f.closest('a')){f.tabIndex=0;f.setAttribute('role','button');f.setAttribute('aria-label','Apri la foto a schermo intero: '+el.alt);f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i)}})}
});
lb.addEventListener('click',function(e){var th=e.target.closest('.lb-th');if(th){show(+th.dataset.i,1);return}if(e.target.closest('.lb-strip'))return;if(e.target.classList.contains('lb-p')){show(cur-1,-1)}else if(e.target.classList.contains('lb-n')){show(cur+1,1)}else{close()}});
document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Tab'){var buttons=[].slice.call(lb.querySelectorAll('button')).filter(function(b){return b.style.display!=='none'});var first=buttons[0],end=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus()}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus()}}else if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(cur-1,-1);else if(e.key==='ArrowRight')show(cur+1,1)});
})();

/* Rotazione delle tre immagini della home. */
(function(){
var hero=document.querySelector('.home-page .hero');if(!hero)return;
var slides=[].slice.call(hero.querySelectorAll('.hero-slide')),dots=[].slice.call(hero.querySelectorAll('.hero-dot')),pause=hero.querySelector('.hero-pause');
var index=0,timer=null,reduced=matchMedia('(prefers-reduced-motion: reduce)'),paused=reduced.matches;
function show(n){index=n;slides.forEach(function(s,i){var active=i===n;s.classList.toggle('is-active',active);s.setAttribute('aria-hidden',String(!active));dots[i].setAttribute('aria-pressed',String(active))})}
function stop(){clearInterval(timer);timer=null}
function start(){stop();if(!paused&&!document.hidden)timer=setInterval(function(){show((index+1)%slides.length)},5000)}
function label(){pause.textContent=paused?'Riprendi':'Pausa';pause.setAttribute('aria-label',paused?'Avvia rotazione immagini':'Ferma rotazione immagini')}
dots.forEach(function(dot,i){dot.addEventListener('click',function(){show(i);start()})});
pause.addEventListener('click',function(){paused=!paused;label();start()});
hero.addEventListener('focusin',stop);hero.addEventListener('focusout',function(e){if(!hero.contains(e.relatedTarget))start()});
document.addEventListener('visibilitychange',start);
reduced.addEventListener('change',function(e){paused=e.matches;label();start()});
label();start();
})();

// ======================================================
// Punto 1: Blocca Tasto Destro e Scorciatoie da Tastiera
// ======================================================

// Disabilita il menu contestuale (tasto destro) in tutta la pagina
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

// Disabilita combinazioni per DevTools e Salvataggio (F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I/J/C)
document.addEventListener('keydown', function (e) {
  if (
    e.key === 'F12' ||
    ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) ||
    ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) ||
    ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key))
  ) {
    e.preventDefault();
  }
});
