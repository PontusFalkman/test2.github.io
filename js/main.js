// Minimal enhancements + theme + high contrast + meta theme-color

function setYear(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

function enhanceNav(){
  const menu = document.querySelector('.menu');
  if (!menu) return;
  const groups = [...menu.querySelectorAll('.menu-group')];
  const closeAll = (except) => {
    groups.forEach(g => { if (g !== except){ g.classList.remove('open'); g.removeAttribute('aria-expanded'); }});
  };
  menu.addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-toggle'); if (!btn) return;
    const group = btn.closest('.menu-group');
    const open = !group.classList.contains('open');
    closeAll();
    if (open){ group.classList.add('open'); group.setAttribute('aria-expanded','true'); btn.focus(); }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.menu')) closeAll(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

  const current = location.pathname.replace(/index\.html$/,'');
  menu.querySelectorAll('a[href]').forEach(a=>{
    try{
      const url = new URL(a.getAttribute('href'), location.origin);
      if (url.pathname.replace(/index\.html$/,'') === current) a.setAttribute('aria-current','page');
    }catch{}
  });
}

// === Theming ===
const BASE_THEMES = ["indigo","teal","slate"]; // exclude high-contrast

function setThemeLabel(name){
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = "Theme: " + name.charAt(0).toUpperCase() + name.slice(1);
}

function setHCLabel(enabled){
  const btn = document.getElementById("hcToggle");
  if (btn){
    btn.textContent = "High contrast: " + (enabled ? "On" : "Off");
    btn.setAttribute("aria-pressed", enabled ? "true" : "false");
  }
}

function setMetaThemeColorFromCSS(){
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  let meta = document.querySelector('meta[name="theme-color"]');
  if(!meta){
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
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
  setHCLabel(enabled);
  setMetaThemeColorFromCSS();
}

function cycleTheme(){
  const current = localStorage.getItem("theme") || BASE_THEMES[0];
  const idx = BASE_THEMES.indexOf(current);
  const next = BASE_THEMES[(idx + 1) % BASE_THEMES.length];
  localStorage.setItem("theme", next);
  setThemeLabel(next);
  const hc = localStorage.getItem("highContrast") === "1";
  if (!hc) {
    document.documentElement.setAttribute("data-theme", next);
    setMetaThemeColorFromCSS();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  enhanceNav();

  // Restore theme state
  const savedTheme = localStorage.getItem("theme") || BASE_THEMES[0];
  const savedHC = localStorage.getItem("highContrast") === "1";
  setThemeLabel(savedTheme);
  setHCLabel(savedHC);
  document.documentElement.setAttribute("data-theme", savedHC ? "high-contrast" : savedTheme);
  setMetaThemeColorFromCSS();

  // Wire buttons
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", cycleTheme);

  const hcBtn = document.getElementById("hcToggle");
  if (hcBtn) hcBtn.addEventListener("click", () => {
    const enabled = localStorage.getItem("highContrast") === "1";
    applyHighContrast(!enabled);
  });
});

// Optional: add this small inline snippet first in <head> to prevent theme flash:
// <script>try{const hc=localStorage.getItem("highContrast")==="1";const base=localStorage.getItem("theme")||"indigo";document.documentElement.setAttribute("data-theme",hc?"high-contrast":base);}catch(e){}</script>
