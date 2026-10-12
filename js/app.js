const KEY = 'labor-planner-v1';
const LANG_KEY = 'labor-planner-lang';
const SAMPLE = {
  volume: 45000, totalHc: 118, shift: 10, breakMin: 60, indirect: 10, absent: 8,
  paths: [
    { name: 'Pick',      share: 100, rate: 110, hc: 60 },
    { name: 'Pack',      share: 100, rate: 160, hc: 40 },
    { name: 'SLAM',      share: 100, rate: 650, hc: 8 },
    { name: 'Ship Dock', share: 100, rate: 900, hc: 8 }
  ]
};
const clone = o => JSON.parse(JSON.stringify(o));
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && Array.isArray(s.paths)) {
      // Older saved plans had no total headcount: start it at the number already assigned.
      if (s.totalHc === undefined) s.totalHc = s.paths.reduce((a, p) => a + (Math.floor(parseFloat(p.hc)) || 0), 0);
      return s;
    }
  } catch (e) {}
  return clone(SAMPLE);
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

const $ = id => document.getElementById(id);

// ---- Language ----
// Priority: ?lang=ar / ?lang=en in the URL, then the saved choice, then English.
function initialLang() {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ar' || q === 'en') return q;
  } catch (e) {}
  try { const s = localStorage.getItem(LANG_KEY); if (s === 'ar' || s === 'en') return s; } catch (e) {}
  return 'en';
}
let lang = initialLang();
const t = key => I18N[lang][key];

function applyLang() {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  const btn = $('langBtn');
  btn.textContent = t('langBtn');
  btn.lang = lang === 'ar' ? 'en' : 'ar';
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
}

let state = load();
const num = (v, min, max) => {
  let n = parseFloat(v); if (!isFinite(n)) n = 0;
  if (min !== undefined) n = Math.max(min, n);
  if (max !== undefined) n = Math.min(max, n);
  return n;
};
// Western digits in both languages, as used across Saudi business documents.
const fmt = (n, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const signed = n => (n > 0 ? '+' : '') + n;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nm = s => `<bdi>${esc(s)}</bdi>`;

const SHIFT_FIELDS = ['volume', 'totalHc', 'shift', 'breakMin', 'indirect', 'absent'];
function fillShift() { SHIFT_FIELDS.forEach(f => { $(f).value = state[f]; }); }
SHIFT_FIELDS.forEach(f => $(f).addEventListener('input', e => { state[f] = e.target.value; update(); }));

function renderPaths() {
  $('pathRows').innerHTML = state.paths.map((p, i) => `
    <tr>
      <td><input type="text" dir="auto" data-i="${i}" data-k="name" value="${esc(p.name)}" aria-label="${esc(t('thPath'))}"></td>
      <td><input type="number" min="0" max="100" step="1" data-i="${i}" data-k="share" value="${esc(p.share)}" aria-label="${esc(t('thShare'))}"></td>
      <td><input type="number" min="0" step="5" data-i="${i}" data-k="rate" value="${esc(p.rate)}" aria-label="${esc(t('thRate'))}"></td>
      <td><input type="number" min="0" step="1" data-i="${i}" data-k="hc" value="${esc(p.hc)}" aria-label="${esc(t('thAvail'))}"></td>
      <td><button class="icon-btn" data-remove="${i}" aria-label="${esc(t('removePath'))}">✕</button></td>
    </tr>`).join('');
}
$('pathRows').addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.k) { state.paths[+el.dataset.i][el.dataset.k] = el.value; update(); }
});
$('pathRows').addEventListener('click', e => {
  const b = e.target.closest('[data-remove]');
  if (b) { state.paths.splice(+b.dataset.remove, 1); renderPaths(); update(); }
});
$('addPath').addEventListener('click', () => {
  state.paths.push({ name: t('newPath'), share: 100, rate: 100, hc: 0 });
  renderPaths(); update();
});

function calc() {
  const volume = num(state.volume, 0);
  const shift = num(state.shift, 0, 24);
  const brk = num(state.breakMin, 0, 1440);
  const ind = num(state.indirect, 0, 90);
  const abs = num(state.absent, 0, 90);
  const prodHrs = Math.max(0, shift - brk / 60) * (1 - ind / 100);
  const showUp = 1 - abs / 100;

  const rows = state.paths.map(p => {
    const name = String(p.name || '').trim() || t('unnamed');
    const share = num(p.share, 0, 100), rate = num(p.rate, 0), hc = Math.floor(num(p.hc, 0));
    const vol = volume * share / 100;
    const invalid = share > 0 && rate <= 0;
    const laborHrs = rate > 0 ? vol / rate : 0;
    const needed = prodHrs > 0 ? laborHrs / prodHrs : 0;
    const sched = Math.ceil(needed / showUp - 1e-9);
    const gap = hc - sched;
    const capacity = (share > 0 && rate > 0) ? hc * showUp * prodHrs * rate / (share / 100) : Infinity;
    return { name, share, rate, hc, vol, laborHrs, needed, sched, gap, capacity, invalid };
  });

  const valid = rows.filter(x => !x.invalid);
  const assigned = valid.reduce((a, x) => a + x.hc, 0);
  const total = Math.floor(num(state.totalHc, 0));
  const unassigned = total - assigned;
  const tSched = valid.reduce((a, x) => a + x.sched, 0);
  const net = total - tSched;

  // Bottleneck with the current assignment.
  const caps = valid.filter(x => isFinite(x.capacity));
  const bn = caps.length ? caps.reduce((a, b) => (b.capacity < a.capacity ? b : a)) : null;
  const curCap = bn ? Math.floor(bn.capacity) : 0;

  // Best possible output if every person on shift were placed where needed.
  const hrsPerUnit = valid.reduce((a, x) => a + (x.share > 0 && x.rate > 0 ? (x.share / 100) / x.rate : 0), 0);
  const rebCap = hrsPerUnit > 0 ? Math.floor(total * showUp * prodHrs / hrsPerUnit) : 0;

  return { volume, prodHrs, showUp, rows, valid, assigned, total, unassigned, tSched, net, bn, curCap, rebCap, hrsPerUnit };
}

function statusBadge(r) {
  if (r.invalid) return `<span class="badge warn">${t('enterRate')}</span>`;
  if (r.gap < 0) return `<span class="badge bad">${t('short')(-r.gap)}</span>`;
  if (r.gap > 0 && r.gap >= Math.max(2, Math.ceil(r.sched * 0.15))) return `<span class="badge warn">${t('overstaffed')(r.gap)}</span>`;
  if (r.gap > 0) return `<span class="badge ok">${t('surplus')(r.gap)}</span>`;
  return `<span class="badge ok">${t('balanced')}</span>`;
}

// Fill short paths from the unassigned pool first, then from surplus paths.
function flexPlan(r) {
  const moves = [], notes = [];
  let pool = Math.max(0, r.unassigned);
  const surplus = r.valid.filter(x => x.gap > 0).map(x => ({ name: x.name, n: x.gap })).sort((a, b) => b.n - a.n);
  const short = r.valid.filter(x => x.gap < 0).map(x => ({ name: x.name, n: -x.gap })).sort((a, b) => b.n - a.n);
  for (const d of short) {
    if (pool > 0) {
      const m = Math.min(pool, d.n);
      moves.push(t('flexPool')(m, nm(d.name)));
      pool -= m; d.n -= m;
    }
    for (const s of surplus) {
      if (d.n === 0) break;
      if (s.n === 0) continue;
      const m = Math.min(s.n, d.n);
      moves.push(t('flexMove')(m, nm(s.name), nm(d.name)));
      s.n -= m; d.n -= m;
    }
  }
  const stillShort = short.filter(d => d.n > 0).map(d =>
    `<span class="badge bad">${t('flexStillShort')(d.n)}</span> ${t('flexStillShortTip')(nm(d.name))}`);
  if (pool > 0) notes.push(`<span class="badge ok">${t('flexPoolLeft')(pool)}</span> ${t('flexPoolLeftTip')}`);
  surplus.filter(s => s.n > 0).forEach(s =>
    notes.push(`<span class="badge ok">${t('flexSpare')(s.n)}</span> ${t('flexSpareTip')(nm(s.name))}`));
  return { moves, stillShort, notes };
}

function renderOverview(r, flex) {
  const pct = cap => (r.volume > 0 ? Math.floor(cap / r.volume * 100) : 0);
  const has = !!r.bn && r.volume > 0;
  let cls = '', title, text;
  if (!has) {
    title = t('vNoDataTitle'); text = t('vNoData');
  } else if (r.curCap >= r.volume) {
    cls = 'ok'; title = t('vOkTitle');
    text = t('vOk')(fmt(r.curCap), pct(r.curCap), fmt(r.volume), signed(r.net));
  } else if (r.rebCap >= r.volume) {
    cls = 'warn'; title = t('vRebalTitle');
    text = t('vRebal')(nm(r.bn.name), fmt(r.curCap), pct(r.curCap), signed(r.net));
  } else {
    cls = 'bad'; title = t('vShortTitle');
    // People needed so that rebalanced output reaches the forecast.
    const needTotal = Math.ceil(r.volume * r.hrsPerUnit / (r.showUp * r.prodHrs) - 1e-9);
    const extra = Math.max(1, needTotal - r.total, -r.net);
    text = t('vShort')(fmt(r.rebCap), pct(r.rebCap), extra);
  }
  const over = r.unassigned < 0 ? `<div class="warn-line">${t('vOverAssigned')(r.assigned, r.total)}</div>` : '';
  $('verdict').className = 'verdict ' + cls;
  $('verdict').innerHTML = `<span class="dot" aria-hidden="true"></span><div><div class="vt">${title}</div><p>${text}</p>${over}</div>`;

  const meter = cap => `<div class="meter"><span style="width:${Math.min(100, pct(cap))}%"></span></div>`;
  const curOk = r.curCap >= r.volume, rebOk = r.rebCap >= r.volume;
  $('cards').innerHTML = has ? `
    <div class="card ${curOk ? 'ok' : 'bad'}"><div class="k">${t('kMax')}</div>
      <div class="v">${fmt(r.curCap)}</div>${meter(r.curCap)}
      <div class="s">${t('kMaxSub')(pct(r.curCap), fmt(r.volume))}</div>
      <div class="s">${t('kBottleneck')(nm(r.bn.name))}</div></div>
    <div class="card ${r.net < 0 ? 'bad' : 'ok'}"><div class="k">${t('kGap')}</div>
      <div class="v"><bdi dir="ltr">${signed(r.net)}</bdi></div>
      <div class="s">${t('kGapSub')(r.total, r.tSched)}</div></div>
    <div class="card ${rebOk ? 'ok' : 'bad'}"><div class="k">${t('kReb')}</div>
      <div class="v">${fmt(r.rebCap)}</div>${meter(r.rebCap)}
      <div class="s">${rebOk ? t('covered') : t('notCovered')} · ${t('kRebSub')(r.total)}</div></div>
    <div class="card ${r.unassigned < 0 ? 'bad' : (r.unassigned > 0 ? 'warn' : '')}"><div class="k">${t('kUnassigned')}</div>
      <div class="v">${Math.max(0, r.unassigned)}</div>
      <div class="s">${r.unassigned < 0 ? t('kOverSub')(-r.unassigned) : t('kUnassignedSub')(r.assigned, r.total)}</div></div>` : '';

  const top = [...flex.moves, ...flex.stillShort].slice(0, 3);
  $('topActions').innerHTML = has && top.length
    ? `<h3>${t('actionsTitle')}</h3><ul>${top.map(i => `<li>${i}</li>`).join('')}</ul>` : '';
}

function update() {
  save();
  const r = calc();
  $('prodHrs').textContent = `${fmt(r.prodHrs, 2)} ${t('hoursUnit')}`;

  const al = $('assignLine');
  al.className = 'assign-line' + (r.unassigned < 0 ? ' over' : '');
  al.innerHTML = r.unassigned < 0 ? t('assignOver')(r.assigned, r.total, -r.unassigned) : t('assignLine')(r.assigned, r.total, r.unassigned);

  $('resultRows').innerHTML = r.rows.map(x => `
    <tr>
      <td>${nm(x.name)}</td>
      <td class="n">${fmt(x.vol)}</td>
      <td class="n">${x.invalid ? '–' : fmt(x.laborHrs, 1)}</td>
      <td class="n">${x.invalid ? '–' : fmt(x.needed, 1)}</td>
      <td class="n">${x.invalid ? '–' : x.sched}</td>
      <td class="n">${x.hc}</td>
      <td>${statusBadge(x)}</td>
    </tr>`).join('') || `<tr><td colspan="7">${t('noPaths')}</td></tr>`;

  const tHrs = r.valid.reduce((a, x) => a + x.laborHrs, 0);
  const tNeed = r.valid.reduce((a, x) => a + x.needed, 0);
  $('resultFoot').innerHTML = r.valid.length ? `
    <tr><td>${t('total')}</td><td class="n"></td><td class="n">${fmt(tHrs, 1)}</td><td class="n">${fmt(tNeed, 1)}</td>
    <td class="n">${r.tSched}</td><td class="n">${r.assigned}</td><td></td></tr>` : '';

  const flex = flexPlan(r);
  const items = [...flex.moves, ...flex.stillShort, ...flex.notes];
  if (!items.length) items.push(r.valid.length ? t('flexBalanced') : t('flexEmpty'));
  $('flexList').innerHTML = items.map(i => `<li>${i}</li>`).join('');

  renderOverview(r, flex);
}

$('exportCsv').addEventListener('click', () => {
  const r = calc();
  const q = v => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [
    [t('csvForecast'), r.volume], [t('csvTotal'), r.total], [t('csvProd'), r.prodHrs.toFixed(2)],
    [t('csvMax'), r.curCap], [t('csvReb'), r.rebCap], [t('csvNet'), r.net], [],
    t('csvHeader'),
    ...r.rows.map(x => [x.name, x.share, x.rate, Math.round(x.vol), x.laborHrs.toFixed(1), x.needed.toFixed(1), x.invalid ? '' : x.sched, x.hc, x.invalid ? '' : x.gap])
  ];
  // The BOM (﻿) makes Excel open Arabic text correctly.
  const csv = '﻿' + lines.map(l => l.map(q).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = t('csvFile');
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});
$('printBtn').addEventListener('click', () => window.print());
$('resetBtn').addEventListener('click', () => { state = clone(SAMPLE); fillShift(); renderPaths(); update(); });
$('langBtn').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  applyLang(); renderPaths(); update();
});

applyLang();
fillShift();
renderPaths();
update();
