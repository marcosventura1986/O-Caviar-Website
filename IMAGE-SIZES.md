# 🖼️ Guia de Tamanhos de Imagem - Ó Caviar

## 📐 Tamanhos Padronizados

Para garantir uma experiência visual consistente em todo o site, use os seguintes tamanhos para suas imagens:

---

## 1️⃣ **HERO IMAGES** (Artigos e Páginas Principais)
Usado em: Headers de artigos individuais, hero banners

### **Tamanho recomendado:**
- **Largura**: 1600px
- **Altura**: 900px
- **Aspect Ratio**: 16:9
- **Formato**: JPG ou WebP
- **Tamanho de arquivo**: 100-200KB

### **Exemplo:**
```
champagne-beluga-hero.jpg (1600x900)
irish-linen-stone-hero.jpg (1600x900)
```

**Como usar:**
```html
<img src="/assets/journal/meu-artigo-hero.jpg" 
     alt="Article hero image"
     width="1600"
     height="900"
     style="aspect-ratio: 16/9; object-fit: cover;">
```

---

## 2️⃣ **JOURNAL CARDS** (Thumbnails no Index)
Usado em: Página `/journal/`, cards de artigos na lista

### **Tamanho recomendado:**
- **Largura**: 800px
- **Altura**: 450px
- **Aspect Ratio**: 16:9
- **Formato**: JPG ou WebP
- **Tamanho de arquivo**: 50-100KB

### **Exemplo:**
```
2024-11-15-champagne-beluga-pairing.jpg (800x450)
2024-12-01-irish-linen-stone.jpg (800x450)
```

**CSS Aplicado Automaticamente:**
```css
.journal-card-image {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;  /* Corta a imagem para manter proporção */
}
```

---

## 3️⃣ **HOMEPAGE JOURNAL CARDS** (Cards na Seção Journal)
Usado em: Homepage do site (3 artigos mais recentes)

### **Tamanho recomendado:**
- **Largura**: 400px
- **Altura**: 300px
- **Aspect Ratio**: 4:3
- **Formato**: JPG ou WebP
- **Tamanho de arquivo**: 40-80KB

### **Exemplo:**
```
serving.jpg (400x300)
pairings.jpg (400x300)
linen.jpg (400x300)
```

**CSS Aplicado Automaticamente:**
```css
.ph {
  aspect-ratio: 3 / 3;  /* Quadrado */
  object-fit: cover;
}
```

---

## 4️⃣ **PRODUCT IMAGES**
Usado em: Página de produtos, catálogo

### **Tamanho recomendado:**
- **Largura**: 400px
- **Altura**: 500px
- **Aspect Ratio**: 4:5
- **Formato**: JPG ou WebP
- **Tamanho de arquivo**: 50-100KB

**CSS Aplicado Automaticamente:**
```css
.ph-tall .ph {
  aspect-ratio: 3 / 4;  /* Retrato */
  object-fit: cover;
}
```

---

## 📋 Tabela Rápida de Referência

| Tipo | Tamanho | Aspect Ratio | Arquivo | Onde Usar |
|------|---------|--------------|---------|-----------|
| **Hero** | 1600×900 | 16:9 | 100-200KB | Artigos, banners principais |
| **Journal Card** | 800×450 | 16:9 | 50-100KB | /journal/ page |
| **Homepage Card** | 400×300 | 4:3 | 40-80KB | Homepage (3 artigos) |
| **Product** | 400×500 | 4:5 | 50-100KB | Página de produtos |

---

## 🎨 Formatos Recomendados

1. **JPG** - Para fotografias e imagens com gradientes
   - Qualidade: 80-85%
   - Compressão: Máxima possível sem perder qualidade

2. **WebP** - Para melhor performance (opcional)
   - Reduz tamanho em ~30% comparado a JPG
   - Suportado em navegadores modernos

3. **PNG** - Apenas para imagens que precisam de transparência
   - Use com moderação (aumenta tamanho)

---

## 🔧 Como o Sistema Funciona

### **Object-fit: cover**
```css
object-fit: cover;  /* Preenche o espaço, cortando se necessário */
```

Isso significa que **NÃO IMPORTA o tamanho da sua imagem**, o CSS a ajustará para caber perfeitamente na área designada, mantendo as proporções. Algumas partes podem ser cortadas, mas a imagem nunca ficará distorcida.

### **Aspect-ratio**
```css
aspect-ratio: 16 / 9;  /* Mantém proporção 16:9 em qualquer tamanho */
```

O navegador automaticamente reserva o espaço correto baseado nesta proporção.

---

## ✅ Checklist para Seu Cliente

Ao enviar imagens, certifique-se de:

- ✅ Tamanho correto (veja tabela acima)
- ✅ Formato: JPG ou WebP
- ✅ Qualidade razoável (não muito comprimida)
- ✅ Sem watermarks ou logos (exceto intencional)
- ✅ Nome descritivo do arquivo (ex: `artigo-caviar-premium.jpg`)
- ✅ Imagem boa para a proporção (não muito de lado)

---

## 🚀 Otimização de Performance

### **Dicas para melhor performance:**

1. **Use ferramentas online de compressão:**
   - TinyJPG: https://tinyjpg.com
   - ImageOptim (Mac)
   - FileZilla Compress

2. **Dimensões finais:**
   - Não envie imagens maiores que necessário
   - O servidor não redimensiona automaticamente
   - Seu cliente é responsável pelo tamanho correto

3. **Lazy Loading:**
   - O site carrega imagens sob demanda
   - Imagens fora da tela são carregadas apenas quando necessário

---

## 📞 Instruções para Seu Cliente

### **"Enviando uma imagem para o artigo do Journal:"**

1. Prepare sua imagem (ex: foto em alta resolução)
2. Redimensione para **1600×900px** (veja tabela acima)
3. Comprima o arquivo para ~150KB máximo
4. Nomeie descritivamente (ex: `pairing-champagne.jpg`)
5. Envie para o CMS do Netlify

### **"O site não exibe sua imagem do tamanho certo?"**

- Verifique se a imagem é verdadeiramente naquele tamanho (verifique propriedades)
- A imagem será **cortada/escalada automaticamente** para manter proporções
- Se parece desproporcionada, tente uma foto que se encaixe melhor na proporção

---

## 💡 Exemplos de Uso Real

### **HTML para Hero Image:**
```html
<img src="/assets/journal/artigo-hero.jpg" 
     alt="Featured article image"
     width="1600"
     height="900"
     loading="lazy"
     style="aspect-ratio: 16/9; object-fit: cover; width: 100%; height: auto;">
```

### **HTML para Card Image:**
```html
<img src="/assets/journal/artigo-thumb.jpg" 
     alt="Article card thumbnail"
     width="800"
     height="450"
     loading="lazy"
     style="aspect-ratio: 16/9; object-fit: cover; width: 100%; height: auto;">
```

---

## 🔐 Manutenção

Todos os tamanhos são definidos em **2 arquivos CSS**:

- `styles.css` - Estilos principais do site
- `journal/journal.css` - Estilos específicos do journal

Caso precise ajustar algum tamanho:
1. Localize a classe CSS (ex: `.journal-card-image`)
2. Ajuste `aspect-ratio` conforme necessário
3. Limpe cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)

---

## 📧 Suporte

Se o cliente tiver dúvidas sobre tamanhos de imagem:
1. Aponte para esta documentação
2. Forneça exemplos de imagens que funcionaram bem
3. Teste a imagem localmente antes de fazer push

---

**Última atualização:** 3 de Novembro de 2025  
**Versão:** 1.0
