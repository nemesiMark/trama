(function(){
var h=document.querySelector('header'),nav=document.getElementById('nav'),b=document.querySelector('.burger');
function sc(){h.classList.toggle('solid',window.scrollY>40)}sc();window.addEventListener('scroll',sc,{passive:true});
b.addEventListener('click',function(){var o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o)});
var dd=document.querySelector('.dd>a');
dd.addEventListener('click',function(e){if(matchMedia('(max-width:900px)').matches||matchMedia('(hover:none)').matches){e.preventDefault();dd.parentNode.classList.toggle('open')}});
nav.querySelectorAll('a[href]').forEach(function(a){a.addEventListener('click',function(){if(a!==dd)nav.classList.remove('open')})});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
document.querySelectorAll('.ph img').forEach(function(i){i.addEventListener('error',function(){i.style.display='none'})});
var f=document.getElementById('contact-form');
if(f)f.addEventListener('submit',function(){var s=f.querySelector('button');s.disabled=true;s.textContent='Invio in corso…'});
var y=document.getElementById('y');if(y)y.textContent=new Date().getFullYear();
})();
