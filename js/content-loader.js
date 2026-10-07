(async function () {
  async function getJSON(path) {
    const response = await fetch(path, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Impossible de charger " + path);
    }

    return response.json();
  }

  // Informations générales
  try {
    const site = await getJSON("/content/site.json");

    document.querySelectorAll('[data-cms-site="phone"]').forEach(el => {
      el.textContent = site.phone;

      if (el.tagName === "A") {
        el.href = "tel:" + site.phone.replace(/\D/g, "");
      }
    });

    document.querySelectorAll('[data-cms-site="email"]').forEach(el => {
      el.textContent = site.email;

      if (el.tagName === "A") {
        el.href = "mailto:" + site.email;
      }
    });

    document.querySelectorAll('[data-cms-site="calendly"]').forEach(el => {
      el.href = site.calendly;
    });

  } catch (error) {
    console.warn("Contenu général non chargé :", error);
  }

  // Page d'accueil
  try {
    const home = await getJSON("/content/home.json");

    const title = document.querySelector('[data-cms="hero-title"]');
    const description = document.querySelector('[data-cms="hero-desc"]');

    if (title) {
      title.textContent = home.hero_title;
    }

    if (description) {
      description.textContent = home.hero_desc;
    }

  } catch (error) {
    console.warn("Contenu accueil non chargé :", error);
  }
})();
