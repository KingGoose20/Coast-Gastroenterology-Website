const scriptPathS = document.currentScript.src;
const scriptS = document.currentScript;
const activeMenuS = scriptS.dataset.activeMenuS;
const serviceDirS = scriptPathS.substring(0, scriptPathS.lastIndexOf('/'));

fetch(`${serviceDirS}/service.html`)
    .then(r => r.text())
    .then(html => {
        const container = document.createElement("div");
        container.innerHTML = html;

        const activeMenuInt = parseInt(scriptS.dataset.activeMenuS, 10);
        const start = container.querySelector("#serviceStart");
        if (start) {
            switch (activeMenuInt) {
                case 1:
                    start.classList.add("et_pb_section_3");
                    break;
                case 2:
                    start.classList.add("et_pb_section_4");
                    break;
            }
        }

        // -----------------------------------------
        // PREPEND "../" BASED ON DIRECTORY DEPTH
        // -----------------------------------------
        const depth = getDirDepth(); // calculate depth
        prependDotsToLinksAndImages(container, depth); // rewrite all <a> hrefs

        // Insert modified service
        document.getElementById("service").innerHTML = container.innerHTML;

    });


// -------- Helper functions ----------
function getDirDepth() {
    console.log("b");
    const path = window.location.pathname;
    const withoutFile = path.replace(/[^\/]+$/, "");
    const parts = withoutFile.split("/").filter(Boolean);
    if (parts[0] === "Coast-Gastroenterology-Website") {
        parts.splice(0,1);
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
