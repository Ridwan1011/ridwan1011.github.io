// add-car.js — handles Add Car form + upload to backend
(function () {
  const form = document.getElementById("addCarForm");
  const yearFooter = document.getElementById("yearFooter");
  const previewImage = document.getElementById("previewImage");
  const fileInput = document.getElementById("imageFileInput");
  const brandLogoPreview = document.getElementById("brandLogoPreview");
  const brandLogoFileInput = document.getElementById("brandLogoFileInput");

  if (yearFooter) {
    yearFooter.textContent = new Date().getFullYear();
  }

  // ---- simple sign-in guard ----
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("cars-auth-user") || "null");
  } catch (e) {
    currentUser = null;
  }

  if (!currentUser) {
    // not signed in → go back home
    window.location.href = "index.html";
    return;
  }

  // ---- image previews ----

  // main car image
  if (fileInput && previewImage) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) {
        previewImage.removeAttribute("src");
        previewImage.style.display = "none";
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }

  // brand logo image
  if (brandLogoFileInput && brandLogoPreview) {
    brandLogoFileInput.addEventListener("change", () => {
      const file = brandLogoFileInput.files && brandLogoFileInput.files[0];
      if (!file) {
        brandLogoPreview.removeAttribute("src");
        brandLogoPreview.style.display = "none";
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        brandLogoPreview.src = e.target.result;
        brandLogoPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }

  if (!form) return;

  // ---- submit handler: send to PHP ----
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

const data = new FormData(form);

// include signed-in user's email + display name
if (currentUser) {
  if (currentUser.email) {
    data.append("ownerEmail", currentUser.email);
  }
  if (currentUser.name) {
    data.append("ownerName", currentUser.name);
  }
}



    try {
      const res = await fetch("save-car.php", {
        method: "POST",
        body: data,
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json || !json.success) {
        throw new Error((json && json.message) || "Failed to save car.");
      }

      alert("Car saved to the database!");
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      alert("There was a problem saving your car: " + err.message);
    }
  });
})();
