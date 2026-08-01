/* ============================================================
   HAPPY GIRLFRIEND DAY — script.js
   Edit the CONFIG block below to personalize everything:
   names, letter text, photos, reasons, and the song file.
   ============================================================ */

const CONFIG = {
 
  // Section 5 cards — icon, title, text
  reasons: [
    { icon: "❤️", title: "Your Smile", text: "Your smile can brighten even my darkest days." },
    { icon: "🌸", title: "Your Kindness", text: "Your kind heart makes you so special." },
    { icon: "👑", title: "Your Care", text: "The way you care for me means everything." },
    { icon: "⭐", title: "You & Me", text: "Because of you, every moment is perfect." },
  ],
  // Section 3 song.
  // Put your song file in an "audio" folder next to index.html, named:
  //   audio/song.mp3
  // (mp3 or ogg both work — update the extension below to match your file.)
  // Then edit the title/artist text to whatever you want shown in the player.
  song: {
    src: "music.mp3",
    title: "My Love Song",
    artist: "Your Name",
},
};

/* ---------------- utility: seeded random within range ---------------- */
const rand = (min, max) => Math.random() * (max - min) + min;

/* ---------------- ambient stars ---------------- */
function buildStars() {
  const layer = document.getElementById("stars1");
  if (!layer) return;
  const count = window.innerWidth < 640 ? 60 : 110;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.style.left = rand(0, 100) + "%";
    s.style.top = rand(0, 70) + "%";
    s.style.animationDelay = rand(0, 3) + "s";
    s.style.width = s.style.height = rand(1, 2.4) + "px";
    frag.appendChild(s);
  }
  layer.appendChild(frag);
}

/* ---------------- floating hearts across whole page ---------------- */
function buildFloatingHearts() {
  const layer = document.getElementById("floatingHearts");
  if (!layer) return;
  const glyphs = ["♥", "♡"];
  setInterval(() => {
    const h = document.createElement("span");
    h.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    h.style.left = rand(2, 98) + "%";
    h.style.fontSize = rand(12, 26) + "px";
    h.style.setProperty("--drift", rand(-60, 60) + "px");
    h.style.animationDuration = rand(9, 16) + "s";
    layer.appendChild(h);
    setTimeout(() => h.remove(), 17000);
  }, 1400);
}

/* ---------------- falling petals (sections 2 & 3) ---------------- */
function buildPetals(id, count) {
  const layer = document.getElementById(id);
  if (!layer) return;
  const glyphs = ["❀", "❁", "✿"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    p.style.left = rand(0, 100) + "%";
    p.style.setProperty("--drift", rand(-40, 40) + "px");
    p.style.animationDelay = rand(0, 10) + "s";
    p.style.animationDuration = rand(7, 13) + "s";
    p.style.opacity = rand(0.4, 0.9);
    layer.appendChild(p);
  }
}

/* ---------------- side dot navigation + scroll spy ---------------- */
function setupDotNav() {
  const scroller = document.getElementById("scroller");
  const sections = Array.from(document.querySelectorAll(".panel"));
  const dots = Array.from(document.querySelectorAll(".dot"));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          dots.forEach((d) => d.classList.remove("active"));
          const match = dots.find((d) => d.dataset.target === entry.target.id);
          if (match) match.classList.add("active");
        }
      });
    },
    { root: scroller, threshold: 0.55 }
  );
  sections.forEach((s) => observer.observe(s));

  // "Begin Our Story" button scrolls to next section
  document.querySelectorAll("[data-scroll-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = btn.closest(".panel");
      const next = current.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ---------------- music: top toggle + mini player share one <audio> ---------------- */
function setupMusic() {
  const audio = document.getElementById("bgAudio");
  const topToggle = document.getElementById("musicToggle");
  const playBtn = document.getElementById("playBtn");
  const volBtn = document.getElementById("volBtn");
  const playerBar = document.querySelector(".player-bar");
  const trackName = document.getElementById("trackName");
  const trackArtist = document.getElementById("trackArtist");

  trackName.textContent = CONFIG.song.title;
  trackArtist.textContent = CONFIG.song.artist;
  if (CONFIG.song.src) audio.src = CONFIG.song.src;

  function syncUI(playing) {
    topToggle.classList.toggle("playing", playing);
    topToggle.querySelector(".music-label").textContent = playing ? "Pause Music" : "Play Music";
    topToggle.setAttribute("aria-pressed", String(playing));
    playBtn.textContent = playing ? "⏸" : "▶";
    playerBar.classList.toggle("playing", playing);
  }

  async function togglePlay() {
    if (!CONFIG.song.src) {
      // No audio file configured yet — just flip the visual state so the
      // demo still feels alive. Add a real file in CONFIG.song.src to play audio.
      syncUI(audio.paused ? true : false);
      return;
    }
    try {
      if (audio.paused) {
        await audio.play();
        syncUI(true);
      } else {
        audio.pause();
        syncUI(false);
      }
    } catch (e) {
      console.warn("Playback needs a user gesture or a valid audio file.", e);
    }
  }

  topToggle.addEventListener("click", togglePlay);
  playBtn.addEventListener("click", togglePlay);
  volBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    volBtn.textContent = audio.muted ? "🔇" : "🔊";
  });
}

/* ---------------- envelope open interaction ---------------- */
function setupEnvelope() {
  const btn = document.getElementById("envelopeBtn");
  const hint = document.getElementById("envelopeHint");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const opened = btn.classList.toggle("opened");
    hint.textContent = opened ? "tap to continue" : "tap the envelope";
    if (opened) {
      setTimeout(() => {
        const next = document.getElementById("letter");
        // don't auto-scroll immediately — let them enjoy the reveal
        hint.onclick = () => next.scrollIntoView({ behavior: "smooth" });
      }, 600);
    }
  });
}

/* ---------------- memories carousel ---------------- */
function setupMemories() {
  const track = document.getElementById("polaroidTrack");
  const modalGrid = document.getElementById("modalGrid");
  if (!track) return;

  CONFIG.memories.forEach((m, i) => {
    const photoInner = m.img
      ? `<img src="${m.img}" alt="${m.caption}" loading="lazy">`
      : `<div class="photo-fallback">${m.emoji || "🐼"}</div>`;

    const card = document.createElement("div");
    card.className = "polaroid";
    card.style.setProperty("--tilt", (i % 2 === 0 ? -1 : 1) * rand(2, 6) + "deg");
    card.innerHTML = `
      <div class="photo">${photoInner}</div>
      <span class="cap">${m.caption}</span>
    `;
    track.appendChild(card);

    const modalCard = document.createElement("div");
    modalCard.innerHTML = `<div class="photo">${photoInner}</div>`;
    modalGrid.appendChild(modalCard);
  });

  const prev = document.getElementById("memPrev");
  const next = document.getElementById("memNext");
  const scrollAmount = 176;
  prev.addEventListener("click", () => track.scrollBy({ left: -scrollAmount, behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: scrollAmount, behavior: "smooth" }));

  // modal open/close
  const modal = document.getElementById("photoModal");
  const openBtn = document.getElementById("viewAllBtn");
  const closeBtn = document.getElementById("modalClose");
  openBtn.addEventListener("click", () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
}

/* ---------------- reasons cards + dots (grid on desktop, swipe-paged on mobile) ---------------- */
function setupReasons() {
  const grid = document.getElementById("reasonGrid");
  const dotsWrap = document.getElementById("reasonDots");
  if (!grid) return;

  CONFIG.reasons.forEach((r) => {
    const card = document.createElement("div");
    card.className = "reason-card";
    card.innerHTML = `
      <div class="reason-icon">${r.icon}</div>
      <div class="reason-title">${r.title}</div>
      <div class="reason-text">${r.text}</div>
    `;
    grid.appendChild(card);
  });

  CONFIG.reasons.forEach((_, i) => {
    const d = document.createElement("span");
    if (i === 1) d.classList.add("active"); // mirrors mockup's active dot
    dotsWrap.appendChild(d);
  });
}

/* ---------------- fireworks canvas (finale) ---------------- */
function setupFireworks() {
  const canvas = document.getElementById("fireworks");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let running = false;
  let rafId = null;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#ff4f93", "#ff8fc0", "#ffd76a", "#ffffff", "#c81d5b"];

  function burst(x, y) {
    const count = 46;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = rand(1.5, 4.2);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: rand(1.5, 3),
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.025; // gravity
      p.life -= 0.012;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    particles = particles.filter((p) => p.life > 0);
    ctx.globalAlpha = 1;
    if (running) rafId = requestAnimationFrame(tick);
  }

  function randomBurstLoop() {
    if (!running) return;
    burst(rand(canvas.width * 0.15, canvas.width * 0.85), rand(canvas.height * 0.15, canvas.height * 0.55));
    setTimeout(randomBurstLoop, rand(900, 1800));
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    tick();
    randomBurstLoop();
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  const finale = document.getElementById("finale");
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
    { threshold: 0.4 }
  );
  observer.observe(finale);

  // confetti-style extra burst on the thank-you button
  const thankBtn = document.getElementById("thankYouBtn");
  thankBtn.addEventListener("click", () => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => burst(rand(canvas.width * 0.2, canvas.width * 0.8), rand(canvas.height * 0.2, canvas.height * 0.6)), i * 200);
    }
  });
}

/* ---------------- init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  buildStars();
  buildFloatingHearts();
  buildPetals("petals2", 22);
  buildPetals("petals3", 14);
  setupDotNav();
  setupMusic();
  setupEnvelope();
  setupMemories();
  setupReasons();
  setupFireworks();
});