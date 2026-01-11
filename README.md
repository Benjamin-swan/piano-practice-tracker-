# 🎹 Piano Practice Tracker

A beautiful and intuitive web application for tracking your piano practice sessions. Built with React, TypeScript, and Tailwind CSS.

## Features

- ✨ **User Authentication**: Sign up and log in to keep your practice data private
- 📊 **Practice Tracking**: Track practice sessions for each song with customizable counters
- 📝 **Notes & Memos**: Add notes to each practice session
- 🎨 **Theme Customization**: Choose from various fruit-themed colors for your tracks
- 📅 **Date Grouping**: Automatically groups sessions by "Today", "Yesterday", and other dates
- 🔍 **Search**: Quickly find your songs with the search feature
- 💾 **Auto-save**: All data is automatically saved to localStorage
- 🔐 **Session Persistence**: Stay logged in across browser sessions

## Run Locally

**Prerequisites:** Node.js 18+

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd piano-practice-tracker-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deploy to Cloudflare Pages

### Via Cloudflare Dashboard

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click "Save and Deploy"

### Via Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run build
wrangler pages deploy dist
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **LocalStorage** - Data persistence

## License

MIT
