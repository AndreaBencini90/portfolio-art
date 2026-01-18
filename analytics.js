// analytics.js
(function () {
  const GA_ID = 'G-NXDWCDVM1V'; // <-- il tuo ID GA4

  // Funzione globale per avviare GA4 su richiesta
  window.startAnalytics = function() {
    if (window.ga_initialized) return;

    console.log('🚀 Google Analytics avviato (ID: ' + GA_ID + ')');

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    
    window.ga_initialized = true;
    localStorage.setItem('cookie_consent', 'accepted');
  };

  // Se l'utente ha già dato il consenso in passato, avvia subito
  // DISABILITATO TEMPORANEAMENTE
  // if (localStorage.getItem('cookie_consent') === 'accepted') {
  //   window.startAnalytics();
  // }
})();
