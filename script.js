/* =========================================================
   REVKØ — Interactions (v5 — polished)
   ========================================================= */
(function () {
    'use strict';

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Préchargeur ---------- */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        let visited = false;
        try { visited = sessionStorage.getItem('revko-visited') === '1'; } catch (err) { /* stockage indisponible */ }

        const hidePreloader = () => {
            preloader.classList.add('is-hidden');
            try { sessionStorage.setItem('revko-visited', '1'); } catch (err) { /* stockage indisponible */ }
        };

        if (visited) {
            hidePreloader();
        } else {
            window.addEventListener('load', () => setTimeout(hidePreloader, 650));
            setTimeout(hidePreloader, 2200);
        }
    }

    /* ---------- Progression + navbar + retour en haut ---------- */
    const progress = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');
    const btt = document.getElementById('backToTop');
    let ticking = false;

    const onScroll = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
        if (navbar) navbar.classList.toggle('is-scrolled', window.scrollY > 40);
        if (btt) btt.classList.toggle('is-visible', window.scrollY > 600);
    };
    const requestScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            onScroll();
            ticking = false;
        });
    };
    window.addEventListener('scroll', requestScroll, { passive: true });
    onScroll();

    /* ---------- Menu mobile ---------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        const scrim = document.createElement('div');
        scrim.className = 'nav-scrim';
        document.body.appendChild(scrim);

        const closeMenu = () => {
            const hadFocus = navLinks.contains(document.activeElement);
            navLinks.classList.remove('is-open');
            navToggle.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Ouvrir le menu');
            document.body.classList.remove('menu-open');
            scrim.classList.remove('is-open');
            if (hadFocus) navToggle.focus({ preventScroll: true });
        };
        const openMenu = () => {
            navLinks.classList.add('is-open');
            navToggle.classList.add('is-open');
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Fermer le menu');
            document.body.classList.add('menu-open');
            scrim.classList.add('is-open');
            const first = navLinks.querySelector('a');
            if (first) first.focus({ preventScroll: true });
        };

        navToggle.addEventListener('click', () => {
            if (navLinks.classList.contains('is-open')) closeMenu();
            else openMenu();
        });
        navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
        scrim.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('is-open')) closeMenu();
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinks.classList.contains('is-open')) closeMenu();
        });
    }

    /* ---------- Défilement doux vers les ancres ---------- */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        });
    });

    /* ---------- Titre du hero : lettres qui tombent sur le temps ---------- */
    const line = document.querySelector('.hero-title-line');
    if (line) {
        const text = line.textContent;
        line.textContent = '';
        let i = 0;
        for (const ch of text) {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch;
            span.style.animationDelay = (0.35 + i * 0.1) + 's';
            line.appendChild(span);
            i++;
        }
    }

    /* ---------- Apparition au scroll ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => io.observe(el));
    }

    /* ---------- Section active dans la navigation ---------- */
    const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const sectionEls = navAnchors
        .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
        .filter(Boolean);

    if (sectionEls.length && 'IntersectionObserver' in window) {
        const setCurrent = (id) => {
            navAnchors.forEach((a) => {
                const active = a.getAttribute('href') === '#' + id;
                a.classList.toggle('is-current', active);
                if (active) a.setAttribute('aria-current', 'location');
                else a.removeAttribute('aria-current');
            });
        };
        const sectionIO = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) setCurrent(visible.target.id);
        }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.15, 0.4] });
        sectionEls.forEach((el) => sectionIO.observe(el));
    }

    /* ---------- Halo qui suit le curseur sur les blocs ---------- */
    if (!reduce && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.feature, .track-card, .contact-card').forEach((card) => {
            card.addEventListener('pointermove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
                card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
            });
        });
    }

    /* ---------- Compteurs de statistiques ---------- */
    const stats = document.querySelector('.about-stats');
    if (stats && !reduce && 'IntersectionObserver' in window) {
        const nums = Array.from(stats.querySelectorAll('strong[data-count]'));
        const run = () => {
            nums.forEach((el) => {
                const target = Number(el.dataset.count) || 0;
                const pad = Number(el.dataset.pad) || 0;
                const start = performance.now();
                const dur = 1200;
                const step = (now) => {
                    const p = Math.min((now - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    const val = Math.round(target * eased);
                    el.textContent = pad ? String(val).padStart(pad, '0') : String(val);
                    if (p < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            });
            // Filet de sécurité si les animations sont ralenties par le navigateur.
            setTimeout(() => {
                nums.forEach((el) => {
                    const target = Number(el.dataset.count) || 0;
                    const pad = Number(el.dataset.pad) || 0;
                    el.textContent = pad ? String(target).padStart(pad, '0') : String(target);
                });
            }, 1500);
        };
        const statsIO = new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) { run(); statsIO.disconnect(); }
        }, { threshold: 0.35 });
        statsIO.observe(stats);
    }

    /* ---------- Boutons magnétiques ---------- */
    if (!reduce && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.btn').forEach((btn) => {
            btn.addEventListener('pointermove', (e) => {
                const rect = btn.getBoundingClientRect();
                const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
                const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
                btn.style.setProperty('--tx', (dx * 7).toFixed(2) + 'px');
                btn.style.setProperty('--ty', (dy * 5).toFixed(2) + 'px');
            });
            btn.addEventListener('pointerleave', () => {
                btn.style.setProperty('--tx', '0px');
                btn.style.setProperty('--ty', '0px');
            });
        });
    }

    /* ---------- Horloge de Paris ---------- */
    const timeEl = document.getElementById('footerTime');
    if (timeEl) {
        let formatter;
        try {
            formatter = new Intl.DateTimeFormat('fr-FR', {
                timeZone: 'Europe/Paris',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        } catch (err) {
            formatter = new Intl.DateTimeFormat('fr-FR', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }
        const tick = () => { timeEl.textContent = 'Paris — ' + formatter.format(new Date()); };
        tick();
        setInterval(tick, 1000);
    }

    /* ---------- Kick : forme d'onde + pulsation du titre ---------- */
    const hero = document.getElementById('hero');
    const canvas = document.getElementById('scope');
    const BPM = 160;
    const BEAT = 60 / BPM;          // durée d'un temps en secondes
    const WINDOW_BEATS = 6;         // temps visibles à l'écran

    // Un kick saturé : sinus qui chute en fréquence, amplitude qui retombe, puis écrêté.
    const kick = (u) => {
        const phase = 2 * Math.PI * (2 * u + (12 * (1 - Math.exp(-6 * u))) / 6);
        const amp = Math.exp(-u * 3.2);
        return Math.tanh(3.4 * amp * Math.sin(phase));
    };

    if (hero && canvas) {
        const ctx = canvas.getContext('2d');
        let w = 0, h = 0, dpr = 1;
        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = (t, env) => {
            ctx.clearRect(0, 0, w, h);
            const mid = h / 2;
            const amp = h * 0.42;
            const beatPx = w / WINDOW_BEATS;
            const shift = ((t % BEAT) / BEAT) * beatPx;   // défilement vers la gauche

            // Repères de temps très discrets
            ctx.beginPath();
            for (let x = -shift; x < w + beatPx; x += beatPx) {
                const gx = Math.round(x) + 0.5;
                ctx.moveTo(gx, mid - h * 0.18);
                ctx.lineTo(gx, mid + h * 0.18);
            }
            ctx.strokeStyle = 'rgba(241, 241, 238, 0.055)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Forme d'onde du kick
            ctx.beginPath();
            for (let x = 0; x <= w; x += 1) {
                const px = x + shift;
                const u = (((px / beatPx) % 1) + 1) % 1;
                const y = mid - kick(u) * amp;
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.lineJoin = 'round';
            ctx.lineWidth = 1.6;
            ctx.strokeStyle = `rgba(241, 241, 238, ${0.55 + env * 0.4})`;
            ctx.shadowColor = 'rgba(255, 45, 26, 0.8)';
            ctx.shadowBlur = 6 + env * 18;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // ligne de repos
            ctx.beginPath();
            ctx.moveTo(0, mid);
            ctx.lineTo(w, mid);
            ctx.strokeStyle = 'rgba(241, 241, 238, 0.08)';
            ctx.lineWidth = 1;
            ctx.stroke();
        };

        if (reduce) {
            hero.style.setProperty('--beat', '0');
            draw(0, 0);
        } else {
            let visible = true;
            if ('IntersectionObserver' in window) {
                new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(hero);
            }
            const loop = (now) => {
                if (visible) {
                    const t = now / 1000;
                    const phase = (t % BEAT) / BEAT;
                    const env = Math.exp(-phase * 5);
                    hero.style.setProperty('--beat', env.toFixed(3));
                    draw(t, env);
                }
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        }
    }

    /* ---------- Copier l'adresse e-mail ---------- */
    const copyBtn = document.getElementById('copyEmailBtn');
    if (copyBtn) {
        const label = copyBtn.querySelector('span');
        const original = label ? label.textContent : '';
        let resetTimer;

        const fallbackCopy = (text) => {
            const area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
            document.body.removeChild(area);
            return ok;
        };

        copyBtn.setAttribute('aria-live', 'polite');
        copyBtn.addEventListener('click', async () => {
            let ok = false;
            try {
                await navigator.clipboard.writeText(copyBtn.dataset.email);
                ok = true;
            } catch (err) {
                ok = fallbackCopy(copyBtn.dataset.email);
            }
            if (label) label.textContent = ok ? 'Adresse copiée ✓' : 'Copie impossible';
            copyBtn.classList.toggle('is-copied', ok);
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                if (label) label.textContent = original;
                copyBtn.classList.remove('is-copied');
            }, 2200);
        });
    }

    /* ---------- Transition entre pages ---------- */
    window.addEventListener('pageshow', () => document.body.classList.remove('is-leaving'));

    /* ---------- Pluie (canvas) ---------- */
    const rainCanvas = document.getElementById('rain');
    if (rainCanvas) {
        const ctx = rainCanvas.getContext('2d');
        let drops = [];
        const resize = () => { rainCanvas.width = window.innerWidth; rainCanvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);
        const initDrops = () => {
            drops = [];
            const count = Math.floor(window.innerWidth / 6);
            for (let i = 0; i < count; i++) {
                drops.push({
                    x: Math.random() * rainCanvas.width,
                    y: Math.random() * rainCanvas.height,
                    l: Math.random() * 18 + 8,
                    s: Math.random() * 4 + 4,
                    o: Math.random() * 0.35 + 0.1
                });
            }
        };
        initDrops();
        window.addEventListener('resize', initDrops);
        const drawRain = () => {
            ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
            ctx.strokeStyle = 'rgba(200, 210, 230, 0.35)';
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';
            for (const d of drops) {
                ctx.globalAlpha = d.o;
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - 0.3, d.y + d.l);
                ctx.stroke();
                d.y += d.s;
                if (d.y > rainCanvas.height) {
                    d.y = -d.l;
                    d.x = Math.random() * rainCanvas.width;
                }
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(drawRain);
        };
        drawRain();
    }

    /* ---------- Spotlight global qui suit la souris ---------- */
    const spotlight = document.getElementById('spotlight');
    if (spotlight) {
        let spTicking = false;
        const onMove = (e) => {
            if (spTicking) return;
            spTicking = true;
            requestAnimationFrame(() => {
                spotlight.style.setProperty('--mx', e.clientX + 'px');
                spotlight.style.setProperty('--my', e.clientY + 'px');
                spotlight.style.opacity = '1';
                spTicking = false;
            });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerleave', () => { spotlight.style.opacity = '0'; });
    }
    document.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || /^(https?:|mailto:|tel:)/.test(href) || a.target === '_blank') return;
        // même page + ancre : laisser le navigateur faire
        if (href.startsWith('index.html#') && /(^|\/)(index\.html)?$/.test(location.pathname)) return;
        a.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            document.body.classList.add('is-leaving');
            setTimeout(() => { window.location.href = href; }, 240);
        });
    });
})();
