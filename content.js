// Écouter les messages du popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  applyDarkMode(request.darkMode);
});

// Charger l'état au démarrage
chrome.storage.sync.get(['darkMode'], function(result) {
  applyDarkMode(result.darkMode || false);
});

function applyDarkMode(enable) {
  if (enable) {
    document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
    document.body.style.backgroundColor = '#111';
    
    // Corriger les images/vidéos
    const mediaElements = document.querySelectorAll('img, video, iframe');
    mediaElements.forEach(el => {
      el.style.filter = 'invert(1) hue-rotate(180deg)';
    });
  } else {
    document.documentElement.style.filter = 'none';
    document.body.style.backgroundColor = '';
    
    const mediaElements = document.querySelectorAll('img, video, iframe');
    mediaElements.forEach(el => {
      el.style.filter = 'none';
    });
  }
}