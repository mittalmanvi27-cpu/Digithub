// ===== Site config — REPLACE with real details =====
const CONFIG = {
  whatsapp: '917710242183', // country code + number, digits only
  email: 'hello@digitroot.in',
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const isMobile = () => window.matchMedia('(max-width: 640px)').matches;
const HOME = document.body.dataset.home || ''; // '' on home page, '../index.html' on blog pages

const inr = (n) => {
  n = Math.round(n);
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2).replace(/\.?0+$/, '') + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2).replace(/\.?0+$/, '') + ' L';
  return '₹' + n.toLocaleString('en-IN');
};
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
};

$('#year') && ($('#year').textContent = new Date().getFullYear());
const mbarWa = $('#mbarWa');
if (mbarWa) { mbarWa.href = waLink("Hi Digitroot, I'd like to know more about your services."); mbarWa.target = '_blank'; }

// ===== Header state on scroll =====
const header = $('.header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===== Mobile menu + dropdowns =====
const toggle = $('#menuToggle');
const nav = $('#nav');
const closeDropdowns = (except) => $$('.dd').forEach((d) => {
  if (d === except) return;
  d.classList.remove('is-open');
  $('.dd__btn', d).setAttribute('aria-expanded', 'false');
});
const setMenu = (open) => {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (!open) closeDropdowns();
};
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
$$('.dd').forEach((dd) => {
  const btn = $('.dd__btn', dd);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !dd.classList.contains('is-open');
    closeDropdowns(dd);
    dd.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
  });
});
$$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', (e) => { if (!e.target.closest('.dd')) closeDropdowns(); });

// ===== Pricing tabs with sliding pill =====
const tabs = $$('.tab');
const pill = $('.tabs__pill');
const movePill = (t) => { if (pill && t) { pill.style.width = t.offsetWidth + 'px'; pill.style.transform = `translateX(${t.offsetLeft}px)`; } };
function selectTab(name, focus = false) {
  tabs.forEach((t) => {
    const on = t.dataset.tab === name;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    $('#panel-' + t.dataset.tab).hidden = !on;
    if (on) { movePill(t); if (focus) t.focus(); }
  });
}
if (tabs.length) {
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t.dataset.tab));
    t.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (dir) selectTab(tabs[(i + dir + tabs.length) % tabs.length].dataset.tab, true);
    });
  });
  const syncPill = () => movePill($('.tab.is-active'));
  window.addEventListener('resize', syncPill);
  document.fonts?.ready.then(syncPill);
  syncPill();
  $$('.tile__link[data-tab]').forEach((a) => a.addEventListener('click', () => selectTab(a.dataset.tab)));
}

// ===== Contact form helpers =====
const message = $('#message');
const serviceSel = $('#service');
function prefill(text, service) {
  if (!message) return;
  message.value = text;
  if (service) [...serviceSel.options].forEach((o) => { if (o.text === service) serviceSel.value = o.value; });
}
// Pre-fill from services page links: index.html?interest=Service#contact
const interest = new URLSearchParams(location.search).get('interest');
if (interest) prefill(`I'm interested in ${interest}.`);
const planService = { SEO: 'SEO', PPC: 'Google / Meta Ads', Website: 'Website Design', Founding: 'Founding Partner Programme' };
$$('[data-plan]').forEach((btn) =>
  btn.addEventListener('click', () => prefill(`I'm interested in the ${btn.dataset.plan}.`, planService[btn.dataset.plan.split(' ')[0]]))
);

// ===== Contact form → WhatsApp (falls back to email) =====
const form = $('#contactForm');
if (form) {
  const status = $('#formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name'), phone = $('#phone');
    let ok = true;
    [name, phone].forEach((f) => {
      const bad = !f.value.trim();
      f.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      status.textContent = 'Please add your name and phone number.';
      status.classList.add('is-error');
      (name.value.trim() ? phone : name).focus();
      return;
    }
    const text = [
      'New enquiry from digitroot.in',
      `Name: ${name.value.trim()}`,
      `Phone: ${phone.value.trim()}`,
      `Email: ${$('#email').value.trim() || '—'}`,
      `Website: ${$('#website').value.trim() || '—'}`,
      `Service: ${serviceSel.value || 'Not sure yet'}`,
      `Budget: ${$('#budget').value || '—'}`,
      `Goal: ${message.value.trim() || '—'}`,
    ].join('\n');
    const win = window.open(waLink(text), '_blank', 'noopener');
    if (!win) window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(text)}`;
    status.classList.remove('is-error');
    status.textContent = "Thank you — we'll get back to you within one working day.";
    form.reset();
  });
}

// ===== Newsletter =====
$('#newsForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $('#newsEmail').value.trim();
  window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Subscribe: monthly growth note')}&body=${encodeURIComponent('Please add me to the monthly growth note: ' + email)}`;
  e.target.reset();
});

// ===== Free audit with check-list animation =====
const auditForm = $('#auditForm');
if (auditForm) {
  auditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = $('#auditUrl').value.trim();
    if (!url) return;
    const btn = $('button', auditForm);
    btn.disabled = true;
    const items = $$('#scanList li');
    items.forEach((li) => li.classList.remove('is-ok', 'is-run'));
    $('#scanDone').hidden = true;
    const step = reduce ? 0 : 420;
    items.forEach((li, i) => {
      setTimeout(() => li.classList.add('is-run'), i * step);
      setTimeout(() => { li.classList.remove('is-run'); li.classList.add('is-ok'); }, i * step + step * 0.9);
    });
    setTimeout(() => {
      $('#scanSend').href = waLink(`Hi Digitroot, I'd like a free growth audit for: ${url}\n(Website, Google listing, AI search visibility & ads)`);
      $('#scanDone').hidden = false;
      btn.disabled = false;
    }, items.length * step + 200);
  });
}

// ===== ROI calculator =====
const calc = { v: $('#cVisitors'), c: $('#cConv'), k: $('#cClose'), val: $('#cValue'), scn: 'real',
  scenarios: { cons: { t: 0.2, c: 0.25 }, real: { t: 0.4, c: 0.5 }, amb: { t: 0.7, c: 1 } } };
if (calc.v) {
  const fill = (r) => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min)) * 100 + '%');
  const runCalc = () => {
    const v = +calc.v.value, c = +calc.c.value, k = +calc.k.value, val = +calc.val.value;
    const s = calc.scenarios[calc.scn];
    [calc.v, calc.c, calc.k, calc.val].forEach(fill);
    $('#oVisitors').textContent = v.toLocaleString('en-IN');
    $('#oConv').textContent = c.toFixed(1).replace('.0', '') + '%';
    $('#oClose').textContent = k + '%';
    $('#oValue').textContent = inr(val);
    const leadsNow = v * c / 100;
    const leadsNew = v * (1 + s.t) * (c + s.c) / 100;
    const revNow = leadsNow * k / 100 * val;
    const revNew = leadsNew * k / 100 * val;
    const extra = revNew - revNow;
    $('#rExtra').textContent = '+' + inr(extra);
    $('#rNow').textContent = inr(revNow);
    $('#rNew').textContent = inr(revNew);
    $('#rLeads').textContent = '+' + Math.round(leadsNew - leadsNow).toLocaleString('en-IN');
    $('#rYear').textContent = '+' + inr(extra * 12);
    $('#rBarNow').style.width = (revNow / revNew) * 100 + '%';
    $('#rBarNew').style.width = '100%';
    $('#rFine').textContent = `Assumes +${s.t * 100}% traffic and +${s.c} pt conversion. Illustrative estimate, not a guarantee.`;
    calc.summary = `ROI calculator: ${v.toLocaleString('en-IN')} visitors/month, ${c}% enquiry rate, ${k}% close rate, ${inr(val)} avg value. Estimated upside ${inr(extra)}/month.`;
  };
  [calc.v, calc.c, calc.k, calc.val].forEach((r) => r.addEventListener('input', runCalc));
  $$('.seg').forEach((b) => b.addEventListener('click', () => {
    $$('.seg').forEach((x) => x.classList.toggle('is-on', x === b));
    calc.scn = b.dataset.scn;
    runCalc();
  }));
  $('#calcCta').addEventListener('click', () => prefill(calc.summary + ' I would like a plan to get there.'));
  runCalc();
}

// ===== AI answer typing demo =====
function typeAnswer(el) {
  if (!el) return;
  const full = el.dataset.text;
  const brand = 'YourStudio Interiors';
  const finish = () => { el.innerHTML = full.replace(brand, `<mark>${brand}</mark>`); el.classList.add('is-done'); };
  if (reduce) return finish();
  let i = 0;
  const tick = () => {
    i += 2;
    el.textContent = full.slice(0, i);
    if (i < full.length) setTimeout(tick, 22); else finish();
  };
  setTimeout(tick, 500);
}

// ===== Reveal on scroll =====
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in');
    if (en.target.classList.contains('ai__demo')) typeAnswer($('#aiTyping'));
    io.unobserve(en.target);
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
$$('.reveal').forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
  el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
  io.observe(el);
});

// ===== Statement: words light up on scroll =====
const statement = $('#statement');
if (statement) {
  const highlight = new Set(['right', 'honestly,', 'improved']);
  statement.innerHTML = statement.textContent.trim().split(/\s+/)
    .map((w) => `<span class="w${highlight.has(w) ? ' hl' : ''}">${w}</span>`).join(' ');
  const words = $$('.w', statement);
  const paint = () => {
    const r = statement.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  if (reduce) words.forEach((w) => w.classList.add('on'));
  else { paint(); window.addEventListener('scroll', paint, { passive: true }); }
}

// ===== Spotlight + magnetic =====
if (finePointer) {
  $$('.spot').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
  if (!reduce) $$('.magnetic').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}

// ===== Hero: orbiting platforms, rotating word, parallax cards =====
const orbit = $('#orbit');
if (orbit) {
  const sats = $$('.sat', orbit).map((el) => ({ el, ring: +el.dataset.ring, a: +el.dataset.a * Math.PI / 180 }));
  const RINGS = { 1: { rx: 270 / 600, ry: 104 / 600, speed: 0.00016 }, 2: { rx: 190 / 600, ry: 72 / 600, speed: -0.00024 } };
  let W = orbit.clientWidth, Hh = orbit.clientHeight;
  window.addEventListener('resize', () => { W = orbit.clientWidth; Hh = orbit.clientHeight; });
  const place = (t) => {
    sats.forEach((s) => {
      const r = RINGS[s.ring];
      const ang = s.a + t * r.speed;
      const x = W / 2 + Math.cos(ang) * r.rx * W;
      const y = Hh / 2 + Math.sin(ang) * r.ry * W * (Hh / W);
      const depth = (Math.sin(ang) + 1) / 2; // 0 = back, 1 = front
      const scale = 0.72 + depth * 0.38;
      s.el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      s.el.style.zIndex = depth > 0.5 ? 10 : 2;
      s.el.style.opacity = 0.55 + depth * 0.45;
      s.el.style.filter = depth < 0.3 ? `blur(${(0.3 - depth) * 4}px)` : '';
    });
  };
  if (reduce) place(0);
  else {
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(orbit);
    const loop = (t) => { if (visible) place(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  // parallax cards follow the pointer
  if (finePointer && !reduce) {
    const cards = $$('[data-depth]', orbit);
    $('#hero').addEventListener('pointermove', (e) => {
      const r = orbit.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      cards.forEach((c) => {
        const d = +c.dataset.depth;
        c.style.setProperty('--tx', `${(-dx * d).toFixed(1)}px`);
        c.style.setProperty('--ty', `${(-dy * d).toFixed(1)}px`);
      });
    });
  }
}

const rot = $$('.rotator__box b');
if (rot.length && !reduce) {
  let i = 0;
  setInterval(() => {
    const cur = rot[i];
    cur.classList.remove('is-on'); cur.classList.add('is-out');
    setTimeout(() => cur.classList.remove('is-out'), 700);
    i = (i + 1) % rot.length;
    rot[i].classList.add('is-on');
  }, 2200);
}

// ===== Blog: filters, reading progress, active TOC =====
$$('.filter').forEach((f) => f.addEventListener('click', () => {
  $$('.filter').forEach((x) => x.classList.toggle('is-on', x === f));
  $$('#blogGrid .post').forEach((p) => { p.hidden = f.dataset.filter !== 'all' && p.dataset.cat !== f.dataset.filter; });
}));
const prose = $('#prose');
if (prose) {
  const bar = $('#progress');
  const links = $$('#toc a');
  const heads = links.map((a) => $(a.getAttribute('href')));
  const onRead = () => {
    const r = prose.getBoundingClientRect();
    const p = Math.min(Math.max(-r.top / (r.height - window.innerHeight * 0.6), 0), 1);
    bar.style.width = p * 100 + '%';
    let active = 0;
    heads.forEach((h, i) => { if (h && h.getBoundingClientRect().top < 140) active = i; });
    links.forEach((a, i) => a.classList.toggle('is-on', i === active));
  };
  onRead();
  window.addEventListener('scroll', onRead, { passive: true });
}

/* =========================================================
   Digi — AI growth assistant (guided, runs in the browser)
   ========================================================= */
const assist = {
  root: $('#assist'), panel: $('#assistPanel'), log: $('#assistLog'), quick: $('#assistQuick'),
  launcher: $('#assistLauncher'), input: $('#assistText'), greet: $('#assistGreet'),
  started: false, goal: null, transcript: [],
};

const MAIN_MENU = ['Recommend a plan', 'Pricing', 'Free audit', 'AI search (ChatGPT SEO)', 'Talk to a human'];
const GOALS = {
  'More local customers': 'local',
  'Leads fast with ads': 'ads',
  'A new website': 'web',
  'Show up in ChatGPT / AI': 'ai',
  'Sell more online': 'ecom',
};
const BUDGETS = { 'Under ₹10k / month': 0, '₹10k – ₹25k / month': 1, '₹25k+ / month': 2 };
const RECS = {
  local: [
    ['SEO Basic — ₹9,999/mo', 'Google Business Profile, local keywords and on-page fixes to win the Maps pack.', 'seo'],
    ['SEO Standard — ₹19,999/mo', 'Local SEO + content + citations, plus AI search structuring so you show up in AI answers too.', 'seo'],
    ['SEO Standard + PPC Basic — ₹27,998/mo', 'SEO builds long-term rankings while Google Ads brings enquiries from week one.', 'seo'],
  ],
  ads: [
    ['PPC Basic — ₹7,999/mo + ad spend', 'One focused Google or Meta campaign with proper conversion tracking.', 'ppc'],
    ['PPC Standard — ₹14,999/mo + ad spend', 'Google + Meta, remarketing, creative testing and a landing page included.', 'ppc'],
    ['PPC Standard + SEO Basic — ₹24,998/mo', 'Ads for leads now, SEO so your cost per lead keeps falling over time.', 'ppc'],
  ],
  web: [
    ['Website Basic — ₹14,999 one-time', 'Up to 5 fast, mobile-first pages with WhatsApp and basic SEO.', 'web'],
    ['Website Standard — ₹29,999 one-time', 'Up to 12 custom pages, blog, schema, GA4 and speed optimisation.', 'web'],
    ['Website Premium — ₹59,999 one-time', 'Ecommerce or custom features, payment gateway and CRO landing pages.', 'web'],
  ],
  ai: [
    ['SEO Basic — ₹9,999/mo', 'The foundations AI models read: clean site, schema and a strong Google profile. Upgrade later for full AEO.', 'seo'],
    ['SEO Standard — ₹19,999/mo', 'Includes AEO content structuring so ChatGPT, Gemini and Perplexity can cite you.', 'seo'],
    ['SEO Premium — ₹34,999/mo', 'Full GEO programme with AI visibility tracking, digital PR and authority building.', 'seo'],
  ],
  ecom: [
    ['PPC Basic — ₹7,999/mo + ad spend', 'Google Shopping or Meta catalogue ads to start selling quickly.', 'ppc'],
    ['PPC Standard — ₹14,999/mo + ad spend', 'Shopping + Meta + remarketing to recover abandoned carts.', 'ppc'],
    ['Website Premium + PPC Premium', 'A conversion-focused store plus full-funnel ads across Google, Meta and YouTube.', 'web'],
  ],
};

const KB = {
  pricing: { k: /price|pricing|cost|charge|fee|rate|kitna|paisa|budget/i, a: ['Our plans start at:\n• SEO from ₹9,999/month\n• Google/Meta Ads management from ₹7,999/month (+ ad spend)\n• Websites from ₹14,999 one-time\n\nAll prices exclude GST. Want me to recommend the right one?', ['Recommend a plan', 'See all pricing']] },
  ai: { k: /chatgpt|gemini|perplexity|\bai\b|aeo|geo|llm|overview/i, a: ["AI search optimisation makes your business the one ChatGPT, Gemini, Perplexity and Google AI Overviews recommend — through answer-first content, schema, entity signals, reviews and authoritative mentions.\n\nIt's included in our SEO Standard (₹19,999/mo) and Premium plans.", ['Recommend a plan', 'Read our GEO guide']] },
  audit: { k: /audit|check|review my|analy/i, a: ["Our free audit covers website speed, mobile, technical SEO, your Google Business Profile, AI search visibility and any ad spend. You'll get a short, prioritised report within 48 hours — no obligation.", ['Start free audit', 'Talk to a human']] },
  time: { k: /how long|time|kab|results|when/i, a: ['Ads can bring enquiries within the first 1–2 weeks. SEO quick wins show in weeks, while strong rankings usually take 3–6 months. Websites take about 2–4 weeks depending on size.', ['Recommend a plan', 'Free audit']] },
  contract: { k: /contract|lock|cancel|notice/i, a: ["No lock-ins. SEO and PPC are month-to-month with 30 days' notice. We keep clients by delivering, not by paperwork.", ['Recommend a plan']] },
  blog: { k: /blog|article|guide|learn|read/i, a: ['Our blog has practical guides on GEO / ChatGPT SEO, Google Business Profile and Google Ads.', ['Open the blog', 'Recommend a plan']] },
  web: { k: /website|site|wordpress|design|landing/i, a: ['We build fast, mobile-first websites designed to rank and convert — from ₹14,999 (5 pages) to ₹59,999 (ecommerce/custom). SEO, schema and tracking are built in.', ['See website pricing', 'Recommend a plan']] },
  ads: { k: /ads|ppc|google ads|meta|facebook|instagram|campaign/i, a: ['We run Google Search, Performance Max, Shopping and Meta (Facebook/Instagram) campaigns built around cost per lead. Management starts at ₹7,999/month; your ad budget is paid directly to Google/Meta.', ['See ads pricing', 'Recommend a plan']] },
  seo: { k: /seo|rank|google|keyword|local|maps/i, a: ['Our SEO covers technical fixes, on-page, local SEO & Google Business Profile, content and link building — reported monthly in plain English. Plans start at ₹9,999/month.', ['See SEO pricing', 'Recommend a plan']] },
  human: { k: /human|call|talk|whatsapp|contact|phone|number|baat/i, a: ['Sure — tap below to continue on WhatsApp. A specialist (not a bot) will reply, usually within the hour during working hours.', ['Open WhatsApp']] },
  founding: { k: /founding|discount|offer|deal/i, a: ["We're taking on 5 founding partners at 20% off for the first 3 months, in exchange for honest feedback and a case study once you see results.", ['Apply for founding spot', 'Recommend a plan']] },
  hello: { k: /^(hi|hello|hey|namaste|hii+)\b/i, a: ['Hello! 👋 What would you like help with today?', MAIN_MENU] },
};

function addMsg(text, who = 'bot') {
  const m = document.createElement('div');
  m.className = `msg msg--${who}`;
  m.textContent = text;
  assist.log.appendChild(m);
  assist.log.scrollTop = assist.log.scrollHeight;
  assist.transcript.push(`${who === 'bot' ? 'Digi' : 'Visitor'}: ${text}`);
}
function setQuick(list = []) {
  assist.quick.innerHTML = '';
  list.forEach((label) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'qr'; b.textContent = label;
    b.addEventListener('click', () => handle(label));
    assist.quick.appendChild(b);
  });
}
function bot(text, quick = []) {
  setQuick([]);
  const typing = document.createElement('div');
  typing.className = 'msg msg--bot msg--typing';
  typing.innerHTML = '<i></i><i></i><i></i>';
  assist.log.appendChild(typing);
  assist.log.scrollTop = assist.log.scrollHeight;
  const delay = reduce ? 0 : Math.min(400 + text.length * 6, 1300);
  setTimeout(() => { typing.remove(); addMsg(text); setQuick(quick); }, delay);
}
const say = (key) => bot(...KB[key].a);
function goTo(hash, tab) {
  if (!document.querySelector(hash)) { window.location.href = HOME + hash; return; }
  if (tab) selectTab(tab);
  if (isMobile()) openAssist(false);
  document.querySelector(hash).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}
const blogUrl = (slug = '') => (HOME ? '' : 'blog/') + (slug ? slug + '.html' : 'index.html');
function openWhatsApp() {
  const summary = assist.transcript.slice(-8).join('\n');
  window.open(waLink(`Hi Digitroot! I was chatting with Digi on your website.\n\n${summary}`), '_blank', 'noopener');
}
function focusAudit() {
  goTo('#audit');
  setTimeout(() => $('#auditUrl')?.focus({ preventScroll: true }), 600);
}

function handle(raw) {
  const text = raw.trim();
  if (!text) return;
  addMsg(text, 'user');

  if (GOALS[text]) {
    assist.goal = GOALS[text];
    return bot('Got it. Roughly what monthly budget are you comfortable with for marketing?', Object.keys(BUDGETS));
  }
  if (text in BUDGETS && assist.goal) {
    const [name, why, tab] = RECS[assist.goal][BUDGETS[text]];
    assist.rec = { name, tab };
    prefill(`Digi recommended: ${name}. I'd like to discuss this.`);
    return bot(`My recommendation: ${name}\n\n${why}\n\nEvery plan is fine-tuned after a free audit, and there's no lock-in.`, ['Book free audit', 'See this plan', 'Talk to a human']);
  }

  const actions = {
    'Recommend a plan': () => bot("Happy to help! What's your main goal right now?", Object.keys(GOALS)),
    'Pricing': () => say('pricing'),
    'See all pricing': () => { goTo('#pricing'); bot('Here are all our plans. Anything else?', MAIN_MENU); },
    'See SEO pricing': () => { goTo('#pricing', 'seo'); bot('Here are the SEO plans. Anything else?', MAIN_MENU); },
    'See ads pricing': () => { goTo('#pricing', 'ppc'); bot('Here are the ads plans. Anything else?', MAIN_MENU); },
    'See website pricing': () => { goTo('#pricing', 'web'); bot('Here are the website plans. Anything else?', MAIN_MENU); },
    'See this plan': () => { goTo('#pricing', assist.rec?.tab); bot('Opened the right tab for you. Want to book a free audit next?', ['Book free audit', 'Talk to a human']); },
    'Free audit': () => say('audit'),
    'Start free audit': () => { focusAudit(); bot('Just enter your website in the audit box. 👍', ['Talk to a human']); },
    'Book free audit': () => { focusAudit(); bot("Enter your website in the audit box and we'll take it from there.", ['Talk to a human']); },
    'AI search (ChatGPT SEO)': () => say('ai'),
    'Read our GEO guide': () => { window.location.href = blogUrl('geo-chatgpt-seo-guide'); },
    'Open the blog': () => { window.location.href = blogUrl(); },
    'Talk to a human': () => say('human'),
    'Open WhatsApp': () => { openWhatsApp(); bot("Opened WhatsApp with our chat summary so you don't have to repeat yourself.", MAIN_MENU); },
    'Apply for founding spot': () => { prefill("I'd like to apply for the Founding Partner Programme.", 'Founding Partner Programme'); goTo('#contact'); bot("I've pre-filled the form for you — just add your name and number.", ['Talk to a human']); },
  };
  if (actions[text]) return actions[text]();

  const hit = Object.keys(KB).find((key) => KB[key].k.test(text));
  if (hit) return say(hit);
  bot("Good question — that's best answered by a specialist. Want to continue on WhatsApp, or shall I recommend a plan?", ['Open WhatsApp', 'Recommend a plan', 'Pricing']);
}

function hideGreet() {
  if (assist.greet) assist.greet.hidden = true;
  store.set('dr_greeted', '1');
}
function openAssist(open = true) {
  hideGreet();
  assist.panel.hidden = !open;
  assist.root.classList.toggle('is-open', open);
  assist.launcher.setAttribute('aria-expanded', open);
  if (open && !assist.started) {
    assist.started = true;
    bot("Namaste, I'm Digi ✦ — Digitroot's growth assistant.\nI can recommend a plan, explain pricing, or set up your free audit. What would you like to do?", MAIN_MENU);
  }
  if (open && !isMobile()) setTimeout(() => assist.input.focus(), 50);
  if (!open) assist.launcher.focus();
}
assist.launcher.addEventListener('click', () => openAssist(true));
$('#assistClose').addEventListener('click', () => openAssist(false));
$$('[data-open-chat]').forEach((b) => b.addEventListener('click', () => openAssist(true)));
$('#assistForm').addEventListener('submit', (e) => {
  e.preventDefault();
  handle(assist.input.value);
  assist.input.value = '';
});
$('#greetClose')?.addEventListener('click', hideGreet);
$('#greetStart')?.addEventListener('click', () => openAssist(true));
if (assist.greet && !store.get('dr_greeted')) {
  setTimeout(() => { if (assist.panel.hidden) assist.greet.hidden = false; }, location.hash === '#greet' ? 0 : 4000);
}
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  setMenu(false);
  if (!assist.panel.hidden) openAssist(false);
  else hideGreet();
});

// Deep link: digitroot.in/#chat opens the assistant
if (location.hash === '#chat') openAssist(true);
