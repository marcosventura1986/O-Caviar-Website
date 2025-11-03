#!/usr/bin/env node

/**
 * Automated Journal Article Processor
 * Converts Netlify CMS markdown files to complete article system
 * Syncs articles.json with markdown files and manages article directories
 */

const fs = require('fs').promises;
const path = require('path');

async function processArticles() {
    console.log('🚀 Processing CMS articles...');
    console.log('📌 Location:', __dirname);
    
    try {
        // Read all markdown files from _articles
        const articlesDir = path.join(__dirname, 'journal', '_articles');
        
        // Ensure directory exists
        try {
            await fs.access(articlesDir);
        } catch (err) {
            console.warn(`⚠️  Articles directory not found at: ${articlesDir}`);
            console.warn('Creating directory...');
            await fs.mkdir(articlesDir, { recursive: true });
        }

        const files = await fs.readdir(articlesDir);
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        
        console.log(`📄 Found ${markdownFiles.length} markdown files to process`);
        
        const articles = [];
        const processedSlugs = new Set();
        
        // Process each markdown file
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
                
                processedSlugs.add(article.slug);
                
                // Validate article data
                if (!article.title || !article.date) {
                    console.warn(`⚠️  Skipping "${file}" - missing title or date`);
                    continue;
                }
                
                // Add to articles array
                articles.push({
                    slug: article.slug,
                    title: article.title,
                    date: article.date,
                    excerpt: article.excerpt || 'No excerpt provided',
                    hero: article.hero || '/assets/journal/default-hero.jpg',
                    tags: article.tags || ['caviar']
                });
                
                // Create individual article page
                await createArticlePage(article);
                
                console.log(`✅ Processed: ${article.title}`);
            } else {
                console.warn(`⚠️  Failed to parse: ${file}`);
            }
        }
        
        // Update articles.json and clean up orphaned directories
        await updateArticlesJSON(articles, processedSlugs);
        
        console.log('🎉 All articles processed successfully!');
        console.log(`� Total articles: ${articles.length}`);
        
    } catch (error) {
        console.error('❌ Error processing articles:', error);
        process.exit(1);
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

  <!-- Site Header (matches existing article pages) -->
  <header class="site-header" id="header">
    <div class="container nav">
      <a class="brand" href="../../" aria-label="Ó Caviar home">
        <img src="../../images/inline_logo.svg" class="logo logo--inline" alt="Ó Caviar — Inline" role="img">
      </a>
      <nav class="menu" aria-label="Primary">
        <a href="../../#about">About</a>
        <a href="../../#collection">Collection</a>
        <a href="../../#maturation">Process</a>
        <a href="../../#mv">Mission & Vision</a>
        <a href="../">Journal</a>
        <a href="../../#sensory">Sensory Journey</a>
        <a href="../../#footer">Contact</a>
        <a href="../../#shop" class="btn pill">Shop</a>
      </nav>
      <button class="hamburger" aria-expanded="false" aria-controls="drawer" onclick="toggleDrawer()">Menu ▾</button>
    </div>
    <div id="drawer" class="mobile-drawer container" role="dialog" aria-modal="true" aria-label="Mobile menu">
      <a href="../../#about" onclick="toggleDrawer(false)">About</a>
      <a href="../../#collection" onclick="toggleDrawer(false)">Collection</a>
      <a href="../../#maturation" onclick="toggleDrawer(false)">Process</a>
      <a href="../../#mv" onclick="toggleDrawer(false)">Mission & Vision</a>
      <a href="../" onclick="toggleDrawer(false)">Journal</a>
      <a href="../../#sensory" onclick="toggleDrawer(false)">Sensory Journey</a>
      <a href="../../#footer" onclick="toggleDrawer(false)">Contact</a>
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
  <footer id="footer" class="site-footer">
    <div class="container footgrid">
      <div>
        <div class="brand">
          <img src="../../images/stacked_logo.svg" class="logo logo--stacked" alt="Ó Caviar — Stacked" role="img">
        </div>
      </div>
      <div>
        <div class="kicker">Explore</div>
        <a href="../../#about">About</a><br/>
        <a href="../../#collection">Collection</a><br/>
        <a href="../../#maturation">Process</a><br/>
        <a href="../">Journal</a>
      </div>
      <div>
        <div class="kicker">Contact</div>
        <a href="mailto:hello@ocaviar.com">hello@ocaviar.com</a><br/>
        <span class="muted">Wicklow, Ireland</span>
      </div>
    </div>
    
    <!-- Legal Links -->
    <div style="border-top: 1px solid rgba(255,255,255,.06); margin-top: 40px; padding-top: 20px; text-align: center;">
      <a href="../../cookies-policy.html" style="color: var(--muted); font-size: 13px; text-decoration: underline; margin: 0 12px;">Cookies Policy</a>
      <span style="color: var(--muted); font-size: 13px;">•</span>
      <a href="../../terms-and-conditions.html" style="color: var(--muted); font-size: 13px; text-decoration: underline; margin: 0 12px;">Terms & Conditions</a>
    </div>

    <!-- Copyright centered below footer grid -->
    <div class="copyright-container">
      <p class="copy copyright-text">© <span id="year"></span> Ó Caviar. <span class="copyright-break">All rights reserved.</span> Elevating the legacy of sturgeon.</p>
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

async function updateArticlesJSON(newArticles, processedSlugs) {
    const articlesPath = path.join(__dirname, 'journal', 'articles.json');
    const journalDir = path.join(__dirname, 'journal');
    
    try {
        // Read existing articles
        let existingArticles = [];
        try {
            const existingData = await fs.readFile(articlesPath, 'utf8');
            existingArticles = JSON.parse(existingData);
            if (!Array.isArray(existingArticles)) {
                console.warn('⚠️  articles.json is not an array, resetting');
                existingArticles = [];
            }
        } catch (error) {
            console.log('📝 Creating new articles.json');
            existingArticles = [];
        }
        
        // Filter out articles that no longer have markdown files (deleted articles)
        const validArticles = existingArticles.filter(article => 
            processedSlugs.has(article.slug)
        );
        
        // Log deleted articles
        const deletedCount = existingArticles.length - validArticles.length;
        if (deletedCount > 0) {
            const deletedArticles = existingArticles
                .filter(a => !processedSlugs.has(a.slug))
                .map(a => a.title);
            console.log(`🗑️  Removed ${deletedCount} deleted article(s):`);
            deletedArticles.forEach(title => console.log(`   - ${title}`));
        }
        
        // Merge with new articles (replace existing ones with same slug)
        const mergedArticles = [...validArticles];
        
        for (const newArticle of newArticles) {
            const existingIndex = mergedArticles.findIndex(a => a.slug === newArticle.slug);
            if (existingIndex >= 0) {
                console.log(`🔄 Updating: ${newArticle.title}`);
                mergedArticles[existingIndex] = newArticle;
            } else {
                console.log(`✨ New article: ${newArticle.title}`);
                mergedArticles.push(newArticle);
            }
        }
        
        // Sort by date (most recent first)
        mergedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Write updated articles.json
        await fs.writeFile(articlesPath, JSON.stringify(mergedArticles, null, 2));
        console.log(`\n✅ articles.json updated with ${mergedArticles.length} total articles`);
        
        // Clean up orphaned article directories
        await cleanupOrphanedDirectories(journalDir, processedSlugs);
        
    } catch (error) {
        console.error('❌ Error updating articles.json:', error);
        throw error;
    }
}

async function cleanupOrphanedDirectories(journalDir, processedSlugs) {
    try {
        const entries = await fs.readdir(journalDir, { withFileTypes: true });
        let cleanupCount = 0;
        
        for (const entry of entries) {
            // Skip non-directories and special directories
            if (!entry.isDirectory() || entry.name === '_articles') {
                continue;
            }
            
            // If directory slug is not in processed slugs, it's orphaned
            if (!processedSlugs.has(entry.name)) {
                const dirPath = path.join(journalDir, entry.name);
                console.log(`🗑️  Removing orphaned directory: ${entry.name}`);
                await fs.rm(dirPath, { recursive: true, force: true });
                cleanupCount++;
            }
        }
        
        if (cleanupCount > 0) {
            console.log(`🧹 Cleaned up ${cleanupCount} orphaned article directory(ies)`);
        }
    } catch (error) {
        console.warn('⚠️  Error cleaning up orphaned directories:', error.message);
        // Don't throw - this is not critical
    }
}

// Run the processor
if (require.main === module) {
    processArticles();
}

module.exports = { processArticles };