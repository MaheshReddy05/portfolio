  /* Shared footer: copy-email button and the Kill the Bug game.
     The bug wanders; when the pointer gets close it bolts, often to hide
     behind something marked data-hide. Each escape costs stamina, so after
     a few it tires and can be caught. Runs only while the footer is on screen. */
  initFooter(root, reduced) {
    const foot = root.querySelector('[data-foot]');
    if (!foot) return;

    const copyBtn = foot.querySelector('[data-copy]');
    const copyLabel = foot.querySelector('[data-copy-label]');
    let copyTimer;
    const setCopy = (text, ok) => {
      copyLabel.textContent = text;
      copyBtn.classList.toggle('ok', !!ok);
      clearTimeout(copyTimer);
      if (text !== 'Copy email') copyTimer = setTimeout(() => setCopy('Copy email', false), 2000);
    };
    const onCopy = () => {
      const email = copyBtn.getAttribute('data-copy');
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(() => setCopy('Copied', true), () => setCopy('Copy blocked here', false));
          return;
        }
      } catch (err) {}
      setCopy('Copy blocked here', false);
    };
    if (copyBtn && copyLabel) copyBtn.addEventListener('click', onCopy);

    const bug = foot.querySelector('[data-bug]');
    const toast = foot.querySelector('[data-bug-toast]');
    const score = foot.querySelector('[data-bug-score]');
    if (!bug || !toast) return;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const turnTo = (a, want, max) => {
      let d = want - a;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return a + clamp(d, -max, max);
    };
    let W = foot.clientWidth, H = foot.clientHeight;
    let x = W * 0.18, y = H - 70, ang = -0.4, target = null, hideUntil = 0, stamina = 3;
    let caught = false, fixes = 0, last = 0, raf = 0, visible = false;
    let mx = -9999, my = -9999;
    const timers = [];

    const spots = () => {
      const fr = foot.getBoundingClientRect();
      return Array.prototype.map.call(foot.querySelectorAll('[data-hide]'), (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - fr.left + r.width / 2, y: r.top - fr.top + r.height / 2 };
      });
    };
    const place = () => {
      bug.style.transform = 'translate(' + (x - 20).toFixed(1) + 'px,' + (y - 20).toFixed(1) + 'px) rotate(' + (ang + Math.PI / 2).toFixed(3) + 'rad)';
    };

    const tick = (t) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
      last = t;
      if (!caught) {
        const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy) || 1;
        const tired = stamina < 1;
        const fleeR = tired ? 40 : 100;
        if (d < fleeR && t > hideUntil && (!target || !target.flee)) {
          stamina = Math.max(0, stamina - 1);
          const far = spots().filter((p) => Math.hypot(p.x - mx, p.y - my) > 170);
          if (far.length && Math.random() < 0.65) {
            const p = far[Math.floor(Math.random() * far.length)];
            target = { x: p.x, y: p.y, flee: true, hide: true };
          } else {
            target = { x: clamp(x + (dx / d) * 200, 24, W - 24), y: clamp(y + (dy / d) * 150, 24, H - 24), flee: true };
          }
        }

        let speed = 42;
        if (t < hideUntil) {
          speed = 0;
        } else {
          bug.classList.remove('still');
          if (target) {
            const tx = target.x - x, ty = target.y - y;
            ang = turnTo(ang, Math.atan2(ty, tx), 9 * dt);
            speed = target.flee ? (tired ? 52 : 108) : 30;
            if (Math.hypot(tx, ty) < 12) {
              if (target.hide) { hideUntil = t + 1200 + Math.random() * 900; bug.classList.add('still'); }
              target = null;
            }
          } else {
            ang += (Math.random() - 0.5) * 2.6 * dt;
            if (Math.random() < dt * 0.35) ang += (Math.random() - 0.5) * 2.4;
          }
        }

        x += Math.cos(ang) * speed * dt;
        y += Math.sin(ang) * speed * dt;
        if (x < 22 || x > W - 22) { ang = Math.PI - ang; x = clamp(x, 22, W - 22); target = target && target.hide ? target : null; }
        if (y < 22 || y > H - 22) { ang = -ang; y = clamp(y, 22, H - 22); target = target && target.hide ? target : null; }
        stamina = Math.min(3, stamina + dt * 0.1);
        place();
      }
      raf = window.requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && !reduced) { last = 0; raf = window.requestAnimationFrame(tick); } };
    const stop = () => { if (raf) { window.cancelAnimationFrame(raf); raf = 0; } };

    /* every new bug wears the next brand colour */
    const shells = ['var(--terra)', 'var(--primary)', 'var(--olive)', 'var(--petrol)', 'var(--rose)'];
    const shell = bug.querySelector('ellipse');
    const spawn = () => {
      W = foot.clientWidth; H = foot.clientHeight;
      if (shell) shell.style.fill = shells[fixes % shells.length];
      const fromLeft = Math.random() < 0.5;
      x = fromLeft ? 26 : W - 26; y = H - 60 - Math.random() * 120;
      ang = fromLeft ? -0.2 : Math.PI + 0.2;
      target = null; hideUntil = 0; stamina = 3; caught = false;
      bug.classList.remove('caught', 'away', 'still');
      if (reduced) bug.classList.add('still');
      place();
    };

    const onCatch = () => {
      if (caught) return;
      caught = true;
      fixes += 1;
      bug.classList.add('caught');
      toast.style.left = x + 'px';
      toast.style.top = Math.max(8, y - 54) + 'px';
      toast.classList.add('show');
      if (score) score.textContent = 'bugs fixed: ' + fixes + (fixes >= 3 ? '. ship it.' : '');
      timers.push(setTimeout(() => toast.classList.remove('show'), 1800));
      timers.push(setTimeout(() => bug.classList.add('away'), 900));
      timers.push(setTimeout(() => {
        spawn();
        if (score) score.textContent = 'bugs fixed: ' + fixes + '. oh no, another one.';
      }, 4200));
    };

    const onMove = (e) => {
      const fr = foot.getBoundingClientRect();
      mx = e.clientX - fr.left; my = e.clientY - fr.top;
    };
    const onLeave = () => { mx = -9999; my = -9999; };
    const onResize = () => { W = foot.clientWidth; H = foot.clientHeight; x = clamp(x, 22, W - 22); y = clamp(y, 22, H - 22); place(); };

    foot.addEventListener('pointermove', onMove);
    foot.addEventListener('pointerdown', onMove);
    foot.addEventListener('pointerleave', onLeave);
    bug.addEventListener('click', onCatch);
    window.addEventListener('resize', onResize);

    let io = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      });
      io.observe(foot);
    } else {
      start();
    }
    spawn();

    this.cleanups.push(() => {
      stop();
      if (io) io.disconnect();
      timers.forEach(clearTimeout);
      clearTimeout(copyTimer);
      if (copyBtn) copyBtn.removeEventListener('click', onCopy);
      foot.removeEventListener('pointermove', onMove);
      foot.removeEventListener('pointerdown', onMove);
      foot.removeEventListener('pointerleave', onLeave);
      bug.removeEventListener('click', onCatch);
      window.removeEventListener('resize', onResize);
    });
  }

