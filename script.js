// app.js — My Favorite Cars (vanilla JS)

// ---- Editable data: put YOUR favorite cars here ----
const CARS = window.CARS || [];

// ---- App state ----
const state = {
  query: "",
  brand: "All",
  sort: "year-desc",
  favorites: [],
};

// ---- Helpers ----
function getFavorites(){
  try{ return JSON.parse(localStorage.getItem("fav-cars")||"[]"); } catch(e){ return []; }
}
function saveFavorites(){
  localStorage.setItem("fav-cars", JSON.stringify(state.favorites));
}
function uniqueBrands(){
  return Array.from(new Set(CARS.map(c=>c.brand))).sort();
}
function sorters(key){
  return {
    "year-desc": (a,b)=> b.year - a.year,
    "year-asc": (a,b)=> a.year - b.year,
    "hp-desc": (a,b)=> b.horsepower - a.horsepower,
    "hp-asc": (a,b)=> a.horsepower - b.horsepower,
    "speed-desc": (a,b)=> b.topSpeedMph - a.topSpeedMph,
    "speed-asc": (a,b)=> a.topSpeedMph - b.topSpeedMph,
  }[key];
}
// --- Favicon helpers (index page) ---
function makeDataFavicon(letter, color="#6366f1"){
  const c = document.createElement("canvas");
  c.width = 64; c.height = 64;
  const ctx = c.getContext("2d");
  // background
  ctx.fillStyle = "#0b0b0c"; ctx.fillRect(0,0,64,64);
  // colored circle
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(32,32,28,0,Math.PI*2); ctx.fill();
  // letter
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

function setIndexFavicon(){
  const brand = state.brand; // from your existing UI state
  const map = window.BRAND_ICONS || {};
  if(brand && brand !== "All" && map[brand]){
    setFavicon(map[brand], brand[0]);
  }else{
    // generic site icon if "All" or no file present
    setFavicon(null, "🏎".slice(0,1));
  }
}

// ---- DOM refs ----
const grid = document.getElementById('grid');
const brandFilter = document.getElementById('brandFilter');
const sortBy = document.getElementById('sortBy');
const search = document.getElementById('search');
const brandChips = document.getElementById('brandChips');
const yearSpan = document.getElementById('year');
const cardTpl = document.getElementById('cardTemplate');

// ---- Init UI ----
function init(){
  state.favorites = getFavorites();
  yearSpan.textContent = new Date().getFullYear();

  // Brand select
  uniqueBrands().forEach(b=>{
    const opt = document.createElement('option');
    opt.value = b; opt.textContent = b; brandFilter.appendChild(opt);
  });

  // Brand chips (quick filters)
  ;['All', ...uniqueBrands()].forEach(b=>{
    const btn = document.createElement('button');
    btn.className = 'chip' + (b===state.brand ? ' active' : '');
    btn.textContent = b; btn.dataset.brand = b;
    btn.addEventListener('click', ()=>{
      state.brand = b; brandFilter.value = b; render();
      // update chip styles
      [...brandChips.children].forEach(c=>c.classList.toggle('active', c===btn));
    });
    brandChips.appendChild(btn);
  });

  // Events
  brandFilter.addEventListener('change', ()=>{ state.brand = brandFilter.value; syncChips(); render(); setIndexFavicon();});
  sortBy.addEventListener('change', ()=>{ state.sort = sortBy.value; render(); });
  search.addEventListener('input', ()=>{ state.query = search.value.toLowerCase(); render(); });

  render();
  setIndexFavicon();
}

function syncChips(){
  [...brandChips.children].forEach(c=>{
    c.classList.toggle('active', c.dataset.brand === state.brand);
  });
}

// ---- Render grid ----
function render(){
  let list = CARS.filter(c=> (`${c.brand} ${c.model}`).toLowerCase().includes(state.query));
  if(state.brand !== 'All') list = list.filter(c=> c.brand === state.brand);
  list = list.slice().sort(sorters(state.sort));

  grid.innerHTML = '';
  list.forEach(c=> grid.appendChild(renderCard(c)));
}

function renderCard(c){
  const node = cardTpl.content.firstElementChild.cloneNode(true);
  const img = node.querySelector('.card-img');
  const title = node.querySelector('.card-title');
  const year = node.querySelector('.year');
  const desc = node.querySelector('.card-desc');
  const hp = node.querySelector('.hp');
  const speed = node.querySelector('.speed');
  const favBtn = node.querySelector('.fav-btn');

  // fill in data
  img.src = c.image; 
  img.alt = `${c.brand} ${c.model}`;
  title.innerHTML = `${c.brand} <span class="muted">${c.model}</span>`;
  year.textContent = c.year;
  desc.textContent = c.description;
  hp.textContent = c.horsepower;
  speed.textContent = c.topSpeedMph;

  // wrap card in link
  const link = document.createElement('a');
  link.href = `car.html?id=${c.id}`;
  link.style.textDecoration = 'none';
  link.appendChild(node);

  // favorite button behavior
  const isFav = state.favorites.includes(c.id);
  favBtn.classList.toggle('active', isFav);
  favBtn.textContent = isFav ? '★ Favorited' : '☆ Favorite';
  favBtn.setAttribute('aria-pressed', String(isFav));
  favBtn.addEventListener('click', (e)=>{
    e.preventDefault(); // stop link navigation
    const i = state.favorites.indexOf(c.id);
    if(i>=0) state.favorites.splice(i,1); 
    else state.favorites.push(c.id);
    saveFavorites();
    const nowFav = state.favorites.includes(c.id);
    favBtn.classList.toggle('active', nowFav);
    favBtn.textContent = nowFav ? '★ Favorited' : '☆ Favorite';
    favBtn.setAttribute('aria-pressed', String(nowFav));
  });

  return link;
}

// Kickoff
init();
