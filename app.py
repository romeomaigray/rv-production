#!/usr/bin/env python3
"""
R&V Production - Filmmaker Portfolio
Flask backend server
"""

from flask import Flask, render_template, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# ─────────────────────────────────────────────
#  PORTFOLIO CONFIGURATION
# ─────────────────────────────────────────────
CONFIG = {
    "name": "R&V Production",
    "tagline": "Cinematic Storytelling — Luxury. Precision. Art.",
    "email": "rvcreation.prod@gmail.com",
    "phone": "+32489044540",
    "instagram": "@r.v_production",
    "location": "Belgium / Ibiza",
    "about": (
        "We are a luxury cinematography studio specialising in high-end "
        "brand films, real estate showcases, automotive cinematography, "
        "yacht & lifestyle content, and watch campaigns. "
        "Every frame is crafted with intention."
    ),
}

# ─────────────────────────────────────────────
#  PRICING PACKAGES  (kept for future use)
# ─────────────────────────────────────────────
PRICING = [
    {
        "tier": "Essential",
        "price": "€1 500",
        "per": "/ day",
        "features": [
            "Full shooting day (8 h)",
            "1 edited video (up to 2 min)",
            "10 retouched photos",
            "Basic colour grade",
            "Digital delivery",
        ],
        "popular": False,
    },
    {
        "tier": "Prestige",
        "price": "€3 500",
        "per": "/ day",
        "features": [
            "Full shooting day (10 h)",
            "2 edited videos (up to 3 min each)",
            "30 retouched photos",
            "Cinematic colour grade",
            "Drone aerial footage",
            "Soundtrack licensing",
            "Rush 48 h delivery",
        ],
        "popular": True,
    },
    {
        "tier": "Signature",
        "price": "Custom",
        "per": "",
        "features": [
            "Multi-day production",
            "Full creative direction",
            "Unlimited edited content",
            "International travel included",
            "Dedicated production team",
            "Brand strategy consultation",
            "Priority support",
        ],
        "popular": False,
    },
]

# ─────────────────────────────────────────────
#  PORTFOLIO CATEGORIES
#  Edit label, description freely
# ─────────────────────────────────────────────
CATEGORIES = [
    {
        "id": "real-estate",
        "label": "Real Estate",
        "description": (
            "Architectural cinematography for the world's most "
            "prestigious properties. From intimate villas to iconic "
            "penthouses — every space told as a story."
        ),
    },
    {
        "id": "luxury-cars",
        "label": "Luxury Cars",
        "description": (
            "High-performance automotive films that capture speed, "
            "craftsmanship, and emotion."
        ),
    },
    {
        "id": "yachts",
        "label": "Yachts",
        "description": (
            "Superyacht and lifestyle cinematography across the "
            "Mediterranean and beyond. Sun, sea, and pure luxury "
            "framed in every shot."
        ),
    },
    {
        "id": "watches",
        "label": "Watches",
        "description": (
            "Macro-precision campaigns for haute horlogerie and "
            "jewellery brands. The art of detail, lit and graded "
            "to perfection."
        ),
    },
    {
        "id": "art",
        "label": "Art",
        "description": (
            "Creative and artistic projects that push the boundaries "
            "of visual storytelling. Fashion, fine art, and "
            "experimental cinematography."
        ),
    },
    {
        "id": "hospitality",
        "label": "Hospitality",
        "description": (
            "Ultra-luxury hotel and resort campaigns that capture the "
            "essence of world-class hospitality — from private villas "
            "to iconic palaces."
        ),
    },
]


# ─────────────────────────────────────────────
#  ART PRINT STORE
#  Each entry maps to static/images/store/<id>/
#  Folder should contain: photo.jpg (or .png), mockup.png
# ─────────────────────────────────────────────
STORE = [
    {
        "id": "print-01",
        "title": "Espalmador Island",
        "description": "A serene morning in the Alps captured moments before the sun broke through the clouds. The layers of mist and pine create a sense of infinite depth.",
        "resolution": "8064 × 4536 px",
    },
    {
        "id": "print-02",
        "title": "Circle Boat",
        "description": "The Mediterranean at dusk — a photograph of stillness and warmth where the last light of the day dissolves into the sea.",
        "resolution": "4000 × 3000 px",
    },
    {
        "id": "print-03",
        "title": "Wave Boat",
        "description": "Aerial dunes of the Sahara at sunrise. Shot from above, the geometry of sand and shadow becomes pure abstract art.",
        "resolution": "4000 × 3000 px",
    },
    {
        "id": "print-04",
        "title": "The Surfer",
        "description": "A dramatic Atlantic storm rolling over a rugged coastline. Raw power and beauty captured in a single frame.",
        "resolution": "4000 × 3000 px",
    },
]


# ─────────────────────────────────────────────
#  ROUTES
# ─────────────────────────────────────────────

@app.route("/")
def index():
    """Render portfolio with server-side video path for instant playback."""
    hero_vid = ""
    try:
        vid_folder = os.path.join(app.static_folder, "videos", "hero")
        exts = {".mp4", ".webm", ".mov", ".m4v"}
        files = [f for f in os.listdir(vid_folder)
                 if os.path.splitext(f)[1].lower() in exts]
        if files:
            hero_vid = files[0]
    except Exception:
        pass
    return render_template(
        "index.html",
        config=CONFIG,
        categories=CATEGORIES,
        hero_vid=hero_vid,
    )


@app.route("/api/images/<category>")
def get_images(category):
    """Return sorted image filenames for a category folder."""
    folder = os.path.join(app.static_folder, "images", category)
    if not os.path.isdir(folder):
        return jsonify([])
    exts = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
    files = [
        f for f in os.listdir(folder)
        if os.path.splitext(f)[1].lower() in exts
    ]
    return jsonify(sorted(files))


@app.route("/api/videos/<category>")
def get_videos(category):
    """Return sorted video filenames for a category folder."""
    folder = os.path.join(app.static_folder, "videos", category)
    if not os.path.isdir(folder):
        return jsonify([])
    exts = {".mp4", ".webm", ".mov", ".m4v"}
    files = [
        f for f in os.listdir(folder)
        if os.path.splitext(f)[1].lower() in exts
    ]
    return jsonify(sorted(files))


@app.route("/api/config")
def get_config():
    return jsonify(CONFIG)


@app.route("/api/categories")
def get_categories():
    return jsonify(CATEGORIES)


@app.route("/images/<category>/<filename>")
def serve_image(category, filename):
    folder = os.path.join(app.static_folder, "images", category)
    return send_from_directory(folder, filename)


@app.route("/videos/<category>/<filename>")
def serve_video(category, filename):
    folder = os.path.join(app.static_folder, "videos", category)
    return send_from_directory(folder, filename)


@app.route("/api/store")
def get_store():
    """Return store items enriched with dynamic image URLs."""
    img_exts = {".jpg", ".jpeg", ".png", ".webp"}
    result = []
    for item in STORE:
        folder = os.path.join(app.static_folder, "images", "store", item["id"])
        photo = mockup = None
        if os.path.isdir(folder):
            files = [f for f in os.listdir(folder)
                     if os.path.splitext(f)[1].lower() in img_exts]
            for f in sorted(files):
                name = f.lower()
                if name.startswith("mockup") and not mockup:
                    mockup = f
                elif not photo:
                    photo = f
        result.append({
            **item,
            "photo":  f"/images/store/{item['id']}/{photo}"  if photo  else None,
            "mockup": f"/images/store/{item['id']}/{mockup}" if mockup else None,
        })
    return jsonify(result)


@app.route("/images/store/<print_id>/<filename>")
def serve_store_image(print_id, filename):
    folder = os.path.join(app.static_folder, "images", "store", print_id)
    return send_from_directory(folder, filename)



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("RAILWAY_ENVIRONMENT") is None  # debug off in prod
    print(f"\n🎬  R&V Production Portfolio Server")
    print(f"    Open  →  http://127.0.0.1:{port}\n")
    app.run(host="0.0.0.0", debug=debug, port=port)
