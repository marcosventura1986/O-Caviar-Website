#!/bin/bash

# Deployment and Sync Script for Ó Caviar Website
# This script ensures consistency between local development and Netlify deployment

set -e  # Exit on any error

echo "🚀 Starting Ó Caviar Website deployment process..."

# Step 1: Process all articles
echo "📝 Processing CMS articles..."
node process-articles.js

# Step 2: Validate articles.json
echo "🔍 Validating articles.json..."
if ! node -e "JSON.parse(require('fs').readFileSync('journal/articles.json', 'utf8'))" 2>/dev/null; then
    echo "❌ Invalid JSON in articles.json"
    exit 1
fi

# Step 3: Check for required files
echo "📋 Checking required files..."
required_files=(
    "index.html"
    "styles.css"  
    "scripts.js"
    "journal/index.html"
    "journal/journal.css"
    "journal/articles.json"
    "admin/index.html"
    "admin/config.yml"
    "netlify.toml"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
done

# Step 4: Validate all article directories have index.html
echo "🏠 Validating article pages..."
if [ -f "journal/articles.json" ]; then
    slugs=$(node -e "
        const articles = JSON.parse(require('fs').readFileSync('journal/articles.json', 'utf8'));
        articles.forEach(article => {
            if (require('fs').existsSync('journal/' + article.slug)) {
                if (!require('fs').existsSync('journal/' + article.slug + '/index.html')) {
                    console.log(article.slug);
                    process.exit(1);
                }
            }
        });
    ")
    
    if [ $? -ne 0 ]; then
        echo "❌ Some articles missing index.html files"
        exit 1
    fi
fi

# Step 5: Test local server briefly
echo "🧪 Testing local functionality..."
python3 -m http.server 8001 > /dev/null 2>&1 &
SERVER_PID=$!
sleep 2

# Test main page
if curl -s -f "http://localhost:8001/" > /dev/null; then
    echo "✅ Main page loads successfully"
else
    echo "❌ Main page failed to load"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Test articles.json
if curl -s -f "http://localhost:8001/journal/articles.json" > /dev/null; then
    echo "✅ Articles API loads successfully"
else
    echo "❌ Articles API failed to load"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Stop test server
kill $SERVER_PID 2>/dev/null || true
sleep 1

echo "🎉 All validation checks passed!"
echo ""
echo "📤 Ready for deployment to Netlify"
echo "💡 Recommendations for Netlify deployment:"
echo "   1. Push changes to your Git repository"
echo "   2. Netlify will automatically rebuild and deploy"
echo "   3. Test the live site after deployment"
echo "   4. Use the /admin/ interface for content management"
echo ""
echo "🔗 Key URLs after deployment:"
echo "   - Main site: https://your-site.netlify.app/"
echo "   - Journal: https://your-site.netlify.app/journal/"
echo "   - Admin (CMS): https://your-site.netlify.app/admin/"
echo ""
echo "✨ Deployment preparation complete!"