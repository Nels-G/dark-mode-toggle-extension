// Vérifier si le script est déjà injecté
if (!window.nightSwitchInjected) {
  window.nightSwitchInjected = true;
  
  console.log('NightSwitch content script loaded');

  // Écouteur pour les messages
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.darkMode !== undefined) {
      console.log('Received dark mode state:', request.darkMode);
      applyDarkMode(request.darkMode);
      sendResponse({ success: true });
    }
    return true;
  });

  // Fonction d'application du dark mode
  function applyDarkMode(enable) {
    if (enable) {
      console.log('Applying dark mode');
      document.documentElement.classList.add('nightswitch-dark');
      document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
      document.body.style.backgroundColor = '#111';
      
      // Corriger les images/vidéos
      const mediaElements = document.querySelectorAll('img, video, iframe, picture');
      mediaElements.forEach(el => {
        el.style.filter = 'invert(1) hue-rotate(180deg)';
      });
    } else {
      console.log('Removing dark mode');
      document.documentElement.classList.remove('nightswitch-dark');
      document.documentElement.style.filter = 'none';
      document.body.style.backgroundColor = '';
      
      const mediaElements = document.querySelectorAll('img, video, iframe, picture');
      mediaElements.forEach(el => {
        el.style.filter = 'none';
      });
    }
  }

  // Charger l'état initial
  chrome.storage.sync.get(['darkMode'], function(result) {
    if (result.darkMode !== undefined) {
      applyDarkMode(result.darkMode);
    }
  });
}