# Deployment Guide

This guide will help you deploy your Login System to the web for free!

## Option 1: GitHub Pages (Recommended - Free & Easy)

Since your code is already on GitHub, GitHub Pages is the easiest option.

### Steps:

1. **Go to your GitHub repository**: https://github.com/Kimheang-code-IT/Wed_design-login

2. **Click on "Settings"** (top menu of your repository)

3. **Scroll down to "Pages"** (left sidebar)

4. **Under "Source"**, select:
   - Branch: `main`
   - Folder: `/ (root)`

5. **Click "Save"**

6. **Wait 1-2 minutes**, then your site will be live at:
   ```
   https://kimheang-code-it.github.io/Wed_design-login/
   ```

### Important Note for GitHub Pages:
Since your files are in subfolders (HTML/, CSS/, Javascript/), you need to update the paths or create an index.html in the root.

**Quick Fix**: Create a root `index.html` that redirects to `HTML/index.html`

---

## Option 2: Netlify (Free & Easy)

1. Go to https://www.netlify.com
2. Sign up with your GitHub account
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub account
5. Select your repository: `Wed_design-login`
6. Build settings:
   - **Base directory**: (leave empty)
   - **Publish directory**: (leave empty)
   - **Build command**: (leave empty)
7. Click "Deploy site"
8. Your site will be live in seconds!

**Your site URL will be**: `https://your-site-name.netlify.app`

---

## Option 3: Vercel (Free & Easy)

1. Go to https://vercel.com
2. Sign up with your GitHub account
3. Click "Add New Project"
4. Import your repository: `Wed_design-login`
5. Click "Deploy"
6. Your site will be live in seconds!

**Your site URL will be**: `https://your-site-name.vercel.app`

---

## Option 4: Firebase Hosting (Free)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

---

## Quick Fix for GitHub Pages

Since your HTML files are in the `HTML/` folder, create a root index.html:

```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=HTML/index.html">
</head>
<body>
    <p>Redirecting to <a href="HTML/index.html">Login Page</a>...</p>
</body>
</html>
```

Or better, update all paths to work from root directory.

---

## Recommended: Netlify or Vercel

These platforms automatically detect your project structure and work perfectly with your folder structure!

---

## Need Help?

- GitHub Pages: https://pages.github.com
- Netlify: https://docs.netlify.com
- Vercel: https://vercel.com/docs

