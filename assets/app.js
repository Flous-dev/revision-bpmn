/* Application de révision BPMN : navigation, progression, activités. */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const SYM = Object.fromEntries(SYMBOLS.map(s => [s.key, s]));

  /* ---------- Stockage local (progression, brouillons) ---------- */
  const KEY = 'bpmn-revision-v1';
  let store = {};
  try { store = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { store = {}; }
  store.acts = store.acts || {};
  store.drafts = store.drafts || {};
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* stockage indisponible */ } };
  function record(actId, ratio) {
    const prev = store.acts[actId] || { best: 0 };
    store.acts[actId] = { best: Math.max(prev.best || 0, ratio), last: ratio, done: true };
    save();
    refreshProgress();
  }
  const scoredActs = lvl => lvl.acts.filter(a => a.type !== 'timer');
  function levelProgress(lvl) {
    const acts = scoredActs(lvl);
    if (!acts.length) return 0;
    return acts.reduce((s, a) => s + ((store.acts[a.id] && store.acts[a.id].best) || 0), 0) / acts.length;
  }

  /* ---------- Thème ---------- */
  function applyTheme() {
    let t = null;
    try { t = localStorage.getItem('bpmn-theme'); } catch (e) { /* ignore */ }
    if (t) document.documentElement.setAttribute('data-theme', t);
  }
  applyTheme();
  $('#theme').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('bpmn-theme', next); } catch (e) { /* ignore */ }
  });

  /* ---------- Rendu d'un pictogramme ---------- */
  function symSvg(key) {
    const s = SYM[key];
    return BPMN.render(s.d, { nolabels: s.key !== 'note' && s.key !== 'pool' && s.key !== 'pool-black' }).svg;
  }

  /* ---------- Figure de diagramme (zoom / plein écran) ---------- */
  function figure(key, opts = {}) {
    const d = DIAGRAMS[key];
    const r = BPMN.render(d, Object.assign({ hl: d.hl }, opts));
    const id = 'fig-' + Math.random().toString(36).slice(2, 8);
    let svg = r.svg.replace('<svg ', `<svg data-w="${r.width}" data-min="${opts.minZoom || 0.75}" `);
    if (opts.dim) svg = svg.replace('class="bpmn"', 'class="bpmn dim"');
    return `<div class="fig" id="${id}" data-key="${key}">
      <div class="fig-tools"><span>Zoom</span>
        <button class="btn sm" data-z="-">−</button><button class="btn sm" data-z="fit">Vue d’ensemble</button><button class="btn sm" data-z="+">+</button>
        <span class="spacer"></span><button class="btn sm" data-z="full">⤢ Plein écran</button></div>
      <div class="fig-scroll">${svg}</div></div>`;
  }
  function initFigures(root) {
    $$('.fig', root).forEach(fig => {
      if (fig.dataset.init) return;
      fig.dataset.init = 1;
      const svg = $('svg', fig);
      const natural = +svg.dataset.w;
      let zoom = null; // null = ajusté
      const apply = () => {
        const box = $('.fig-scroll', fig).clientWidth - 16;
        const fit = Math.max(+svg.dataset.min || 0, Math.min(1, box / natural));
        const z = zoom === null ? fit : zoom;
        svg.style.width = Math.round(natural * z) + 'px';
        svg.style.height = 'auto';
      };
      apply();
      new ResizeObserver(() => { if (zoom === null) apply(); }).observe($('.fig-scroll', fig));
      $$('[data-z]', fig).forEach(b => b.addEventListener('click', () => {
        const box = $('.fig-scroll', fig).clientWidth - 16;
        const cur = zoom === null ? Math.min(1, box / natural) : zoom;
        const v = b.dataset.z;
        if (v === '+') zoom = Math.min(2.5, cur * 1.25);
        else if (v === '-') zoom = Math.max(0.25, cur / 1.25);
        else if (v === 'fit') zoom = Math.min(1, box / natural);
        else if (v === 'full') {
          fig.classList.toggle('full');
          b.textContent = fig.classList.contains('full') ? '✕ Fermer' : '⤢ Plein écran';
          zoom = null;
        }
        apply();
      }));
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') $$('.fig.full').forEach(f => { f.classList.remove('full'); const b = $('[data-z="full"]', f); if (b) b.textContent = '⤢ Plein écran'; });
  });

  /* ---------- Pages ---------- */
  const app = $('#app');

  function home() {
    const cards = LEVELS.map(l => {
      const p = levelProgress(l);
      return `<a class="card level-card${p >= 0.999 ? ' done' : ''}" href="#/niveau/${l.num}">
        <span class="num">Niveau ${l.num}${l.id === 'exam' ? ' · final' : ''}</span>
        <h3>${esc(l.title)}</h3><p>${esc(l.short)}</p>
        <div class="row small muted"><span>${scoredActs(l).length} activité${scoredActs(l).length > 1 ? 's' : ''}</span><span class="spacer"></span><span data-prog="${l.id}">${Math.round(p * 100)} %</span></div>
        <div class="bar"><i data-bar="${l.id}" style="width:${p * 100}%"></i></div></a>`;
    }).join('');
    app.innerHTML = `
      <section class="hero">
        <span class="pill">SI & BD 1 · BPMN</span>
        <h1 style="margin-top:10px">Réussir l’examen BPMN, niveau par niveau</h1>
        <p>Un parcours en 8 niveaux construit à partir du cours, des TD, des exercices de révision et de l’annale 2024 : QCM pour vérifier le cours et les symboles, lecture de logigrammes, puis entraînement aux deux exercices de l’examen.</p>
      </section>
      <div class="exam-parts">
        <div class="card exam-part"><div class="ic">1</div><div><b>BPMN → texte</b><p class="muted small" style="margin:4px 0 0">Retranscrire un logigramme (ou une branche) en français, sans rien oublier. Annale : 10 points.</p></div></div>
        <div class="card exam-part"><div class="ic">2</div><div><b>Texte → BPMN</b><p class="muted small" style="margin:4px 0 0">Modéliser un processus à partir d’un énoncé, sur papier, avec piscines et couloirs. Annale : 20 points.</p></div></div>
      </div>
      <div class="row" style="margin-bottom:12px"><h2 style="margin:0">Le parcours</h2><span class="spacer"></span><a class="btn sm" href="#/memo">Fiche mémo des symboles</a></div>
      <div class="levels">${cards}</div>
      <p class="small muted" style="margin-top:22px">Ta progression est enregistrée dans ce navigateur uniquement. La partie 4 du cours (UML, cas d’utilisation) n’est pas au programme de l’examen et n’est donc pas traitée ici.</p>`;
  }

  function symbolSheet() {
    const cats = [...new Set(SYMBOLS.map(s => s.cat))];
    return cats.map(c => `<h3 class="sym-cat">${esc(c)}</h3><div class="sym-grid">` +
      SYMBOLS.filter(s => s.cat === c).map(s => `<div class="sym"><div class="pic">${symSvg(s.key)}</div><div><b>${esc(s.name)}</b><span>${esc(s.desc)}</span></div></div>`).join('') +
      '</div>').join('');
  }

  function memo() {
    app.innerHTML = `<div class="lvl-head"><div class="crumb"><a href="#/">Accueil</a> / Fiche mémo</div><h1>Fiche mémo : tous les symboles</h1>
      <p class="muted">À relire juste avant l’examen. Les deux règles d’or sont en bas de page.</p></div>
      <div class="card">${symbolSheet()}
      <h3 class="sym-cat">Les deux règles d’or</h3>
      <div class="callout warn" style="margin:0"><b>R1</b> — Les messages servent à communiquer à l’extérieur d’un processus, jamais en interne.<br><b>R2</b> — Les flux de séquence ne sortent jamais d’un processus (d’une piscine).</div></div>`;
  }

  function level(num) {
    const idx = LEVELS.findIndex(l => l.num === num);
    const l = LEVELS[idx];
    if (!l) return home();
    const prev = LEVELS[idx - 1], next = LEVELS[idx + 1];
    app.innerHTML = `
      <div class="lvl-head"><div class="crumb"><a href="#/">Accueil</a> / Niveau ${l.num}</div>
        <h1>${esc(l.title)}</h1><p class="muted">${esc(l.short)}</p>
        <div class="row"><span class="pill gray">Progression : <span data-prog="${l.id}">${Math.round(levelProgress(l) * 100)} %</span></span></div></div>
      <div class="stack">
        <details class="fold" ${l.id === 'exam' ? 'open' : ''} id="lesson"><summary>📘 ${l.id === 'exam' ? 'Consignes' : 'Fiche de cours'}</summary><div class="fold-body lesson">${l.lesson}</div></details>
        <div class="acts">${l.acts.map(a => `<section class="card act" id="${a.id}"></section>`).join('')}</div>
      </div>
      <div class="row" style="margin-top:24px">
        ${prev ? `<a class="btn" href="#/niveau/${prev.num}">← Niveau ${prev.num}</a>` : '<a class="btn" href="#/">← Accueil</a>'}
        <span class="spacer"></span>
        ${next ? `<a class="btn primary" href="#/niveau/${next.num}">Niveau ${next.num} →</a>` : '<a class="btn primary" href="#/">Retour à l’accueil</a>'}
      </div>`;
    const sheet = $('#symbol-sheet');
    if (sheet) sheet.innerHTML = symbolSheet();
    if (levelProgress(l) === 0 && l.id !== 'exam') $('#lesson').open = true;
    l.acts.forEach(a => {
      const el = $('#' + a.id);
      const R = RENDERERS[a.type];
      if (R) R(el, a);
    });
    initFigures(app);
  }

  function actHead(a, typeLabel) {
    const st = store.acts[a.id];
    const best = st ? `<span class="pill ok">Meilleur : ${Math.round(st.best * 100)} %</span>` : '';
    return `<div class="act-head"><div><div class="act-type">${typeLabel}${a.level ? ' · ' + a.level : ''}</div><h3>${esc(a.title)}</h3></div><span class="spacer"></span><span class="best">${best}</span></div>`;
  }
  function updateBest(el, a) {
    const st = store.acts[a.id];
    const b = $('.best', el);
    if (b && st) b.innerHTML = `<span class="pill ok">Meilleur : ${Math.round(st.best * 100)} %</span>`;
  }

  /* ---------- QCM ---------- */
  function renderQuiz(el, a, questions, typeLabel) {
    let qs, i, score, answered;
    const start = () => {
      qs = shuffle(questions).map(q => {
        const order = shuffle(q.opts.map((_, k) => k));
        return Object.assign({}, q, { order });
      });
      i = 0; score = 0; answered = false;
      draw();
    };
    const intro = () => {
      el.innerHTML = actHead(a, typeLabel) + `<div class="act-body"><p class="muted">${questions.length} questions, ordre et réponses mélangés à chaque essai. Une explication s’affiche après chaque réponse.</p><button class="btn primary" data-go>Commencer</button></div>`;
      $('[data-go]', el).onclick = start;
    };
    const draw = () => {
      if (i >= qs.length) return finish();
      const q = qs[i];
      const hasSvg = !!q.svgOpts || !!q.svgAll;
      const optHtml = q.order.map((k, n) => {
        if (q.svgAll) return `<button class="opt svg-opt" data-k="${k}">${q.svgAll[k]}</button>`;
        const pic = q.svgOpts ? `<span class="mini-sym">${symSvg(q.svgOpts[k])}</span>` : `<span class="k">${'ABCD'[n]}</span>`;
        return `<button class="opt" data-k="${k}">${pic}<span>${esc(q.opts[k])}</span></button>`;
      }).join('');
      el.innerHTML = actHead(a, typeLabel) + `<div class="act-body">
        <div class="quiz-top"><span class="small muted">Question ${i + 1} / ${qs.length}</span><div class="bar"><i style="width:${i / qs.length * 100}%"></i></div><span class="small muted">${score} ✓</span></div>
        <div class="q-text">${esc(q.q)}</div>
        ${q.fig ? `<div class="q-fig">${q.fig}</div>` : ''}
        <div class="opts${q.svgAll ? ' grid' : ''}">${optHtml}</div>
        <div class="fb"></div></div>`;
      $$('.opt svg', el).forEach(s => { s.style.width = q.svgAll ? '' : '46px'; s.style.height = 'auto'; s.style.maxHeight = q.svgAll ? '64px' : '34px'; });
      answered = false;
      $$('.opt', el).forEach(b => b.onclick = () => {
        if (answered) return;
        answered = true;
        const k = +b.dataset.k, ok = k === q.a;
        if (ok) score++;
        $$('.opt', el).forEach(x => { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        $('.fb', el).innerHTML = `<div class="feedback ${ok ? 'ok' : 'ko'}"><b>${ok ? 'Bonne réponse !' : 'Pas tout à fait…'}</b>${esc(q.ex || '')}</div>
          <div class="row" style="margin-top:12px"><span class="spacer"></span><button class="btn primary" data-next>${i + 1 < qs.length ? 'Question suivante →' : 'Voir mon score'}</button></div>`;
        $('[data-next]', el).onclick = () => { i++; draw(); };
        $('[data-next]', el).focus({ preventScroll: true });
      });
      void hasSvg;
    };
    const finish = () => {
      const ratio = score / qs.length;
      record(a.id, ratio);
      const msg = ratio >= 0.9 ? 'Excellent, c’est acquis !' : ratio >= 0.7 ? 'Bien ! Relis la fiche pour les erreurs.' : 'Relis la fiche de cours puis recommence.';
      el.innerHTML = actHead(a, typeLabel) + `<div class="act-body result"><div class="big">${score} / ${qs.length}</div><p>${msg}</p><button class="btn primary" data-again>Recommencer</button></div>`;
      $('[data-again]', el).onclick = start;
    };
    intro();
  }

  const RENDERERS = {
    quiz: (el, a) => renderQuiz(el, a, a.questions, 'QCM'),

    symquiz: (el, a) => {
      const pool = SYMBOLS.filter(s => s.key !== 'note');
      const pickDistractors = (s, n) => {
        const same = shuffle(pool.filter(x => x.cat === s.cat && x.key !== s.key));
        const other = shuffle(pool.filter(x => x.cat !== s.cat));
        return same.concat(other).slice(0, n);
      };
      const gen = () => shuffle(pool).slice(0, a.count).map(s => {
        const opts = [s].concat(pickDistractors(s, 3));
        if (a.mode === 'name') {
          return { q: 'Quel est ce symbole ?', fig: symSvg(s.key), opts: opts.map(o => o.name), a: 0, ex: s.name + ' — ' + s.desc };
        }
        return { q: 'Quel symbole représente : « ' + s.name + ' » ?', opts: opts.map(o => o.name), svgAll: opts.map(o => symSvg(o.key)), a: 0, ex: s.desc };
      });
      // regénère un tirage à chaque démarrage
      const wrapper = Object.assign({}, a);
      let qset = gen();
      renderQuiz(el, wrapper, qset, 'Quiz symboles');
      el.addEventListener('click', e => {
        if (e.target.matches('[data-again]')) { qset.splice(0, qset.length, ...gen()); }
      }, true);
    },

    tf: (el, a) => {
      let answers = {};
      const draw = () => {
        const done = Object.keys(answers).length;
        const good = a.items.filter((it, k) => answers[k] === it[1]).length;
        el.innerHTML = actHead(a, 'Vrai / Faux') + `<div class="act-body stack">${figure(a.diagram)}
          <div class="tf-list">${a.items.map((it, k) => {
            const ans = answers[k];
            const st = ans === undefined ? '' : ans === it[1] ? 'ok' : 'ko';
            return `<div class="tf ${st}"><div><b>${k + 1}.</b> ${esc(it[0])}</div>
              ${ans === undefined ? `<div class="row"><button class="btn sm" data-k="${k}" data-v="1">Vrai</button><button class="btn sm" data-k="${k}" data-v="0">Faux</button></div>`
                : `<div class="ex">${st === 'ok' ? '✅' : '❌'} ${esc(it[2])}</div>`}</div>`;
          }).join('')}</div>
          <div class="row"><span class="muted small">${done} / ${a.items.length} répondues · ${good} juste${good > 1 ? 's' : ''}</span><span class="spacer"></span><button class="btn sm" data-reset>Recommencer</button></div></div>`;
        initFigures(el);
        $$('[data-k]', el).forEach(b => b.onclick = () => {
          answers[b.dataset.k] = b.dataset.v === '1';
          if (Object.keys(answers).length === a.items.length) {
            record(a.id, a.items.filter((it, k) => answers[k] === it[1]).length / a.items.length);
          }
          const y = window.scrollY; draw(); window.scrollTo(0, y);
        });
        $('[data-reset]', el).onclick = () => { answers = {}; draw(); };
      };
      draw();
    },

    b2t: (el, a) => {
      const draft = store.drafts[a.id] || '';
      el.innerHTML = actHead(a, 'BPMN → texte') + `<div class="act-body stack">
        <p><b>Consigne :</b> ${esc(a.consigne)}</p>
        ${figure(a.diagram, { dim: a.dim })}
        <textarea class="answer" placeholder="Écris ici ta retranscription en français…">${esc(draft)}</textarea>
        <div class="row"><span class="small muted" data-count></span><span class="spacer"></span><button class="btn primary" data-correct>Corriger</button></div>
        <div data-rubric></div></div>`;
      const ta = $('textarea', el);
      const count = () => { $('[data-count]', el).textContent = (ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0) + ' mots · brouillon enregistré'; };
      count();
      ta.addEventListener('input', () => { store.drafts[a.id] = ta.value; save(); count(); });
      $('[data-correct]', el).onclick = () => {
        const text = ta.value.toLowerCase();
        const hit = groups => groups.every(g => new RegExp(g, 'i').test(text));
        const rub = $('[data-rubric]', el);
        rub.innerHTML = `<h4>Barème : coche les points que ton texte exprime vraiment</h4>
          <p class="small muted">Indice automatique : <span style="color:var(--ok)">mots-clés repérés</span> / <span style="color:var(--warn)">non repérés</span>. C’est seulement une aide : c’est à toi de juger si l’idée est présente et juste.</p>
          <div class="rubric">${a.points.map((p, k) => {
            const f = text.length > 0 && hit(p[1]);
            return `<label class="crit${f ? ' checked' : ''}"><input type="checkbox" ${f ? 'checked' : ''} data-p="${k}"><span class="num">${k + 1}</span><span>${esc(p[0])}<span class="hint ${f ? 'found' : 'miss'}">${f ? 'Mots-clés repérés dans ton texte' : 'Mots-clés non repérés'}</span></span></label>`;
          }).join('')}</div>
          <div class="scorebox"><span class="big" data-score></span><span class="muted small">points cochés</span><span class="spacer"></span><button class="btn" data-model>Voir la proposition de correction</button><button class="btn primary" data-save>Enregistrer mon score</button></div>
          <div data-modelbox style="margin-top:12px"></div>`;
        const upd = () => {
          const n = $$('[data-p]', rub).filter(c => c.checked).length;
          $('[data-score]', rub).textContent = `${n} / ${a.points.length}`;
          $$('.crit', rub).forEach(c => c.classList.toggle('checked', $('input', c).checked));
          return n;
        };
        upd();
        $$('[data-p]', rub).forEach(c => c.onchange = upd);
        $('[data-model]', rub).onclick = () => {
          const box = $('[data-modelbox]', rub);
          box.innerHTML = box.innerHTML ? '' : `<div class="model">${a.model}</div>`;
        };
        $('[data-save]', rub).onclick = e => { record(a.id, upd() / a.points.length); updateBest(el, a); e.target.textContent = 'Score enregistré ✓'; };
        rub.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    },

    fill: (el, a) => {
      const d = DIAGRAMS[a.diagram];
      const blanks = d.nodes.filter(n => n.bl);
      const lblBank = shuffle(blanks.filter(n => n.bl === 'lbl').map(n => n.l));
      let fills = {}, marks = {}, sel = null;
      const optionsFor = n => {
        if (n.bl === 'lbl') return lblBank.map(l => ({ v: l, html: esc(l) }));
        if (n.bl === 'g') return [['x', 'Exclusive'], ['+', 'Parallèle'], ['o', 'Inclusive'], ['ev', 'Évènementielle']].map(([v, name]) => ({ v, html: BPMN.render({ cw: 60, rh: 60, nodes: [{ id: 'a', t: 'gw', g: v, c: 0, r: 0 }], edges: [] }, { nolabels: true }).svg + `<span>${name}</span>` }));
        return [['', 'Aucun (simple)'], ['message', 'Message'], ['timer', 'Timer'], ['condition', 'Condition'], ['signal', 'Signal']].map(([v, name]) => ({ v, html: BPMN.render({ cw: 60, rh: 60, nodes: [{ id: 'a', t: n.t, m: v, c: 0, r: 0 }], edges: [] }, { nolabels: true }).svg + `<span>${name}</span>` }));
      };
      const draw = () => {
        const done = blanks.filter(n => fills[n.id] !== undefined).length;
        const figHtml = figure(a.diagram, { blanks: true, fills, marks, minZoom: 0.75 });
        el.innerHTML = actHead(a, 'Logigramme à trous') + `<div class="act-body stack">
          <div class="statement">${a.text}</div>
          <p class="small muted">Clique sur une case en pointillés (activité, passerelle ou évènement), puis choisis le bon élément dans la liste qui apparaît sous le schéma.</p>
          ${figHtml.replace('class="fig"', 'class="fig" data-fill')}
          <div data-picker></div>
          <div class="row"><span class="small muted">${done} / ${blanks.length} cases remplies</span><span class="spacer"></span>
            <button class="btn sm" data-sol>Voir la solution</button><button class="btn sm" data-reset>Réinitialiser</button><button class="btn primary sm" data-check>Vérifier</button></div>
          <div data-res></div></div>`;
        initFigures(el);
        if (sel) { const g = $(`.blank[data-id="${sel}"]`, el); if (g) g.classList.add('sel'); }
        $$('.blank', el).forEach(g => g.addEventListener('click', () => { sel = g.dataset.id; keepScroll(draw); showPicker(); }));
        $('[data-reset]', el).onclick = () => { fills = {}; marks = {}; sel = null; draw(); };
        $('[data-sol]', el).onclick = () => { blanks.forEach(n => { fills[n.id] = n.bl === 'lbl' ? n.l : n.bl === 'g' ? n.g : (n.m || ''); }); marks = {}; sel = null; draw(); };
        $('[data-check]', el).onclick = () => {
          let good = 0;
          blanks.forEach(n => {
            const ans = n.bl === 'lbl' ? n.l : n.bl === 'g' ? n.g : (n.m || '');
            const ok = fills[n.id] === ans;
            marks[n.id] = fills[n.id] === undefined ? '' : ok ? 'ok' : 'ko';
            if (ok) good++;
          });
          record(a.id, good / blanks.length);
          sel = null;
          keepScroll(draw);
          $('[data-res]', el).innerHTML = `<div class="feedback ${good === blanks.length ? 'ok' : 'ko'}"><b>${good} / ${blanks.length} cases justes</b>${good === blanks.length ? 'Parfait ! Tu peux passer à l’exercice suivant.' : 'Les cases en rouge sont fausses, corrige-les et revérifie.'}</div>`;
          updateBest(el, a);
        };
        if (sel) showPicker();
      };
      const showPicker = () => {
        const n = blanks.find(b => b.id === sel);
        if (!n) return;
        const used = new Set(Object.entries(fills).filter(([id]) => id !== sel).map(([, v]) => v));
        const kind = n.bl === 'lbl' ? 'le libellé de l’activité' : n.bl === 'g' ? 'le type de passerelle' : 'le type d’évènement';
        $('[data-picker]', el).innerHTML = `<div class="picker"><div class="row" style="margin-bottom:8px"><b>Choisis ${kind}</b><span class="spacer"></span><button class="btn sm ghost" data-close>Fermer</button></div>
          <div class="opts">${optionsFor(n).map(o => `<button class="opt${n.bl !== 'lbl' ? ' svg-opt' : ''}${n.bl === 'lbl' && used.has(o.v) ? ' used' : ''}" data-v="${esc(o.v)}">${o.html}</button>`).join('')}</div></div>`;
        $$('.picker svg', el).forEach(s => { s.style.width = '44px'; s.style.height = 'auto'; });
        $('[data-close]', el).onclick = () => { sel = null; keepScroll(draw); };
        $$('.picker .opt', el).forEach(b => b.onclick = () => {
          fills[sel] = b.dataset.v; delete marks[sel];
          const idx = blanks.findIndex(x => x.id === sel);
          const nextEmpty = blanks.slice(idx + 1).concat(blanks.slice(0, idx)).find(x => fills[x.id] === undefined);
          sel = nextEmpty ? nextEmpty.id : null;
          keepScroll(draw);
        });
      };
      draw();
    },

    t2b: (el, a) => {
      let stepAns = {};
      el.innerHTML = actHead(a, 'Texte → BPMN') + `<div class="act-body">
        <div class="statement">${a.text}</div>
        <div class="step-h"><span class="n">1</span><h4>Analyse guidée : choisis les bons éléments</h4></div>
        <div data-steps></div>
        <div class="step-h"><span class="n">2</span><h4>Dessine le logigramme sur une feuille</h4></div>
        <p class="muted">Comme à l’examen : crayon, gomme, règle. Commence par les piscines/couloirs et le chemin parfait, puis ajoute les exceptions. Prends ton temps, puis passe à la correction.</p>
        <div class="step-h"><span class="n">3</span><h4>Correction et auto-évaluation</h4></div>
        <button class="btn primary" data-show>Afficher la correction</button>
        <div data-sol></div></div>`;
      const stepsBox = $('[data-steps]', el);
      const drawSteps = () => {
        stepsBox.innerHTML = a.steps.map((q, k) => {
          const ans = stepAns[k];
          const order = q._order || (q._order = shuffle(q.opts.map((_, j) => j)));
          return `<div class="mini-q"><div class="q-text">${k + 1}. ${esc(q.q)}</div><div class="opts">${order.map(j => {
            const cls = ans === undefined ? '' : j === q.a ? ' right' : j === ans ? ' wrong' : '';
            const pic = q.svgOpts ? `<span class="mini-sym">${symSvg(q.svgOpts[j])}</span>` : '';
            return `<button class="opt${cls}" data-s="${k}" data-j="${j}" ${ans !== undefined ? 'disabled' : ''}>${pic}<span>${esc(q.opts[j])}</span></button>`;
          }).join('')}</div>${ans !== undefined ? `<div class="feedback ${ans === q.a ? 'ok' : 'ko'}">${esc(q.ex)}</div>` : ''}</div>`;
        }).join('');
        $$('.mini-q .opt svg', stepsBox).forEach(s => { s.style.width = '40px'; s.style.height = 'auto'; s.style.maxHeight = '30px'; });
        $$('[data-s]', stepsBox).forEach(b => b.onclick = () => { stepAns[b.dataset.s] = +b.dataset.j; keepScroll(drawSteps); });
      };
      drawSteps();
      $('[data-show]', el).onclick = e => {
        e.target.remove();
        const sol = $('[data-sol]', el);
        sol.innerHTML = `<p class="muted small">Proposition de correction (d’autres modélisations peuvent être justes si elles expriment tout le texte sans rien ajouter).${a.diagrams.length > 1 ? ' Le diagramme est découpé en deux parties reliées par un évènement de lien « Vers préparation ».' : ''}</p>
          <div class="stack">${a.diagrams.map(k => figure(k)).join('')}</div>
          <h4 style="margin-top:18px">Barème : coche ce que ton dessin contient correctement</h4>
          <div class="rubric">${a.checklist.map((c, k) => `<label class="crit"><input type="checkbox" data-c="${k}"><span class="num">${k + 1}</span><span>${esc(c)}</span></label>`).join('')}</div>
          <div class="scorebox"><span class="big" data-score>0 / ${a.checklist.length}</span><span class="muted small">points</span><span class="spacer"></span><button class="btn primary" data-save>Enregistrer mon score</button></div>`;
        initFigures(sol);
        const upd = () => {
          const n = $$('[data-c]', sol).filter(c => c.checked).length;
          $('[data-score]', sol).textContent = `${n} / ${a.checklist.length}`;
          $$('.crit', sol).forEach(c => c.classList.toggle('checked', $('input', c).checked));
          return n;
        };
        $$('[data-c]', sol).forEach(c => c.onchange = upd);
        $('[data-save]', sol).onclick = ev => { record(a.id, upd() / a.checklist.length); updateBest(el, a); ev.target.textContent = 'Score enregistré ✓'; };
      };
    },

    timer: (el, a) => {
      let remaining = a.minutes * 60, running = false, handle = null;
      el.innerHTML = `<div class="act-head"><div><div class="act-type">Conditions d’examen</div><h3>${esc(a.title)}</h3></div><span class="spacer"></span>
        <span class="timer" style="font-size:1.8rem" data-t></span></div>
        <div class="row" style="margin-top:10px"><button class="btn primary" data-go>Démarrer</button><button class="btn" data-reset>Réinitialiser</button>
        <span class="small muted">Conseil : ~40 min pour l’exercice 1, ~80 min pour l’exercice 2.</span></div>`;
      const show = () => {
        const m = Math.floor(remaining / 60), s = remaining % 60;
        $('[data-t]', el).textContent = `${String(Math.floor(m / 60))}:${String(m % 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        $('[data-t]', el).style.color = remaining <= 600 ? 'var(--ko)' : '';
      };
      show();
      const go = $('[data-go]', el);
      go.onclick = () => {
        running = !running;
        go.textContent = running ? 'Pause' : 'Reprendre';
        if (running) handle = setInterval(() => { if (remaining > 0) { remaining--; show(); } else { clearInterval(handle); go.textContent = 'Terminé'; } }, 1000);
        else clearInterval(handle);
      };
      $('[data-reset]', el).onclick = () => { clearInterval(handle); running = false; remaining = a.minutes * 60; go.textContent = 'Démarrer'; show(); };
      window.addEventListener('hashchange', () => clearInterval(handle), { once: true });
    }
  };

  function keepScroll(fn) { const y = window.scrollY; fn(); window.scrollTo(0, y); }

  function refreshProgress() {
    LEVELS.forEach(l => {
      const p = levelProgress(l);
      $$(`[data-prog="${l.id}"]`).forEach(x => x.textContent = Math.round(p * 100) + ' %');
      $$(`[data-bar="${l.id}"]`).forEach(x => x.style.width = p * 100 + '%');
    });
  }

  /* ---------- Routeur ---------- */
  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const m = h.match(/^niveau\/(\d+)/);
    $$('.topnav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + h || (h === '' && a.getAttribute('href') === '#/')));
    if (m) level(+m[1]);
    else if (h === 'memo') memo();
    else home();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
