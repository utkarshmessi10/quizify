#!/bin/bash

echo "🚀 Starting Quizify Deployment Process..."

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd server/server
npm install --production
cd ../..

echo "🎨 Building frontend..."
cd client
npm install
npm run build
cd ..

echo "📁 Copying frontend build to backend..."
mkdir -p server/server/public
cp -r client/build/* server/server/public/

echo "✅ Build complete! Your app is ready for deployment."
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy backend to Railway/Render"
echo "3. Update REACT_APP_API_URL in your frontend"
echo ""
echo "🌐 Deployment platforms:"
echo "• Railway: https://railway.app"
echo "• Render: https://render.com"
echo "• Vercel: https://vercel.com"