  /* Draft notes, newest first. Shared by the Thoughts grid and the reader.
     Each thumbnail is a tint, a pattern and three stroked paths on a 120 by 120 grid. */
  readerNotes() {
    return [
      { title: 'The future of interfaces: will they vanish?', date: 'February 12, 2025', tag: 'Interfaces',
        bg: 'var(--p-lav)', ink: 'var(--primary)', pat: 'pat-grid',
        d1: 'M24 24h72a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8V32a8 8 0 0 1 8-8z',
        d2: 'M34 58v6M48 46v30M62 38v46M76 48v26M90 56v10',
        d3: 'M14 102h20M42 102h16M66 102h10M84 102h6M98 102h2',
        excerpt: 'Voice, headsets and brain-computer interfaces are all pulling at the screen. Does it hold?',
        body: [
          'Imagine a world where we do not tap, swipe or type, because technology understands us instantly. Does that excite you, or make you uneasy?',
          'For years we have interacted with technology through screens, buttons and touch. With AI pushing the boundaries, that might be changing. Think about how we use Google Assistant, Gemini, Alexa or Siri. Instead of navigating menus, we ask a question and the task is done. No scrolling, no searching. Could it mean traditional interfaces disappear?',
          'AR and VR are already redefining how we interact with technology. Devices like the Apple Vision Pro and Meta Quest create immersive, screenless experiences, blending digital content with our surroundings.',
          'AI-powered assistants like the Humane AI Pin and Rabbit R1 go further. They are designed to provide information and complete tasks with no touch at all, responding instead to your voice, your gestures and what is around you.',
          'Then there are brain-computer interfaces. Companies like Neuralink are working on technology that lets you control devices just by thinking. Writing an email or setting a reminder without lifting a finger, or even speaking a word. It sounds like science fiction, but the early results are promising.',
          'So will screens truly disappear? These innovations are exciting, and they come with real challenges: privacy, accessibility, and the need for people to stay in control. Right now it looks more likely that traditional screens and new AI-powered interfaces will coexist for a while.',
          'What do you think? Will technology become so smart that visible interfaces fade into the background, or will we always need something tangible to interact with?'
        ],
        quote: 'Traditional screens and AI-powered interfaces will coexist for a while.' },
      { title: 'The death of the homepage? Or an evolution?', date: 'February 10, 2025', tag: 'Web',
        bg: 'var(--p-sage)', ink: 'var(--petrol)', pat: 'pat-dots',
        d1: 'M14 26h92a6 6 0 0 1 6 6v54a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V32a6 6 0 0 1 6-6z',
        d2: 'M8 46h104M24 36h6M38 36h6',
        d3: 'M26 76c16-18 44 10 62-8M82 62l8 6-6 8',
        excerpt: 'Netflix barely has one. Google barely has one. So what is left for everyone else?',
        body: [
          'For years the homepage has been the front door of digital experiences, the space where brands introduce themselves and guide people. Today, with AI-driven personalization and direct search behavior, its role is changing.',
          'Think about it. Netflix does not have a traditional homepage, it curates content for you the moment you arrive. Google keeps its search page minimal because most people go straight into a query. Amazon leads with recommendations and deals drawn from what you have browsed and bought.',
          'More and more, apps and websites are shifting from static homepages to dynamic, AI-driven experiences.',
          'Search and assistants are becoming the new homepage. Platforms like ChatGPT and Google Search Generative Experience show that people increasingly start with a query, not a landing page. They arrive directly on product pages, sign-up flows and blog posts through search and social links, and chatbots drop them straight into an experience, skipping the homepage entirely. Feeds like Netflix and Amazon serve personalized content immediately.',
          'But what about SaaS, informational websites, or brands nobody has heard of yet? There the homepage still plays a critical role, and its function is evolving. Instead of building a static overview, we should be making homepages that act as targeted landing pages, focused on a single action such as signing up or booking a demo, rather than trying to cover everything at once.',
          'That means guiding first-time visitors clearly, through interactive demos, explainer videos or AI-driven onboarding. It means showing instead of telling, letting people engage with a micro-experience or preview the thing working. And it means reducing cognitive load: one key benefit that sparks curiosity, not a wall of features.',
          'So is the homepage really dead? Not entirely, but it is definitely changing. Instead of being the centerpiece of a website, the homepage is now one of many entry points, and the best ones adapt to what people need, how they behave, and what the data says.',
          'What do you think? Should businesses still prioritize homepages, or should we rethink how people enter digital experiences altogether?'
        ],
        quote: 'Homepages are now just one of many entry points.' }
    ];
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
      /* however many paragraphs the note actually has */
      const bodyBox = q('body');
      bodyBox.textContent = '';
      n.body.forEach((text, k) => {
        const p = document.createElement('p');
        p.className = k ? 'para' : 'para lead';
        p.textContent = text;
        bodyBox.appendChild(p);
      });
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
      box.classList.add('open');
      lock(true);
      try { closeBtn.focus({ preventScroll: true }); } catch (err) { closeBtn.focus(); }
    };
    const close = () => {
      if (!box.classList.contains('open')) return;
      const done = () => {
        box.classList.remove('open');
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

