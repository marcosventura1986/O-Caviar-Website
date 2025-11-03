# Ó Caviar Journal & CMS Setup Guide

## ✅ System Overview

The Ó Caviar website now has a fully automated article management system that:

1. **Processes articles from the CMS**: Markdown files in `journal/_articles/` are automatically converted to complete HTML pages
2. **Syncs articles.json**: Maintains a centralized JSON file with all articles, sorted by date (newest first)
3. **Displays on homepage**: Shows the 3 most recent articles in the Journal section
4. **Journal index page**: Lists all articles at `/journal/` 
5. **Auto-cleanup**: Removes deleted articles and orphaned directories

## 🛠 How It Works

### Article Creation (via Netlify CMS or manually)

1. Create a markdown file in `journal/_articles/` with the naming pattern: `YYYY-MM-DD-slug-name.md`
2. Include frontmatter with:
   - `title`: Article title
   - `date`: Publication date (ISO format)
   - `excerpt`: Short summary
   - `hero`: Image path (stored in `/assets/journal/`)
   - `slug`: URL-friendly name
   - `tags`: Array of tags (optional)

Example:
```markdown
---
title: "Perfect Caviar Pairings"
date: "2025-11-03T12:00:00.000Z"
excerpt: "Discover the best wine and food combinations with caviar."
slug: "caviar-pairings"
hero: "/assets/journal/pairings.jpg"
tags:
  - pairing
  - wine
  - luxury
---

# Article content here...
```

### Build Process

When you deploy to Netlify:
1. `netlify.toml` runs: `node process-articles.js`
2. Script reads all markdown files from `journal/_articles/`
3. For each markdown file:
   - Parses frontmatter
   - Generates complete HTML page with proper header/footer
   - Creates directory structure: `journal/{slug}/index.html`
4. Updates `journal/articles.json` with all articles (sorted by date)
5. Removes any articles that were deleted from CMS
6. Cleans up orphaned directories

### Frontend Display

**Homepage (3 most recent)**:
- `scripts.js` fetches `journal/articles.json`
- Sorts by date (newest first)
- Takes first 3 articles
- Renders them in the Journal section

**Journal Index (`/journal/`)**:
- `journal/index.html` loads all articles from `journal/articles.json`
- Displays complete list sorted by date
- Each article links to its dedicated page

**Individual Article Pages**:
- Located at `/journal/{slug}/`
- Contains consistent header, footer, and styling
- Uses `journal.css` for article-specific styling
- Inherits main site design system

## 📋 File Structure

```
journal/
├── _articles/              # CMS markdown source files
│   ├── 2024-10-28-serving-rituals-at-home.md
│   ├── 2024-11-15-champagne-beluga-pairing.md
│   └── 2024-12-01-irish-linen-stone.md
├── articles.json           # Auto-generated, all articles
├── index.html              # Journal index page
├── journal.css             # Article-specific styles
├── champagne-beluga-pairing/
│   └── index.html
├── irish-linen-stone/
│   └── index.html
└── serving-rituals-at-home/
    └── index.html

assets/journal/            # Article hero images
├── champagne-beluga-hero.jpg
├── irish-linen-stone-hero.jpg
└── serving-rituals-hero.jpg
```

## 🔄 Workflow Example

### Adding a New Article

1. Create `journal/_articles/2025-11-04-new-article.md` with frontmatter
2. Push to GitHub
3. Netlify automatically triggers build
4. `process-articles.js` runs and:
   - Creates `journal/new-article/index.html`
   - Adds entry to `journal/articles.json`
   - New article appears on homepage (if in top 3)
   - Accessible at `/journal/new-article/`

### Removing an Article

1. Delete markdown file from `journal/_articles/`
2. Push to GitHub
3. Netlify triggers build
4. `process-articles.js` runs and:
   - Removes directory `journal/{slug}/`
   - Removes entry from `journal/articles.json`
   - Article no longer appears anywhere

### Updating an Article

1. Edit the markdown file in `journal/_articles/`
2. Push to GitHub
3. Netlify triggers build
4. `process-articles.js` runs and:
   - Regenerates HTML page with new content
   - Updates entry in `journal/articles.json` with new metadata
   - Changes live immediately

## 🎨 Styling Consistency

All auto-generated article pages include:
- **Header**: Navigation bar with logo and menu (matches main site)
- **Footer**: Brand information and links (matches main site)
- **Hero Section**: Full-width image with title and excerpt
- **Content**: Styled with `journal.css`
- **CTA Section**: Call-to-action for shop
- **Responsive Design**: Mobile-friendly layout

CSS files loaded:
- `../../styles.css` - Main site styles
- `../journal.css` - Article-specific styles

## 🚀 Deployment to Netlify

No additional setup needed! The build command in `netlify.toml` automatically:
- Runs `node process-articles.js`
- Processes all articles
- Generates complete site

The deploy is instant once `node process-articles.js` finishes successfully.

## 📊 Current Articles

Run `node process-articles.js` locally to see:
- Number of articles processed
- Articles that were updated vs. newly added
- Articles that were removed
- Cleanup operations

Example output:
```
🚀 Processing CMS articles...
📄 Found 3 markdown files to process
✅ Processed: Article 1
✅ Processed: Article 2
✅ Processed: Article 3
✅ articles.json updated with 3 total articles
🎉 All articles processed successfully!
```

## 🔧 Troubleshooting

### Article not showing on homepage?
- Check if it's in top 3 most recent (by date)
- Verify frontmatter has valid date in ISO format
- Run `node process-articles.js` locally to test

### Article page looks wrong?
- Verify CSS files are loading (check hero image path)
- Check browser console for errors
- Ensure hero image path is correct

### Article removed but directory still exists?
- Run `node process-articles.js` again
- Check that markdown file is actually deleted from `_articles/`

## ✨ Future Enhancements

Potential improvements:
- Article templates customizable per category
- Search functionality in journal index
- Related articles suggestions
- Article comments/engagement
- Analytics tracking per article
