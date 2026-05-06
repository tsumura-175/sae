(function () {
  'use strict';

  // ===== Service Tabs =====
  var serviceTabs = document.querySelectorAll('.service-tab');
  var servicePanels = document.querySelectorAll('.service-panel');
  serviceTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-target');
      serviceTabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      servicePanels.forEach(function (p) {
        var active = p.id === target;
        p.classList.toggle('is-active', active);
        if (active) {
          p.removeAttribute('hidden');
        } else {
          p.setAttribute('hidden', '');
        }
      });
    });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var idx = Array.prototype.indexOf.call(serviceTabs, tab);
      var next = e.key === 'ArrowRight' ? (idx + 1) % serviceTabs.length : (idx - 1 + serviceTabs.length) % serviceTabs.length;
      serviceTabs[next].focus();
      serviceTabs[next].click();
    });
  });

  // ===== Header shadow on scroll =====
  var header = document.getElementById('siteHeader');
  var ticking = false;
  function updateHeader() {
    var y = window.scrollY;
    if (y > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
  updateHeader();

  // ===== Mobile menu =====
  var menuToggle = document.getElementById('menuToggle');
  var headerNav = document.getElementById('headerNav');
  var drawerOverlay = document.getElementById('drawerOverlay');
  var body = document.body;

  function openMenu() {
    headerNav.classList.add('is-open');
    drawerOverlay.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'メニューを閉じる');
    body.style.overflow = 'hidden';
  }
  function closeMenu() {
    headerNav.classList.remove('is-open');
    drawerOverlay.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'メニューを開く');
    body.style.overflow = '';
  }
  menuToggle.addEventListener('click', function () {
    var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu();
    else openMenu();
  });
  drawerOverlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && headerNav.classList.contains('is-open')) closeMenu();
  });
  // Close on nav link click (mobile)
  headerNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 1024) closeMenu();
    });
  });
  // Reset on resize
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024 && headerNav.classList.contains('is-open')) closeMenu();
  });

  // ===== Floating CTA visibility =====
  var floatingCta = document.getElementById('floatingCta');
  var contactSection = document.getElementById('contact-form');
  function updateFloatingCta() {
    var scrolled = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var percent = docHeight > 0 ? (scrolled / docHeight) : 0;
    var contactRect = contactSection.getBoundingClientRect();
    var contactInView = contactRect.top < window.innerHeight && contactRect.bottom > 0;
    if (percent > 0.15 && !contactInView) {
      floatingCta.classList.add('is-visible');
    } else {
      floatingCta.classList.remove('is-visible');
    }
  }
  var floatTicking = false;
  window.addEventListener('scroll', function () {
    if (!floatTicking) {
      window.requestAnimationFrame(function () {
        updateFloatingCta();
        floatTicking = false;
      });
      floatTicking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateFloatingCta);
  updateFloatingCta();

  // ===== Scroll spy for nav active state =====
  var navLinks = document.querySelectorAll('.header-nav-list a[href^="#"]');
  var sectionMap = {};
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').substring(1);
    var sec = document.getElementById(id);
    if (sec) sectionMap[id] = { link: link, section: sec };
  });
  function updateScrollSpy() {
    var offset = 120;
    var current = null;
    Object.keys(sectionMap).forEach(function (id) {
      var rect = sectionMap[id].section.getBoundingClientRect();
      if (rect.top - offset <= 0) current = id;
    });
    navLinks.forEach(function (l) { l.classList.remove('is-active'); });
    if (current && sectionMap[current]) {
      sectionMap[current].link.classList.add('is-active');
    }
  }
  var spyTicking = false;
  window.addEventListener('scroll', function () {
    if (!spyTicking) {
      window.requestAnimationFrame(function () {
        updateScrollSpy();
        spyTicking = false;
      });
      spyTicking = true;
    }
  }, { passive: true });
  updateScrollSpy();

  // ===== Reveal on scroll =====
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-gentle');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // ===== Parallax decoration =====
  var parallaxDecos = document.querySelectorAll('.parallax-deco');
  if (!reduceMotion && parallaxDecos.length) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      parallaxDecos.forEach(function (el) {
        var speed = parseFloat(el.dataset.speed) || 0.02;
        el.style.transform = 'translateY(' + (y * speed) + 'px)';
      });
    }, { passive: true });
  }

  // ===== Counter animation for stats =====
  var counterEls = document.querySelectorAll('.stat-number .num');
  if (counterEls.length && !reduceMotion && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.dataset.count, 10);
          var duration = 1600;
          var start = performance.now();
          function tick(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counterEls.forEach(function (el) {
      el.textContent = el.dataset.count;
    });
  }

  // ===== Primary button ripple hint =====
  document.querySelectorAll('.btn-primary').forEach(function (btn) {
    btn.addEventListener('pointermove', function (e) {
      var rect = btn.getBoundingClientRect();
      btn.style.setProperty('--x', ((e.clientX - rect.left) / rect.width * 100) + '%');
      btn.style.setProperty('--y', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });

  // ===== Form basic handling (prevent navigation, show loading state) =====
  var form = document.getElementById('applyForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('.btn-submit');
      if (!form.checkValidity()) {
        // find first invalid field and focus
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      submitBtn.disabled = true;
      submitBtn.innerHTML = '送信しています…';
      // Placeholder: actual submission goes here
      setTimeout(function () {
        submitBtn.innerHTML = 'ありがとうございました';
      }, 800);
    });
  }

  // ===== Privacy Policy Dialog =====
  var privacyDialog = document.getElementById('privacyDialog');
  if (privacyDialog) {
    var openBtns = document.querySelectorAll('[data-privacy-open]');
    var closeBtns = privacyDialog.querySelectorAll('[data-privacy-close]');

    function openPrivacy() {
      if (typeof privacyDialog.showModal === 'function') {
        privacyDialog.showModal();
      } else {
        privacyDialog.setAttribute('open', '');
      }
      document.body.classList.add('privacy-dialog-open');
    }
    function closePrivacy() {
      if (typeof privacyDialog.close === 'function') {
        privacyDialog.close();
      } else {
        privacyDialog.removeAttribute('open');
      }
      document.body.classList.remove('privacy-dialog-open');
    }

    openBtns.forEach(function (b) { b.addEventListener('click', openPrivacy); });
    closeBtns.forEach(function (b) { b.addEventListener('click', closePrivacy); });

    // 背景クリックで閉じる
    privacyDialog.addEventListener('click', function (e) {
      if (e.target === privacyDialog) closePrivacy();
    });
    // ESC キーや submit 等で close した際の body クラス解除
    privacyDialog.addEventListener('close', function () {
      document.body.classList.remove('privacy-dialog-open');
    });
  }
})();
