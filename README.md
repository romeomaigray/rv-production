# R&V Production — Filmmaker Portfolio
## 🎬 Project Structure

```
WEBSITE/
├── app.py                   ← Flask server (edit config, pricing, categories here)
├── requirements.txt         ← Python dependencies
├── templates/
│   └── index.html           ← Main HTML page (Jinja2 template)
├── static/
│   ├── css/
│   │   └── style.css        ← All styles (dark luxury theme)
│   ├── js/
│   │   └── main.js          ← Gallery, lightbox, animations
│   └── images/              ← 📂 PUT YOUR IMAGES HERE
│       ├── hero/            ← Hero background image (first image auto-loads)
│       ├── real-estate/     ← Real estate photos/stills
│       ├── luxury-cars/     ← Automotive cinematography
│       ├── yachts/          ← Yacht & lifestyle
│       ├── watches/         ← Watch & jewellery campaigns
│       ├── brands/          ← Brand campaigns
│       ├── portraits/       ← Director portrait → name it portrait.jpg
│       └── behind-scenes/   ← BTS content
└── uploads/                 ← Reserved for future upload feature
```

---

## 🚀 How to Run

```bash
cd /Users/romeomaigraijbotta/Desktop/WEBSITE
/usr/bin/python3 app.py
```

Then open **http://127.0.0.1:5000** in your browser.

---

## 🖼️ Adding Your Images

1. Supported formats: `.jpg` `.jpeg` `.png` `.webp` `.gif` `.avif`
2. Drop images into the matching folder under `static/images/<category>/`
3. Refresh the browser — images load automatically, no code changes needed
4. **Hero image**: put any image in `static/images/hero/` and it becomes the full-screen background
5. **Portrait**: put your photo at `static/images/portraits/portrait.jpg`

---

## ⚙️ Customising Your Info

Open **`app.py`** and edit the `CONFIG` dict at the top:

```python
CONFIG = {
    "name": "R&V Production",
    "tagline": "Your tagline here",
    "email": "your@email.com",
    "phone": "+1 (555) 000-0000",
    "instagram": "@yourhandle",
    "location": "Your City, Country",
    "about": "Your bio / studio description...",
}
```

Edit the `PRICING` list to change packages and prices.

---

## 🎨 Changing Colours / Fonts

Open `static/css/style.css` and edit the `:root` block at the top:

```css
:root {
  --gold: #c9a84c;       /* accent colour */
  --black: #080808;      /* page background */
  --white: #f8f6f2;      /* text colour */
  ...
}
```
