/**
 * BRASÍLIA AGORA — Portal de Notícias
 * JavaScript modular — interações e utilitários
 */

(function () {
  'use strict';

  /* ============================================
     Módulo: Data e hora (Top Bar)
     ============================================ */
  const DateTimeModule = {
    diasSemana: [
      'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
      'quinta-feira', 'sexta-feira', 'sábado'
    ],
    meses: [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ],

    formatar(data) {
      const dia = data.getDate();
      const mes = this.meses[data.getMonth()];
      const ano = data.getFullYear();
      const semana = this.diasSemana[data.getDay()];
      return `${dia} de ${mes} de ${ano}, ${semana}`;
    },

    init() {
      const el = document.querySelector('#current-date .top-bar__text');
      if (!el) return;
      el.textContent = this.formatar(new Date());
    }
  };

  /* ============================================
     Módulo: Menu sticky e sombra
     ============================================ */
  const StickyNavModule = {
    nav: null,
    threshold: 120,

    init() {
      this.nav = document.getElementById('main-nav');
      if (!this.nav) return;

      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      this.onScroll();
    },

    onScroll() {
      const stuck = window.scrollY > this.threshold;
      this.nav.classList.toggle('is-stuck', stuck);
    }
  };

  /* ============================================
     Módulo: Menu mobile (hambúrguer)
     ============================================ */
  const MobileMenuModule = {
    toggle: null,
    nav: null,
    overlay: null,
    isOpen: false,

    init() {
      this.toggle = document.getElementById('menu-toggle');
      this.nav = document.getElementById('main-nav');
      if (!this.toggle || !this.nav) return;

      this.createOverlay();
      this.toggle.addEventListener('click', () => this.toggleMenu());
      this.overlay.addEventListener('click', () => this.close());
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && this.isOpen) this.close();
      });
    },

    createOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'nav-overlay';
      this.overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.overlay);
    },

    toggleMenu() {
      this.isOpen ? this.close() : this.open();
    },

    open() {
      this.isOpen = true;
      this.nav.classList.add('is-open');
      this.toggle.classList.add('is-active');
      this.toggle.setAttribute('aria-expanded', 'true');
      this.overlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.isOpen = false;
      this.nav.classList.remove('is-open');
      this.toggle.classList.remove('is-active');
      this.toggle.setAttribute('aria-expanded', 'false');
      this.overlay.classList.remove('is-visible');
      document.body.style.overflow = '';
    }
  };

  /* ============================================
     Módulo: Busca
     ============================================ */
  const SearchModule = {
    init() {
      const form = document.querySelector('.search-form');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('.search-form__input');
        const termo = input?.value.trim();
        if (termo) {
          console.info('[Brasília Agora] Busca:', termo);
          /* Integrar com backend/CMS quando disponível */
        }
      });
    }
  };

  /* ============================================
     Módulo: Links de navegação ativos
     ============================================ */
  const NavActiveModule = {
    init() {
      const links = document.querySelectorAll('.main-nav__link');
      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          if (link.getAttribute('href') === '#') {
            e.preventDefault();
          }
          links.forEach((l) => l.classList.remove('main-nav__link--active'));
          link.classList.add('main-nav__link--active');

          if (window.innerWidth <= 768) {
            MobileMenuModule.close();
          }
        });
      });
    }
  };

  /* ============================================
     Módulo: Lazy reveal no scroll (leve)
     ============================================ */
  const ScrollRevealModule = {
    init() {
      if (!('IntersectionObserver' in window)) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );

      document.querySelectorAll('.cta-whatsapp__inner, .site-footer').forEach((el) => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.6s ease';
        observer.observe(el);
      });
    }
  };

  /* ============================================
     Inicialização
     ============================================ */
  function init() {
    DateTimeModule.init();
    StickyNavModule.init();
    MobileMenuModule.init();
    SearchModule.init();
    NavActiveModule.init();
    ScrollRevealModule.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
