  /* Back-to-top button: shown from the third section onward (or the footer
     on pages with fewer sections), watched with an observer, not scroll events. */
  initToTop(root, reduced) {
    const btn = root.querySelector('[data-totop]');
    if (!btn || typeof IntersectionObserver === 'undefined') return;
    const sections = root.querySelectorAll(':scope > section');
    const mark = sections[2] || root.querySelector('[data-foot]');
    if (!mark) return;
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      btn.classList.toggle('show', e.isIntersecting || e.boundingClientRect.top < 0);
    });
    io.observe(mark);
    const onClick = () => {
      if (this.lenis) this.lenis.scrollTo(0, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    };
    btn.addEventListener('click', onClick);
    this.cleanups.push(() => { io.disconnect(); btn.removeEventListener('click', onClick); });
  }

