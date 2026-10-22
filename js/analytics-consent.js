/* Synergies Humaines — GA4, chargé uniquement après accord. */
(function () {
  'use strict';
  if (window.shAnalyticsConsent) return;
  const measurementId = 'G-XCK6LKPGGQ';
  const storageKey = 'sh-analytics-consent-v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const production = ['synergieshumaines.com', 'www.synergieshumaines.com'].includes(location.hostname);
  let loaded = false;
  let choice = readChoice();
  let previousFocus;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && ['accepted', 'refused'].includes(saved.value) &&
          typeof saved.time === 'number' && saved.time <= Date.now() &&
          Date.now() - saved.time < lifetime) return saved.value;
    } catch (_) { /* Le refus du stockage ne bloque pas le site. */ }
    return null;
  }

  function cleanUrl(value, keepArticle) {
    try {
      const url = new URL(value);
      const slug = keepArticle && url.searchParams.get('slug');
      return url.origin + url.pathname + (slug ? '?slug=' + encodeURIComponent(slug) : '');
    } catch (_) { return ''; }
  }

  function startAnalytics() {
    window['ga-disable-' + measurementId] = false;
    if (loaded || !production) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    // Le script Google est absent tant que le consentement n'est pas donné.
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_expires: 180 * 24 * 60 * 60,
      cookie_update: false,
      page_location: cleanUrl(location.href, true),
      page_referrer: cleanUrl(document.referrer, false)
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.id = 'sh-google-analytics';
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(tag);
  }

  function stopAnalytics() {
    window['ga-disable-' + measurementId] = true;
    // Désactivation immédiate ; pas de ping de refus envoyé à Google.
    if (!production) return;
    const domains = ['', location.hostname, '.' + location.hostname,
      'synergieshumaines.com', '.synergieshumaines.com'];
    document.cookie.split(';').forEach(part => {
      const name = part.split('=')[0].trim();
      if (name !== '_ga' && !name.startsWith('_ga_')) return;
      domains.forEach(domain => {
        document.cookie = name + '=; Max-Age=0; path=/' +
          (domain ? '; domain=' + domain : '') + '; SameSite=Lax; Secure';
      });
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    #sh-consent[hidden]{display:none!important}
    #sh-consent{position:fixed;inset:auto 12px 12px;z-index:2147483000;max-width:680px;margin:auto;
      max-height:calc(100dvh - 24px);overflow:auto;box-sizing:border-box;padding:20px;
      border:1px solid #cbd5e1;border-radius:14px;background:#fff;color:#16283d;
      box-shadow:0 6px 30px #0003;font:15px/1.5 system-ui,sans-serif}
    #sh-consent p{margin:0 0 12px}
    #sh-consent a{color:#16283d;text-decoration:underline}
    #sh-consent-actions{display:flex;gap:12px;flex-wrap:wrap}
    #sh-consent-actions button{flex:1 1 150px;min-height:44px;padding:10px 16px;border:1px solid #16283d;
      border-radius:8px;background:#16283d;color:white;cursor:pointer;font:600 15px system-ui,sans-serif}
    #sh-consent-actions button:focus-visible,#sh-consent-settings:focus-visible{outline:3px solid #e06d53;outline-offset:3px}
    #sh-consent-settings{display:block;margin:16px auto;padding:8px 12px;border:0;border-radius:4px;
      background:transparent;color:inherit;text-decoration:underline;cursor:pointer;font:inherit}
  `;
  document.head.appendChild(style);
  const banner = document.createElement('section');
  banner.id = 'sh-consent';
  banner.lang = 'fr';
  banner.className = 'notranslate';
  banner.setAttribute('translate', 'no');
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Choix de confidentialité');
  banner.hidden = true;
  banner.innerHTML = '<p>Avec votre accord nous analysons les visites pour améliorer ce site.</p>' +
    '<p><a href="/mentions.html">Confidentialité et cookies</a></p>' +
    '<div id="sh-consent-actions"><button type="button" id="sh-consent-refuse">Refuser</button>' +
    '<button type="button" id="sh-consent-accept">Accepter</button></div>';
  document.body.appendChild(banner);
  const settings = document.createElement('button');
  settings.type = 'button';
  settings.id = 'sh-consent-settings';
  settings.textContent = 'Mes choix de cookies';
  settings.lang = 'fr';
  settings.className = 'notranslate';
  settings.setAttribute('translate', 'no');
  settings.setAttribute('aria-controls', 'sh-consent');
  settings.setAttribute('aria-expanded', 'false');
  (document.querySelector('footer') || document.body).appendChild(settings);

  function show(focus) {
    previousFocus = document.activeElement;
    banner.hidden = false;
    settings.setAttribute('aria-expanded', 'true');
    if (focus) document.getElementById('sh-consent-refuse').focus();
  }
  function choose(value, persist) {
    choice = value;
    if (persist) {
      try { localStorage.setItem(storageKey, JSON.stringify({value: value, time: Date.now()})); }
      catch (_) { /* Le choix vaut au moins pour cette page. */ }
    }
    if (value === 'accepted') startAnalytics(); else stopAnalytics();
    banner.hidden = true;
    settings.setAttribute('aria-expanded', 'false');
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }
  settings.addEventListener('click', () => show(true));
  document.getElementById('sh-consent-accept').addEventListener('click', () => choose('accepted', true));
  document.getElementById('sh-consent-refuse').addEventListener('click', () => choose('refused', true));
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    const saved = readChoice();
    if (saved) choose(saved, false);
    else { choice = null; stopAnalytics(); show(false); }
  });
  window.shAnalyticsConsent = { open: () => show(true) };
  if (choice) choose(choice, false);
  else { stopAnalytics(); show(false); }
})();
