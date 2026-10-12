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
