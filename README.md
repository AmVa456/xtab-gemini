<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/19fB0S_qOYhzmIpgi9N_3V_RfUvHrylNl

## 🚀 Live Demo

The app is automatically deployed to GitHub Pages: **https://amva456.github.io/xtab-gemini/**

## 🌟 Features

- **AI-Powered Image Generation** - Generate creative images using Google's Gemini AI
- **Image Editing** - Edit images with AI-powered transformations
- **Video Generation** - Create videos from text prompts
- **Design Chat** - Interactive AI assistant for design feedback
- **Gallery Management** - Save and organize your creations
- **xTab-Dashboard Integration** - Seamlessly connect with xTab-dashboard to save posts

## 🔗 xTab-Dashboard Integration

xtab-gemini can work in three modes:

1. **Standalone Mode** - Works independently without any backend
2. **Integrated Mode** - Connects to xTab-dashboard for saving posts
3. **Embedded Mode** - Can be embedded directly within xTab-dashboard

### Quick Setup for Integration

1. Set up your environment variables (see Configuration section below)
2. Enable dashboard integration by setting `VITE_DASHBOARD_ENABLED=true`
3. Configure your dashboard API URL
4. Start generating and saving content!

For detailed integration instructions, see [INTEGRATION.md](./INTEGRATION.md)

## Run Locally

**Prerequisites:**  Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your API key from: https://ai.google.dev/

3. Run the app:
   ```bash
   npm run dev
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## 📦 Configuration

xtab-gemini uses environment variables for configuration. Copy `.env.example` to `.env.local` and configure:

### Required Variables

- `GEMINI_API_KEY` - Your Gemini API key from Google AI Studio

### Optional Variables (xTab-Dashboard Integration)

- `VITE_DASHBOARD_ENABLED` - Enable dashboard integration (true/false)
- `VITE_DASHBOARD_API_URL` - Dashboard API endpoint (e.g., http://localhost:5000/api)
- `VITE_DASHBOARD_API_KEY` - API key for dashboard authentication
- `VITE_MODE` - App mode: 'standalone', 'integrated', or 'embedded'

### Example Configuration

#### Standalone Mode (Default)
```env
GEMINI_API_KEY=your_key_here
VITE_DASHBOARD_ENABLED=false
VITE_MODE=standalone
```

#### Integrated Mode with xTab-Dashboard
```env
GEMINI_API_KEY=your_key_here
VITE_DASHBOARD_ENABLED=true
VITE_DASHBOARD_API_URL=http://localhost:5000/api
VITE_DASHBOARD_API_KEY=your_dashboard_key
VITE_MODE=integrated
```

## 🔨 Build Options

### Standalone Build (Default)
```bash
npm run build
```
Creates a standalone web application in the `dist/` directory.

### Library Build (For Embedding)
```bash
npm run build:lib
```
Creates library bundles (ES and UMD) that can be imported into xTab-dashboard or other applications.

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

## 🎨 Usage

### Generate Images
1. Enter a text prompt describing what you want to create
2. Click Generate
3. Save your favorites to the gallery
4. (Optional) Save to xTab-dashboard as posts

### Edit Images
1. Upload an image
2. Draw a mask over areas you want to edit
3. Describe the changes you want
4. Generate the edited version

### Generate Videos
1. Enter a detailed video description
2. Wait for the AI to generate your video
3. Download or save to gallery

### Design Chat
1. Ask questions about design concepts
2. Get feedback on your ideas
3. Explore design trends and best practices

## 📚 Documentation

- [Integration Guide](./INTEGRATION.md) - Detailed xTab-dashboard integration
- [API Documentation](./INTEGRATION.md#api-documentation) - API client reference
- [Environment Variables](./INTEGRATION.md#environment-variables) - Complete configuration guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
