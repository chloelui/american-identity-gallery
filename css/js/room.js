// ---------- GRAB PAGE ELEMENTS ----------
const artifacts = DATA[document.body.dataset.room];
const world = document.getElementById("world");
const avatar = document.getElementById("avatar");
const body = document.getElementById("avatar-body");
const legs = document.getElementById("avatar-legs");
const overlay = document.getElementById("overlay");

const LEG_FRAMES = [
    "images/avatar-legs-1.png",
    "images/avatar-legs-2.png",
    "images/avatar-legs-3.png",
    "images/avatar-legs-4.png"
];
const BODY_SIDE = "images/avatar-body-side.png";
const BODY_BACK = "images/avatar-body-back.png";

// preload every image to avoid flicker first time it swaps in
[...LEG_FRAMES, BODY_SIDE, BODY_BACK].forEach(src => { new Image().src = src; });

let looking = false;

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
    looking = true;
}
function closeCard() { overlay.hidden = true; looking = false; }
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
let x = 260;
let facing = 1;
let last = performance.now(), walkTimer = 0, frame = 0;
const SPEED = 320;
const FRAME_TIME = 0.15;
const AVATAR_W = () => avatar.offsetWidth;
const MAX_X = () => world.offsetWidth - AVATAR_W() - 40;

function loop(now) {
    const dt = (now - last) / 1000; last = now;
    const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);

    if (looking) {
        body.src = BODY_BACK;
        legs.src = LEG_FRAMES[0];
    } else if (dir !== 0) {
        body.src = BODY_SIDE;
        facing = dir;
        x = Math.min(Math.max(x + dir * SPEED * dt, 120), MAX_X());
        walkTimer += dt;
        if (walkTimer > FRAME_TIME) {
            walkTimer = 0;
            frame = (frame + 1) % LEG_FRAMES.length;
        }
        legs.src = LEG_FRAMES[frame];
    } else {
        body.src = BODY_SIDE;
        legs.src = LEG_FRAMES[0];
        frame = 0; walkTimer = 0;
    }

    avatar.style.left = x + "px";
    avatar.style.transform = `scaleX(${facing})`;   // flips container w/ body + legs together

    const vw = window.innerWidth;
    const cam = Math.min(Math.max(x - vw / 2, 0), world.offsetWidth - vw);
    world.style.transform = `translateX(${-cam}px)`;

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);