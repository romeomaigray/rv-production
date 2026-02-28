/* =========================================================
   R&V Production — main.js v7
   Grid: 3 images + 1 video per row (4-col).
   Placeholders for empty slots.
   Video poster: first frame via #t=0.1.
   Per-project description in video lightbox.
   Back button returns to cover grid.
   ========================================================= */
"use strict";

/* ── Categories + project descriptions ─────────────────── */
const CATEGORIES = [
    {
        id: "real-estate", label: "Real Estate",
        description: "Architectural cinematography for the world's most prestigious properties. From intimate villas to iconic penthouses — every space told as a story.",
        projects: [
            { title: "Villa by Bruno Erpicum", description: "A striking contemporary residence designed by architect Bruno Erpicum. We crafted a cinematic walkthrough that captures the brutalist geometry, natural light, and relationship between indoor and outdoor living." },
            // Add more projects here as { title, description }
        ]
    },
    {
        id: "luxury-cars", label: "Luxury Cars",
        description: "High-performance automotive films that capture speed, craftsmanship, and emotion. Collaborations with the world's most iconic marques.",
        projects: [
            { title: "Automotive Campaign", description: "A visceral automotive film showcasing the lines, power, and precision of a high-performance vehicle. Filmed at dawn for maximum atmosphere." },
        ]
    },
    {
        id: "yachts", label: "Yachts",
        description: "Superyacht and lifestyle cinematography across the Mediterranean and beyond. Sun, sea, and pure luxury framed in every shot.",
        projects: [
            { title: "Mediterranean Lifestyle", description: "An immersive yacht lifestyle film shot on the open Mediterranean. Drone aerials, golden hour sequences, and intimate on-deck moments." },
        ]
    },
    {
        id: "watches", label: "Watches",
        description: "Macro-precision campaigns for haute horlogerie and jewellery brands. The art of detail, lit and graded to perfection.",
        projects: [
            { title: "Haute Horlogerie Campaign", description: "Ultra-macro product cinematography for a luxury watchmaker. Each gear, crystal, and facet lit and framed to reveal the mechanical artistry within." },
        ]
    },
    {
        id: "art", label: "Art",
        description: "Creative and artistic projects that push the boundaries of visual storytelling. Fashion, fine art, and experimental cinematography.",
        projects: [
            { title: "Editorial", description: "An experimental editorial film blending fashion, colour, and movement. Conceived as moving art rather than a conventional campaign." },
        ]
    },
    {
        id: "hospitality", label: "Hospitality",
        description: "Ultra-luxury hotel and resort campaigns that capture the essence of world-class hospitality — from private villas to iconic palaces.",
        projects: [
            { title: "Luxury Resort Campaign", description: "A cinematic resort campaign capturing the interplay of architecture, landscape, and service excellence — crafted to inspire and convert." },
        ]
    },
];

/* ── State ──────────────────────────────────────────────── */
const allImages = {};
const allVideos = {};
let activeCategory = null;
const $ = (sel) => document.querySelector(sel);
const MAX_IMAGES_PER_ROW = 3;   // images before each video slot

/* ── Nav scroll ─────────────────────────────────────────── */
window.addEventListener("scroll", () => {
    $("#nav").classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

/* ── Hero (logo; video rendered server-side) ────────────── */
async function initHero() {
    try {
        const files = await fetch("/api/images/logo").then(r => r.json());
        if (!files.length) return;
        const img = $("#hero-logo-img");
        const nImg = $("#nav-logo-img");
        const nTxt = $("#nav-logo-text");
        img.src = `/images/logo/${files[0]}`;
        img.style.display = "block";
        $("#hero-logo-fallback").style.display = "none";
        nImg.src = `/images/logo/${files[0]}`;
        nImg.style.display = "block";
        nTxt.style.display = "none";
    } catch (_) { }
}

/* ── Load all media from API ────────────────────────────── */
async function loadAllMedia() {
    await Promise.allSettled(
        CATEGORIES.map(async cat => {
            const [imgFiles, vidFiles] = await Promise.all([
                fetch(`/api/images/${cat.id}`).then(r => r.json()).catch(() => []),
                fetch(`/api/videos/${cat.id}`).then(r => r.json()).catch(() => []),
            ]);
            allImages[cat.id] = imgFiles.map(f => `/images/${cat.id}/${f}`);
            allVideos[cat.id] = vidFiles.map(f => `/videos/${cat.id}/${f}`);
        })
    );
    renderCoverGrid();
}

/* ── Cover grid: 6 category tiles (3-col) ──────────────── */
function renderCoverGrid() {
    const g = $("#portfolio-grid");
    g.innerHTML = "";
    g.classList.remove("portfolio-grid-4");
    hideCategoryDetail();
    activeCategory = null;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    // Remove back button if present
    document.querySelector(".back-btn")?.remove();

    CATEGORIES.forEach((cat, idx) => {
        const imgs = allImages[cat.id] || [];
        const item = document.createElement("div");
        item.className = "portfolio-item reveal";
        item.style.transitionDelay = `${idx * 0.07}s`;
        item.innerHTML = `
            <img src="${imgs[0] || ''}" alt="${cat.label}" loading="lazy"
                 onerror="this.style.display='none'"/>
            <div class="portfolio-overlay">
                <span class="portfolio-caption">${cat.label}</span>
            </div>`;
        item.addEventListener("click", () => selectCategory(cat.id));
        g.appendChild(item);
    });
    requestAnimationFrame(observeReveal);
}

/* ── Select a category ──────────────────────────────────── */
function selectCategory(catId) {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) return;
    activeCategory = catId;
    document.querySelectorAll(".tab-btn").forEach(b =>
        b.classList.toggle("active", b.dataset.category === catId));
    showCategoryDetail(cat);
    renderCategoryMedia(cat);
}

/* ── Category detail panel ──────────────────────────────── */
function showCategoryDetail(cat) {
    $("#cd-label").textContent = "Selected Work";
    $("#cd-category-name").textContent = cat.label;
    $("#cd-description").textContent = cat.description;
    const imgs = allImages[cat.id] || [];
    const imgEl = $("#cd-hero-img");
    if (imgs.length) { imgEl.src = imgs[0]; imgEl.style.display = "block"; }
    else imgEl.style.display = "none";
    $("#category-detail").classList.remove("hidden");
    $("#category-detail").scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideCategoryDetail() {
    $("#category-detail").classList.add("hidden");
    const imgEl = $("#cd-hero-img");
    if (imgEl) imgEl.src = "";
}

/* ── Category media: 4-col (3 images + 1 video per row) ── */
function renderCategoryMedia(cat) {
    const g = $("#portfolio-grid");
    g.innerHTML = "";
    g.classList.add("portfolio-grid-4");

    const imgs = allImages[cat.id] || [];
    const vids = allVideos[cat.id] || [];

    // Insert "← All Work" back button above grid
    const backBtn = document.createElement("button");
    backBtn.className = "back-btn";
    backBtn.innerHTML = "← All Work";
    backBtn.addEventListener("click", renderCoverGrid);
    g.before(backBtn);

    // Build rows: 3 images then 1 video, repeat
    const totalRows = Math.max(Math.ceil(imgs.length / MAX_IMAGES_PER_ROW), vids.length, 1);

    for (let row = 0; row < totalRows; row++) {
        // 3 image slots
        for (let col = 0; col < MAX_IMAGES_PER_ROW; col++) {
            const idx = row * MAX_IMAGES_PER_ROW + col;
            if (idx < imgs.length) {
                const item = document.createElement("div");
                item.className = "portfolio-item reveal";
                item.innerHTML = `
                    <img src="${imgs[idx]}" alt="${cat.label}" loading="lazy"/>
                    <div class="portfolio-overlay">
                        <span class="portfolio-caption">${cat.label}</span>
                    </div>`;
                item.addEventListener("click", () => openLightboxImage(imgs[idx], cat.label));
                g.appendChild(item);
            } else {
                // Placeholder image slot
                const ph = document.createElement("div");
                ph.className = "placeholder-item";
                ph.innerHTML = `<div class="ph-icon">🖼</div><span>Drop photo in<br>static/images/${cat.id}/</span>`;
                g.appendChild(ph);
            }
        }
        // 1 video slot
        if (row < vids.length) {
            const vsrc = vids[row];
            const proj = cat.projects?.[row] || { title: cat.label, description: cat.description };
            const item = document.createElement("div");
            item.className = "portfolio-item reveal";
            // #t=0.1 forces browser to seek and show first frame as thumbnail
            item.innerHTML = `
                <video src="${vsrc}#t=0.1" muted playsinline preload="metadata"
                       style="width:100%;height:100%;object-fit:cover;pointer-events:none;"></video>
                <div class="portfolio-overlay">
                    <div class="play-badge">▶</div>
                    <span class="portfolio-caption">${proj.title}</span>
                </div>`;
            item.addEventListener("click", () => openLightboxVideo(vsrc, proj));
            g.appendChild(item);
        } else {
            // Placeholder video slot
            const ph = document.createElement("div");
            ph.className = "placeholder-item";
            ph.innerHTML = `<div class="ph-icon">🎬</div><span>Drop video in<br>static/videos/${cat.id}/</span>`;
            g.appendChild(ph);
        }
    }

    requestAnimationFrame(observeReveal);
}

/* ── Tabs ───────────────────────────────────────────────── */
$("#category-tabs")?.addEventListener("click", e => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    if (btn.dataset.category === activeCategory) {
        renderCoverGrid();
        return;
    }
    selectCategory(btn.dataset.category);
});

/* ── Brands Slider ──────────────────────────────────────── */
async function loadBrandsSlider() {
    try {
        const files = await fetch("/api/images/collaborations").then(r => r.json());
        if (!files.length) return;
        const track = $("#brands-track");
        const items = files.map(f => {
            const w = document.createElement("div");
            w.className = "brand-logo-item";
            const img = document.createElement("img");
            img.src = `/images/collaborations/${f}`;
            img.alt = f.replace(/\.[^.]+$/, "");
            w.appendChild(img);
            return w;
        });
        items.forEach(el => track.appendChild(el));
        items.forEach(el => track.appendChild(el.cloneNode(true)));
    } catch (_) { }
}

/* ── Lightbox — image ───────────────────────────────────── */
function openLightboxImage(src, alt) {
    const img = $("#lightbox-img");
    const vid = $("#lightbox-vid");
    const panel = $("#lightbox-panel");
    vid.pause(); vid.src = ""; vid.style.display = "none";
    if (panel) panel.style.display = "none";
    img.src = src; img.alt = alt || "";
    img.style.display = "block";
    $("#lightbox").classList.add("open");
    document.body.style.overflow = "hidden";
}

/* ── Lightbox — video + project description ─────────────── */
function openLightboxVideo(src, project) {
    const img = $("#lightbox-img");
    const vid = $("#lightbox-vid");
    const panel = $("#lightbox-panel");
    img.style.display = "none";
    vid.src = src; vid.style.display = "block";
    vid.load(); vid.play().catch(() => { });
    if (panel && project) {
        $("#lp-label").textContent = project.title || "";
        $("#lp-description").textContent = project.description || "";
        panel.style.display = "flex";
    }
    $("#lightbox").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    const vid = $("#lightbox-vid");
    const panel = $("#lightbox-panel");
    $("#lightbox").classList.remove("open");
    vid.pause(); vid.src = "";
    if (panel) panel.style.display = "none";
    document.body.style.overflow = "";
}
window.closeLightbox = closeLightbox;
$("#lightbox")?.addEventListener("click", e => {
    if (e.target === $("#lightbox")) closeLightbox();
});

/* ── Contact Modal ──────────────────────────────────────── */
function openContactModal() { $("#contact-modal").classList.add("open"); document.body.style.overflow = "hidden"; }
function closeContactModal() { $("#contact-modal").classList.remove("open"); document.body.style.overflow = ""; }
function handleModalOutsideClick(e) { if (e.target === $("#contact-modal")) closeContactModal(); }
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.handleModalOutsideClick = handleModalOutsideClick;

$("#contact-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const mail = $('a[href^="mailto"]')?.href.replace("mailto:", "") || "rvcreation.prod@gmail.com";
    const body = encodeURIComponent(`Name: ${d.name}\nService: ${d.service}\nBudget: ${d.budget}\n\n${d.message}`);
    window.location.href = `mailto:${mail}?subject=Project%20Inquiry&body=${body}`;
    $("#toast").classList.add("show");
    setTimeout(() => $("#toast").classList.remove("show"), 3500);
    e.target.reset();
    closeContactModal();
});

/* ── Escape key ─────────────────────────────────────────── */
document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeLightbox(); closeContactModal(); }
});

/* ── Scroll reveal ──────────────────────────────────────── */
function observeReveal() {
    const obs = new IntersectionObserver(
        entries => entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
        }),
        { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal:not(.visible)").forEach(el => obs.observe(el));
}

/* ── Init ───────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
    observeReveal();
    initHero();
    loadAllMedia();
    loadBrandsSlider();
    loadStore();
});

/* ═══════════════════════════════════════════════════════════
   ART PRINT STORE
   ═══════════════════════════════════════════════════════════ */

let storeCurrentSlide = 0;

async function loadStore() {
    try {
        const items = await fetch("/api/store").then(r => r.json());
        const grid = $("#store-grid");
        if (!grid || !items.length) return;
        grid.innerHTML = "";
        items.forEach(item => {
            const card = document.createElement("div");
            card.className = "store-card reveal";
            const imgSrc = item.photo || item.mockup || "";
            card.innerHTML = `
                <div class="store-card-img">
                    <img src="${imgSrc}" alt="${item.title}" loading="lazy"
                         onerror="this.parentElement.style.background='#1a1a1a'"/>
                </div>
                <div class="store-card-info">
                    <div class="store-card-title">${item.title}</div>
                </div>`;
            card.addEventListener("click", () => openStoreLightbox(item));
            grid.appendChild(card);
        });
        requestAnimationFrame(observeReveal);
    } catch (e) { console.warn("Store load error:", e); }
}

function openStoreLightbox(item) {
    storeCurrentSlide = 0;
    // Populate images
    $("#slb-photo").src = item.photo || "";
    $("#slb-room").src = item.mockup || "";
    // Populate info
    $("#slb-title").textContent = item.title;
    $("#slb-description").textContent = item.description;
    $("#slb-resolution").textContent = item.resolution;
    // Reset slider
    storeGoTo(0);
    // Show
    $("#store-lightbox").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeStoreLightbox() {
    $("#store-lightbox").classList.remove("open");
    document.body.style.overflow = "";
    // Clear images to free memory
    setTimeout(() => {
        $("#slb-photo").src = "";
        $("#slb-room").src = "";
    }, 400);
}
window.closeStoreLightbox = closeStoreLightbox;

function storeSlide(dir) {
    storeGoTo((storeCurrentSlide + dir + 2) % 2);
}
function storeGoTo(idx) {
    storeCurrentSlide = idx;
    $("#store-slides").style.transform = `translateX(-${idx * 100}%)`;
    document.querySelectorAll("#store-dots .dot").forEach((d, i) =>
        d.classList.toggle("active", i === idx));
}
window.storeSlide = storeSlide;
window.storeGoTo = storeGoTo;

// Keyboard support for store lightbox
document.addEventListener("keydown", e => {
    if (!$("#store-lightbox").classList.contains("open")) return;
    if (e.key === "ArrowLeft") storeSlide(-1);
    if (e.key === "ArrowRight") storeSlide(1);
    if (e.key === "Escape") closeStoreLightbox();
});

// Click outside inner panel to close
$("#store-lightbox")?.addEventListener("click", e => {
    if (e.target === $("#store-lightbox")) closeStoreLightbox();
});
