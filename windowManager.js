let topZ = 1000;

function showWindow(title, bodyHtml, widthPx = 300) {
    // window presentation layer
    const layer = document.getElementById("window-layer");
    if (!layer) {
        console.error("window-layer not found");
        return;
    }

    // window creation
    const win = document.createElement("div");
    win.className = "window floating-window";
    win.style.width = widthPx + "px";

    win.innerHTML = `
        <div class="title-bar">
        <div class="title-bar-text">${title}</div>
        <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
        </div>
        </div>
        <div class="window-body">
        ${bodyHtml}
        </div>
    `;

    // close button behaviour
    const closeBtn = win.querySelector('button[aria-label="Close"]');
    closeBtn.addEventListener("click", () => win.remove());

    // minimise toggles window body leaving just the titlebar
    // or making it visible again
    const body = win.querySelector(".window-body");
    const minBtn = win.querySelector('button[aria-label="Minimize"]');

    minBtn.addEventListener("click", () => {
        body.style.display = (body.style.display === "none") ? "" : "none";
    });

    // maximising
    const maxBtn = win.querySelector('button[aria-label="Maximize"]');

    let isMax = false;
    let prev = {};

    maxBtn.addEventListener("click", () => {
        if (!isMax) {
            // save previous state
            prev = {
                top: win.style.top,
                left: win.style.left,
                width: win.style.width,
                height: win.style.height
            };

            // new state
            win.style.top = "16px";
            win.style.left = "16px";
            win.style.width = "calc(100% - 32px)";
            win.style.height = "calc(100% - 32px)";

            maxBtn.setAttribute("aria-label", "Restore");

            isMax = true;
        } else {
            // restore previous state
            win.style.top = prev.top || "";
            win.style.left = prev.left || "";
            win.style.width = prev.width || "";
            win.style.height = prev.height || "";

            maxBtn.setAttribute("aria-label", "Maximize");

            isMax = false;
        }
    });

    // dragging by title bar
    const titleBar = win.querySelector(".title-bar");
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titleBar.addEventListener("mousedown", (e) => {
        // don't drag if clicking the control buttons
        if (e.target.closest(".title-bar-controls")) return;

        dragging = true;

        const rect = win.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // avoid text selection while dragging
        e.preventDefault();
    });

    // put in front
    win.addEventListener("mousedown", () => {
        win.style.zIndex = ++topZ;
    });

    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;

        win.style.left = (e.clientX - offsetX) + "px";
        win.style.top = (e.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
    });

    // window is on the list of children of window-layer
    layer.appendChild(win);
}
