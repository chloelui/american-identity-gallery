// ---------- GRAB PAGE ELEMENTS ----------
const artifacts = DATA[document.body.dataset.room];
const world = document.getElementById("world");
const avatar = document.getElementById("avatar");
const overlay = document.getElementById("overlay");

// ---------- SCROLLABLE HALLWAY ----------
const START = 600, GAP = 550;
world.style.width = (START + artifacts.length * GAP + 400) + "px";  // total hallway length

artifacts.forEach((a, i) => {
    const el = document.createElement("div");

    // read plaque setting or use "below" if didn't write one
    const plaquePos = a.plaque || "below";
    el.className = `item ${a.type} plaque-${plaquePos}`;
    el.style.left = (START + i * GAP) + "px";
    
    // artwork w/ custom frame if given
    let artHTML;
    if (a.frame) {
        artHTML = `
        <div class="frame-wrap" style="--inset:${a.frameInset || "-8%"}">
            <img class="art" src="${a.image}" alt="${a.title}">
            <img class="frame" src="${a.frame}" alt="">
        </div>`;
    } else {
        artHTML = `<img class="art plain" src="${a.image}" alt="${a.title}">`;
    }

    // pedestal image if given
    const pedestalHTML = a.pedestal ? `<img class="pedestal" src="${a.pedestal}" alt="" style="width:${a.pedestalWidth || "16vh"}">` : "";

    // put art and pedestal together
    el.innerHTML = `
        <div class="piece">${artHTML}${pedestalHTML}</div>
        <div class="plaque"><b>${a.short}</b>Click to read</div>`;

    el.querySelector(".plaque").addEventListener("click", () => openCard(a));
    world.appendChild(el);
});

// ---------- POP-UP CARD ----------
function openCard(a) {
    document.getElementById("card-title").textContent = a.title;
    document.getElementById("card-meta").textContent = a.meta;
    document.getElementById("card-body").textContent = a.body;
    overlay.hidden = false;
    keys.left = keys.right = false; // stop walking while reading
}
function closeCard() { overlay.hidden = true; }
document.getElementById("close").addEventListener("click", closeCard);
overlay.addEventListener("click", e => { if (e.target === overlay) closeCard(); }); // click dim area
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCard(); });

// ---------- KEYBOARD INPUT ----------
const keys = { left: false, right: false };
function setKey(e, down) {
    if (!overlay.hidden) return;    // ignore arrows while card is open
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keys.left = down;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keys.right = down;
    if (e.key.startsWith("Arrow")) e.preventDefault();
}
document.addEventListener("keydown", e => setKey(e, true));
document.addEventListener("keyup", e => setKey(e, false));

// ---------- AVATAR ANIMATION ----------