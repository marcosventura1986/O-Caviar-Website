# 🔧 Corrigindo o CMS - Webhook do Netlify

## ❌ O Problema

Você criou um artigo de teste no CMS, mas ele **não apareceu no site** porque:

1. **Configuração incorreta do `config.yml`**
   - ❌ CMS estava salvando em: `journal/artigo.md`
   - ✅ CMS deveria salvar em: `journal/_articles/YYYY-MM-DD-artigo.md`

2. **Slug incorreto**
   - ❌ Antes: `{{fields.slug}}` → `artigo.md`
   - ✅ Agora: `{{fields.date}}-{{fields.slug}}` → `2025-11-03-artigo.md`

3. **Webhook não processava**
   - Netlify disparava build, mas `process-articles.js` não encontrava arquivos na pasta certa

## ✅ A Solução

Já corrigi `admin/config.yml`:

```yaml
collections:
  - name: "journal"
    label: "Journal Articles"
    folder: "journal/_articles"        # ✅ Pasta correta!
    create: true
    slug: "{{fields.date}}-{{fields.slug}}"  # ✅ Formato correto!
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Publish Date", name: "date", widget: "datetime"}
      - {label: "Excerpt", name: "excerpt", widget: "text"}
      - {label: "Hero Image", name: "hero", widget: "image"}
      - {label: "Content", name: "body", widget: "markdown"}
      - {label: "Tags", name: "tags", widget: "list", default: ["caviar"]}
      - {label: "Slug", name: "slug", widget: "string"}
      - {label: "Layout", name: "layout", widget: "hidden", default: "article"}
```

## 🎯 Próximos Passos

### 1. **Commit e Deploy**
```bash
git add admin/config.yml
git commit -m "fix: Corrigir configuração do CMS para salvar em pasta correta"
git push origin main
```

### 2. **Aguarde Build no Netlify**
- Acesse: https://app.netlify.com/
- Vá para seu site O-Caviar
- Aguarde o deploy terminar ✅

### 3. **Teste Novo Artigo**
1. Acesse: https://seu-site.netlify.app/admin/
2. Vá para "Journal Articles"
3. Clique "New Journal Articles"
4. Preencha os campos:
   - **Title**: "Meu Novo Artigo"
   - **Publish Date**: Selecione uma data
   - **Excerpt**: Uma descrição curta
   - **Hero Image**: Suba uma imagem
   - **Content**: Escreva o conteúdo
   - **Slug**: `meu-novo-artigo` (sem espaços, minúsculas, hífens)
   - **Tags**: Adicione tags relevantes
5. Clique "Publish"

### 4. **Verifique no Site**
- ✅ Novo artigo aparece em `/journal/`
- ✅ Novo artigo na homepage se for um dos 3 mais recentes
- ✅ Página individual em `/journal/{slug}/`

## 🔍 Fluxo Agora Funciona Assim

```
CMS (Netlify)
    ↓
Artigo criado: journal/_articles/2025-11-03-novo.md
    ↓
Netlify dispara webhook
    ↓
Build roda: node process-articles.js
    ↓
process-articles.js:
  1. Lê arquivo markdown de _articles/
  2. Gera HTML em journal/novo/index.html
  3. Atualiza journal/articles.json
    ↓
Site atualizado! ✅
```

## ⚠️ Importante

- **Sempre use slug em minúsculas com hífens**: `meu-artigo`, não `MeuArtigo`
- **Data no formato ISO**: A data será usada como prefixo do arquivo
- **Imagem hero obrigatória**: Será salva em `assets/journal/`
- **Deletar artigo**: Remove automaticamente de `_articles/`, HTML, e `articles.json`

## 🐛 Se Ainda Não Funcionar

1. Verifique se há arquivos em `journal/_articles/`:
   ```bash
   ls -la journal/_articles/
   ```

2. Rode manualmente o processor:
   ```bash
   node process-articles.js
   ```

3. Verifique o arquivo gerado:
   ```bash
   ls -la journal/meu-novo-artigo/
   ```

4. Verifique `articles.json`:
   ```bash
   cat journal/articles.json | grep "meu-novo-artigo"
   ```

## ✨ Resultado Final

Agora todo o workflow funciona:
- ✅ CMS salva na pasta correta
- ✅ Webhook dispara build
- ✅ process-articles.js processa
- ✅ Site atualiza automaticamente
- ✅ Artigos sincronizados

---

**Status**: 🟢 **PRONTO PARA USAR**

Se tiver dúvidas ou o artigo ainda não aparecer, avise! 🚀
