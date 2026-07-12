// BodyShop Booster — redesign concept: lightweight view switching + niceties
(function () {
  const today = document.getElementById('today');
  if (today) {
    today.textContent = new Date().toLocaleDateString(undefined, {
      weekday: 'long', month: 'short', day: 'numeric'
    });
  }

  const views = document.querySelectorAll('.view');
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  const crumb = document.querySelector('[data-crumb]');

  // ---- Mobile sidebar (off-canvas) ----
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('[data-overlay]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const closeNav = document.querySelector('[data-close-nav]');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    overlay && (overlay.hidden = false, requestAnimationFrame(() => overlay.classList.add('show')));
    menuToggle && menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (overlay) {
      overlay.classList.remove('show');
      setTimeout(() => { overlay.hidden = true; }, 200);
    }
    menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  menuToggle && menuToggle.addEventListener('click', openSidebar);
  closeNav && closeNav.addEventListener('click', closeSidebar);
  overlay && overlay.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeSidebar();
  });

  function show(name) {
    let matched = false;
    views.forEach(v => {
      const on = v.dataset.view === name;
      v.hidden = !on;
      if (on) matched = true;
    });
    if (!matched) return;
    navItems.forEach(n => n.classList.toggle('active', n.dataset.view === name));
    if (crumb) crumb.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(n => n.addEventListener('click', e => {
    e.preventDefault();
    show(n.dataset.view);
    history.replaceState(null, '', '#' + n.dataset.view);
    closeSidebar();
  }));

  document.querySelectorAll('[data-view-link]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      show(a.dataset.viewLink);
    });
  });

  // Deep-link
  const initial = (location.hash || '#dashboard').slice(1);
  show(initial);

  // ⌘K / N shortcuts
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const s = document.querySelector('.search input');
      s && s.focus();
    } else if (e.key.toLowerCase() === 'n' && !/input|textarea/i.test(document.activeElement.tagName)) {
      const b = document.querySelector('[data-new]');
      b && b.click();
    }
  });

  // "New" button — tiny pulse to signal action
  const newBtn = document.querySelector('[data-new]');
  newBtn && newBtn.addEventListener('click', () => {
    newBtn.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(.97)' }, { transform: 'scale(1)' }],
      { duration: 220, easing: 'ease-out' }
    );
  });

  // Tab groups (visual only)
  document.querySelectorAll('.tabs').forEach(group => {
    group.addEventListener('click', e => {
      const t = e.target.closest('.tab');
      if (!t) return;
      group.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
  });
})();