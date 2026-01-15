<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/19fB0S_qOYhzmIpgi9N_3V_RfUvHrylNl

## 🚀 Live Demo

The app is automatically deployed to GitHub Pages: **https://amva456.github.io/xtab-gemini/**

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
4. Preview production build:
   `npm run preview`

## 📦 Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### How it works:
- GitHub Actions workflow builds the app using `npm run build`
- Build artifacts are deployed to GitHub Pages
- The app is accessible at https://amva456.github.io/xtab-gemini/

### Manual deployment:
Push your changes to the `main` branch:
```bash
git push origin main
```

The deployment workflow will automatically run and deploy your changes.
