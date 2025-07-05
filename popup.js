document.addEventListener('DOMContentLoaded', async function() {
  const toggle = document.getElementById('toggle-darkmode');
  const statusText = document.getElementById('status');

  // Charger l'état actuel
  const result = await chrome.storage.sync.get(['darkMode']);
  const isDarkMode = result.darkMode || false;
  toggle.checked = isDarkMode;
  updateUI(isDarkMode);

  // Écouter les changements
  toggle.addEventListener('change', async function() {
    const isDarkMode = this.checked;
    
    try {
      // Sauvegarder l'état
      await chrome.storage.sync.set({ darkMode: isDarkMode });
      updateUI(isDarkMode);
      
      // Mettre à jour l'icône
      await updateExtensionIcon(isDarkMode);

      // Appliquer le mode sur l'onglet actif
      await applyDarkModeToCurrentTab(isDarkMode);
    } catch (error) {
      console.error('Erreur:', error);
    }
  });

  function updateUI(isDarkMode) {
    statusText.textContent = isDarkMode ? 'Mode sombre activé' : 'Mode clair activé';
    statusText.style.color = isDarkMode ? '#1E2A4A' : '#333';
  }

  async function updateExtensionIcon(isDark) {
    const iconPath = isDark ? "icons/icon-dark.svg" : "icons/icon.svg";
    await chrome.action.setIcon({ path: iconPath });
  }

  async function applyDarkModeToCurrentTab(isDarkMode) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) return;

    try {
      await chrome.tabs.sendMessage(tab.id, { darkMode: isDarkMode });
    } catch (error) {
      console.log('Injection du content script...');
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        await chrome.tabs.sendMessage(tab.id, { darkMode: isDarkMode });
      } catch (injectionError) {
        console.error('Échec de l\'injection:', injectionError);
      }
    }
  }
});