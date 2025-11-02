#!/usr/bin/env node

/**
 * Automated Journal Article Processor
 * Converts Netlify CMS markdown files to complete article system
 */

const fs = require('fs').promises;
const path = require('path');

async function processArticles() {
    console.log('🚀 Processing CMS articles...');
    
    try {
        // Read all markdown files from _articles
        const articlesDir = path.join(__dirname, 'journal', '_articles');
        const files = await fs.readdir(articlesDir);
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        
        console.log(`📄 Found ${markdownFiles.length} articles to process`);
        
        const articles = [];
        
        for (const file of markdownFiles) {
            const filePath = path.join(articlesDir, file);
            const content = await fs.readFile(filePath, 'utf8');
            
            // Parse frontmatter and content
            const article = parseFrontMatter(content);
            
            if (article) {
                // Generate slug from filename if not provided
                if (!article.slug) {
                    article.slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');
                }
                
                // Add to articles array
                articles.push({
                    slug: article.slug,
                    title: article.title,
                    date: article.date,
                    excerpt: article.excerpt,
                    hero: article.hero,
                    tags: article.tags || ['caviar']
                });
                
                // Create individual article page
                await createArticlePage(article);
                
                console.log(`✅ Processed: ${article.title}`);
            }
        }
        
        // Update articles.json with all articles (existing + new)
        await updateArticlesJSON(articles);
        
        console.log('🎉 All articles processed successfully!');
        console.log('📋 Your client can now see their articles on the website');
        
    } catch (error) {
        console.error('❌ Error processing articles:', error);
    }
}

function parseFrontMatter(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (!match) return null;
    
    const frontMatter = match[1];
    const body = match[2];
    
    // Parse YAML-like frontmatter
    const article = { body };
    const lines = frontMatter.split('\n').filter(line => line.trim());
    
    let i = 0;
    while (i < lines.length) {
        const line = lines[i].trim();
        
        if (line.includes(':') && !line.startsWith('-')) {
            const colonIndex = line.indexOf(':');
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // Handle different data types
            if (key === 'tags') {
                // Parse tags array
                const tagLines = [];
                i++;
                while (i < lines.length && lines[i].trim().startsWith('-')) {
                    let tagValue = lines[i].trim().substring(1).trim();
                    // Remove quotes from tag values
                    if ((tagValue.startsWith('"') && tagValue.endsWith('"')) || 
                        (tagValue.startsWith("'") && tagValue.endsWith("'"))) {
                        tagValue = tagValue.slice(1, -1);
                    }
                    tagLines.push(tagValue);
                    i++;
                }
                article.tags = tagLines;
                i--; // Back up one since we'll increment at the end
            } else {
                article[key] = value;
            }
        }
        i++;
    }
    
    return article;
}

async function createArticlePage(article) {
    // Create article directory
    const articleDir = path.join(__dirname, 'journal', article.slug);
    await fs.mkdir(articleDir, { recursive: true });
    
    // Generate HTML content
    const htmlContent = generateArticleHTML(article);
    
    // Write article page
    const articlePath = path.join(articleDir, 'index.html');
    await fs.writeFile(articlePath, htmlContent);
}

function generateArticleHTML(article) {
    const formattedDate = new Date(article.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${article.title} — Ó Caviar</title>
  <meta name="description" content="${article.excerpt}" />
  <meta name="theme-color" content="#0b0f0d" />
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&subset=latin&display=swap" rel="stylesheet">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="../../styles.css" />
  <link rel="stylesheet" href="../journal.css" />
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  
  <!-- SEO Meta Tags -->
  <meta property="og:title" content="${article.title} — Ó Caviar" />
  <meta property="og:description" content="${article.excerpt}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="${article.hero}" />
  <meta property="og:url" content="https://ocaviar.example/journal/${article.slug}/" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${article.title} — Ó Caviar" />
  <meta name="twitter:description" content="${article.excerpt}" />
  <meta name="twitter:image" content="${article.hero}" />
  
  <link rel="canonical" href="https://ocaviar.example/journal/${article.slug}/" />
  
  <!-- Preload hero image -->
  <link rel="preload" href="${article.hero}" as="image" fetchpriority="high">

  <!-- JSON-LD structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${article.title}",
    "image": "${article.hero}",
    "datePublished": "${article.date}",
    "author": {
      "@type": "Organization",
      "name": "Ó Caviar"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ó Caviar",
      "logo": {
        "@type": "ImageObject",
        "url": "../../images/logo.png"
      }
    },
    "description": "${article.excerpt}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://ocaviar.example/journal/${article.slug}/"
    }
  }
  </script>
</head>

<body class="journal">
  <!-- Skip to content link -->
  <a href="#main-content" class="journal-skip-link">Skip to main content</a>

  <!-- Site Header -->
  <header class="site-header">
    <nav class="nav-container">
      <div class="nav-brand">
        <a href="../../" aria-label="Ó Caviar Home">
          <img src="../../images/inline_logo.svg" alt="Ó Caviar" class="logo">
        </a>
      </div>
      
      <ul class="nav-links">
        <li><a href="../../#about">About</a></li>
        <li><a href="../../#collection">Collection</a></li>
        <li><a href="../../#process">Process</a></li>
        <li><a href="../../#mission">Mission & Vision</a></li>
        <li><a href="../">Journal</a></li>
        <li><a href="../../#sensory">Sensory Journey</a></li>
        <li><a href="../../#contact">Contact</a></li>
        <li><a href="../../#shop">Shop</a></li>
      </ul>

      <button class="hamburger" onclick="toggleDrawer()" aria-label="Toggle navigation menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </nav>

      <div id="drawer" class="drawer">
      <a href="../../#about" onclick="toggleDrawer(false)">About</a>
      <a href="../../#collection" onclick="toggleDrawer(false)">Collection</a>
      <a href="../../#process" onclick="toggleDrawer(false)">Process</a>
      <a href="../../#mission" onclick="toggleDrawer(false)">Mission & Vision</a>
      <a href="../" onclick="toggleDrawer(false)">Journal</a>
      <a href="../../#sensory" onclick="toggleDrawer(false)">Sensory Journey</a>
      <a href="../../#contact" onclick="toggleDrawer(false)">Contact</a>
      <a href="../../#shop" onclick="toggleDrawer(false)">Shop</a>
    </div>
  </header>

  <!-- Main Content -->
  <main id="main-content" class="journal-main">
    <div class="journal-container">
      
      <!-- Article Navigation -->
      <nav class="journal-breadcrumb" aria-label="Article navigation">
        <a href="../" class="journal-back-link">← Back to Journal</a>
        <div class="journal-nav-links">
          <a href="#" id="prev-article" class="journal-nav-link" hidden>← Previous</a>
          <a href="#" id="next-article" class="journal-nav-link" hidden>Next →</a>
        </div>
      </nav>

      <!-- Article Header -->
      <header class="journal-hero">
        <img 
          src="${article.hero}" 
          alt="${article.title}"
          class="journal-hero-image"
          width="1600"
          height="900"
          loading="lazy"
        >
        <div class="journal-hero-content">
          <div class="journal-hero-text">
            <h1 class="journal-hero-title">${article.title}</h1>
            <p class="journal-hero-subtitle">${article.excerpt}</p>
            <div class="journal-meta">
              <time datetime="${article.date}">${formattedDate}</time>
              <span class="journal-reading-time">• 3 min read</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Article Content -->
      <article class="journal-content">
        <div class="journal-prose">
          ${convertMarkdownToHTML(article.body)}
        </div>
      </article>

    </div>
  </main>

  <!-- CTA Section -->
  <section class="cta">
    <div class="container">
      <div class="cta-content">
        <h2>Experience Ó Caviar</h2>
        <p>Discover our curated selection of Ireland's finest caviar, matured to perfection.</p>
        <a href="../../#shop" class="cta-button">Explore Collection</a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <img src="../../images/stacked_logo.svg" alt="Ó Caviar" class="footer-logo">
          <p>Ireland's first caviar house, dedicated to maturing the world's finest caviar to its peak expression.</p>
        </div>
        
        <div class="footer-links">
          <div class="footer-column">
            <h4>Discover</h4>
            <a href="../../#about">About</a>
            <a href="../../#process">Process</a>
            <a href="../">Journal</a>
          </div>
          
          <div class="footer-column">
            <h4>Collection</h4>
            <a href="../../#collection">Our Caviar</a>
            <a href="../../#sensory">Sensory Journey</a>
            <a href="../../#shop">Shop</a>
          </div>
          
          <div class="footer-column">
            <h4>Connect</h4>
            <a href="../../#contact">Contact</a>
            <a href="../../#mission">Mission</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 Ó Caviar. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="../../scripts.js"></script>
</body>
</html>`;
}

function convertMarkdownToHTML(markdown) {
    return markdown
        .replace(/\n\n/g, '</p><p>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^/g, '<p>')
        .replace(/$/g, '</p>');
}

async function updateArticlesJSON(newArticles) {
    const articlesPath = path.join(__dirname, 'journal', 'articles.json');
    const articlesDir = path.join(__dirname, 'journal', '_articles');
    
    try {
        // Get list of current markdown files to sync with articles.json
        const files = await fs.readdir(articlesDir);
        const currentMdFiles = files.filter(file => file.endsWith('.md'));
        const currentSlugs = currentMdFiles.map(file => {
            // Extract slug from filename (remove date prefix and .md extension)
            return file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');
        });
        
        // Read existing articles
        let existingArticles = [];
        try {
            const existingData = await fs.readFile(articlesPath, 'utf8');
            existingArticles = JSON.parse(existingData);
        } catch (error) {
            console.log('Creating new articles.json');
        }
        
        // Filter out articles that no longer have markdown files (deleted articles)
        const validExistingArticles = existingArticles.filter(article => 
            currentSlugs.includes(article.slug)
        );
        
        // Merge articles (avoid duplicates)
        const allArticles = [...validExistingArticles];
        
        for (const newArticle of newArticles) {
            const existingIndex = allArticles.findIndex(a => a.slug === newArticle.slug);
            if (existingIndex >= 0) {
                allArticles[existingIndex] = newArticle;
            } else {
                allArticles.push(newArticle);
            }
        }
        
        // Clean up article directories that no longer have markdown files
        const articleDirs = await fs.readdir(path.join(__dirname, 'journal'));
        for (const dir of articleDirs) {
            const dirPath = path.join(__dirname, 'journal', dir);
            const stats = await fs.stat(dirPath).catch(() => null);
            if (stats && stats.isDirectory() && 
                !['_articles'].includes(dir) &&
                !currentSlugs.includes(dir)) {
                console.log(`🗑️ Removing orphaned article directory: ${dir}`);
                await fs.rmdir(dirPath, { recursive: true }).catch(console.error);
            }
        }
        
        // Sort by date (most recent first)
        allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Write updated articles.json
        await fs.writeFile(articlesPath, JSON.stringify(allArticles, null, 2));
        
        console.log(`📄 Updated articles.json with ${allArticles.length} total articles`);
        console.log(`🧹 Synchronized with ${currentMdFiles.length} markdown files`);
        
    } catch (error) {
        console.error('❌ Error updating articles.json:', error);
        throw error;
    }
}

// Run the processor
if (require.main === module) {
    processArticles();
}

module.exports = { processArticles };