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
      "https://i.redd.it/2019-ferrari-488-pista-v0-yh4uazoznnfb1.jpg?width=2160&format=pjpg&auto=webp&s=ec1f0b5efb8198fe2dd9093d8d94034accdce499",
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
      "https://www.hdcarwallpapers.com/walls/2020_lamborghini_aventador_svj_roadster_4k_5k_4-HD.jpg",
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
      "https://www.pcarmarket.com/static/media/uploads/galleries/photos/uploads/galleries/14893-luis-2022-porsche-911-gt3-blue/.thumbnails/IMG_1074.jpg/IMG_1074-tiny-2048x0.jpg",
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
      "https://www.hiltonandmoss.com/image-blobs/stock/590945/images/7b05f02c-8276-4368-b2bf-e9758b44bf82/mercedes_benz_amg_gtc_hilton_and_moss_01.jpg?width=2000&height=1333&crop",
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
      "https://cdn.bmwblog.com/wp-content/uploads/2023/05/BMW-M3-CS-Frozen-Solid-White-4.jpg",
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
      "https://4kwallpapers.com/images/wallpapers/audi-r8-v10-performance-rwd-2021-5k-8k-3840x2160-7158.jpg",
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
      "https://cdna.artstation.com/p/assets/images/images/067/721/292/large/rishi-5.jpg?1696061715",
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
      "https://4kwallpapers.com/images/wallpapers/toyota-gr-supra-a90-3840x2160-22172.jpeg",
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
      "https://www.digitaltrends.com/wp-content/uploads/2016/03/2017-Nissan-GTR_.jpg?p=1",
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
