// HYC Portfolio — 모드 전환 · 떠 있는 내비게이션 · 모바일 메뉴 · 현재 섹션 표시

const root = document.documentElement;

/* ── Light / Dark — 프레임의 Color 모드를 바꾸면 통째로 반전됩니다 ── */

const themeToggle = document.getElementById("theme-toggle");

function paintTheme(dark) {
  if (dark) root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");

  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.querySelector(".visually-hidden").textContent =
    dark ? "밝은 화면으로 바꾸기" : "어두운 화면으로 바꾸기";
}

paintTheme(root.getAttribute("data-theme") === "dark");

themeToggle.addEventListener("click", () => {
  const dark = root.getAttribute("data-theme") !== "dark";
  paintTheme(dark);
  try { localStorage.setItem("hyc-theme", dark ? "dark" : "light"); } catch (e) {}
});

/* ── 스크롤 시 bg/subtle 80% + Frosted ── */

const nav = document.getElementById("nav");
const sentinel = document.createElement("div");
sentinel.setAttribute("aria-hidden", "true");
sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px";
document.body.prepend(sentinel);

new IntersectionObserver(
  ([entry]) => nav.setAttribute("data-scrolled", String(!entry.isIntersecting))
).observe(sentinel);

/* ── 모바일 메뉴 ── */

const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("nav-menu");
const menuIcon = document.getElementById("menu-icon");

function setMenu(open) {
  menu.setAttribute("data-open", String(open));
  menuToggle.setAttribute("aria-expanded", String(open));
  menuIcon.setAttribute("href", open ? "#icon-close" : "#icon-menu");
  menuToggle.querySelector(".visually-hidden").textContent =
    open ? "메뉴 닫기" : "메뉴 열기";
}

menuToggle.addEventListener("click", () => {
  setMenu(menu.getAttribute("data-open") !== "true");
});

menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.getAttribute("data-open") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

/* ── 현재 섹션을 내비게이션에 표시합니다 ── */

const navLinks = [...document.querySelectorAll(".nav__links a")];
const targets = navLinks
  .map((a) => document.querySelector(a.hash))
  .filter(Boolean);

if (targets.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) =>
          a.setAttribute("aria-current", String(a.hash === "#" + entry.target.id))
        );
      });
    },
    // 화면 위쪽 1/3 을 지나는 섹션 하나만 현재로 봅니다
    { rootMargin: "-20% 0px -70% 0px" }
  );
  targets.forEach((t) => spy.observe(t));
}

/* ── 모션 — 화면에 들어온 섹션에 data-inview="true" ── */
/* 섹션 머리가 화면 아래 15% 선을 넘으면 등장하고, 화면 밖으로 완전히 나가면 되돌려
   다시 돌아왔을 때 한 번 더 등장합니다. */

window.__hycMotion = true;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const REVEAL = [
  ".t-eyebrow", "h1", "h2", ".t-lead", ".section-header__desc",
  ".tile__meta", ".media", ".chips", ".tile__actions", ".hero__actions",
  ".stat", ".row", ".skill-row", ".facts",
].join(",");

const sections = [...document.querySelectorAll("main > .section")];

// 섹션 안에서 위에서 아래 순서로 0, 1, 2 … 번호를 붙여 차례로 나오게 합니다(최대 8단계).
sections.forEach((section) => {
  [...section.querySelectorAll(REVEAL)]
    .filter((el) => !el.parentElement.closest(".row, .skill-row, .stat, .facts"))
    .forEach((el, i) => el.style.setProperty("--i", Math.min(i, 8)));
});

/* Result — 숫자가 0부터 올라갑니다 */
function countUp(el) {
  const node = el.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE) return;
  if (!el.dataset.final) el.dataset.final = node.textContent;
  const match = el.dataset.final.match(/^(\d+)(.*)$/s);
  if (!match) return;
  const target = Number(match[1]);
  const suffix = match[2];
  if (reduceMotion.matches) { node.textContent = el.dataset.final; return; }

  const duration = 1100;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    node.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  node.textContent = "0" + suffix;
  requestAnimationFrame(step);
}

// 등장: 섹션 머리가 화면 아래 15% 선을 넘으면
const reveal = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const section = entry.target;
      if (!entry.isIntersecting || section.dataset.inview === "true") return;
      section.dataset.inview = "true";
      section.querySelectorAll(".stat__value").forEach(countUp);
    });
  },
  { rootMargin: "0px 0px -15% 0px" }
);

// 되돌리기: 섹션이 화면 밖으로 완전히 나가면 — 다시 돌아오면 한 번 더 등장합니다
const reset = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) entry.target.dataset.inview = "false";
  });
});

sections.forEach((section) => {
  reveal.observe(section);
  reset.observe(section);
});

/* ── 프레임마다 할 일 — 스크롤 한 번에 한 번만 ── */

const onFrame = [];
let frameQueued = false;
function queueFrame() {
  if (frameQueued) return;
  frameQueued = true;
  requestAnimationFrame(() => {
    frameQueued = false;
    onFrame.forEach((fn) => fn());
  });
}
window.addEventListener("scroll", queueFrame, { passive: true });
window.addEventListener("resize", queueFrame);

/* ── 내비게이션은 아래에 있는 섹션과 같은 면이 됩니다 ── */

function syncNavTheme() {
  const y = nav.getBoundingClientRect().bottom + 1;
  const under = document.elementFromPoint(window.innerWidth / 2, y);
  const surface = under && under.closest("main > .section, .footer");
  if (surface && surface.getAttribute("data-theme") === "dark") nav.setAttribute("data-theme", "dark");
  else nav.removeAttribute("data-theme");
}
onFrame.push(syncNavTheme);
syncNavTheme();

/* ── Intro — 로고가 획마다 자기 선 방향으로 흩어집니다 ──
   스크롤 위치(맨 위 → 인트로 높이의 75%)에 맞춰 진행하고, 위로 올리면 다시 모입니다.
   처음 열 때는 반대로, 흩어진 획들이 1.6초 동안 모여 로고가 됩니다. */

const intro = document.querySelector(".intro");

if (intro) {
  const logo = intro.querySelector(".intro__logo");
  const SPAN = 0.7;                 // 획 하나가 움직이는 구간 — 전체 진행의 70%
  const DIST = logo.viewBox.baseVal.width * 0.62;   // 빠져나가는 거리 — 로고 폭의 62%

  const strokes = [...logo.querySelectorAll(".intro__stroke")].map((g) => {
    const path = g.querySelector("path");
    const len = path.getTotalLength();
    const [dx, dy] = (g.dataset.exit || "0,0").split(",").map(Number);
    const n = Math.hypot(dx, dy) || 1;
    path.style.strokeDasharray = `${len} ${len}`;
    return {
      g, path, len,
      ux: dx / n, uy: dy / n,
      delay: Number(g.dataset.delay || 0),
      spin: Number(g.dataset.spin || 0),
      spinCenter: g.dataset.spinCenter || "0 0",   // C의 중심
    };
  });

  // p = 0 이면 완성된 로고, 1 이면 모든 획이 빠져나간 상태
  function paint(p) {
    strokes.forEach((s) => {
      const t = Math.min(1, Math.max(0, (p - s.delay) / SPAN));
      const e = t * t;                                        // 천천히 떠나 점점 빨라집니다
      s.path.style.strokeDashoffset = String(-e * s.len);     // 꼬리부터 머리 쪽으로 지워집니다
      s.g.setAttribute(
        "transform",
        s.spin
          ? `rotate(${s.spin * e} ${s.spinCenter})`
          : `translate(${s.ux * DIST * e} ${s.uy * DIST * e})`
      );
    });
  }

  let assembleP = 0;
  let scrollP = 0;

  function renderIntro() {
    const h = intro.offsetHeight || 1;
    scrollP = Math.min(1, Math.max(0, window.scrollY / (h * 0.75)));
    if (!reduceMotion.matches) {
      paint(Math.max(assembleP, scrollP));
      // 로고는 스크롤보다 천천히 올라가 화면 가운데에 조금 더 머뭅니다
      logo.style.translate = `0 ${Math.min(window.scrollY, h) * 0.35}px`;
    }
    intro.style.setProperty("--intro-p", scrollP.toFixed(3));
    // 큰 로고가 절반쯤 흩어지면 내비게이션의 작은 로고가 나타납니다
    root.style.setProperty("--intro-logo", Math.min(1, Math.max(0, (scrollP - 0.35) / 0.4)).toFixed(3));
  }

  onFrame.push(renderIntro);

  // 처음 열 때 — 맨 위에 있으면 흩어진 획들이 모여 로고가 됩니다
  if (!reduceMotion.matches && window.scrollY < 2) {
    const start = performance.now();
    const DURATION = 1600;
    assembleP = 1;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / DURATION);
      assembleP = Math.pow(1 - k, 3);                         // 빠르게 모여 천천히 자리 잡습니다
      renderIntro();
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  renderIntro();
  logo.dataset.ready = "true";
}
