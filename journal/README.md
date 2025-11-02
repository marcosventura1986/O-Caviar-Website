# Ó Caviar Journey Section - Editor Guide

## Overview
The Journey section is a zero-backend article system designed for easy content management without requiring a CMS or database. Articles are managed through JSON configuration and static HTML files.

## File Structure
```
/journey/
├── index.html                    # Main listing page
├── journey.css                   # Scoped styles
├── articles.json                 # Article manifest (EDIT THIS)
├── /champagne-beluga-pairing/    # Sample article folder
│   └── index.html
├── /serving-rituals-at-home/     # Sample article folder
│   └── index.html
└── /your-new-article/            # Your new articles follow this pattern
    └── index.html

/assets/journey/
├── champagne-beluga-hero.jpg     # Hero images
├── serving-rituals-hero.jpg
└── your-new-hero.jpg
```

## Adding a New Article

### Step 1: Create Article Folder
1. Create a new folder in `/journey/` using your article slug
2. Slug format: `lowercase-words-separated-by-hyphens`
3. Example: `/journey/caviar-tasting-guide/`

### Step 2: Create Hero Image
1. Add hero image to `/assets/journey/`
2. Name it: `[article-slug]-hero.jpg`
3. Recommended size: 1600x900px (16:9 aspect ratio)
4. Optimize for web (under 500KB recommended)

### Step 3: Add Article to Manifest
Edit `/journey/articles.json` and add your new article:

```json
{
  "slug": "your-article-slug",
  "title": "Your Article Title",
  "date": "2024-12-01",
  "excerpt": "A compelling 2-3 sentence summary that appears on the index page. Keep it engaging and under 200 characters for best display.",
  "hero": "/assets/journey/your-article-slug-hero.jpg",
  "tags": ["tag1", "tag2", "tag3"]
}
```

### Step 4: Create Article HTML
1. Copy an existing article's `index.html` as a template
2. Update the following sections:

#### Head Section Updates:
- `<title>`: Your Article Title — Ó Caviar
- `<meta name="description">`: Same as excerpt
- `og:title`, `og:description`, `og:image`, `og:url`
- `twitter:title`, `twitter:description`, `twitter:image`
- `article:published_time`: ISO format (2024-12-01T00:00:00Z)
- `article:tag`: Each tag as separate meta tag
- `canonical`: Full URL to article
- JSON-LD schema: Update all fields

#### Body Content Updates:
- Update navigation breadcrumbs
- Change hero image src and alt text
- Update article header (date, title, reading time)
- Replace article content
- Update tags section
- Update JavaScript currentSlug variable

## Content Guidelines

### Slug Rules
- Use lowercase letters only
- Separate words with hyphens (-)
- Keep under 50 characters
- Make it descriptive but concise
- Examples: `caviar-storage-tips`, `ossetra-tasting-notes`

### Title Guidelines
- Use title case
- Keep under 60 characters for SEO
- Make it descriptive and engaging
- Include key topics/keywords naturally

### Excerpt Guidelines
- 150-200 characters ideal
- 2-3 sentences maximum
- Compelling and descriptive
- Avoid ending with ellipsis
- Should make readers want to click

### Image Guidelines
- **Size**: 1600x900px minimum (16:9 aspect ratio)
- **Format**: JPG preferred, WebP for better compression
- **File size**: Under 500KB optimized
- **Quality**: High-resolution, professional photography
- **Style**: Match luxury brand aesthetic
- **Colors**: Work with dark theme (dark greens, golds)
- **Alt text**: Descriptive, specific, helpful for screen readers

### Content Writing
- **Length**: 1000-2000 words ideal
- **Tone**: Luxury, refined, informative but accessible
- **Structure**: Use H2 and H3 headings for organization
- **Paragraphs**: Keep readable (3-5 sentences max)
- **Expertise**: Show deep knowledge of caviar and luxury dining

### Tags
- Use 3-5 tags per article
- Keep tags consistent across articles
- Use lowercase
- Examples: `pairing`, `serving`, `tradition`, `luxury`, `storage`

## Technical Notes

### SEO Optimization
All pages include:
- Complete Open Graph meta tags
- Twitter Card tags  
- JSON-LD structured data
- Canonical URLs
- Proper heading hierarchy
- Image optimization attributes

### Accessibility Features
- Skip-to-content links
- Proper ARIA labels
- Semantic HTML structure
- Alt text for all images
- Keyboard navigation support
- Screen reader announcements

### Performance Features
- Lazy loading for images
- Preload for critical resources
- Optimized font loading
- Minimal JavaScript
- Graceful degradation without JS

## Maintenance Tasks

### Regular Updates
1. Keep articles.json sorted by date (newest first)
2. Optimize images before adding
3. Test new articles on mobile devices
4. Validate HTML and accessibility
5. Check all links work correctly

### Quality Checks
Before publishing a new article:
- [ ] Article appears correctly on index page
- [ ] Hero image loads and displays properly
- [ ] All meta tags are updated
- [ ] Navigation links work (prev/next)
- [ ] Content is proofread and formatted
- [ ] Images have proper alt text
- [ ] Mobile experience is good
- [ ] Links and references are accurate

## Troubleshooting

### Article Not Showing on Index
- Check articles.json syntax (validate JSON)
- Verify slug matches folder name exactly
- Ensure hero image path is correct
- Check date format (YYYY-MM-DD)

### Navigation Not Working
- Verify currentSlug in article JavaScript matches folder name
- Check articles.json is accessible
- Ensure JavaScript is enabled

### Images Not Loading
- Verify image path starts with `/assets/journey/`
- Check file exists and is properly named
- Ensure image is web-optimized (not too large)

### Styling Issues  
- All Journey styles are scoped to `.journey` class
- Check journey.css for conflicts
- Verify CSS path is correct (`../journey.css` for articles)

## Advanced Customization

### Adding New Tag Colors
Edit `journey.css` and add tag-specific styles:
```css
.journey-tag.tag-special {
  color: #your-color;
  border-color: #your-border;
}
```

### Custom Article Layouts
Each article can have unique content structure while maintaining the template's head/navigation sections.

### Integration with Analytics
Add tracking code to individual articles or include in main template for site-wide tracking.

---

## Quick Reference

### File Paths for New Article "caviar-guide"
- Folder: `/journey/caviar-guide/`
- HTML: `/journey/caviar-guide/index.html`
- Hero: `/assets/journey/caviar-guide-hero.jpg`
- URL: `https://yourdomain.com/journey/caviar-guide/`

### Required Updates for New Article
1. Create folder and HTML file
2. Add hero image to assets
3. Add entry to articles.json
4. Update all meta tags in HTML
5. Update content and currentSlug
6. Test on index page and individual article

Remember: This system is designed for simplicity and reliability. Keep the structure consistent and the process will remain smooth for ongoing content management.