@echo off
echo Deploying API fix to production...
echo.

echo Adding files to git...
git add .

echo Committing changes...
git commit -m "Fix API route with better error handling and debugging"

echo Pushing to GitHub...
git push origin main

echo.
echo ✅ Deployment started! 
echo Check your Vercel dashboard for the new deployment.
echo.
pause
