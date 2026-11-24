/* MANIMAX TECH — stable, responsive motion controller */
(() => {
  'use strict';
  const ready = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true }) : fn();

  ready(() => {
    const body = document.body;
    const root = document.documentElement;
    const header = document.querySelector('.site-header');
    const menuButton = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#main-navigation, .main-nav');
    const hero = document.querySelector('.hero');
    const isHome = Boolean(hero);
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;

    // Wait for web fonts before animating text; prevents line-wrap jumps.
    const enableMotion = () => body.classList.add('mt-motion-ready');
    if (document.fonts && document.fonts.ready) {
      Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 900))]).then(enableMotion);
    } else enableMotion();

    if (isHome) {
      body.classList.add('mt-home');
      hero.classList.add('mt-home-hero');
      [
        ['.hero-copy .eyebrow', 'mt-hero-eyebrow'],
        ['.hero-copy h1', 'mt-hero-title'],
        ['.hero-copy > p', 'mt-hero-description'],
        ['.hero-copy .hero-actions', 'mt-hero-actions'],
        ['.hero-copy .hero-tags', 'mt-hero-tags'],
        ['.hero-visual', 'mt-hero-art']
      ].forEach(([selector, cls]) => {
        const el = hero.querySelector(selector);
        if (el) el.classList.add(cls);
      });
    }

    const year = document.querySelector('#year');
    if (year) year.textContent = new Date().getFullYear();

    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.main-nav a.nav-link').forEach(link => {
      const target = (link.getAttribute('href') || '').split('/').pop().toLowerCase();
      const active = target === current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    // Accessible mobile menu; CSS and JS share the 1100px breakpoint.
    if (menuButton && nav) {
      const closeMenu = () => {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation menu');
      };
      menuButton.setAttribute('aria-controls', nav.id || 'main-navigation');
      menuButton.addEventListener('click', event => {
        event.preventDefault();
        const open = !nav.classList.contains('is-open');
        nav.classList.toggle('is-open', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      });
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
      document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
      document.addEventListener('click', event => {
        if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
      });
      const desktop = matchMedia('(min-width:1101px)');
      const resetAtDesktop = () => { if (desktop.matches) closeMenu(); };
      desktop.addEventListener ? desktop.addEventListener('change', resetAtDesktop) : desktop.addListener(resetAtDesktop);
    }

    // One observer for all pages. Reveal parent blocks/cards, not individual images.
    const selectors = [
      '.intro-grid', '.section-heading', '.cap-card', '.preview-card',
      '.statement-grid', '.patent-strip-inner', '.cta-inner', '.two-col',
      '.vision-grid article', '.founder-photo-wrap', '.founder-grid > div:not(.founder-photo-wrap)',
      '.market-grid span', '.service-detail', '.portfolio-note', '.product-detail',
      '.patent-card', '.legal-note', '.contact-grid > *', '.contact-info', '.contact-form', '.project-card', '.gallery-grid > *', '.spec-grid > *'
    ].join(',');
    const revealItems = [...document.querySelectorAll(selectors)];
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(el => el.classList.add('mt-visible'));
    } else {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('mt-visible');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });
      revealItems.forEach(el => {
        el.classList.add('mt-reveal');
        const siblings = el.parentElement ? [...el.parentElement.children] : [el];
        const i = Math.max(0, siblings.indexOf(el));
        el.style.setProperty('--mt-delay', `${Math.min(i, 3) * 55}ms`);
        observer.observe(el);
      });
    }

    // Scroll controls: one RAF pipeline; no hero geometry writes or forced layout.
    const progress = document.createElement('div');
    progress.className = 'mt-scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    body.appendChild(progress);
    const backTop = document.createElement('button');
    backTop.className = 'mt-back-top';
    backTop.type = 'button';
    backTop.setAttribute('aria-label', 'Back to top');
    backTop.textContent = '↑';
    body.appendChild(backTop);
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

    let queued = false;
    const updateScroll = () => {
      const y = window.scrollY || root.scrollTop || 0;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
      if (header) header.classList.toggle('is-scrolled', y > 24);
      backTop.classList.toggle('is-visible', y > 380);
      queued = false;
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(updateScroll);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    updateScroll();

    // Pointer parallax: latest coordinates are read inside the RAF callback.
    const artwork = isHome ? hero.querySelector('.hero-visual') : null;
    const logo = artwork && artwork.querySelector('.hero-logo');
    if (artwork && logo && finePointer && !reduceMotion) {
      let rect = artwork.getBoundingClientRect();
      let frame = 0, px = 0, py = 0;
      const measure = () => { rect = artwork.getBoundingClientRect(); };
      const reset = () => {
        logo.style.setProperty('--mt-pointer-x', '0px');
        logo.style.setProperty('--mt-pointer-y', '0px');
      };
      artwork.addEventListener('pointerenter', measure, { passive: true });
      artwork.addEventListener('pointermove', event => {
        px = ((event.clientX - rect.left) / Math.max(1, rect.width) - .5) * 7;
        py = ((event.clientY - rect.top) / Math.max(1, rect.height) - .5) * 7;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          logo.style.setProperty('--mt-pointer-x', `${px.toFixed(1)}px`);
          logo.style.setProperty('--mt-pointer-y', `${py.toFixed(1)}px`);
          frame = 0;
        });
      }, { passive: true });
      artwork.addEventListener('pointerleave', reset, { passive: true });
      addEventListener('resize', measure, { passive: true });
    }

    // Reliable full-page transitions for same-origin HTML navigation.
    if (!reduceMotion) {
      const wipe = document.createElement('div');
      wipe.className = 'mt-page-wipe';
      wipe.setAttribute('aria-hidden', 'true');
      body.appendChild(wipe);
      body.classList.add('mt-page-entering');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        wipe.classList.add('is-away');
        body.classList.add('mt-page-arrived');
      }));
      window.setTimeout(() => {
        wipe.remove();
        body.classList.remove('mt-page-entering', 'mt-page-arrived');
      }, 1050);

      let navigating = false;
      document.addEventListener('click', event => {
        const target = event.target instanceof Element ? event.target : event.target.parentElement;
        const link = target && target.closest('a[href]');
        if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey ||
            event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') ||
            (link.target && link.target !== '_self') || link.hasAttribute('data-no-transition')) return;
        let destination;
        try { destination = new URL(link.href, window.location.href); } catch (_) { return; }
        if (destination.origin !== window.location.origin || !/\.html?$/i.test(destination.pathname) ||
            (destination.pathname === window.location.pathname && destination.search === window.location.search)) return;
        if (navigating) { event.preventDefault(); return; }
        navigating = true;
        event.preventDefault();
        if (nav && menuButton) {
          nav.classList.remove('is-open');
          menuButton.setAttribute('aria-expanded', 'false');
          menuButton.setAttribute('aria-label', 'Open navigation menu');
        }
        wipe.classList.remove('is-away');
        wipe.classList.add('is-leaving');
        body.classList.add('mt-page-leaving');
        window.setTimeout(() => window.location.assign(destination.href), 760);
      }, true);
    }
    const form = document.querySelector('#contactForm');
    if (form) form.addEventListener('submit', async event => {
      event.preventDefault();
      const status = document.querySelector('#formStatus');
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.innerHTML : '';
      if (status) status.textContent = 'Sending your enquiry…';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending…';
      }
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) {
          let detail = '';
          try {
            const result = await response.json();
            if (Array.isArray(result.errors)) detail = ' ' + result.errors.map(item => item.message).join(' ');
          } catch (_) {}
          throw new Error(detail || 'The form service could not accept the enquiry. Please try again.');
        }
        form.reset();
        if (status) status.textContent = 'Thank you! Your enquiry has been sent successfully to the MANIMAX TECH team.';
      } catch (error) {
        if (status) status.textContent = (error && error.message) || 'Unable to send your enquiry right now. Please try again or email manikandan@manimaxtech.com.';
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      }
    });
  });
})();
