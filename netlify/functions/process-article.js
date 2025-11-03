const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  // Only handle POST requests (webhook from Netlify CMS)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    
    // Check if this is a journal article creation/update
    if (body.collection === 'journal') {
      await processJournalArticle(body);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Article processed successfully' })
    };
  } catch (error) {
    console.error('Error processing article:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process article' })
    };
  }
};

async function processJournalArticle(articleData) {
  const { data } = articleData;
  const slug = data.slug || generateSlug(data.title);
  
  // Create article directory
  const articleDir = path.join(process.cwd(), 'journal', slug);
  await fs.mkdir(articleDir, { recursive: true });
  
  // Generate article HTML page
  const articleHTML = generateArticleHTML(data, slug);
  await fs.writeFile(path.join(articleDir, 'index.html'), articleHTML);
  
  // Update articles.json
  await updateArticlesJSON(data, slug);
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateArticleHTML(data, slug) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${data.title} — Ó Caviar</title>
  <meta name="description" content="${data.excerpt}" />
  <meta name="theme-color" content="#0b0f0d" />
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&subset=latin&display=swap" rel="stylesheet">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="../styles.css" />
  <link rel="stylesheet" href="../journal.css" />
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  
  <!-- SEO Meta Tags -->
  <meta property="og:title" content="${data.title} — Ó Caviar" />
  <meta property="og:description" content="${data.excerpt}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="../../${data.hero}" />
  <meta property="og:url" content="https://ocaviar.example/journal/${slug}/" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${data.title} — Ó Caviar" />
  <meta name="twitter:description" content="${data.excerpt}" />
  <meta name="twitter:image" content="../../${data.hero}" />
  
  <link rel="canonical" href="https://ocaviar.example/journal/${slug}/" />
  
  <!-- Preload hero image -->
  <link rel="preload" href="../../${data.hero}" as="image" fetchpriority="high">

  <!-- JSON-LD structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${data.title}",
    "image": "../../${data.hero}",
    "datePublished": "${data.date}",
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
    "description": "${data.excerpt}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://ocaviar.example/journal/${slug}/"
    }
  }
  </script>
  
  <!-- Robots -->
  <meta name="robots" content="index, follow" />
</head>

<body class="journal">
  <!-- Skip to content link for accessibility -->
  <a href="#main-content" class="journal-skip-link">Skip to main content</a>

  <!-- Site Header -->
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
          src="../../${data.hero}" 
          alt="${data.title}"
          class="journal-hero-image"
          width="1600"
          height="900"
          loading="lazy"
        >
        <div class="journal-hero-content">
          <div class="journal-hero-text">
            <h1 class="journal-hero-title">${data.title}</h1>
            <p class="journal-hero-subtitle">${data.excerpt}</p>
            <div class="journal-meta">
              <time datetime="${data.date}">${new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span class="journal-reading-time">• 3 min read</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Article Content -->
      <article class="journal-content">
        <div class="journal-prose">
          ${data.body.replace(/\n/g, '<br>')}
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
    
    <!-- Copyright centered below footer grid -->
    <div class="copyright-container">
      <p class="copy copyright-text">© <span id="year"></span> Ó Caviar. <span class="copyright-break">All rights reserved.</span> Elevating the legacy of sturgeon.</p>
    </div>
  </footer>

  <script src="../../scripts.js"></script>
</body>
</html>`;
}

async function updateArticlesJSON(data, slug) {
  const articlesPath = path.join(process.cwd(), 'journal', 'articles.json');
  
  try {
    // Read existing articles
    const articlesData = await fs.readFile(articlesPath, 'utf8');
    const articles = JSON.parse(articlesData);
    
    // Create new article entry
    const newArticle = {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      hero: data.hero,
      tags: data.tags || ['caviar']
    };
    
    // Add or update article
    const existingIndex = articles.findIndex(a => a.slug === slug);
    if (existingIndex >= 0) {
      articles[existingIndex] = newArticle;
    } else {
      articles.push(newArticle);
    }
    
    // Sort by date (most recent first)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Write back to file
    await fs.writeFile(articlesPath, JSON.stringify(articles, null, 2));
    
  } catch (error) {
    console.error('Error updating articles.json:', error);
    throw error;
  }
}