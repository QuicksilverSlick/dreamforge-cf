document.addEventListener('DOMContentLoaded', function () {
    const root = document.documentElement;

    // Theme toggle
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('df-theme', next); } catch (e) { /* ignore */ }
        });
    }

    // Nav shadow on scroll
    const nav = document.querySelector('.nav');
    const onScroll = () => nav.classList.toggle('scrolled', (window.pageYOffset || 0) > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Forward first-touch UTM params from this landing URL to the app, so paid /
    // campaign attribution survives the domain hop (the app then also captures
    // document.referrer and writes the df_acq cookie read at signup).
    const landingParams = new URLSearchParams(window.location.search);
    const utmQuery = (() => {
        const u = new URLSearchParams();
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => {
            const v = landingParams.get(k);
            if (v) u.set(k, v);
        });
        return u.toString();
    })();
    const withUtm = (url) => (utmQuery ? url + (url.includes('?') ? '&' : '?') + utmQuery : url);
    if (utmQuery) {
        document.querySelectorAll('a[href*="app.getdreamforge.com"]').forEach((a) => {
            try { a.href = withUtm(a.href); } catch (e) { /* ignore */ }
        });
    }

    // Hero prompt: deep-link into the app with the typed idea
    const promptForm = document.getElementById('promptForm');
    const promptInput = document.getElementById('promptInput');
    const APP_URL = 'https://app.getdreamforge.com/';
    if (promptForm && promptInput) {
        const go = () => {
            const v = promptInput.value.trim();
            const base = v ? APP_URL + '?prompt=' + encodeURIComponent(v) : APP_URL;
            window.location.href = withUtm(base);
        };
        promptForm.addEventListener('submit', (e) => { e.preventDefault(); go(); });
        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go(); }
        });
    }

    // Typewriter placeholder (pauses while the user is engaged)
    if (promptInput) {
        const examples = [
            'A client portal where clients log in, upload documents, and pay me…',
            'A booking app for my salon with reminders and payments…',
            'An inventory tracker for my store with low-stock alerts…',
            'A members area with sign-up, a dashboard, and Stripe billing…',
            'A directory site where people submit listings and search them…'
        ];
        let ei = 0, ci = 0, deleting = false, paused = false;
        const base = examples[0];
        promptInput.setAttribute('placeholder', '');
        const tick = () => {
            if (paused || promptInput.value || document.activeElement === promptInput) {
                promptInput.setAttribute('placeholder', promptInput.value ? '' : base);
                return setTimeout(tick, 600);
            }
            const word = examples[ei];
            ci += deleting ? -1 : 1;
            promptInput.setAttribute('placeholder', word.slice(0, ci));
            let delay = deleting ? 22 : 42;
            if (!deleting && ci === word.length) { delay = 2200; deleting = true; }
            else if (deleting && ci === 0) { deleting = false; ei = (ei + 1) % examples.length; delay = 350; }
            setTimeout(tick, delay);
        };
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) { promptInput.setAttribute('placeholder', base); }
        else { setTimeout(tick, 700); }
        promptInput.addEventListener('focus', () => { paused = true; promptInput.setAttribute('placeholder', base); });
        promptInput.addEventListener('blur', () => { if (!promptInput.value) { paused = false; ci = 0; deleting = false; } });
    }

    // Pricing monthly/annual toggle
    const pricingToggle = document.querySelectorAll('.toggle-btn');
    const priceAmounts = document.querySelectorAll('.price-amount');
    pricingToggle.forEach(btn => {
        btn.addEventListener('click', function () {
            pricingToggle.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const period = this.dataset.period;
            priceAmounts.forEach(a => {
                const { monthly, annual } = a.dataset;
                if (monthly && annual) a.textContent = period === 'monthly' ? monthly : annual;
            });
        });
    });

    // Lead form placeholder
    const leadForm = document.querySelector('.lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const privacy = this.parentElement.querySelector('.lead-privacy');
            if (privacy) privacy.textContent = "Thanks — we'll be in touch. (Form not yet connected.)";
            this.reset();
        });
    }

    // PRODUCE application form (apply.html) → POST /api/produce/apply on the app API
    const applyForm = document.getElementById('produceApplyForm');
    if (applyForm) {
        const tierSelect = document.getElementById('applyTier');
        const preselect = landingParams.get('tier');
        if (preselect && tierSelect && Array.from(tierSelect.options).some((o) => o.value === preselect)) {
            tierSelect.value = preselect;
        }
        const API_ORIGIN = /(^|\.)getdreamforge\.com$/.test(window.location.hostname)
            ? 'https://app.getdreamforge.com'
            : window.location.origin;
        const errorEl = document.getElementById('applyError');
        const submitBtn = document.getElementById('applySubmit');
        applyForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            errorEl.hidden = true;
            if (!applyForm.reportValidity()) return;
            const source = ['apply', landingParams.get('utm_source'), landingParams.get('utm_campaign')]
                .filter(Boolean).join(':');
            const payload = {
                name: document.getElementById('applyName').value.trim(),
                email: document.getElementById('applyEmail').value.trim(),
                company: document.getElementById('applyCompany').value.trim() || undefined,
                tier: tierSelect.value,
                projectDescription: document.getElementById('applyProject').value.trim(),
                source: source,
                website: document.getElementById('applyWebsite').value
            };
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
            try {
                const res = await fetch(API_ORIGIN + '/api/produce/apply', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                let data = null;
                try { data = await res.json(); } catch (parseErr) { /* non-JSON error body */ }
                if (!res.ok) {
                    throw new Error((data && data.error && data.error.message) || 'Something went wrong. Please try again.');
                }
                document.getElementById('applySuccessEmail').textContent = payload.email;
                applyForm.hidden = true;
                document.getElementById('applySuccess').hidden = false;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (err) {
                errorEl.textContent = (err && err.message) ||
                    'Something went wrong. Please try again — or email produce@getdreamforge.com.';
                errorEl.hidden = false;
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send my application';
            }
        });
    }

    // Demo video: swap the animated mock for the real video once it loads (no-op until the file exists).
    const demoVideo = document.querySelector('.showcase-video');
    if (demoVideo) {
        demoVideo.addEventListener('loadeddata', () => {
            demoVideo.classList.add('is-ready');
            const showcase = demoVideo.closest('.showcase');
            if (showcase) showcase.classList.add('has-video');
            demoVideo.play().catch(() => { /* autoplay blocked; poster shows */ });
        });
        try { demoVideo.load(); } catch (e) { /* sources may 404 until provided */ }
    }

    // Smooth anchor scroll with nav offset
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight - 12;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // Scroll reveal with stagger
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries, o) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
                    el.style.transitionDelay = (sibs.indexOf(el) * 60) + 'ms';
                    el.classList.add('in');
                    o.unobserve(el);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
        revealEls.forEach(el => obs.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in'));
    }
});
