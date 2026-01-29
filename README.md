# Sajith K M - Personal Portfolio

A modern, responsive, and SEO-optimized personal portfolio website built with HTML, CSS, and JavaScript.

## 🚀 Features

- **Modern & Minimal Design**: Clean UI with glassmorphism effects and smooth animations.
- **Dark/Light Mode**: User preference support with persistent local storage.
- **Responsive**: Fully optimized for mobile, tablet, and desktop devices.
- **Interactive Elements**: Animated skill bars, project cards, and sticky navbar.
- **SEO Optimized**: Meta tags, Open Graph data, and semantic HTML.
- **Performance**: Fast loading with minimal dependencies (AOS for animations).

## 📂 Folder Structure

```
/
├── index.html          # Main HTML structure
├── README.md           # Documentation
└── assets/
    ├── css/
    │   └── style.css   # Main stylesheet
    ├── js/
    │   └── script.js   # Logic for theme, menu, animations
    ├── images/         # Place images here
    │   └── profile.jpg # Profile photo (REQUIRED)
    └── Sajith_KM_Resume.pdf # Resume file (REQUIRED)
```

## 🛠️ Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/sajith-k-m/portfolio.git
    cd portfolio
    ```

2.  **Add your Assets**:
    -   Place your profile photo in `assets/images/` and name it `profile.jpg`.
    -   Place your resume PDF in `assets/` and name it `Sajith_KM_Resume.pdf`.

3.  **Run Locally**:
    -   Simply open `index.html` in your browser.
    -   Or use a live server extension in VS Code.

## 🌐 Deployment Instructions

### GitHub Pages (Recommended for SEO)
1.  Push your code to a GitHub repository (e.g., `username/portfolio`).
2.  Go to **Settings** > **Pages**.
3.  Under **Source**, select `main` (or `master`) branch and `/root` folder.
4.  Click **Save**. Your site will be live at `https://username.github.io/portfolio`.

### Netlify
1.  Log in to Netlify and click "Add new site" > "Import from Git".
2.  Connect your GitHub repository.
3.  Click **Deploy Site**.

## 🔍 SEO & Accessibility
-   Semantic HTML5 tags (`<header>`, `<main>`, `<section>`, `<footer>`) are used.
-   ARIA labels added for buttons and links.
-   Meta tags for description, keywords, and Open Graph added in `index.html`.

## 📜 License
MIT License
