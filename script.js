// ===== Skills data (levels from Danika's CV) =====
// Edit this list to update the skills chart and its table view.
const SKILLS = [
  { level: "Expert",     items: ["SQL", "BigQuery", "Data validation & QA"] },
  { level: "Proficient", items: ["Python (Pandas)", "Power BI", "Tableau", "KPI design & reporting", "Data modelling", "ETL / ELT"] },
  { level: "Familiar",   items: ["Alteryx", "Apache Superset", "T-SQL", "MySQL", "R", "Advanced Excel", "Git", "Azure (exposure)"] },
];
const LEVEL_DOTS = { Expert: 3, Proficient: 2, Familiar: 1 };

// One quiet row per level: a small three-dot marker, the level, then the skills as plain text.
(function buildSkills() {
  const list = document.getElementById("skills-chart");
  if (!list) return;
  const also = list.querySelector(".skill-also");
  SKILLS.forEach(group => {
    const row = document.createElement("div");
    row.className = "skill-row";
    const dt = document.createElement("dt");
    const dots = document.createElement("span");
    dots.className = "skill-dots";
    dots.setAttribute("aria-hidden", "true");
    for (let i = 1; i <= 3; i++) {
      const d = document.createElement("i");
      if (i <= LEVEL_DOTS[group.level]) d.className = "on";
      dots.appendChild(d);
    }
    dt.append(dots, group.level);
    const dd = document.createElement("dd");
    dd.textContent = group.items.join(" · ");
    row.append(dt, dd);
    list.insertBefore(row, also);
  });
})();

// ===== Mobile nav =====
(function nav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;
  const set = open => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => set(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => set(false)));
})();

// ===== Experience tabs (keyboard accessible) =====
(function tabs() {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const select = tab => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", e => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const next = tabs[(i + step + tabs.length) % tabs.length];
      next.focus();
      select(next);
    });
  });
})();

// ===== Reveal sections + count-up numbers =====
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function countUp(el) {
  const target = Number(el.dataset.to);
  if (reduceMotion) { el.textContent = target; return; }
  const start = performance.now(), dur = 1400;
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll(".count").forEach(countUp);
    io.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".section").forEach(s => io.observe(s));

// ===== Hover tooltips for chart marks =====
(function tooltips() {
  const tip = document.getElementById("tooltip");
  if (!tip) return;
  document.addEventListener("mouseover", e => {
    const t = e.target.closest("[data-tip]");
    if (!t) { tip.hidden = true; return; }
    tip.textContent = t.dataset.tip;
    tip.hidden = false;
  });
  document.addEventListener("mousemove", e => {
    if (tip.hidden) return;
    const x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
    tip.style.left = x + "px";
    tip.style.top = (e.clientY + 16) + "px";
  });
})();

// ===== Hero sparkles: gently twinkling points around the image =====
(function sparkles() {
  const canvas = document.getElementById("sparkles");
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext("2d");
  const colours = ["157,123,255", "79,157,255", "190,170,255"];
  let w, h, dots = [];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 4500);
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 0.08,
      c: colours[Math.floor(Math.random() * colours.length)],
    }));
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    const s = t / 1000;
    for (const d of dots) {
      d.y -= 0.05 + d.speed * 0.03;
      d.x += d.drift;
      if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
      const a = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(s * d.speed + d.phase));
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.c},${a})`;
      ctx.shadowColor = `rgba(${d.c},${a})`;
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(frame);
})();
