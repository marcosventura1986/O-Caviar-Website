# Ó Caviar Website - Sistema de Gerenciamento de Conteúdo

## Como usar o sistema CMS

### Acesso ao painel administrativo
1. Vá para: `https://seu-site.netlify.app/admin/`
2. Faça login com suas credenciais Netlify
3. O painel do CMS será carregado automaticamente

### Criando um novo artigo
1. No painel admin, clique em "Journal Articles"
2. Clique em "New Journal Articles" 
3. Preencha os campos:
   - **Title**: Título do artigo
   - **Date**: Data de publicação
   - **Excerpt**: Resumo breve (aparece nos cards)
   - **Hero Image**: Imagem principal do artigo
   - **Slug**: URL do artigo (será gerado automaticamente)
   - **Tags**: Palavras-chave do artigo
   - **Body**: Conteúdo principal do artigo
4. Clique em "Publish" quando terminar

### Editando um artigo existente
1. No painel, selecione o artigo na lista
2. Faça as alterações necessárias
3. Clique em "Publish" para salvar

### Deletando um artigo
1. Selecione o artigo
2. Clique em "Delete" 
3. Confirme a ação
4. O artigo será removido automaticamente do site

## Como o sistema funciona

### Processamento automático
- Quando você cria/edita um artigo no CMS, ele é salvo como arquivo markdown
- Um sistema automático converte esses arquivos em páginas HTML completas
- O arquivo `articles.json` é atualizado automaticamente
- O site principal carrega os artigos mais recentes dinamicamente

### Sincronização
- Mudanças no CMS são refletidas no site automaticamente
- O sistema mantém consistência entre todos os artigos
- Deletar um artigo remove tanto o conteúdo quanto a entrada na lista

### Estrutura de arquivos (para referência técnica)
```
journal/
├── _articles/           # Arquivos markdown do CMS
├── articles.json        # Lista de todos os artigos
├── [slug-do-artigo]/   # Páginas HTML geradas automaticamente
│   └── index.html
└── index.html          # Página principal do journal
```

## Dicas de uso

### Imagens
- Use imagens de alta qualidade (mínimo 1200px de largura)
- Prefira formato JPG para fotos, PNG para gráficos
- Nomes de arquivo devem ser simples, sem espaços ou caracteres especiais

### Títulos
- Mantenha títulos concisos mas descritivos
- Evite títulos muito longos (máximo 60 caracteres)

### Excerpts (Resumos)
- Escreva resumos envolventes de 1-2 frases
- Máximo 150 caracteres para melhor apresentação

### Tags
- Use tags relevantes e consistentes
- Máximo 5 tags por artigo
- Prefira tags em inglês para consistência

### Conteúdo
- Escreva em markdown para melhor formatação
- Use parágrafos curtos para facilitar a leitura
- Inclua subtítulos para organizar o conteúdo

## Formatação de texto (Markdown)

### Básico
- **Negrito**: `**texto**`
- *Itálico*: `*texto*`
- Títulos: `## Título` (use ## para subtítulos)

### Parágrafos
- Deixe uma linha em branco entre parágrafos
- Para quebra de linha, termine com dois espaços

### Listas
```
- Item 1
- Item 2
- Item 3
```

## Suporte técnico

Se encontrar problemas:
1. Verifique sua conexão com a internet
2. Tente fazer logout e login novamente no CMS
3. Limpe o cache do navegador
4. Entre em contato com o suporte técnico

## Backup e segurança

- Todos os artigos são automaticamente salvos no Git
- O sistema mantém histórico de versões
- Mudanças podem ser revertidas se necessário
- Faça backup regular das imagens importantes

---

**Lembre-se**: Após criar ou editar artigos, aguarde alguns minutos para que as mudanças apareçam no site público. O sistema processa as alterações automaticamente.