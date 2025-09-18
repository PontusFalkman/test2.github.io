// A self-contained module for locking/unlocking body scroll.
const scrollLocker = (function() {
  let scrollY = 0;

  function lock() {
    scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlock() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollY);
  }

  return { lock, unlock };
})();

// A module for handling main navigation enhancements (dropdowns, active links).
function initNavEnhancements() {
  const menu = document.querySelector('.menu');
  if (!menu) return;

  const groups = [...menu.querySelectorAll('.menu-group')];
  const closeAll = (exceptGroup = null) => {
    groups.forEach(g => {
      if (g !== exceptGroup) {
        g.classList.remove('open');
        const btn = g.querySelector('.menu-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  };

  // Click to toggle a single submenu
  menu.addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-toggle');
    if (!btn) return;
    const group = btn.closest('.menu-group');
    const willOpen = !group.classList.contains('open');

    closeAll(); // close others first
    if (willOpen) {
      group.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.focus();
    }
  });

  // Click outside closes all
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu')) closeAll();
  });

  // Escape closes all
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });

  // Initialize state: all closed
  closeAll();

  // Mark current page link (directory-safe)
  try {
    const currentPath = location.pathname.endsWith('/')
      ? location.pathname
      : location.pathname.replace(/[^/]*$/, '');
    menu.querySelectorAll('a[href]').forEach(a => {
      const linkPath = a.pathname.endsWith('/')
        ? a.pathname
        : a.pathname.replace(/[^/]*$/, '');
      if (linkPath === currentPath) {
        a.setAttribute('aria-current', 'page');
        const parentGroup = a.closest('.menu-group');
        if (parentGroup) {
          const toggleBtn = parentGroup.querySelector('.menu-toggle');
          if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'true');
            parentGroup.classList.add('open');
          }
        }
      }
    });
  } catch(e) {
    console.error("Failed to set active navigation link.", e);
  }
}

// A module for initializing the mobile hamburger menu.
function initMobileNav() {
  const navBtn = document.getElementById('navToggle');
  const menuEl = document.getElementById('primaryMenu');
  if (!navBtn || !menuEl) return;

  function closeDrawer(){
    if (!document.body.classList.contains('nav-open')) return;
    document.body.classList.remove('nav-open');
    scrollLocker.unlock();
    navBtn.setAttribute('aria-expanded','false');
  }

  navBtn.addEventListener('click', () => {
    const open = !document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open', open);
    navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { scrollLocker.lock(); navBtn.focus(); } else { scrollLocker.unlock(); }
  });

  // Close on link click inside drawer
  menuEl.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeDrawer();
  });

  // Click outside closes
  document.addEventListener('click', e => {
    if (!e.target.closest('#primaryMenu') && !e.target.closest('#navToggle')) closeDrawer();
  });

  // Escape closes
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
}

// Theme switching + OS High Contrast sync.
function initTheme() {
  const BASE_THEMES = ["indigo", "teal", "slate"];
  const mqForced = window.matchMedia?.("(forced-colors: active)");

  function setThemeLabel(name){
    const btn = document.getElementById("themeToggle");
    if (btn) btn.textContent = "Theme: " + name.charAt(0).toUpperCase() + name.slice(1);
  }

  function setHCLabel(enabled, fromOS = false){
    const btn = document.getElementById("hcToggle");
    if (!btn) return;
    if (fromOS) {
      btn.textContent = "High contrast: OS";
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.textContent = "High contrast: " + (enabled ? "On" : "Off");
      btn.setAttribute("aria-pressed", enabled ? "true" : "false");
    }
  }

  function setMetaThemeColorFromCSS(){
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    let meta = document.querySelector('meta[name="theme-color"]');
    if(!meta){ meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    meta.setAttribute('content', bg || '#000');
  }

  function applyHighContrast(enabled){
    localStorage.setItem("highContrast", enabled ? "1" : "0");
    if (enabled){
      document.documentElement.setAttribute("data-theme", "high-contrast");
    } else {
      const base = localStorage.getItem("theme") || BASE_THEMES[0];
      document.documentElement.setAttribute("data-theme", base);
    }
    setHCLabel(enabled, false);
    setMetaThemeColorFromCSS();
  }

  function applyBaseThemeFromStorage(){
    const base = localStorage.getItem("theme") || BASE_THEMES[0];
    document.documentElement.setAttribute("data-theme", base);
    setThemeLabel(base);
    setMetaThemeColorFromCSS();
  }

  function cycleTheme(){
    const current = localStorage.getItem("theme") || BASE_THEMES[0];
    const idx = BASE_THEMES.indexOf(current);
    const next = BASE_THEMES[(idx + 1) % BASE_THEMES.length];
    localStorage.setItem("theme", next);
    setThemeLabel(next);

    const hc = localStorage.getItem("highContrast") === "1";
    const osHC = !!mqForced && mqForced.matches;
    if (!hc && !osHC) {
      document.documentElement.setAttribute("data-theme", next);
      setMetaThemeColorFromCSS();
    }
  }

  function updateFromOS(){
    const osHC = !!mqForced && mqForced.matches;
    const manualHC = localStorage.getItem("highContrast") === "1";
    if (osHC) {
      document.documentElement.setAttribute("data-theme", "high-contrast");
      setHCLabel(true, true);
      setMetaThemeColorFromCSS();
    } else {
      if (manualHC) {
        document.documentElement.setAttribute("data-theme", "high-contrast");
        setHCLabel(true, false);
      } else {
        applyBaseThemeFromStorage();
        setHCLabel(false, false);
      }
    }
  }

  // Restore state on load
  applyBaseThemeFromStorage();
  updateFromOS();

  // Wire buttons
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", cycleTheme);

  const hcBtn = document.getElementById("hcToggle");
  if (hcBtn) hcBtn.addEventListener("click", () => {
    const osHC = !!mqForced && mqForced.matches;
    if (osHC) {
      const was = localStorage.getItem("highContrast") === "1";
      localStorage.setItem("highContrast", was ? "0" : "1");
      updateFromOS();
      return;
    }
    const enabled = localStorage.getItem("highContrast") === "1";
    applyHighContrast(!enabled);
  });

  // React to OS changes live
  if (mqForced && mqForced.addEventListener) {
    mqForced.addEventListener("change", updateFromOS);
  } else if (mqForced && mqForced.addListener) {
    mqForced.addListener(updateFromOS);
  }
}

// Footer year
function setYear(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initNavEnhancements();
  initMobileNav();
  initTheme();
});
