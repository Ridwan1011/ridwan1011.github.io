// cars-data.js
window.CARS = [
  /* ------------------- Ferrari ------------------- */
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
      "https://www.blessthisstuff.com/imagens/listagem/2024/grande/grande_2015-ferrari-laferrari.jpeg",
    details: {
      accent: "#dc2626",
      long:
        "Limited to 499 coupes, LaFerrari pairs a 6.3L NA V12 with an F1-style HY-KERS system. It’s the most advanced Ferrari of its era.",
      specs: {
        Engine: "6.3L NA V12 + HY-KERS",
        Power: "950 hp",
        Drivetrain: "RWD",
        Transmission: "7-speed dual-clutch",
        Production: "2013–2016",
        Units: "499"
      },
      gallery: [
        "https://upload.wikimedia.org/wikipedia/commons/8/83/Ferrari_LaFerrari_-_Red.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/3/3d/LaFerrari_-_rear.jpg"
      ],
      facts: [
        "Part of the ‘Holy Trinity’ with McLaren P1 and Porsche 918.",
        "Ferrari’s first hybrid hypercar.",
        "Active aerodynamics front and rear."
      ],
      links: [
        { label: "Official page", url: "https://www.ferrari.com/en-EN/auto/laferrari" },
        { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Ferrari_LaFerrari" }
      ],
      video: "https://www.youtube.com/embed/2Q1OIv4nQXk"
    }
  },

  /* ----------------- Lamborghini ----------------- */
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
      // (unchanged original URL)
      "https://www.hdcarwallpapers.com/walls/2020_lamborghini_aventador_svj_roadster_4k_5k_4-HD.jpg",
    details: {
      accent: "#f59e0b",
      long:
        "SVJ is the track-focused Aventador with ALA 2.0 active aero and a screaming NA V12. Insane grip and drama.",
      specs: {
        Engine: "6.5L NA V12",
        Power: "759 hp",
        Drivetrain: "AWD",
        Years: "2018–2021"
      },
      gallery: [
        "https://upload.wikimedia.org/wikipedia/commons/9/9a/Lamborghini_Aventador_SVJ.jpg"
      ],
      facts: [
        "Held the Nürburgring production-car record in 2018.",
        "ALA 2.0 active aerodynamics."
      ],
      links: [
        { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Lamborghini_Aventador" }
      ],
      video: "https://www.youtube.com/embed/lv6dH5jv-5E"
    }
  },

  /* ------------------- McLaren ------------------- */
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
      "https://mclaren.scene7.com/is/image/mclaren/1597-McLarenP1trade:crop-16x9?wid=1786&hei=1005",
    details: {
      accent: "#ff8a00",
      long:
        "Hybrid hypercar with race-car aero and a focus on track performance. Purposeful and raw.",
      specs: {
        Engine: "3.8L twin-turbo V8 + e-motor",
        Power: "903 hp",
        Drivetrain: "RWD",
        Years: "2013–2015",
        Units: "375"
      },
      gallery: [
        "https://upload.wikimedia.org/wikipedia/commons/8/86/McLaren_P1.jpg"
      ],
      facts: [
        "Active aero with massive rear wing.",
        "KERS-style electric boost."
      ],
      links: [
        { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/McLaren_P1" }
      ],
      video: "https://www.youtube.com/embed/a7Ny5BYc-Fs"
    }
  },

  /* -------------------- Porsche ------------------ */
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
      "https://cimg0.ibsrv.net/ibimg/hgm/1600x900-1/100/307/porsche-918-spyder-concept_100307356.jpg",
    details: {
      accent: "#16a34a",
      long:
        "V8 plus dual e-motors, torque-vectoring AWD, and record-setting pace in its era.",
      specs: {
        Engine: "4.6L NA V8 + 2 e-motors",
        Power: "887 hp",
        Drivetrain: "AWD",
        Years: "2013–2015",
        Units: "918"
      },
      gallery: [
        "https://upload.wikimedia.org/wikipedia/commons/5/57/Porsche_918_Spyder_IAA_2013.jpg"
      ],
      facts: [
        "Carbon-fiber monocoque.",
        "Torque-vectoring front axle."
      ],
      links: [
        { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Porsche_918_Spyder" }
      ],
      video: "https://www.youtube.com/embed/eqVB3D7WJrM"
    }
  },

  /* ------------------- Mercedes-Benz ------------- */
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
      "https://bringatrailer.com/wp-content/uploads/2022/10/2006_mercedes-benz_slr-mclaren_2006_mercedes-benz_slr-mclaren_1f89fca8-317c-409b-99f3-729a926bcbda-VE8oH7-23779-23784-scaled.jpg?fit=2048%2C1365",
    details: {
      accent: "#0ea5e9",
      long:
        "Mercedes × McLaren collab: long-nose GT with supercharged punch and carbon-ceramic brakes.",
      specs: {
        Engine: "5.4L supercharged V8",
        Power: "617 hp",
        Drivetrain: "RWD",
        Years: "2003–2010"
      },
      gallery: [
        "https://upload.wikimedia.org/wikipedia/commons/1/15/Mercedes-Benz_SLR_McLaren_722_Edition.jpg"
      ],
      facts: [
        "Side-exit exhausts behind the front wheels.",
        "Brake-by-wire with carbon-ceramic discs."
      ],
      links: [
        { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Mercedes-Benz_SLR_McLaren" }
      ],
      video: "https://www.youtube.com/embed/7CwzJ9z7F0k"
    }
  },

  /* ---------------------- Dodge ------------------ */
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
      "https://www.mechatronik.de/fileadmin/doc/verkauf/fahrzeugvermarktung/Dodge_Viper_ACR/3.jpg",
    details: {
      accent: "#7c3aed",
      long:
        "Wild aero + NA V10. Built to murder lap times, not top-speed runs. Manual only, huge grip.",
      specs: {
        Engine: "8.4L naturally aspirated V10",
        Power: "645 hp",
        Drivetrain: "RWD",
        Year: "2017 (final)",
        Aero: "Huge wing & splitter"
      },
      gallery: [
        "https://upload.wikimedia.org/wikipedia/commons/6/6a/2016_Dodge_Viper_ACR_%2826952411062%29.jpg"
      ],
      facts: [
        "Multiple track lap records.",
        "Massive aero package from factory."
      ],
      links: [
        { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Dodge_Viper" }
      ],
      video: "https://www.youtube.com/embed/0CkC7lLxUoA"
    }
  },

  /* ----------------------- BMW ------------------- */
  {
    id: "bmw-m3",
    brand: "BMW",
    model: "M3 Competition (G80)",
    year: 2023,
    horsepower: 503,
    topSpeedMph: 180,
    description:
      "Everyday usable super-sedan with brutal acceleration and a techy cockpit.",
    image:
      // (unchanged original URL)
      "https://cdn.bmwblog.com/wp-content/uploads/2023/05/BMW-M3-CS-Frozen-Solid-White-4.jpg",
    details: {
      accent: "#2563eb",
      long:
        "G80 M3 uses the S58 twin-turbo inline-6. Huge performance with daily usability; optional xDrive AWD.",
      specs: {
        Engine: "3.0L twin-turbo inline-6 (S58)",
        Power: "503 hp",
        Drivetrain: "RWD / AWD (xDrive)",
        Transmission: "8-speed automatic",
        Years: "2021–present"
      },
      facts: [
        "Track Mode with configurable M buttons.",
        "Carbon-fiber roof on many trims."
      ],
      links: [
        { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/BMW_M3#G80/G81/G82/G83_(2020%E2%80%93present)" }
      ],
      video: "https://www.youtube.com/embed/5y2sYdR5o6A"
    }
  },

  /* ----------------------- Audi ------------------ */
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
      // (unchanged original URL)
      "https://4kwallpapers.com/images/wallpapers/audi-r8-v10-performance-rwd-2021-5k-8k-3840x2160-7158.jpg",
    details: {
      accent: "#71717a",
      long:
        "Last of the NA V10 supercars. Shares its heart with the Huracán, but with everyday comfort.",
      specs: {
        Engine: "5.2L naturally aspirated V10",
        Power: "602 hp",
        Drivetrain: "AWD (quattro) / RWD",
        Years: "2019–2023"
      },
      facts: [
        "Mid-engine layout with daily drivability.",
        "High-revving 5.2L V10 soundtrack."
      ],
      links: [
        { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Audi_R8" }
      ],
      video: "https://www.youtube.com/embed/3m2oG6H9kY8"
    }
  },

  /* ---------------------- Toyota ---------------- */
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
      // (unchanged original URL)
      "https://4kwallpapers.com/images/wallpapers/toyota-gr-supra-a90-3840x2160-22172.jpeg",
    details: {
      accent: "#ef4444",
      long:
        "A90 Supra blends Toyota tuning heritage with a BMW-sourced turbo inline-6 and excellent balance.",
      specs: {
        Engine: "3.0L turbo inline-6 (B58)",
        Power: "382 hp",
        Drivetrain: "RWD",
        Transmissions: "8-speed auto / 6-speed manual (later years)",
        Years: "2020–present"
      },
      facts: [
        "Highly tunable B58 engine.",
        "Compact wheelbase, playful handling."
      ],
      links: [
        { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Toyota_GR_Supra" }
      ],
      video: "https://www.youtube.com/embed/ydj8V2Qn2Zg"
    }
  },

  /* ---------------------- Nissan ---------------- */
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
      // (unchanged original URL)
      "https://www.digitaltrends.com/wp-content/uploads/2016/03/2017-Nissan-GTR_.jpg?p=1",
    details: {
      accent: "#991b1b",
      long:
        "Hand-built twin-turbo V6 with trick AWD and launch control. A legend for accessible supercar speed.",
      specs: {
        Engine: "3.8L twin-turbo V6 (VR38DETT)",
        Power: "565 hp",
        Drivetrain: "AWD",
        Transmission: "6-speed dual-clutch",
        Years: "2007–present"
      },
      facts: [
        "Hand-built engines signed by a Takumi master.",
        "Supercar acceleration with everyday usability."
      ],
      links: [
        { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Nissan_GT-R" }
      ],
      video: "https://www.youtube.com/embed/9wQn8G3K3SE"
    }
  }
];
window.BRAND_ICONS = {
  "Ferrari":        "icons/ferrari.png",
  "Lamborghini":    "icons/lamborghini.png",
  "McLaren":        "icons/mclaren.png",
  "Porsche":        "icons/porsche.png",
  "Mercedes-Benz":  "icons/mercedes.png",
  "Dodge":          "icons/dodge.png",
  "BMW":            "icons/bmw.png",
  "Audi":           "icons/audi.png",
  "Toyota":         "icons/toyota.png",
  "Nissan":         "icons/nissan.png"
};
