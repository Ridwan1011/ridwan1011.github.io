// app.js — My Favorite Cars (vanilla JS)

// ---- Editable data: put YOUR favorite cars here ----
let CARS = window.CARS || [];
async function loadDbCars() {
  try {
    const res = await fetch('get-cars.php');
    if (!res.ok) {
      console.error('Failed to load DB cars', res.status);
      return;
    }

    const dbRows = await res.json();

    const mapped = dbRows.map((row) => ({
      id: `user-${row.id}`,                  // unique id
      brand: row.brand,
      model: row.model,
      year: Number(row.year),
      horsepower: Number(row.horsepower),
      topSpeedMph: Number(row.top_speed_mph),
      description: row.description,
      image: row.image_url,                  // main image path from DB
      ownerEmail: row.owner_email,
      ownerName: row.owner_name,
    }));

    CARS = (window.CARS || []).concat(mapped);
    window.CARS = CARS; // keep global in sync
  } catch (err) {
    console.error('Error loading DB cars', err);
  }
}

// ---- App state ----
const state = {
  query: "",
  brand: "All",
  sort: "year-desc",
  favorites: [],
  user: null, // <--- add this
};



// ---- Helpers ----
function getFavorites(){
  try{ return JSON.parse(localStorage.getItem("fav-cars")||"[]"); } catch(e){ return []; }
}
function saveFavorites(){
  localStorage.setItem("fav-cars", JSON.stringify(state.favorites));
}


// ---- Fake auth storage (demo only, not secure!) ----
const AUTH_KEY = "cars-auth-user";   // currently signed-in user
const USERS_KEY = "cars-auth-users"; // all registered users

let authMode = "signin"; // "signin" or "signup"

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch (e) {
    return null;
  }
}

function saveCurrentUser(userOrNull) {
  if (userOrNull == null) {
    localStorage.removeItem(AUTH_KEY);
  } else {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userOrNull));
  }
}

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
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
// Auth-related DOM refs
const signInButton = document.getElementById('signInButton');
const addCarLink = document.getElementById('addCarLink');
const authStatus = document.getElementById('authStatus');
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authName = document.getElementById('authName');
const authClose = document.getElementById('authClose');
const authCancel = document.getElementById('authCancel');
const authSubmitButton = document.getElementById("authSubmitButton");
const authHint = document.getElementById("authHint");
const authSwitchText = document.getElementById("authSwitchText");
const authSwitchButton = document.getElementById("authSwitchButton");
const authTitleEl = document.getElementById("authTitle");
const authPassword = document.getElementById("authPassword");
const authNameGroup = document.getElementById("authNameGroup");

function updateAuthUI() {
  const signedIn = !!state.user;

  if (authStatus) {
    authStatus.textContent = signedIn
      ? `Signed in as ${state.user.name || state.user.email}`
      : "You are not signed in.";
  }

  if (addCarLink) {
    addCarLink.setAttribute("aria-disabled", signedIn ? "false" : "true");
    addCarLink.classList.toggle("btn-disabled", !signedIn);
    if (!signedIn) {
      addCarLink.tabIndex = -1;
    } else {
      addCarLink.removeAttribute("tabindex");
    }
  }

  if (signInButton) {
    signInButton.textContent = signedIn ? "Sign out" : "Sign in";
  }
}

function setAuthMode(mode) {
  authMode = mode === "signup" ? "signup" : "signin";
  const isSignUp = authMode === "signup";

  if (authTitleEl) {
    authTitleEl.textContent = isSignUp ? "Sign up" : "Sign in";
  }

  if (authSubmitButton) {
    authSubmitButton.textContent = isSignUp ? "Create account" : "Sign in";
  }

  if (authHint) {
    authHint.textContent = isSignUp
      ? "For this project, new accounts are stored only in this browser (localStorage)."
      : "Sign in with an email and password you’ve registered in this browser.";
  }

  if (authSwitchText) {
    authSwitchText.textContent = isSignUp
      ? "Already have an account?"
      : "Don’t have an account?";
  }

  if (authSwitchButton) {
    authSwitchButton.textContent = isSignUp ? "Sign in" : "Sign up";
  }

  // Only show name field on sign up
  if (authNameGroup) {
    authNameGroup.style.display = isSignUp ? "" : "none";
  }

  // Clear password when switching modes
  if (authPassword) authPassword.value = "";
}

function openAuthModal(mode = "signin") {
  setAuthMode(mode);
  if (!authModal) return;
  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden", "false");

  if (authEmail) {
    authEmail.focus();
  }
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden", "true");
}



// ---- Init UI ----
function init(){
  state.favorites = getFavorites();
  state.user = getCurrentUser();
  yearSpan.textContent = new Date().getFullYear();

  // Auth button + modal events
  if (signInButton) {
  signInButton.addEventListener("click", () => {
    if (state.user) {
      // Sign out
      state.user = null;
      saveCurrentUser(null);
      updateAuthUI();
    } else {
      // Open modal in sign-in mode
      openAuthModal("signin");
    }
  });
}


  if (authClose) authClose.addEventListener("click", closeAuthModal);
  if (authCancel) authCancel.addEventListener("click", closeAuthModal);
  if (authSwitchButton) {
  authSwitchButton.addEventListener("click", () => {
    const nextMode = authMode === "signin" ? "signup" : "signin";
    setAuthMode(nextMode);
  });
}

  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal || e.target.classList.contains("modal-backdrop")) {
        closeAuthModal();
      }
    });
  }

  if (authForm) {
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;

    const email = authEmail.value.trim().toLowerCase();
    const password = authPassword.value.trim();
    const name = authName ? authName.value.trim() : "";

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const users = getStoredUsers();
    const existing = users.find(
      (u) => u.email.toLowerCase() === email
    );

    if (authMode === "signup") {
      // SIGN UP: create new account if email not used
      if (existing) {
        alert("An account with that email already exists. Please sign in instead.");
        return;
      }

      const newUser = { email, name, password }; // plain text for demo ONLY
      users.push(newUser);
      saveStoredUsers(users);

      state.user = { email, name };
      saveCurrentUser(state.user);

      closeAuthModal();
      updateAuthUI();
    } else {
      // SIGN IN: must match existing email + password
      if (!existing) {
        alert("No account found for that email. Please sign up first.");
        return;
      }
      if (existing.password !== password) {
        alert("Incorrect password. Please try again.");
        return;
      }

      state.user = { email: existing.email, name: existing.name };
      saveCurrentUser(state.user);

      closeAuthModal();
      updateAuthUI();
    }
  });
}


  updateAuthUI();


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
  const addedByEl = node.querySelector('.added-by');
  const favBtn = node.querySelector('.fav-btn');

  // fill in data
  img.src = c.image; 
  img.alt = `${c.brand} ${c.model}`;
  title.innerHTML = `${c.brand} <span class="muted">${c.model}</span>`;
  year.textContent = c.year;
  desc.textContent = c.description;
  hp.textContent = c.horsepower;
  speed.textContent = c.topSpeedMph;

  // NEW: added by text
if (addedByEl) {
  if (c.ownerName) {
    addedByEl.textContent = `Added by ${c.ownerName}`;
  } else {
    addedByEl.style.display = "none"; // hide for built-in cars
  }
}
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
loadDbCars().then(init);
