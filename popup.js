document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('toggle-darkmode');
  const statusText = document.getElementById('status');

  // Charger l'état actuel
  chrome.storage.sync.get(['darkMode'], function(result) {
    const isDarkMode = result.darkMode || false;
    toggle.checked = isDarkMode;
    updateUI(isDarkMode);
  });

  // Écouter les changements
  toggle.addEventListener('change', function() {
    const isDarkMode = this.checked;
    chrome.storage.sync.set({ darkMode: isDarkMode });
    updateUI(isDarkMode);
    
    // Mettre à jour l'icône
    chrome.action.setIcon({
      path: isDarkMode ? "icons/icon-dark.svg" : "icons/icon.svg"
    });

    // Envoyer le message à l'onglet actif
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { darkMode: isDarkMode });
    });
  });

  function updateUI(isDarkMode) {
    statusText.textContent = isDarkMode ? 'Mode sombre activé' : 'Mode clair activé';
    statusText.style.color = isDarkMode ? '#1E2A4A' : '#333';
  }
});