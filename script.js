// app.js — My Favorite Cars (vanilla JS)

// ---- Editable data: put YOUR favorite cars here ----
const CARS = [
  {
    id: "ferrari-488",
    brand: "Ferrari",
    model: "488 Pista",
    year: 2019,
    horsepower: 710,
    topSpeedMph: 211,
    description:
      "Track-focused twin-turbo V8 with razor-sharp handling and iconic Ferrari drama.",
    image:
      "https://images.unsplash.com/photo-1616179054043-4e0d9962b40b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lambo-aven",
    brand: "Lamborghini",
    model: "Aventador SVJ",
    year: 2020,
    horsepower: 759,
    topSpeedMph: 217,
    description:
      "Howling V12 flagship—wild aero, outrageous presence, and raw theater.",
    image:
      "https://images.unsplash.com/photo-1519340333755-5063a0f111f2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "porsche-gt3",
    brand: "Porsche",
    model: "911 GT3 (992)",
    year: 2022,
    horsepower: 502,
    topSpeedMph: 198,
    description:
      "Naturally aspirated flat-six perfection with a motorsport soul and sublime steering.",
    image:
      "https://images.unsplash.com/photo-1606662614136-9b3a23e2bb82?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "mercedes-amg-gt",
    brand: "Mercedes-AMG",
    model: "AMG GT R",
    year: 2019,
    horsepower: 577,
    topSpeedMph: 198,
    description:
      "Front-mid V8 brute with a playful tail and serious track credentials.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "bmw-m3",
    brand: "BMW",
    model: "M3 Competition (G80)",
    year: 2023,
    horsepower: 503,
    topSpeedMph: 180,
    description:
      "Everyday usable super-sedan with brutal acceleration and techy cockpit.",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "audi-r8",
    brand: "Audi",
    model: "R8 V10 Performance",
    year: 2020,
    horsepower: 602,
    topSpeedMph: 205,
    description:
      "Exotic looks, everyday manners, and a spine-tingling V10.",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ford-gt",
    brand: "Ford",
    model: "GT",
    year: 2018,
    horsepower: 647,
    topSpeedMph: 216,
    description:
      "Carbon-tub Le Mans legend for the road with wind-tunnel sculpting.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "toyota-supra",
    brand: "Toyota",
    model: "GR Supra (A90)",
    year: 2021,
    horsepower: 382,
    topSpeedMph: 155,
    description:
      "Modern icon reboot—balanced chassis, tunable, and daily-friendly.",
    image:
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "nissan-gtr",
    brand: "Nissan",
    model: "GT-R (R35)",
    year: 2017,
    horsepower: 565,
    topSpeedMph: 196,
    description:
      "Godzilla—brutal launch control, AWD grip, and cult status.",
    image:
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1200&auto=format&fit=crop",
  },
];

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
  brandFilter.addEventListener('change', ()=>{ state.brand = brandFilter.value; syncChips(); render();});
  sortBy.addEventListener('change', ()=>{ state.sort = sortBy.value; render(); });
  search.addEventListener('input', ()=>{ state.query = search.value.toLowerCase(); render(); });

  render();
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

  img.src = c.image; img.alt = `${c.brand} ${c.model}`;
  title.innerHTML = `${c.brand} <span class="muted">${c.model}</span>`;
  year.textContent = c.year;
  desc.textContent = c.description;
  hp.textContent = c.horsepower;
  speed.textContent = c.topSpeedMph;

  // favorite state
  const isFav = state.favorites.includes(c.id);
  favBtn.classList.toggle('active', isFav);
  favBtn.textContent = isFav ? '★ Favorited' : '☆ Favorite';
  favBtn.setAttribute('aria-pressed', String(isFav));

  favBtn.addEventListener('click', ()=>{
    const i = state.favorites.indexOf(c.id);
    if(i>=0) state.favorites.splice(i,1); else state.favorites.push(c.id);
    saveFavorites();
    favBtn.classList.toggle('active');
    const nowFav = favBtn.classList.contains('active');
    favBtn.textContent = nowFav ? '★ Favorited' : '☆ Favorite';
    favBtn.setAttribute('aria-pressed', String(nowFav));
  });

  return node;
}

// Kickoff
init();
