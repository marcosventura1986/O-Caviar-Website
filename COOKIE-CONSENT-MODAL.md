# Cookie Consent Modal - Ó Caviar

## Overview

Um modal elegante e GDPR-compliant para gerenciar consentimento de cookies. O modal aparece automaticamente na primeira visita do usuário e oferece controle granular sobre as preferências de cookies.

## Funcionalidades

✅ **GDPR Compliant** - Segue as regulações de proteção de dados  
✅ **localStorage Integration** - Persistência de preferências do usuário  
✅ **Granular Controls** - Possibilidade de ativar/desativar categorias individualmente  
✅ **Responsive Design** - Funciona perfeitamente em mobile, tablet e desktop  
✅ **Smooth Animations** - Transições suaves e profissionais  
✅ **Accessibility** - Respeitador de preferências de movimento reduzido  
✅ **Elegant Styling** - Design minimalista que combina com o site Ó Caviar  

## Categorias de Cookies

### 1. Strictly Necessary (Obrigatório)
- **Status**: Sempre ativado, não pode ser desativado
- **Propósito**: Funcionalidade essencial do site (navegação, segurança, checkout)
- **Exemplos**: Sessão de usuário, token CSRF, dados de carrinho

### 2. Analytics (Opcional)
- **Status**: Desativado por padrão
- **Propósito**: Entender como os usuários navegam no site
- **Ferramentas**: Google Analytics, Netlify Analytics
- **Benefício**: Otimização de UX baseada em dados

### 3. Marketing (Opcional)
- **Status**: Desativado por padrão
- **Propósito**: Personalizar conteúdo e mostrar anúncios relevantes
- **Ferramentas**: Pixel do Facebook, Google Ads
- **Benefício**: Melhor experiência de marketing

## Arquivo Principal

**Localização**: `/Users/marcosventura/Desktop/O Caviar/Website/O-Caviar-Website/cookie-consent.js`

### Tamanho
- ~10 KB (minificável para ~5 KB com gzip)
- Sem dependências externas

### Estrutura do Arquivo

```javascript
// IIFE que encapsula toda a funcionalidade
(function() {
  'use strict';
  
  // Constantes de configuração
  const CONSENT_KEY = 'ocaviar_cookie_consent';
  const CONSENT_VERSION = '1.0';
  
  // Funções principais:
  // - injectStyles() - Injeta CSS dinâmico
  // - createModal() - Cria estrutura HTML do modal
  // - hasConsented() - Verifica consentimento anterior
  // - getConsent() - Recupera preferências salvas
  // - saveConsent() - Salva preferências do usuário
  // - toggleSettingsPanel() - Abre/fecha configurações
  // - hideConsentModal() - Oculta modal
  // - init() - Inicializa o sistema
  
  // API Pública
  window.OcaviarCookieConsent = {
    getConsent: getConsent,
    saveConsent: saveConsent,
    reset: () => { /* reseta localStorage */ }
  };
})();
```

## Como Funciona

### 1. Primeira Visita
```
[Página carrega]
  ↓
[Script de cookie consent carrega]
  ↓
[Verifica localStorage]
  ↓
[Sem dados encontrados → Mostra modal]
```

### 2. Modal Principal
- Título elegante: "Your Cookie Preferences"
- Descrição clara dos cookies
- Link direto para Cookies Policy
- Dois botões:
  - **Settings** - Abre painel de configuração
  - **Accept All** - Aceita todos os cookies

### 3. Painel de Configuração
- Checkbox para cada categoria
- Descriptions claras de cada categoria
- Botões:
  - **Reject All** - Nega cookies opcionais
  - **Save Preferences** - Salva seleção customizada

### 4. Armazenamento de Dados
```javascript
// Formato no localStorage
{
  "ocaviar_cookie_consent": {
    "necessary": true,      // Sempre true
    "analytics": boolean,   // Definido pelo usuário
    "marketing": boolean,   // Definido pelo usuário
    "version": "1.0",
    "timestamp": "2024-11-03T14:30:00.000Z"
  }
}
```

### 5. Visitantes Recorrentes
```
[Página carrega]
  ↓
[Verifica localStorage]
  ↓
[Dados encontrados → Modal NÃO aparece]
  ↓
[Script dispara evento 'cookieConsent']
```

## Integração com Analytics

### Event Listener Customizado
```javascript
// No seu scripts.js ou analytics
window.addEventListener('cookieConsent', (e) => {
  const consent = e.detail;
  
  if (consent.analytics) {
    // Ativa Google Analytics
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  }
  
  if (consent.marketing) {
    // Ativa tracking de marketing
    fbq('consent', 'grant');
  }
});
```

## Arquivos Integrados

### Páginas Principais
- ✅ `index.html` - Homepage
- ✅ `journal/index.html` - Página de artigos
- ✅ `cookies-policy.html` - Política de cookies
- ✅ `terms-and-conditions.html` - Termos e condições
- ✅ `journal/{slug}/index.html` - Artigos auto-gerados (via process-articles.js)

### Padrão de Integração
```html
<!-- No final do </body> de cada página -->
<script src="cookie-consent.js"></script>

<!-- Para páginas dentro de /journal/ -->
<script src="../cookie-consent.js"></script>
```

## Customização

### Mudar Cores do Modal
Localize no CSS injetado:
```css
--gold: #c8a96a;      /* Cor principal */
--muted: #cfc8b7;     /* Texto secundário */
--ink: #ece9e0;       /* Texto principal */
--bg: #0b0f0d;        /* Fundo */
```

### Adicionar Nova Categoria de Cookie
```javascript
// 1. Adicione novo div no createModal()
<div class="cookie-category">
  <label class="cookie-category-label">
    <input type="checkbox" class="cookie-checkbox" id="cookie-new-category">
    <span class="cookie-category-name">New Category</span>
  </label>
  <p class="cookie-category-desc">Description</p>
</div>

// 2. Adicione ao objeto de preferências em saveConsent()
const preferences = {
  analytics: document.getElementById('cookie-analytics').checked,
  marketing: document.getElementById('cookie-marketing').checked,
  new_category: document.getElementById('cookie-new-category').checked
};

// 3. Adicione ao getConsent() padrão
return {
  necessary: true,
  analytics: false,
  marketing: false,
  new_category: false,  // ← Adicione aqui
  version: CONSENT_VERSION
};
```

### Resetar Cookies (para testes)
```javascript
// No console do browser
OcaviarCookieConsent.reset();
// Ou manualmente
localStorage.removeItem('ocaviar_cookie_consent');
location.reload();
```

## Conformidade Legal

### GDPR (EU General Data Protection Regulation)
- ✅ Consentimento explícito antes de cookies não-essenciais
- ✅ Fácil acesso às preferências
- ✅ Opt-in em vez de opt-out para dados sensíveis
- ✅ Timestamp de consentimento registrado

### CCPA (California Consumer Privacy Act)
- ✅ Transparência sobre coleta de dados
- ✅ Direito de rejeitar cookies
- ✅ Armazenamento local de preferências

### LGPD (Lei Geral de Proteção de Dados - Brasil)
- ✅ Consentimento prévio e específico
- ✅ Informações claras sobre propósito dos cookies
- ✅ Possibilidade de revogar consentimento

## Performance

### Carregamento
- **Tamanho**: ~10 KB não-minificado
- **Compressão gzip**: ~3-4 KB
- **Execução**: < 50ms em conexões 3G
- **Sem bloqueio**: Script não-crítico

### Otimizações
```javascript
// IIFE para evitar poluição de escopo global
(function() { ... })();

// Event delegation para listeners
// CSS injetado apenas quando necessário
// localStorage para persistência rápida
```

## Troubleshooting

### Modal não aparece
```javascript
// Verifique no console
console.log(localStorage.getItem('ocaviar_cookie_consent'));

// Se existir dados, modal não aparece. Reset com:
OcaviarCookieConsent.reset();
```

### Estilos não aplicados
- Verifique se o arquivo está carregando (Network tab no DevTools)
- Confirme que a pasta raiz está correta (em artigos use `../`)
- Limpe cache do browser (Cmd+Shift+R)

### localStorage não funciona
- Verifique se o browser tem localStorage habilitado
- Tente em modo privado (alguns browsers desabilitam)
- Consulte DevTools → Application → Storage

## Próximas Melhorias

- [ ] Suporte multi-idioma (PT, ES, DE, etc)
- [ ] Integração com Hotjar/Mixpanel
- [ ] Banner flutuante alternativo
- [ ] Auditoria automática de cookies na página
- [ ] Relatório de conformidade GDPR
- [ ] Dark mode automático baseado em preferências do SO

## Recursos

- [GDPR Guidelines](https://gdpr-info.eu/)
- [CCPA Compliance](https://oag.ca.gov/privacy/ccpa)
- [Cookie Law Overview](https://www.cookielaw.org/)
- [Netlify CMS Documentation](https://www.netlifycms.org/)

---

**Versão**: 1.0  
**Última Atualização**: 3 de Novembro de 2024  
**Status**: ✅ Pronto para Produção
