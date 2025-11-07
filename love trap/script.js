const card = document.getElementById('card');
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const overlay = document.getElementById('overlay');
const closeOverlay = document.getElementById('closeOverlay');

let avoidEnabled = true;

// helper
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// move the "No" button anywhere in viewport
function moveNoAwayFrom(x, y) {
  if (!avoidEnabled) return;
  const THRESHOLD = 120; // distance before it jumps
  const btnRect = noBtn.getBoundingClientRect();
  const btnCenterX = btnRect.left + btnRect.width / 2;
  const btnCenterY = btnRect.top + btnRect.height / 2;

  const dx = x - btnCenterX;
  const dy = y - btnCenterY;
  const dist = Math.hypot(dx, dy);

  if (dist > THRESHOLD && !window.matchMedia("(pointer: coarse)").matches) return;

  // Full screen boundaries
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  // random new position (anywhere)
  const newX = Math.random() * (screenW - btnRect.width);
  const newY = Math.random() * (screenH - btnRect.height);

  noBtn.style.position = "fixed";
  noBtn.style.left = `${clamp(newX, 0, screenW - btnRect.width)}px`;
  noBtn.style.top = `${clamp(newY, 0, screenH - btnRect.height)}px`;
  noBtn.style.transition = "all 0.25s ease";
}

// Mouse movement
document.addEventListener("mousemove", (e) => {
  moveNoAwayFrom(e.clientX, e.clientY);
});

// Touch support for mobile
document.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  if (t) moveNoAwayFrom(t.clientX, t.clientY);
});
document.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t) moveNoAwayFrom(t.clientX, t.clientY);
});

// Click on "No" also moves away (for mobile tap)
noBtn.addEventListener("click", (e) => {
  if (avoidEnabled) {
    e.preventDefault();
    const rect = noBtn.getBoundingClientRect();
    moveNoAwayFrom(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
});

// Click on "Yes" → show heart animation
yesBtn.addEventListener("click", () => {
  avoidEnabled = false;
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  yesBtn.focus();
});

// Close overlay
closeOverlay.addEventListener("click", () => {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
});

// Escape key closes overlay
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("show")) {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
  }
});

// Initial position
(function init() {
  noBtn.style.position = "fixed";
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  noBtn.style.left = `${screenW / 2 + 100}px`;
  noBtn.style.top = `${screenH / 2}px`;
})();
