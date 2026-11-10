/* Olimp – mappa animata nella sezione «Dove siamo» (home).
   Si parte dalla Terra vista dallo spazio e si scende in verticale fino alla sede, su foto satellitari.
   Verso la fine compaiono il contorno di Canicattì e il suo nome; all'arrivo il segnaposto e il nome del viale.
   Si carica solo dopo il consenso ai cookie (vedi cookie.js) e solo quando la sezione si avvicina. */
(function(){
  var KEY='olimp_cookie_consent_v1';
  var LIB_JS='js/maplibre-gl-5.6.0.js', LIB_CSS='css/maplibre-gl-5.6.0.css';

  // Posizione della sede (lon, lat). Per spostare il segnaposto basta cambiare questi due numeri.
  var SEDE=[13.84239, 37.35235];
  // Confine del comune di Canicattì (OpenStreetMap) e punto dove scrivere il nome
  var CITTA={ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[13.76102,37.35055],[13.76854,37.3451],[13.77135,37.34383],[13.77205,37.34192],[13.77206,37.3393],[13.77643,37.33919],[13.78929,37.34165],[13.79753,37.34058],[13.80606,37.33814],[13.80895,37.33817],[13.8149,37.33567],[13.82112,37.3362],[13.82187,37.33453],[13.82313,37.33393],[13.82748,37.33342],[13.82807,37.33291],[13.82984,37.3287],[13.83359,37.32768],[13.83459,37.32578],[13.83399,37.32443],[13.83274,37.32325],[13.83481,37.32271],[13.83649,37.32163],[13.83815,37.31862],[13.83906,37.31805],[13.8446,37.32112],[13.84825,37.32458],[13.8487,37.32427],[13.84877,37.32257],[13.85579,37.32496],[13.8614,37.32505],[13.86439,37.32595],[13.86661,37.32833],[13.8699,37.32921],[13.87709,37.33394],[13.88357,37.33512],[13.89776,37.34091],[13.90335,37.34771],[13.90263,37.34829],[13.89689,37.34941],[13.89544,37.35191],[13.89351,37.3534],[13.89174,37.35423],[13.88868,37.35454],[13.88405,37.35787],[13.88212,37.35826],[13.88473,37.35812],[13.88362,37.35889],[13.88042,37.35958],[13.88187,37.35967],[13.88475,37.36448],[13.88584,37.3658],[13.88784,37.36706],[13.8886,37.36889],[13.89165,37.37022],[13.88883,37.37203],[13.88749,37.37183],[13.88523,37.37336],[13.88811,37.37586],[13.88833,37.37557],[13.89044,37.37672],[13.89007,37.37741],[13.89051,37.37911],[13.89452,37.37866],[13.89666,37.37898],[13.89876,37.37788],[13.90131,37.37997],[13.9026,37.382],[13.90419,37.38243],[13.90577,37.38413],[13.9091,37.38552],[13.91046,37.38673],[13.90739,37.38767],[13.90667,37.38927],[13.9055,37.39012],[13.90712,37.39378],[13.90623,37.39519],[13.90279,37.39718],[13.90207,37.39872],[13.89931,37.3988],[13.89919,37.40104],[13.8968,37.40173],[13.89543,37.40355],[13.8731,37.40461],[13.86527,37.40278],[13.86138,37.40343],[13.86091,37.40517],[13.86001,37.40549],[13.85868,37.40721],[13.85893,37.40861],[13.85736,37.40983],[13.85579,37.4124],[13.85378,37.41441],[13.85152,37.41841],[13.84793,37.42121],[13.84622,37.42478],[13.8448,37.42648],[13.8445,37.42783],[13.8474,37.43022],[13.84757,37.43411],[13.84891,37.43554],[13.84848,37.43663],[13.84605,37.43796],[13.84062,37.43788],[13.83879,37.43484],[13.83721,37.43372],[13.83526,37.43479],[13.83326,37.43733],[13.8328,37.43632],[13.83074,37.43548],[13.82914,37.43386],[13.82747,37.43324],[13.82614,37.43175],[13.8247,37.42875],[13.82333,37.42829],[13.82273,37.42738],[13.82175,37.42698],[13.82154,37.42448],[13.82012,37.42272],[13.82031,37.41949],[13.81889,37.41647],[13.81935,37.41595],[13.82006,37.41599],[13.82106,37.41485],[13.8195,37.41332],[13.81826,37.41301],[13.81744,37.41187],[13.81568,37.4113],[13.8165,37.41003],[13.81613,37.40867],[13.81739,37.40776],[13.81621,37.40541],[13.81426,37.40325],[13.81534,37.40198],[13.81176,37.39952],[13.81169,37.39836],[13.81011,37.39602],[13.8057,37.39353],[13.80484,37.39177],[13.80047,37.39163],[13.79912,37.39065],[13.79909,37.39012],[13.79696,37.39049],[13.79368,37.38949],[13.79203,37.38982],[13.79096,37.38919],[13.7895,37.38678],[13.78678,37.3868],[13.78411,37.38593],[13.78243,37.38439],[13.78179,37.38268],[13.7802,37.38087],[13.77989,37.37908],[13.77722,37.37763],[13.77658,37.37615],[13.775,37.37667],[13.76989,37.37617],[13.76805,37.37249],[13.76646,37.37131],[13.76676,37.36976],[13.76625,37.36731],[13.76323,37.36143],[13.76648,37.35682],[13.76649,37.35595],[13.7632,37.35198],[13.76102,37.35055]]] } };
  var CENTRO_CITTA=[13.85036, 37.35894];
  // Punto del viale dove scrivere il suo nome, poco a sinistra della sede, lungo la strada
  var NOME_VIALE=[13.84179, 37.35221];
  // La scritta «Olimp» sul segnaposto apre la sede in Google Maps
  var GMAPS='https://www.google.com/maps/search/?api=1&query=Viale+della+Vittoria+111+92024+Canicatt%C3%AC+AG+Italy';
  var PARTENZA={center:[10,25], zoom:1.1, pitch:0, bearing:0};

  var box, started=false, map=null, pin=null, visible=false, loaded=false;

  function consent(){try{var c=JSON.parse(localStorage.getItem(KEY));return !!(c&&c.maps)}catch(e){return false}}

  function loadLib(cb){
    if(window.maplibregl){cb();return}
    var l=document.createElement('link');l.rel='stylesheet';l.href=LIB_CSS;document.head.appendChild(l);
    var s=document.createElement('script');s.src=LIB_JS;s.onload=cb;document.head.appendChild(s);
  }

  // Andamento della discesa: partenza morbida, frenata finale breve
  function bezier(x1,y1,x2,y2){
    return function(t){
      var lo=0,hi=1,u=t;
      for(var i=0;i<30;i++){u=(lo+hi)/2;var x=3*(1-u)*(1-u)*u*x1+3*(1-u)*u*u*x2+u*u*u;if(x<t)lo=u;else hi=u}
      return 3*(1-u)*(1-u)*u*y1+3*(1-u)*u*u*y2+u*u*u;
    };
  }
  var andatura=bezier(0.25,0.1,0.6,1);

  /* Precarica le foto satellitari attorno alla sede, a ogni livello della discesa:
     durante il volo arrivano dalla memoria del browser e la discesa resta fluida.
     Si ferma da sola dopo qualche secondo, così l'animazione non aspetta troppo. */
  var SAT='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/';
  function tileXY(lon,lat,z){
    var n=Math.pow(2,z),r=lat*Math.PI/180;
    return [Math.floor((lon+180)/360*n),Math.floor((1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*n)];
  }
  function prefetch(done){
    var w=box.clientWidth,h=box.clientHeight,list=[],finished=false;
    var zMax=Math.round(zoomArrivo())+1;
    for(var z=4;z<=zMax;z++){
      var t=tileXY(SEDE[0],SEDE[1],z),n=Math.pow(2,z);
      var rx=Math.min(Math.ceil(w/256/2)+1,n),ry=Math.min(Math.ceil(h/256/2)+1,n);
      for(var dy=-ry;dy<=ry;dy++)for(var dx=-rx;dx<=rx;dx++){
        var x=t[0]+dx,y=t[1]+dy;if(y<0||y>=n)continue;x=((x%n)+n)%n;
        list.push(SAT+z+'/'+y+'/'+x);
      }
    }
    function end(){if(!finished){finished=true;done()}}
    if(!window.fetch){end();return}
    setTimeout(end,4000);
    var i=0,active=0;
    function next(){
      if(finished&&active===0)return;
      while(active<8&&i<list.length){
        active++;
        fetch(list[i++],{mode:'cors',credentials:'same-origin'}).catch(function(){}).then(function(){active--;if(i>=list.length&&active===0)end();else next()});
      }
    }
    next();
  }

  function build(){
    var el=box.querySelector('.map-canvas');
    map=new maplibregl.Map({
      container:el,
      style:{
        version:8,
        projection:{type:'globe'},
        glyphs:'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
        sky:{'atmosphere-blend':['interpolate',['linear'],['zoom'],0,1,6,0.9,9,0]},
        sources:{
          sat:{type:'raster',tileSize:256,maxzoom:19,
               tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
               attribution:'Immagini © Esri, Maxar, Earthstar Geographics'},
          viale:{type:'geojson',data:{type:'Feature',properties:{nome:'Viale della Vittoria'},geometry:{type:'Point',coordinates:NOME_VIALE}}},
          citta:{type:'geojson',data:CITTA},
          nome:{type:'geojson',data:{type:'Feature',properties:{nome:'Canicattì'},geometry:{type:'Point',coordinates:CENTRO_CITTA}}}
        },
        layers:[
          {id:'sat',type:'raster',source:'sat',paint:{'raster-fade-duration':350}},
          // contorno della città: compare verso la fine della discesa
          {id:'citta-area',type:'fill',source:'citta',
           paint:{'fill-color':'#ffffff','fill-opacity':['interpolate',['linear'],['zoom'],7.5,0,9.5,0.14,12.5,0.14,14,0]}},
          {id:'citta-ombra',type:'line',source:'citta',
           paint:{'line-color':'rgba(5,29,52,.55)','line-width':6,'line-blur':3,'line-opacity':['interpolate',['linear'],['zoom'],7.5,0,9.5,1]}},
          {id:'citta-bordo',type:'line',source:'citta',
           paint:{'line-color':'#ffffff','line-width':['interpolate',['linear'],['zoom'],8,1.5,12,3],'line-opacity':['interpolate',['linear'],['zoom'],7.5,0,9.5,1]}},
          // scritta Canicattì: compare verso la fine, poi lascia il posto al viale
          {id:'citta-nome',type:'symbol',source:'nome',
           layout:{'text-field':['get','nome'],'text-font':['Noto Sans Bold'],'text-size':['interpolate',['linear'],['zoom'],8,18,12,30],
                   'text-letter-spacing':0.08,'text-allow-overlap':true},
           paint:{'text-color':'#ffffff','text-halo-color':'rgba(5,29,52,.85)','text-halo-width':2.5,
                  'text-opacity':['interpolate',['linear'],['zoom'],8,0,9.5,1,13.5,1,14.8,0]}},
          // nome del viale: compare solo all'arrivo
          {id:'viale',type:'symbol',source:'viale',
           layout:{visibility:'none','text-field':['get','nome'],'text-font':['Noto Sans Bold'],'text-size':15,'text-letter-spacing':0.04,
                   'text-rotate':-16,'text-rotation-alignment':'map','text-anchor':'top','text-offset':[0,0.9],'text-allow-overlap':true},
           paint:{'text-color':'#ffffff','text-halo-color':'rgba(5,29,52,.85)','text-halo-width':2}}
        ]
      },
      center:PARTENZA.center, zoom:PARTENZA.zoom, pitch:0, bearing:0, maxPitch:0,
      attributionControl:{compact:true},
      maxTileCacheSize:600,
      fadeDuration:300,
      cooperativeGestures:true,
      dragRotate:false, pitchWithRotate:false,
      locale:{
        'CooperativeGesturesHandler.WindowsHelpText':'Usa Ctrl + rotellina per ingrandire la mappa',
        'CooperativeGesturesHandler.MacHelpText':'Usa ⌘ + rotellina per ingrandire la mappa',
        'CooperativeGesturesHandler.MobileHelpText':'Usa due dita per muovere la mappa'
      }
    });
    map.touchZoomRotate.disableRotation();

    pin=document.createElement('div');
    pin.className='map-pin';
    pin.innerHTML='<div class="map-pin-in"><div class="ring"></div><div class="dot"></div><a class="label" href="'+GMAPS+'" target="_blank" rel="noopener noreferrer" title="Apri in Google Maps">Olimp</a></div>';
    new maplibregl.Marker({element:pin,anchor:'center'}).setLngLat(SEDE).addTo(map);

    map.on('load',function(){
      // Su schermi stretti i crediti restano chiusi (si aprono con la «i»)
      if(box.clientWidth<600){var a=box.querySelector('.maplibregl-ctrl-attrib');if(a)a.classList.remove('maplibregl-compact-show')}
      prefetch(function(){loaded=true;if(visible&&!started)play()});
    });
  }

  function arrive(){
    pin.classList.add('is-on');
    map.setLayoutProperty('viale','visibility','visible');
  }

  // Su telefono l'arrivo è un po' più largo, così si vede anche il nome del viale
  function zoomArrivo(){return box.clientWidth<600?16.4:17.2}

  function play(){
    if(!map||!loaded)return;
    started=true;
    map.stop();
    pin.classList.remove('is-on');
    map.setLayoutProperty('viale','visibility','none');
    map.jumpTo(PARTENZA);
    // Chi ha chiesto meno movimento vede subito l'arrivo
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){
      map.jumpTo({center:SEDE,zoom:zoomArrivo()});arrive();return;
    }
    setTimeout(function(){
      map.flyTo({center:SEDE,zoom:zoomArrivo(),duration:12000,curve:1.6,essential:true,easing:andatura});
      map.once('moveend',arrive);
    },1200);
  }

  function start(){
    box=document.querySelector('.map-anim');
    if(!box||box.getAttribute('data-ready'))return;
    if(!consent())return;
    box.setAttribute('data-ready','1');

    var replay=box.querySelector('.map-replay');
    if(replay)replay.addEventListener('click',play);

    // Prepara la mappa quando la sezione si avvicina, la fa partire quando è ben visibile
    if(!('IntersectionObserver' in window)){loadLib(build);visible=true;return}
    var near=new IntersectionObserver(function(es){
      if(es[0].isIntersecting){near.disconnect();loadLib(build)}
    },{rootMargin:'600px 0px'});
    near.observe(box);
    var seen=new IntersectionObserver(function(es){
      if(es[0].isIntersecting){visible=true;seen.disconnect();if(!started)play()}
    },{threshold:0.5});
    seen.observe(box);
  }

  // cookie.js la chiama quando si accettano i cookie
  window.olimpMappa=start;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
