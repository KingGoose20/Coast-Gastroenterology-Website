const scriptPathH = document.currentScript.src;
const scriptH = document.currentScript;
const activeMenuH = scriptH.dataset.activeMenuH;
const headerDir = scriptPathH.substring(0, scriptPathH.lastIndexOf('/'));

fetch(`${headerDir}/header.html`)
    .then(r => r.text())
    .then(html => {
        const container = document.createElement("div");
        container.innerHTML = html;

        // -----------------------------------------
        // Activate menu
        // -----------------------------------------
        const el = container.querySelector(`#menu-item-${activeMenuH}`);
        if (el) {
            el.classList.add("current-menu-item", "current_page_item");
        }

        const activeMenuInt = parseInt(scriptH.dataset.activeMenuH, 10);
        if (activeMenuInt >= 7 && activeMenuInt <= 15) {
            const services = container.querySelector("#menu-item-6");
            if (services) {
                services.classList.add("current-menu-ancestor");
            }
        }

        if (activeMenuInt >= 3 && activeMenuInt <= 5) {
            const services = container.querySelector("#menu-item-2");
            if (services) {
                services.classList.add("current-menu-ancestor");
            }
        }

        // If we're on menu 6, tag all 7–15 submenu links with "other-options"
        if (activeMenuInt === 6) {
            for (let i = 7; i <= 15; i++) {
                const li = container.querySelector(`#menu-item-${i}`);
                if (!li) continue;

                li.querySelectorAll("a").forEach(a => {
                    a.classList.add("other-options");
                });
            }
        }

        // If we're on menu 2, tag all 3-5 submenu links with "other-options"
        if (activeMenuInt === 2) {
            for (let i = 3; i <= 5; i++) {
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
            initMobileMenu();
            createDropDownMenu();
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
    if (parts[0] === "Coast-Gastroenterology-Website") {
        parts.splice(0, 1);
    }
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

function initMobileMenu() {
    const burger = document.getElementById('mobile_menu_bar');
    const mobileMenu = document.getElementById('mobile_menu');

    burger.addEventListener('click', function () {
        mobileMenu.classList.toggle('open');
    });
}

document.addEventListener('DOMContentLoaded', initMobileMenu);

function createDropDownMenu() {
    const dropDown = document.getElementById("dropdown-main");
    const mainNav = document.getElementById('top-menu'); // Assuming your <ul> has an ID
    const listItems = mainNav.querySelectorAll('li');
    console.log(listItems);

    listItems.forEach(item => {
        if (parseInt(item.id.slice(10)) >= 7 && parseInt(item.id.slice(10)) <= 15) return; // Skip non-services items
        dropDown.appendChild(item.cloneNode(true));
    });
}

