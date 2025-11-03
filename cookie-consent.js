/**
 * Cookie Consent Modal - Ó Caviar
 * GDPR compliant cookie consent banner
 * 
 * Features:
 * - Store user consent in localStorage
 * - Respects user preferences
 * - Easy to customize
 */

(function() {
  'use strict';

  // Configuration
  const CONSENT_KEY = 'ocaviar_cookie_consent';
  const CONSENT_VERSION = '1.0';
  
  // Create and inject modal styles
  function injectStyles() {
    const styleId = 'ocaviar-cookie-styles';
    
    // Check if styles already injected
    if (document.getElementById(styleId)) return;
    
    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      /* Cookie Consent Modal Styles */
      .cookie-consent-overlay {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(180deg, rgba(11, 15, 13, 0.95), rgba(11, 15, 13, 0.98));
        border-top: 1px solid rgba(200, 169, 106, 0.2);
        padding: 20px;
        z-index: 9999;
        animation: slideUp 0.4s ease-out;
        font-family: 'Poppins', system-ui, -apple-system, sans-serif;
        max-height: 90vh;
        overflow-y: auto;
      }

      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .cookie-consent-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        flex-wrap: wrap;
      }

      .cookie-consent-content {
        flex: 1;
        min-width: 280px;
      }

      .cookie-consent-title {
        font-family: 'Bordeaux Light', serif;
        font-size: 16px;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #c8a96a;
        margin: 0 0 8px;
        line-height: 1.2;
      }

      .cookie-consent-text {
        font-size: 13px;
        color: #cfc8b7;
        line-height: 1.5;
        margin: 0;
      }

      .cookie-consent-text a {
        color: #c8a96a;
        text-decoration: underline;
        cursor: pointer;
        transition: color 0.2s ease;
      }

      .cookie-consent-text a:hover {
        color: #ddb876;
      }

      .cookie-consent-buttons {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        min-width: 300px;
      }

      .cookie-btn {
        padding: 10px 16px;
        border-radius: 999px;
        border: 1px solid rgba(200, 169, 106, 0.35);
        background: transparent;
        color: #ece9e0;
        font-family: 'Poppins', system-ui, sans-serif;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        white-space: nowrap;
      }

      .cookie-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(200, 169, 106, 0.15);
      }

      .cookie-btn.primary {
        background: linear-gradient(135deg, rgba(200, 169, 106, 0.2), rgba(185, 122, 60, 0.08));
        border-color: #c8a96a;
        color: #c8a96a;
      }

      .cookie-btn.primary:hover {
        background: linear-gradient(135deg, rgba(200, 169, 106, 0.3), rgba(185, 122, 60, 0.15));
        border-color: #ddb876;
        color: #ddb876;
      }

      .cookie-btn.secondary {
        background: transparent;
        border-color: rgba(200, 169, 106, 0.2);
      }

      .cookie-btn.secondary:hover {
        border-color: #c8a96a;
        color: #c8a96a;
      }

      .cookie-settings-panel {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .cookie-settings-panel.active {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cookie-settings-content {
        background: linear-gradient(180deg, rgba(11, 15, 13, 0.99), rgba(11, 15, 13, 0.95));
        border: 1px solid rgba(200, 169, 106, 0.2);
        border-radius: 8px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideDown 0.3s ease-out;
      }

      @keyframes slideDown {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .cookie-settings-header {
        font-family: 'Bordeaux Light', serif;
        font-size: 20px;
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #c8a96a;
        margin-bottom: 24px;
        border-bottom: 1px solid rgba(200, 169, 106, 0.1);
        padding-bottom: 16px;
      }

      .cookie-category {
        margin-bottom: 20px;
      }

      .cookie-category-label {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        cursor: pointer;
      }

      .cookie-checkbox {
        width: 18px;
        height: 18px;
        accent-color: #c8a96a;
        cursor: pointer;
      }

      .cookie-category-name {
        font-weight: 500;
        color: #ece9e0;
        font-size: 14px;
      }

      .cookie-category-desc {
        font-size: 12px;
        color: #bdb7a6;
        margin-left: 30px;
        line-height: 1.4;
      }

      .cookie-settings-footer {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid rgba(200, 169, 106, 0.1);
      }

      .cookie-settings-footer .cookie-btn {
        flex: 1;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .cookie-consent-overlay {
          padding: 16px;
        }

        .cookie-consent-container {
          flex-direction: column;
          gap: 16px;
        }

        .cookie-consent-buttons {
          width: 100%;
          min-width: unset;
        }

        .cookie-btn {
          flex: 1;
          min-width: 120px;
        }

        .cookie-settings-content {
          padding: 24px;
          width: 95%;
        }
      }

      /* Accessibility */
      @media (prefers-reduced-motion: reduce) {
        .cookie-consent-overlay,
        .cookie-settings-content,
        .cookie-btn {
          animation: none;
          transition: none;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  // Create modal HTML
  function createModal() {
    const modal = document.createElement('div');
    modal.id = 'ocaviar-cookie-consent';
    modal.className = 'cookie-consent-overlay';
    modal.innerHTML = `
      <div class="cookie-consent-container">
        <div class="cookie-consent-content">
          <h2 class="cookie-consent-title">Your Cookie Preferences</h2>
          <p class="cookie-consent-text">
            We use cookies to enhance your browsing experience and analyze site traffic. 
            By clicking "Accept All", you consent to the use of all cookies. 
            <a href="./cookies-policy.html" target="_blank">Read our Cookies Policy</a>
          </p>
        </div>
        <div class="cookie-consent-buttons">
          <button class="cookie-btn secondary" id="ocaviar-cookie-settings">Settings</button>
          <button class="cookie-btn primary" id="ocaviar-cookie-accept">Accept All</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);

    // Create settings panel
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'ocaviar-cookie-settings-panel';
    settingsPanel.className = 'cookie-settings-panel';
    settingsPanel.innerHTML = `
      <div class="cookie-settings-content">
        <h3 class="cookie-settings-header">Cookie Settings</h3>
        
        <div class="cookie-category">
          <label class="cookie-category-label">
            <input type="checkbox" class="cookie-checkbox" id="cookie-necessary" checked disabled>
            <span class="cookie-category-name">Strictly Necessary</span>
          </label>
          <p class="cookie-category-desc">
            Essential for website functionality (navigation, security, checkout). These cannot be disabled.
          </p>
        </div>

        <div class="cookie-category">
          <label class="cookie-category-label">
            <input type="checkbox" class="cookie-checkbox" id="cookie-analytics">
            <span class="cookie-category-name">Analytics</span>
          </label>
          <p class="cookie-category-desc">
            Help us understand how you use our site to improve performance and user experience.
          </p>
        </div>

        <div class="cookie-category">
          <label class="cookie-category-label">
            <input type="checkbox" class="cookie-checkbox" id="cookie-marketing">
            <span class="cookie-category-name">Marketing</span>
          </label>
          <p class="cookie-category-desc">
            Allow us to personalize content and show relevant advertisements.
          </p>
        </div>

        <div class="cookie-settings-footer">
          <button class="cookie-btn secondary" id="ocaviar-cookie-reject">Reject All</button>
          <button class="cookie-btn primary" id="ocaviar-cookie-save">Save Preferences</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(settingsPanel);

    return { modal, settingsPanel };
  }

  // Check if user already consented
  function hasConsented() {
    const consent = localStorage.getItem(CONSENT_KEY);
    return consent !== null;
  }

  // Get user consent preferences
  function getConsent() {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      return {
        necessary: true,
        analytics: false,
        marketing: false,
        version: CONSENT_VERSION
      };
    }
    return JSON.parse(stored);
  }

  // Save consent preferences
  function saveConsent(preferences) {
    const consent = {
      necessary: true,
      analytics: preferences.analytics || false,
      marketing: preferences.marketing || false,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    
    // Dispatch custom event for analytics integration
    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: consent }));
    
    return consent;
  }

  // Show/hide settings panel
  function toggleSettingsPanel(show) {
    const panel = document.getElementById('ocaviar-cookie-settings-panel');
    if (show) {
      panel.classList.add('active');
      // Populate current preferences
      const consent = getConsent();
      document.getElementById('cookie-analytics').checked = consent.analytics;
      document.getElementById('cookie-marketing').checked = consent.marketing;
    } else {
      panel.classList.remove('active');
    }
  }

  // Hide consent modal
  function hideConsentModal() {
    const modal = document.getElementById('ocaviar-cookie-consent');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // Initialize
  function init() {
    // Inject styles first
    injectStyles();

    // Only show if user hasn't consented yet
    if (hasConsented()) {
      return;
    }

    // Create and show modal
    const { modal, settingsPanel } = createModal();

    // Event listeners
    document.getElementById('ocaviar-cookie-accept').addEventListener('click', () => {
      saveConsent({ analytics: true, marketing: true });
      hideConsentModal();
    });

    document.getElementById('ocaviar-cookie-settings').addEventListener('click', () => {
      toggleSettingsPanel(true);
    });

    document.getElementById('ocaviar-cookie-reject').addEventListener('click', () => {
      saveConsent({ analytics: false, marketing: false });
      hideConsentModal();
      toggleSettingsPanel(false);
    });

    document.getElementById('ocaviar-cookie-save').addEventListener('click', () => {
      const preferences = {
        analytics: document.getElementById('cookie-analytics').checked,
        marketing: document.getElementById('cookie-marketing').checked
      };
      saveConsent(preferences);
      hideConsentModal();
      toggleSettingsPanel(false);
    });

    // Close settings panel when clicking overlay
    settingsPanel.addEventListener('click', (e) => {
      if (e.target === settingsPanel) {
        toggleSettingsPanel(false);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose public API
  window.OcaviarCookieConsent = {
    getConsent: getConsent,
    saveConsent: saveConsent,
    reset: () => {
      localStorage.removeItem(CONSENT_KEY);
      location.reload();
    }
  };

})();
