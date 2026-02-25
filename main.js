/* ═══════════════════════════════════════════════════════════
   RICHMOND HILL ELITE PLUMBING — main.js
   ═══════════════════════════════════════════════════════════ */

console.log('Richmond Hill Elite Plumbing — Site Ready.');

// ─── SCROLL TO QUOTE ──────────────────────────────────────
function scrollToQuote() {
    const el = document.getElementById('quote');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── DISPATCH BUTTON ──────────────────────────────────────
function dispatchAndGo() {
    const btn = document.getElementById('heroDispatchBtn');
    if (!btn || btn.classList.contains('loading')) return;

    const label  = btn.querySelector('.dispatch-label');
    const icon   = btn.querySelector('.dispatch-icon');
    const loader = btn.querySelector('#dispatchLoader');

    btn.classList.add('loading');
    btn.disabled = true;
    if (label)  label.textContent = 'DISPATCHING…';
    if (icon)   icon.style.display = 'none';
    if (loader) loader.style.display = 'flex';

    // In production, redirect to a dispatch page or call handler
    setTimeout(() => {
        window.location.href = 'tel:+16473256921';
    }, 820);
}

// ─── FLIP CARD ────────────────────────────────────────────
function flipCard(card) {
    card.classList.toggle('is-flipped');
}

// ─── DOM READY ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    /* ── 1. Footer year ────────────────────────────────── */
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ── 2. Header scroll shadow ───────────────────────── */
    const header = document.getElementById('site-header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 12);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ── 3. Mobile nav toggle ──────────────────────────── */
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
        // Close nav on link click
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ── 4. Active nav link ─────────────────────────────── */
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === page) a.classList.add('active-link');
    });

    /* ── 5. Scroll reveal ───────────────────────────────── */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const childObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    childObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );
    document.querySelectorAll('.reveal-child').forEach(el => childObserver.observe(el));

    /* ── 6. Hero parallax ───────────────────────────────── */
    const heroBg = document.getElementById('heroBg');
    if (heroBg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        let ticking = false;
        const applyParallax = () => {
            heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(applyParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ── 7. Mobile dispatch bar reveal ─────────────────── */
    const mobileBar = document.getElementById('mobileDispatchBar');
    if (mobileBar) {
        let barShown = false;
        const showBar = () => {
            if (window.scrollY > 300 && !barShown) {
                mobileBar.classList.add('is-visible');
                barShown = true;
            }
        };
        window.addEventListener('scroll', showBar, { passive: true });
        showBar();
    }

    /* ── 8. Keyboard support for flip cards ─────────────── */
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                flipCard(card);
            }
        });
    });

    /* ── 9. Form submission ─────────────────────────────── */
    document.querySelectorAll('.custom-contact-form').forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn    = form.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" class="spin" aria-hidden="true">
                    <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2.2"
                            stroke-linecap="round" stroke-dasharray="34" stroke-dashoffset="10"/>
                </svg>
                SENDING…`;
            submitBtn.style.opacity = '0.75';
            submitBtn.disabled = true;

            const data = new FormData(e.target);

            try {
                const res = await fetch(e.target.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    form.innerHTML = `
                        <div style="text-align:center;padding:56px 24px;">
                            <div style="
                                width:72px;height:72px;
                                background:rgba(74,222,128,0.1);
                                border:1px solid rgba(74,222,128,0.3);
                                border-radius:50%;
                                display:flex;align-items:center;justify-content:center;
                                margin:0 auto 24px;
                            ">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M5 16l9 9L27 8"
                                          stroke="#4ade80" stroke-width="3"
                                          stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <h3 style="
                                color:#f8f7f3;
                                font-family:'Cinzel',Georgia,serif;
                                font-size:clamp(26px,4vw,38px);
                                font-weight:700;
                                letter-spacing:1.5px;
                                text-transform:uppercase;
                                margin:0 0 14px;
                            ">REQUEST RECEIVED</h3>
                            <p style="
                                color:rgba(248,247,243,0.65);
                                font-family:'DM Sans',system-ui,sans-serif;
                                font-size:1rem;line-height:1.7;
                                max-width:420px;margin:0 auto 28px;
                            ">Your details are with our dispatch team. Expect a call back within <strong style="color:#c8a84b;">15 minutes</strong>.</p>
                            <div style="
                                display:inline-flex;align-items:center;gap:9px;
                                background:rgba(200,168,75,0.08);
                                border:1px solid rgba(200,168,75,0.25);
                                color:#c8a84b;padding:9px 22px;border-radius:100px;
                                font-family:'Cinzel',serif;
                                font-size:10px;font-weight:700;
                                letter-spacing:2.5px;text-transform:uppercase;
                            ">
                                <span style="width:8px;height:8px;background:#4ade80;border-radius:50%;box-shadow:0 0 8px #4ade80;flex-shrink:0;"></span>
                                ELITE DISPATCH TEAM NOTIFIED
                            </div>
                        </div>`;
                } else {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                    showFormError(form, 'There was a problem submitting your request. Please try again or call us directly at 647-325-6921.');
                }
            } catch (err) {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
                showFormError(form, 'Network error — please check your connection or call us at 647-325-6921.');
            }
        });
    });

});

// ─── HELPER: form error ────────────────────────────────────
function showFormError(form, message) {
    const existing = form.querySelector('.form-error-msg');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = 'form-error-msg';
    div.style.cssText = `
        background: rgba(220,38,38,0.10);
        border: 1px solid rgba(220,38,38,0.3);
        color: #fca5a5;
        padding: 14px 18px;
        border-radius: 8px;
        font-size: 0.88rem;
        margin-bottom: 16px;
        font-family: 'DM Sans', system-ui, sans-serif;
        text-align: center;
        line-height: 1.55;
    `;
    div.textContent = message;
    form.insertBefore(div, form.firstChild);
    setTimeout(() => div.remove(), 7000);
}
