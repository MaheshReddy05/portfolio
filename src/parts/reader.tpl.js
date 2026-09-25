  /* Draft notes, newest first. Shared by the Thoughts grid and the reader.
     Each thumbnail is a tint, a pattern and three stroked paths on a 120 by 120 grid. */
  readerNotes() {
    return /*NOTES*/;
  }

  /* Note reader: one overlay for every element carrying data-note="index".
     It fills existing nodes (text, attributes); nothing is created or removed.
     Keys are handled on the overlay itself, never globally. */
  initReader(root, reduced) {
    const box = root.querySelector('[data-reader]');
    if (!box) return;
    const notes = this.readerNotes();
    const q = (k) => box.querySelector('[data-r-' + k + ']');
    const panel = q('panel');
    const closeBtn = q('close');
    const art = q('art');
    let cur = 0, trigger = null, flip = false, closeTimer;

    const paint = (el, n) => {
      el.classList.remove('pat-dots', 'pat-grid', 'pat-lines');
      el.classList.add(n.pat);
      el.style.backgroundColor = n.bg;
      el.style.color = n.ink;
      const paths = el.querySelectorAll('path');
      [n.d1, n.d2, n.d3].forEach((d, i) => { if (paths[i]) paths[i].setAttribute('d', d); });
    };
    const minutes = (n) => Math.max(1, Math.round((n.body.join(' ') + ' ' + n.quote).split(/\s+/).length / 220)) + ' min read';

    const fill = (i, dir) => {
      const N = notes.length, n = notes[i], prev = notes[(i - 1 + N) % N], next = notes[(i + 1) % N];
      cur = i;
      q('tag').textContent = n.tag;
      q('meta').textContent = n.date + ', ' + minutes(n);
      q('pos').textContent = (i + 1) + ' / ' + N;
      q('title').textContent = n.title;
      [1, 2, 3].forEach((k) => { const p = q('p' + k); p.textContent = n.body[k - 1] || ''; p.hidden = !n.body[k - 1]; });
      q('quote').textContent = n.quote;
      paint(q('thumb'), n);
      paint(q('prev-thumb'), prev);
      q('prev-title').textContent = prev.title;
      paint(q('next-thumb'), next);
      q('next-title').textContent = next.title;
      if (dir && !reduced) {
        art.classList.remove('rdr-in-na', 'rdr-in-nb', 'rdr-in-pa', 'rdr-in-pb');
        flip = !flip;
        art.classList.add('rdr-in-' + (dir > 0 ? 'n' : 'p') + (flip ? 'a' : 'b'));
      }
      panel.scrollTop = 0;
    };

    const lock = (on) => {
      if (this.lenis) { if (on) this.lenis.stop(); else this.lenis.start(); }
      else document.documentElement.style.overflow = on ? 'hidden' : '';
    };
    const open = (i, from) => {
      trigger = from || null;
      fill(i, 0);
      clearTimeout(closeTimer);
      box.classList.remove('closing');
      box.hidden = false;
      lock(true);
      try { closeBtn.focus({ preventScroll: true }); } catch (err) { closeBtn.focus(); }
    };
    const close = () => {
      if (box.hidden) return;
      const done = () => {
        box.hidden = true;
        box.classList.remove('closing');
        lock(false);
        if (trigger && trigger.focus) { try { trigger.focus({ preventScroll: true }); } catch (err) {} }
      };
      if (reduced) { done(); return; }
      box.classList.add('closing');
      clearTimeout(closeTimer);
      closeTimer = setTimeout(done, 230);
    };
    const step = (d) => fill((cur + d + notes.length) % notes.length, d);

    const onRootClick = (e) => {
      const card = e.target && e.target.closest ? e.target.closest('[data-note]') : null;
      if (!card || box.contains(card)) return;
      const i = Number(card.getAttribute('data-note'));
      if (!(i >= 0 && i < notes.length)) return;
      e.preventDefault();
      const focusable = card.matches('button, a[href]') ? card : card.querySelector('button, a[href]');
      open(i, focusable || card);
    };
    const onBoxClick = (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('[data-r-close]') || t.hasAttribute('data-r-scrim')) close();
      else if (t.closest('[data-r-prev]')) step(-1);
      else if (t.closest('[data-r-next]')) step(1);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'Tab') {
        const f = panel.querySelectorAll('button, a[href]');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    root.addEventListener('click', onRootClick);
    box.addEventListener('click', onBoxClick);
    box.addEventListener('keydown', onKey);
    this.cleanups.push(() => {
      root.removeEventListener('click', onRootClick);
      box.removeEventListener('click', onBoxClick);
      box.removeEventListener('keydown', onKey);
      clearTimeout(closeTimer);
    });
  }

