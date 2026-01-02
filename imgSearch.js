let IMAGES = null;

async function loadImages() {
    if (IMAGES) return IMAGES;

    const res = await fetch("json/images.json");
    if (!res.ok) throw new Error("Failed to load images.json: " + res.status);

    IMAGES = await res.json();
    return IMAGES;
}

function norm(s) {
    return String(s).trim().toLowerCase();
}

function formatDate(img) {
    const y = img.year ?? "????";
    const m = img.month ? String(img.month).padStart(2, "0") : null;
    const d = img.day ? String(img.day).padStart(2, "0") : null;

    if (!m) return `${y}`;
    if (!d) return `${y}-${m}`;
    return `${y}-${m}-${d}`;
}

function matchesTags(img, tokens) {
    if (tokens.length === 0) return true;
    const tagSet = new Set((img.tags || []).map(norm));
    return tokens.some(t => tagSet.has(t)); // OR search
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

const CDN_BASE = "https://cdn.jsdelivr.net/gh/GT1650CS/rocketphotoarchive@main/";

function imgUrl(img) {
  return CDN_BASE + img.path;
}

function openImageWindow(img) {
    const bodyHtml = `
    <p><strong>${escapeHtml(img.id)}</strong></p>
    <p style="font-size:12px; line-height:1.4;">
      <b>Date:</b> ${escapeHtml(formatDate(img))}<br>
      <b>Tags:</b> ${(img.tags || []).map(escapeHtml).join(", ")}<br>
      <b>Resolution:</b> ${escapeHtml(img.imgw)}&times;${escapeHtml(img.imgh)}<br>
      <b>URL:</b> <a href="${imgUrl(img)}">${escapeHtml(imgUrl(img))}</a>
    </p>
    <p>
      <a href="${imgUrl(img)}" download>Download image</a>
    </p>
    <img src="${imgUrl(img)}" alt="" style="max-width:100%; height:auto; margin-top:8px;">
  `;

    showWindow("Image Properties", bodyHtml, 520);
}

function renderResults(list) {
    const results = document.getElementById("results");
    if (!results) return;

    if (list.length === 0) {
        results.innerHTML = `<p>No matches.</p>`;
        return;
    }

    // result list
    results.innerHTML = `
    <p>${list.length} match(es)</p>
    <table style="width:100%; font-size:12px;">
      <thead>
        <tr>
          <th align="left">ID</th>
          <th align="left">Date</th>
          <th align="left">Tags</th>
          <th align="left">Action</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((img, i) => `
          <tr data-i="${i}">
            <td>${escapeHtml(img.id)}</td>
            <td>${escapeHtml(formatDate(img))}</td>
            <td>${(img.tags || []).map(escapeHtml).join(", ")}</td>
            <td>
              <button class="open-btn" data-id="${escapeHtml(img.id)}">Open</button>
              <a href="${imgUrl(img)}" download>Download</a>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

    // button routing
    results.querySelectorAll(".open-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const img = list.find(x => x.id === id);
            if (img) openImageWindow(img);
        });
    });
}

async function searchImg() {
    const all = await loadImages();

    const q = norm(document.getElementById("searchtxt")?.value || "");
    const tokens = q.split(/\s+/).filter(Boolean);

    const matches = all.filter(img => matchesTags(img, tokens));
    renderResults(matches);
}

// the user can also press Enter in the search box to run search
document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("searchtxt");
    if (box) {
        box.addEventListener("keydown", (e) => {
            if (e.key === "Enter") searchImg();
        });
    }
});


