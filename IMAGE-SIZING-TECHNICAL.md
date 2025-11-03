# 📏 Image Sizing - CSS Reference

Este documento técnico mostra como o CSS gerencia os tamanhos de imagem no site Ó Caviar.

## Sistema de Aspect Ratio

### CSS aplicado automaticamente:

```css
/* object-fit: cover garante que imagens nunca ficam distorcidas */
img {
  width: 100%;
  height: auto;
  object-fit: cover;  /* Preenche o espaço, cortando se necessário */
}
```

---

## Tamanhos por Contexto

### 1. **Hero Images** (16:9)
```css
.hero-image {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
}
```
- Usado em: Headers de artigos
- Tamanho real: 1600×900px
- Redimensiona responsivamente

### 2. **Journal Cards** (16:9)
```css
.journal-card-image-wrapper {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.journal-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```
- Usado em: /journal/ page
- Tamanho real: 800×450px
- Animação de zoom no hover

### 3. **Homepage Cards** (1:1)
```css
.ph {
  aspect-ratio: 1 / 1;
  object-fit: cover;
}
```
- Usado em: Homepage (3 artigos)
- Tamanho real: 400×300px
- Quadrado perfeito

### 4. **Product Cards** (4:5)
```css
.ph-tall .ph {
  aspect-ratio: 4 / 5;
  object-fit: cover;
}
```
- Usado em: Página de produtos
- Tamanho real: 400×500px
- Proporção retrato

---

## Como Funciona object-fit: cover

### Cenários:

**Imagem muito larga:**
```
Imagem:    ████████████████████████ (muito larga)
Container: ████████ (espaço disponível)
Resultado: [cortada nas laterais] (bem centrada)
```

**Imagem muito alta:**
```
Imagem:    ▓
           ▓
           ▓
           ▓
Container: ▒▒▒
Resultado: [cortada no topo/fundo] (bem centrada)
```

**Imagem do tamanho certo:**
```
Resultado: [perfeita, sem corte]
```

---

## Responsividade

O sistema é totalmente responsivo. O CSS automaticamente:

1. Redimensiona baseado na largura do container
2. Mantém aspect ratio em qualquer tamanho
3. Corta inteligentemente para preencher o espaço
4. Funciona em desktop, tablet e mobile

---

## Breakpoints Importantes

```css
/* Desktop: Imagens em tamanho máximo */
@media (min-width: 1200px) {
  /* 100% largura máxima */
}

/* Tablet: Imagens escaladas proporcionalmente */
@media (max-width: 768px) {
  /* Reduz padding, mantém aspect ratio */
}

/* Mobile: Imagens otimizadas para tela pequena */
@media (max-width: 480px) {
  /* Reduz tamanho, melhor performance */
}
```

---

## Performance

### Lazy Loading
```html
<img src="..." loading="lazy" width="800" height="450">
```
- Imagens carregam sob demanda
- Melhora performance inicial

### Dimensões HTML
```html
<img ... width="800" height="450">
```
- Avita "layout shift" enquanto imagem carrega
- Navegador reserva espaço correto

### Formatos Otimizados
- JPG: Fotos e gradientes (padrão)
- WebP: Performance (~30% menor)
- PNG: Apenas com transparência

---

## Exemplo de Uso Completo

### HTML correto:
```html
<div class="journal-card-image-wrapper">
  <img 
    src="/assets/journal/artigo.jpg"
    alt="Artigo sobre caviar premium"
    width="800"
    height="450"
    loading="lazy"
    class="journal-card-image"
  >
</div>
```

### CSS que o site aplica:
```css
.journal-card-image-wrapper {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.journal-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;  /* Magic! */
  transition: transform 0.3s ease;
}
```

### Resultado:
- ✅ Imagem sempre com proporção 16:9
- ✅ Nunca distorcida
- ✅ Responsiva em todos os tamanhos
- ✅ Zoom suave no hover

---

## Troubleshooting

### "Minha imagem aparece esticada/comprimida"
→ CSS está usando `object-fit: cover`, não deve acontecer. Recarregue a página (Cmd+Shift+R).

### "A imagem foi cortada demais"
→ Verifique se a imagem tem a proporção certa (16:9 para cards, 1:1 para homepage).

### "Porque a imagem é cortada?"
→ `object-fit: cover` corta proporcionalmente para preencher o espaço. É o comportamento esperado para manter consistência.

---

## Próximas Otimizações

Possíveis melhorias futuras:
- [ ] AVIF format (melhor que WebP)
- [ ] Srcset para diferentes resoluções
- [ ] CDN com cache agressivo
- [ ] Image compression pipeline
- [ ] Responsive images com picture element

---

**Documentação técnica | Ó Caviar Website**  
*Última atualização: 3 de Novembro de 2025*
