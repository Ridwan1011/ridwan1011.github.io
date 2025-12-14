// car.js — supports static cars + DB cars + delete button
(async function () {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  // ---- who is logged in? (for delete permission) ----
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("cars-auth-user") || "null");
  } catch (e) {
    currentUser = null;
  }

  function makeDataFavicon(letter, color = "#6366f1") {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#0b0b0c";
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.font =
      "bold 36px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText(letter, 32, 36);
    return c.toDataURL("image/png");
  }

  function setFavicon(urlOrNull, letterFallback = "M", color = "#6366f1") {
    let link = document.querySelector('link#favicon[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      document.head.appendChild(link);
    }
    if (urlOrNull && /\.svg(\?|$)/i.test(urlOrNull)) {
      link.type = "image/svg+xml";
    } else if (urlOrNull && /\.ico(\?|$)/i.test(urlOrNull)) {
      link.type = "image/x-icon";
    } else {
      link.type = "image/png";
    }
    const href = urlOrNull
      ? `${urlOrNull}${urlOrNull.includes("?") ? "&" : "?"}v=${Date.now()}`
      : makeDataFavicon(letterFallback, color);
    link.href = href;
  }

  // --- load DB cars + merge with static window.CARS ---
  async function loadDbCarsForDetailPage() {
    try {
      const res = await fetch("get-cars.php");
      if (!res.ok) {
        console.error("Failed to load DB cars on detail page", res.status);
        return;
      }
      const dbRows = await res.json();

      const mapped = dbRows.map((row) => {
        const factsArray = row.facts
          ? row.facts
              .split(/\r?\n/)
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        return {
          id: `user-${row.id}`,          // used in the URL
          dbId: Number(row.id),          // actual DB id (for delete)
          brand: row.brand,
          model: row.model,
          year: Number(row.year),
          horsepower: Number(row.horsepower),
          topSpeedMph: Number(row.top_speed_mph),
          description: row.description,
          image: row.image_url,
          ownerEmail: row.owner_email,   // who added this car
          details: {
            long: row.long_desc || "",
            facts: factsArray,
            video: row.video_url || "",
            specs: {},
            gallery: [],
            links: [],
          },
        };
      });

      const existing = window.CARS || [];
      window.CARS = existing.concat(mapped);
    } catch (err) {
      console.error("Error loading DB cars on detail page", err);
    }
  }

  // favorites storage
  const FAV_KEY = "fav-cars";
  function getFavs() {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveFavs(f) {
    localStorage.setItem(FAV_KEY, JSON.stringify(f));
  }

  // DOM refs
  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");
  const name = document.getElementById("name");
  const year = document.getElementById("year");
  const desc = document.getElementById("desc");
  const hp = document.getElementById("hp");
  const speed = document.getElementById("speed");
  const hero = document.getElementById("hero");
  const favBtn = document.getElementById("fav");
  const deleteBtn = document.getElementById("deleteCarBtn");
  const yearFooter = document.getElementById("yearFooter");
  const brandLogo = document.getElementById("brandLogo");

  if (yearFooter) {
    yearFooter.textContent = new Date().getFullYear();
  }

  // 1) make sure DB cars are loaded into window.CARS
  await loadDbCarsForDetailPage();

  const cars = window.CARS || [];
  const car = cars.find((c) => c.id === id);

  if (!car) {
    if (title) title.textContent = "Car not found";
    if (subtitle) subtitle.textContent = "Check the link and try again.";
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = "<p>Sorry, we couldn’t find that car.</p>";
    }
    if (deleteBtn) deleteBtn.style.display = "none";
    return;
  }

  const d = car.details || {};
  const root = document.documentElement;

  // ----- Base content -----
  document.title = `${car.brand} ${car.model} — Details`;
  if (title) title.textContent = `${car.brand} ${car.model}`;
  if (subtitle) subtitle.textContent = `${car.brand}`;
  if (name)
    name.innerHTML = `${car.brand} <span class="muted">${car.model}</span>`;
  if (year) year.textContent = car.year;
  if (desc) desc.textContent = car.description || "";
  if (hp) hp.textContent = car.horsepower;
  if (speed) speed.textContent = car.topSpeedMph;
  if (hero) {
    hero.src = car.image;
    hero.alt = `${car.brand} ${car.model}`;
  }

  const accent =
    (d && (d.accent || d.color)) ||
    getComputedStyle(root).getPropertyValue("--accent") ||
    "#6366f1";

  const brandMap = window.BRAND_ICONS || {};
  const brand = car.brand || "M";
  const iconUrl = brandMap[brand] || null;

  if (brandLogo && iconUrl) {
    brandLogo.src = iconUrl;
    brandLogo.alt = `${brand} logo`;
  }

  setFavicon(iconUrl, brand[0], (accent || "").toString().trim() || "#6366f1");

  // ----- Favorites -----
  const favs = getFavs();
  const isFav = favs.includes(car.id);
  if (favBtn) {
    favBtn.classList.toggle("active", isFav);
    favBtn.textContent = isFav ? "★ Favorited" : "☆ Favorite";
    favBtn.setAttribute("aria-pressed", String(isFav));
    favBtn.addEventListener("click", () => {
      const list = getFavs();
      const i = list.indexOf(car.id);
      if (i >= 0) list.splice(i, 1);
      else list.push(car.id);
      saveFavs(list);
      const nowFav = list.includes(car.id);
      favBtn.classList.toggle("active", nowFav);
      favBtn.textContent = nowFav ? "★ Favorited" : "☆ Favorite";
      favBtn.setAttribute("aria-pressed", String(nowFav));
    });
  }

  // ----- Delete button (only for owner) -----
  if (deleteBtn) {
    const canDelete =
      car.dbId &&
      car.ownerEmail &&
      currentUser &&
      currentUser.email &&
      currentUser.email === car.ownerEmail;

    if (!canDelete) {
      deleteBtn.style.display = "none";
    } else {
      deleteBtn.style.display = "inline-flex";
      deleteBtn.addEventListener("click", async () => {
        const really = confirm(
          "Are you sure you want to delete this car? This cannot be undone."
        );
        if (!really) return;

        try {
          const res = await fetch("delete-car.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: car.dbId,
              ownerEmail: currentUser.email,
            }),
          });

          const json = await res.json().catch(() => null);
          if (!res.ok || !json || !json.success) {
            throw new Error(
              (json && json.message) || "Failed to delete car."
            );
          }

          alert("Car deleted.");
          window.location.href = "index.html";
        } catch (err) {
          console.error(err);
          alert("Could not delete car: " + err.message);
        }
      });
    }
  }

  // ----- helper for show/hide sections -----
  function show(el, on) {
    if (!el) return;
    el.style.display = on ? "" : "none";
  }

  // Overview
  const overviewSec = document.getElementById("overview");
  const longP = document.getElementById("long");
  if (d.long) {
    if (longP) longP.textContent = d.long;
    show(overviewSec, true);
  } else show(overviewSec, false);

  // Specs
  const specsSec = document.getElementById("specs");
  const specsGrid = document.getElementById("specsGrid");
  if (d.specs && Object.keys(d.specs).length) {
    if (specsGrid) {
      specsGrid.innerHTML = "";
      Object.entries(d.specs).forEach(([k, v]) => {
        const div = document.createElement("div");
        div.className = "spec";
        div.innerHTML = `<span class="k">${k}</span><span class="v">${v}</span>`;
        specsGrid.appendChild(div);
      });
    }
    show(specsSec, true);
  } else show(specsSec, false);

  // Gallery
  const gallerySec = document.getElementById("gallery");
  const galleryGrid = document.getElementById("galleryGrid");
  if (Array.isArray(d.gallery) && d.gallery.length) {
    if (galleryGrid) {
      galleryGrid.innerHTML = "";
      d.gallery.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${car.brand} ${car.model} gallery`;
        galleryGrid.appendChild(img);
      });
    }
    show(gallerySec, true);
  } else show(gallerySec, false);

  // Facts
  const factsSec = document.getElementById("facts");
  const factsList = document.getElementById("factsList");
  if (Array.isArray(d.facts) && d.facts.length) {
    if (factsList) {
      factsList.innerHTML = "";
      d.facts.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        factsList.appendChild(li);
      });
    }
    show(factsSec, true);
  } else show(factsSec, false);

  // Links
  const linksSec = document.getElementById("links");
  const linkChips = document.getElementById("linkChips");
  if (Array.isArray(d.links) && d.links.length) {
    if (linkChips) {
      linkChips.innerHTML = "";
      d.links.forEach((l) => {
        const a = document.createElement("a");
        a.className = "chip";
        a.href = l.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = l.label;
        linkChips.appendChild(a);
      });
    }
    show(linksSec, true);
  } else show(linksSec, false);

  // Video
  const videoSec = document.getElementById("video");
  const frame = document.getElementById("videoFrame");
  if (d.video && frame) {
    frame.src = d.video + (d.video.includes("?") ? "&rel=0" : "?rel=0");
    show(videoSec, true);
  } else show(videoSec, false);
})();
