// car.js
(function(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  function makeDataFavicon(letter, color="#6366f1"){
    const c = document.createElement("canvas");
    c.width = 64; c.height = 64;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#0b0b0c"; ctx.fillRect(0,0,64,64);
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(32,32,28,0,Math.PI*2); ctx.fill();
    ctx.font = "bold 36px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "white"; ctx.fillText(letter, 32, 36);
    return c.toDataURL("image/png");
  }
  function setFavicon(urlOrNull, letterFallback="M", color="#6366f1"){
    let link = document.querySelector('link#favicon[rel="icon"]');
    if(!link){ link = document.createElement("link"); link.id="favicon"; link.rel="icon"; link.type="image/png"; document.head.appendChild(link); }
    link.href = urlOrNull || makeDataFavicon(letterFallback, color);
  }

  const cars = window.CARS || [];
  const car = cars.find(c => c.id === id);

  // favorites storage (same key as index page)
  const FAV_KEY = "fav-cars";
  function getFavs(){ try{ return JSON.parse(localStorage.getItem(FAV_KEY)||"[]"); }catch(e){return [];} }
  function saveFavs(f){ localStorage.setItem(FAV_KEY, JSON.stringify(f)); }

  // DOM elements
  const title = document.getElementById('title');
  const subtitle = document.getElementById('subtitle');
  const name = document.getElementById('name');
  const year = document.getElementById('year');
  const desc = document.getElementById('desc');
  const hp = document.getElementById('hp');
  const speed = document.getElementById('speed');
  const hero = document.getElementById('hero');
  const favBtn = document.getElementById('fav');
  const yearFooter = document.getElementById('yearFooter');

  yearFooter.textContent = new Date().getFullYear();

  if(!car){
    title.textContent = "Car not found";
    subtitle.textContent = "Check the link and try again.";
    document.querySelector('main').innerHTML = '<p>Sorry, we couldn’t find that car.</p>';
    return;
  }

  // Base content
  document.title = `${car.brand} ${car.model} — Details`;
  title.textContent = `${car.brand} ${car.model}`;
  subtitle.textContent = `${car.brand}`;
  name.innerHTML = `${car.brand} <span class="muted">${car.model}</span>`;
  year.textContent = car.year;
  desc.textContent = car.description || "";
  hp.textContent = car.horsepower;
  speed.textContent = car.topSpeedMph;
  hero.src = car.image;
  hero.alt = `${car.brand} ${car.model}`;

  const map = window.BRAND_ICONS || {};
  const brand = car.brand || "M";
  const accent =
    (car.details && (car.details.accent || car.details.color)) ||
    getComputedStyle(document.documentElement).getPropertyValue('--accent') ||
    "#6366f1";
  const iconUrl = map[brand] || null;     // requires BRAND_ICONS from cars-data.js
  setFavicon(iconUrl, brand[0], (accent||"").toString().trim() || "#6366f1");

  // Favorite state
  const favs = getFavs();
  const isFav = favs.includes(car.id);
  favBtn.classList.toggle('active', isFav);
  favBtn.textContent = isFav ? '★ Favorited' : '☆ Favorite';
  favBtn.setAttribute('aria-pressed', String(isFav));
  favBtn.addEventListener('click', ()=>{
    const list = getFavs();
    const i = list.indexOf(car.id);
    if(i>=0) list.splice(i,1); else list.push(car.id);
    saveFavs(list);
    const nowFav = list.includes(car.id);
    favBtn.classList.toggle('active', nowFav);
    favBtn.textContent = nowFav ? '★ Favorited' : '☆ Favorite';
    favBtn.setAttribute('aria-pressed', String(nowFav));
  });

  // ----- Unique sections (optional) -----
  const d = car.details || {};
  const root = document.documentElement;

  // Allow per-car accent color (your CSS uses --accent)
  if (d.accent) root.style.setProperty('--accent', d.accent);

  function show(el, on){ if(!el) return; el.style.display = on ? "" : "none"; }

  // Overview
  const overviewSec = document.getElementById('overview');
  const longP = document.getElementById('long');
  if (d.long) { longP.textContent = d.long; show(overviewSec, true); } else show(overviewSec, false);

  // Specs
  const specsSec = document.getElementById('specs');
  const specsGrid = document.getElementById('specsGrid');
  if (d.specs && Object.keys(d.specs).length){
    specsGrid.innerHTML = '';
    Object.entries(d.specs).forEach(([k,v])=>{
      const div = document.createElement('div');
      div.className = 'spec';
      div.innerHTML = `<span class="k">${k}</span><span class="v">${v}</span>`;
      specsGrid.appendChild(div);
    });
    show(specsSec, true);
  } else show(specsSec, false);

  // Gallery
  const gallerySec = document.getElementById('gallery');
  const galleryGrid = document.getElementById('galleryGrid');
  if (Array.isArray(d.gallery) && d.gallery.length){
    galleryGrid.innerHTML = '';
    d.gallery.forEach(src=>{
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${car.brand} ${car.model} gallery`;
      galleryGrid.appendChild(img);
    });
    show(gallerySec, true);
  } else show(gallerySec, false);

  // Facts
  const factsSec = document.getElementById('facts');
  const factsList = document.getElementById('factsList');
  if (Array.isArray(d.facts) && d.facts.length){
    factsList.innerHTML = '';
    d.facts.forEach(t=>{
      const li = document.createElement('li');
      li.textContent = t;
      factsList.appendChild(li);
    });
    show(factsSec, true);
  } else show(factsSec, false);

  // Links
  const linksSec = document.getElementById('links');
  const linkChips = document.getElementById('linkChips');
  if (Array.isArray(d.links) && d.links.length){
    linkChips.innerHTML = '';
    d.links.forEach(l=>{
      const a = document.createElement('a');
      a.className = 'chip';
      a.href = l.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = l.label;
      linkChips.appendChild(a);
    });
    show(linksSec, true);
  } else show(linksSec, false);

  // Video
  const videoSec = document.getElementById('video');
  const frame = document.getElementById('videoFrame');
  if (d.video){
    frame.src = d.video + (d.video.includes('?') ? '&rel=0' : '?rel=0');
    show(videoSec, true);
  } else show(videoSec, false);
})();
