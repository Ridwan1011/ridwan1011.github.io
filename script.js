// app.js — My Favorite Cars (vanilla JS)

// ---- Editable data: put YOUR favorite cars here ----
const CARS = [
  {
    id: "ferrari-laferrari",
    brand: "Ferrari",
    model: "LaFerrari",
    year: 2015,
    horsepower: 950,
    topSpeedMph: 217,
    description:
      "Ferrari’s hybrid hypercar—6.3L V12 with electric assist, futuristic design, and blistering performance.",
    image:
      "https://www.blessthisstuff.com/imagens/listagem/2024/grande/grande_2015-ferrari-laferrari.jpeg"
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
    id: "porsche-918",
    brand: "Porsche",
    model: "918 Spyder",
    year: 2015,
    horsepower: 887,
    topSpeedMph: 211,
    description:
      "Hybrid hypercar with V8 and electric motors—lightweight carbon fiber, AWD grip, and Nürburgring record-breaking speed.",
    image:
      "https://cimg0.ibsrv.net/ibimg/hgm/1600x900-1/100/307/porsche-918-spyder-concept_100307356.jpg"
  },
  {
    id: "mercedes-slr",
    brand: "Mercedes-Benz",
    model: "SLR McLaren",
    year: 2006,
    horsepower: 617,
    topSpeedMph: 207,
    description:
      "A collaboration between Mercedes and McLaren—supercharged V8, long nose, and F1-inspired tech.",
    image:
      "https://bringatrailer.com/wp-content/uploads/2022/10/2006_mercedes-benz_slr-mclaren_2006_mercedes-benz_slr-mclaren_1f89fca8-317c-409b-99f3-729a926bcbda-VE8oH7-23779-23784-scaled.jpg?fit=2048%2C1365"
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
  {
  id: "mclaren-p1",
  brand: "McLaren",
  model: "P1",
  year: 2014,
  horsepower: 903,
  topSpeedMph: 217,
  description:
    "Hybrid hypercar legend—twin-turbo V8 with electric boost, insane aero, and track-focused performance.",
  image:
    "https://mclaren.scene7.com/is/image/mclaren/1597-McLarenP1trade:crop-16x9?wid=1786&hei=1005"
  },
  {
  id: "dodge-viper-acr",
  brand: "Dodge",
  model: "Viper ACR",
  year: 2017,
  horsepower: 645,
  topSpeedMph: 177,
  description:
    "The ultimate Viper—naturally aspirated 8.4L V10, massive aero, and brutal track performance.",
  image:
    "https://www.mechatronik.de/fileadmin/doc/verkauf/fahrzeugvermarktung/Dodge_Viper_ACR/3.jpg"
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
