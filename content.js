// Liste des sites avec mode sombre natif
const DARK_MODE_NATIVE_SITES = [
  'twitter.com',
  'reddit.com',
  'youtube.com',
  'github.com',
  'discord.com'
];

// Liste des sites problématiques
const PROBLEMATIC_SITES = [
  'google.com',
  'google.fr',
  'facebook.com'
];

function shouldSkipDarkMode() {
  const hostname = window.location.hostname;
  return DARK_MODE_NATIVE_SITES.some(site => hostname.includes(site));
}

function isProblematicSite() {
  const hostname = window.location.hostname;
  return PROBLEMATIC_SITES.some(site => hostname.includes(site));
}

function applyCompatibleDarkMode() {
  // Solution alternative pour Google
  if (window.location.hostname.includes('google.')) {
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#e0e0e0';
    return;
  }
  // Ajouter d'autres cas spécifiques ici
}

function applyDarkMode(enable) {
  if (shouldSkipDarkMode()) return;
  
  try {
    if (enable) {
      if (isProblematicSite()) {
        applyCompatibleDarkMode();
      } else {
        document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
        document.body.style.backgroundColor = '#111';
        
        const mediaElements = document.querySelectorAll('img, video, iframe');
        mediaElements.forEach(el => {
          el.style.filter = 'invert(1) hue-rotate(180deg)';
        });
      }
    } else {
      document.documentElement.style.filter = 'none';
      document.body.style.backgroundColor = '';
      
      const mediaElements = document.querySelectorAll('img, video, iframe');
      mediaElements.forEach(el => {
        el.style.filter = 'none';
      });
    }
  } catch (err) {
    console.error("NightSwitch error:", err);
  }
}