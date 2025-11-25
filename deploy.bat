@echo off
echo 🚀 Starting Quizify Deployment Process...

if not exist "README.md" (
    echo ❌ Please run this script from the project root directory
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd server\server
call npm install --production
cd ..\..

echo 🎨 Building frontend...
cd client
call npm install
call npm run build
cd ..

echo 📁 Copying frontend build to backend...
if not exist "server\server\public" mkdir server\server\public
xcopy client\build server\server\public /E /I /Y

echo ✅ Build complete! Your app is ready for deployment.
echo.
echo 📋 Next steps:
echo 1. Push your code to GitHub
echo 2. Deploy backend to Railway/Render
echo 3. Update REACT_APP_API_URL in your frontend
echo.
echo 🌐 Deployment platforms:
echo • Railway: https://railway.app
echo • Render: https://render.com  
echo • Vercel: https://vercel.com

pause