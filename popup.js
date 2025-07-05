document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('toggle-darkmode');
  const statusText = document.getElementById('status');

  // Fonction pour envoyer le message à l'onglet actif
  const sendMessageToTab = (isDarkMode) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Vérifie qu'un onglet est bien trouvé
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { darkMode: isDarkMode })
          .catch(err => console.log("Onglet non disponible", err));
      }
    });
  };

  // Charger l'état initial
  chrome.storage.sync.get(['darkMode'], (result) => {
    const isDarkMode = result.darkMode || false;
    toggle.checked = isDarkMode;
    updateUI(isDarkMode);
  });

  // Gestion du toggle
  toggle.addEventListener('change', function() {
    const isDarkMode = this.checked;
    chrome.storage.sync.set({ darkMode: isDarkMode });
    updateUI(isDarkMode);
    
    // Mettre à jour l'icône
    chrome.action.setIcon({
      path: isDarkMode ? "icons/icon-dark.svg" : "icons/icon.svg"
    });

    // Envoyer le message
    sendMessageToTab(isDarkMode);
  });

  function updateUI(isDarkMode) {
    statusText.textContent = isDarkMode ? 'Mode sombre activé' : 'Mode clair activé';
    statusText.style.color = isDarkMode ? '#1E2A4A' : '#333';
  }
});