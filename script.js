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
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
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
var done=function(name){show(true,'Download completato: il file «'+name+'» è stato scaricato.');openThanks('Download completato','Il file «'+name+'» è stato scaricato sul tuo dispositivo.')};
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
/* Finché non si accettano i cookie l'invio resta bloccato: si apre ed evidenzia il banner. */
if(document.documentElement.classList.contains('ck-pending')){if(window.olimpOpenCookies)window.olimpOpenCookies();var ck=document.getElementById('ck-banner');if(ck){ck.classList.remove('ck-attn');void ck.offsetWidth;ck.classList.add('ck-attn');var cb=ck.querySelector('button');if(cb)cb.focus()}return}
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
var imgs=[].slice.call(document.querySelectorAll('.ph img')).filter(function(i){return !i.closest('a,.no-zoom')});if(!imgs.length)return;
var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Foto a schermo intero');
lb.innerHTML='<button class="lb-x" aria-label="Chiudi">&times;</button><button class="lb-p" aria-label="Foto precedente">&#8249;</button><img alt=""><button class="lb-n" aria-label="Foto successiva">&#8250;</button>';
document.body.appendChild(lb);
var im=lb.querySelector('img'),x=lb.querySelector('.lb-x'),cur=0,last=null;
if(imgs.length<2){lb.querySelector('.lb-p').style.display=lb.querySelector('.lb-n').style.display='none'}
function show(i,d){for(var k=0;k<imgs.length;k++){cur=(i+imgs.length)%imgs.length;if(imgs[cur].style.display!=='none')break;i=cur+(d||1)}
im.src=imgs[cur].src.replace(/w=\d+/,'w=1800');im.alt=imgs[cur].alt}
function open(i){last=document.activeElement;show(i,1);lb.classList.add('on');document.body.style.overflow='hidden';x.focus()}
function close(){lb.classList.remove('on');document.body.style.overflow='';im.removeAttribute('src');if(last&&last.focus)last.focus()}
imgs.forEach(function(el,i){
el.addEventListener('click',function(e){e.preventDefault();open(i)});
var f=el.parentNode;if(!f.closest('a')){f.tabIndex=0;f.setAttribute('role','button');f.setAttribute('aria-label','Apri la foto a schermo intero: '+el.alt);f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i)}})}
});
lb.addEventListener('click',function(e){if(e.target.classList.contains('lb-p')){show(cur-1,-1)}else if(e.target.classList.contains('lb-n')){show(cur+1,1)}else{close()}});
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
