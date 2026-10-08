
(async function () {
  async function getJSON(path) {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error('Impossible de charger ' + path);
    return response.json();
  }

  try {
    const site = await getJSON('/content/site.json');

    document.querySelectorAll('[data-cms-site="phone"]').forEach(el => {
      el.textContent = site.phone;
      if (el.tagName === 'A') {
        el.href = 'tel:' + site.phone.replace(/\D/g, '');
      }
    });

    document.querySelectorAll('[data-cms-site="email"]').forEach(el => {
      el.textContent = site.email;
      if (el.tagName === 'A') {
        el.href = 'mailto:' + site.email;
      }
    });

    document.querySelectorAll('[data-cms-site="calendly"]').forEach(el => {
      if (el.tagName === 'A') el.href = site.calendly;
    });

    document.querySelectorAll('[data-cms-href="phone"]').forEach(el => {
      if (el.tagName === 'A') {
        el.href = 'tel:' + site.phone.replace(/\D/g, '');
      }
    });

    document.querySelectorAll('[data-cms-href="email"]').forEach(el => {
      if (el.tagName === 'A') {
        el.href = 'mailto:' + site.email;
      }
    });
  } catch (error) {
    console.warn('Informations générales non chargées :', error);
  }

  try {
    const home = await getJSON('/content/home.json');
    const title = document.querySelector('[data-cms="hero-title"]');
    const desc = document.querySelector('[data-cms="hero-desc"]');

    if (title && typeof home.hero_title === 'string') {
      const parts = home.hero_title.split('|').map(part => part.trim());

      if (parts.length === 3) {
        title.replaceChildren();

        title.append(document.createTextNode(parts[0] + ' '));

        const lineBreak = document.createElement('br');
        lineBreak.className = 'hidden sm:inline';
        title.append(lineBreak);

        const emphasis = document.createElement('span');
        emphasis.className = 'text-coral-cta font-light italic';
        emphasis.textContent = parts[1];

        title.append(
          emphasis,
          document.createTextNode(' ' + parts[2])
        );
      } else {
        title.textContent = home.hero_title;
      }
    }

    if (desc && typeof home.hero_desc === 'string') {
      desc.textContent = home.hero_desc;
    }
  } catch (error) {
    console.warn('Contenu de l’accueil non chargé :', error);
  }
})();
