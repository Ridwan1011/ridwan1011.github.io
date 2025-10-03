// car.js
(function(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

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

  // Fill content
  document.title = `${car.brand} ${car.model} — Details`;
  title.textContent = `${car.brand} ${car.model}`;
  subtitle.textContent = `${car.brand}`;
  name.innerHTML = `${car.brand} <span class="muted">${car.model}</span>`;
  year.textContent = car.year;
  desc.textContent = car.description;
  hp.textContent = car.horsepower;
  speed.textContent = car.topSpeedMph;
  hero.src = car.image;
  hero.alt = `${car.brand} ${car.model}`;

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
})();
