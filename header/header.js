const scriptPathH = document.currentScript.src;
const script = document.currentScript;
const activeMenu = script.dataset.activeMenu;
const headerDir = scriptPathH.substring(0, scriptPathH.lastIndexOf('/'));

fetch(`${headerDir}/header.html`)
    .then(r => r.text())
    .then(html => {
        const container = document.createElement("div");
        container.innerHTML = html;

        // -----------------------------------------
        // Activate menu
        // -----------------------------------------
        const el = container.querySelector(`#menu-item-${activeMenu}`);
        if (el) {
            el.classList.add("current-menu-item", "current_page_item");
        }

        const activeMenuInt = parseInt(script.dataset.activeMenu, 10);
        if (activeMenuInt >= 4 && activeMenuInt <= 12) {
            const services = container.querySelector("#menu-item-3");
            if (services) {
                services.classList.add("current-menu-ancestor");
            }
        }

        // If we're on menu 3, tag all 4–12 submenu links with "other-options"
        if (activeMenuInt === 3) {
            for (let i = 4; i <= 12; i++) {
                const li = container.querySelector(`#menu-item-${i}`);
                if (!li) continue;

                li.querySelectorAll("a").forEach(a => {
                    a.classList.add("other-options");
                });
            }
        }


        // -----------------------------------------
        // PREPEND "../" BASED ON DIRECTORY DEPTH
        // -----------------------------------------
        const depth = getDirDepth(); // calculate depth
        prependDotsToLinksAndImages(container, depth); // rewrite all <a> hrefs

        // Insert modified header
        document.getElementById("header").innerHTML = container.innerHTML;

        // --- Wait for DOM to update ---
        requestAnimationFrame(() => {
            const headerEl = document.getElementById("main-header");
            const pageContent = document.getElementById("page-container");

            if (headerEl && pageContent) {
                // Set page padding so content is not hidden
                const headerHeight = headerEl.offsetHeight;
                pageContent.style.paddingTop = headerHeight + "px";

                // Now attach scroll listener safely
                initHideHeaderOnScroll(headerEl);
            }
        });

    });


// -------- Helper functions ----------
function getDirDepth() {
    const path = window.location.pathname;
    const withoutFile = path.replace(/[^\/]+$/, "");
    const parts = withoutFile.split("/").filter(Boolean);
    return parts.length;
}

function prependDotsToLinksAndImages(container, depth) {
    const prefix = "../".repeat(depth);

    // --------- A TAGS ---------
    container.querySelectorAll("a[href]").forEach(a => {
        const href = a.getAttribute("href");

        if (!href) return;

        // ignore absolute links
        if (/^(https?:)?\/\//.test(href)) return;

        // ignore leading slash (root-relative)
        if (href.startsWith("/")) return;

        // ignore if already has ../
        if (href.startsWith("../")) return;

        a.setAttribute("href", prefix + href);
    });

    // --------- IMG TAGS ---------
    container.querySelectorAll("img[src]").forEach(img => {
        const src = img.getAttribute("src");

        if (!src) return;

        // ignore absolute URLs
        if (/^(https?:)?\/\//.test(src)) return;

        // ignore root-relative paths
        if (src.startsWith("/")) return;

        // ignore if already adjusted
        if (src.startsWith("../")) return;

        img.setAttribute("src", prefix + src);
    });
}



// --- Helper functions ---

function initHideHeaderOnScroll(header) {
    if (!header) return;

    let lastScrollY = window.scrollY;
    const threshold = 10;

    window.addEventListener("scroll", () => {
        const current = window.scrollY;

        // Always show header if near top
        if (current <= 20) {
            header.classList.remove("header-hidden");
        }
        // scrolling down -> hide
        else if (current > lastScrollY && current > 60) {
            header.classList.add("header-hidden");
        }
        // scrolling up -> show
        else if (lastScrollY - current > threshold) {
            header.classList.remove("header-hidden");
        }

        lastScrollY = current;
    }, { passive: true });
}
