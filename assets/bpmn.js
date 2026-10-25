/* Mini moteur de rendu BPMN en SVG.
   Un diagramme = { cw, rh, pools, nodes, edges, hl }
   Les positions sont exprimées en "grille" : c = colonne, r = ligne (décimales autorisées). */
(function () {
  const EV = 18, GW = 25, TW = 110, TH = 64;
  let uid = 0;

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function wrap(text, max) {
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let cur = '';
    for (const w of words) {
      if (!cur) cur = w;
      else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
      else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // Bloc de texte multi-lignes. valign : 'middle' | 'top' | 'bottom'
  function txt(x, y, text, o = {}) {
    if (!text) return '';
    const lh = o.lh || 13;
    const lines = wrap(text, o.max || 16);
    let top = y - (lines.length - 1) * lh / 2;
    if (o.valign === 'top') top = y;
    if (o.valign === 'bottom') top = y - (lines.length - 1) * lh;
    return `<text class="${o.cls || 'lbl'}" x="${x}" y="${top}" text-anchor="${o.anchor || 'middle'}" dominant-baseline="middle">` +
      lines.map((l, i) => `<tspan x="${x}" y="${top + i * lh}">${esc(l)}</tspan>`).join('') + '</text>';
  }

  /* ---------- Pictogrammes ---------- */
  function envelope(x, y, w, h, filled) {
    const l = x - w / 2, t = y - h / 2;
    return `<rect x="${l}" y="${t}" width="${w}" height="${h}" class="${filled ? 'ico-fill' : 'ico'}"/>` +
      `<polyline points="${l},${t} ${x},${y + 1} ${l + w},${t}" class="${filled ? 'ico-inv' : 'ico'}" fill="none"/>`;
  }

  function evMarker(m, x, y, filled) {
    switch (m) {
      case 'message': return envelope(x, y, 17, 12, filled);
      case 'timer': {
        let s = `<circle cx="${x}" cy="${y}" r="10.5" class="ico"/>`;
        for (let i = 0; i < 12; i++) {
          const a = i * Math.PI / 6, r1 = 8, r2 = 10.5;
          s += `<line x1="${x + r1 * Math.cos(a)}" y1="${y + r1 * Math.sin(a)}" x2="${x + r2 * Math.cos(a)}" y2="${y + r2 * Math.sin(a)}" class="ico-thin"/>`;
        }
        return s + `<polyline points="${x},${y - 6.5} ${x},${y} ${x + 4.5},${y + 2}" class="ico" fill="none"/>`;
      }
      case 'condition':
        return `<rect x="${x - 6.5}" y="${y - 8.5}" width="13" height="17" class="ico"/>` +
          [-4.5, -1.5, 1.5, 4.5].map(d => `<line x1="${x - 4}" y1="${y + d}" x2="${x + 4}" y2="${y + d}" class="ico-thin"/>`).join('');
      case 'signal':
        return `<polygon points="${x},${y - 9} ${x + 8.5},${y + 6} ${x - 8.5},${y + 6}" class="${filled ? 'ico-fill' : 'ico'}"/>`;
      case 'link':
        return `<polygon points="${x - 7},${y - 3.5} ${x + 1},${y - 3.5} ${x + 1},${y - 8} ${x + 8.5},${y} ${x + 1},${y + 8} ${x + 1},${y + 3.5} ${x - 7},${y + 3.5}" class="${filled ? 'ico-fill' : 'ico'}"/>`;
      default: return '';
    }
  }

  function taskIcon(k, x, y) {
    switch (k) {
      case 'user':
        return `<circle cx="${x + 8}" cy="${y + 5}" r="3.6" class="ico"/><path d="M${x + 1.5} ${y + 16} Q${x + 1.5} ${y + 9.5} ${x + 8} ${y + 9.5} Q${x + 14.5} ${y + 9.5} ${x + 14.5} ${y + 16} Z" class="ico"/>`;
      case 'manual':
        return `<path d="M${x + 1} ${y + 8} L${x + 6} ${y + 3.5} L${x + 7.5} ${y + 5} L${x + 6} ${y + 7} L${x + 15} ${y + 7} M${x + 9} ${y + 9.5} L${x + 15} ${y + 9.5} M${x + 9} ${y + 12} L${x + 14} ${y + 12} M${x + 8} ${y + 14.5} L${x + 12} ${y + 14.5} M${x + 1} ${y + 8} L${x + 1} ${y + 14.5} L${x + 8} ${y + 14.5}" class="ico" fill="none"/>`;
      case 'service': {
        const cx = x + 8, cy = y + 9;
        let s = '';
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4;
          s += `<line x1="${cx + 4.5 * Math.cos(a)}" y1="${cy + 4.5 * Math.sin(a)}" x2="${cx + 7.5 * Math.cos(a)}" y2="${cy + 7.5 * Math.sin(a)}" class="ico-bold"/>`;
        }
        return s + `<circle cx="${cx}" cy="${cy}" r="4.8" class="ico"/><circle cx="${cx}" cy="${cy}" r="1.8" class="ico"/>`;
      }
      case 'send': return envelope(x + 8.5, y + 8, 16, 11, true);
      case 'receive': return envelope(x + 8.5, y + 8, 16, 11, false);
      case 'rule':
        return `<rect x="${x + 1}" y="${y + 2}" width="16" height="13" class="ico"/><rect x="${x + 1}" y="${y + 2}" width="16" height="3.5" class="ico-fill"/>` +
          `<line x1="${x + 1}" y1="${y + 10}" x2="${x + 17}" y2="${y + 10}" class="ico-thin"/><line x1="${x + 6}" y1="${y + 5.5}" x2="${x + 6}" y2="${y + 15}" class="ico-thin"/>`;
      default: return '';
    }
  }

  function bottomMarkers(n) {
    const ms = [];
    if (n.loop) ms.push('loop');
    if (n.multi) ms.push(n.multi);
    if (n.t === 'sub') ms.push('sub');
    if (!ms.length) return '';
    const size = 13, gap = 4, total = ms.length * size + (ms.length - 1) * gap;
    let x = n.x - total / 2;
    const y = n.y + n.h / 2 - size - 3;
    let s = '';
    for (const m of ms) {
      const cx = x + size / 2, cy = y + size / 2;
      if (m === 'sub') s += `<rect x="${x}" y="${y}" width="${size}" height="${size}" class="ico"/><line x1="${cx}" y1="${y + 3}" x2="${cx}" y2="${y + size - 3}" class="ico-bold"/><line x1="${x + 3}" y1="${cy}" x2="${x + size - 3}" y2="${cy}" class="ico-bold"/>`;
      if (m === 'loop') s += `<path d="M${cx - 3} ${cy + 5} A5.5 5.5 0 1 1 ${cx + 4} ${cy + 4}" class="ico" fill="none"/><polyline points="${cx - 6},${cy + 3} ${cx - 3},${cy + 5.5} ${cx - 1},${cy + 2}" class="ico" fill="none"/>`;
      if (m === 'par') s += [-4, 0, 4].map(d => `<line x1="${cx + d}" y1="${y + 1}" x2="${cx + d}" y2="${y + size - 1}" class="ico-bold"/>`).join('');
      if (m === 'seq') s += [-4, 0, 4].map(d => `<line x1="${x + 1}" y1="${cy + d}" x2="${x + size - 1}" y2="${cy + d}" class="ico-bold"/>`).join('');
      x += size + gap;
    }
    return s;
  }

  function gwMarker(g, x, y) {
    switch (g) {
      case 'x': return `<path d="M${x - 7.5} ${y - 7.5} L${x + 7.5} ${y + 7.5} M${x + 7.5} ${y - 7.5} L${x - 7.5} ${y + 7.5}" class="gw-mark"/>`;
      case '+': return `<path d="M${x} ${y - 10} L${x} ${y + 10} M${x - 10} ${y} L${x + 10} ${y}" class="gw-mark"/>`;
      case 'o': return `<circle cx="${x}" cy="${y}" r="10" class="gw-mark" fill="none"/>`;
      case 'ev': {
        let pts = [];
        for (let i = 0; i < 5; i++) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
          pts.push(`${x + 6.5 * Math.cos(a)},${y + 6.5 * Math.sin(a)}`);
        }
        return `<circle cx="${x}" cy="${y}" r="13" class="ico" fill="none"/><circle cx="${x}" cy="${y}" r="10.5" class="ico" fill="none"/><polygon points="${pts.join(' ')}" class="ico"/>`;
      }
      default: return '';
    }
  }

  /* ---------- Géométrie ---------- */
  function isEvent(n) { return n.t === 'start' || n.t === 'end' || n.t === 'inter'; }

  function clip(n, toward) {
    // point d'intersection entre le contour du nœud et le segment centre -> toward
    const dx = toward.x - n.x, dy = toward.y - n.y;
    if (!dx && !dy) return { x: n.x, y: n.y };
    if (isEvent(n)) {
      const d = Math.hypot(dx, dy);
      return { x: n.x + dx / d * EV, y: n.y + dy / d * EV };
    }
    if (n.t === 'gw') {
      const t = GW / (Math.abs(dx) + Math.abs(dy));
      return { x: n.x + dx * t, y: n.y + dy * t };
    }
    if (n.t === 'note') return { x: n.x, y: n.y };
    const t = Math.min(n.w / 2 / Math.abs(dx || 1e-9), n.h / 2 / Math.abs(dy || 1e-9));
    return { x: n.x + dx * t, y: n.y + dy * t };
  }

  function nodeBox(n, o) {
    const lab = n.l && !o.nolabels;
    if (isEvent(n) && !lab) return [n.x - EV - 2, n.y - EV - 2, n.x + EV + 2, n.y + EV + 2];
    if (n.t === 'gw' && !lab) return [n.x - GW - 2, n.y - GW - 2, n.x + GW + 2, n.y + GW + 2];
    if (isEvent(n)) return [n.x - EV - (n.lpos === 'left' ? 100 : 50), n.y - EV - (n.lpos === 'above' ? 40 : 0), n.x + EV + (n.lpos === 'right' ? 100 : 50), n.y + EV + 40];
    if (n.t === 'gw') return [n.x - GW - 30, n.y - GW - 40, n.x + GW + 30, n.y + GW + 30];
    if (n.t === 'note') return [n.x - 4, n.y - n.h / 2, n.x + n.w, n.y + n.h / 2];
    if (n.t === 'none') return [n.x - 50, n.y - 12, n.x + 50, n.y + 12];
    return [n.x - n.w / 2, n.y - n.h / 2, n.x + n.w / 2, n.y + n.h / 2];
  }

  /* ---------- Rendu d'un nœud ---------- */
  function renderNode(n, o) {
    if (n.t === 'none') return '';
    const blank = o.blanks && n.bl;
    const fill = blank ? (o.fills || {})[n.id] : undefined;
    const mark = blank ? (o.marks || {})[n.id] : '';
    let v = n;
    if (blank) {
      v = Object.assign({}, n);
      if (n.bl === 'lbl') v.l = fill;
      if (n.bl === 'g') v.g = fill === undefined ? '?' : fill;
      if (n.bl === 'm') v.m = fill === undefined ? '?' : fill;
    }
    const cls = ['node', 'n-' + n.t];
    if (n.hl || (o.hl && o.hl.includes(n.id))) cls.push('hl');
    if (blank) cls.push('blank', fill === undefined ? 'empty' : 'filled', mark || '');
    let s = `<g class="${cls.join(' ')}" data-id="${n.id}">`;
    const qm = (x, y) => `<text class="qmark" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">?</text>`;

    if (isEvent(n)) {
      const ni = n.ni ? ' ni' : '';
      if (n.t === 'start') s += `<circle cx="${n.x}" cy="${n.y}" r="${EV}" class="ev-start${ni}"/>`;
      if (n.t === 'end') s += `<circle cx="${n.x}" cy="${n.y}" r="${EV}" class="ev-end"/>`;
      if (n.t === 'inter') s += `<circle cx="${n.x}" cy="${n.y}" r="${EV}" class="ev-inter${ni}"/><circle cx="${n.x}" cy="${n.y}" r="${EV - 3.5}" class="ev-inter-in${ni}"/>`;
      const filled = n.t === 'end' || !!n.throw;
      s += v.m === '?' ? qm(n.x, n.y) : evMarker(v.m, n.x, n.y, filled);
      if (n.l && !o.nolabels) s += evLabel(n);
    } else if (n.t === 'gw') {
      s += `<polygon points="${n.x},${n.y - GW} ${n.x + GW},${n.y} ${n.x},${n.y + GW} ${n.x - GW},${n.y}" class="gw"/>`;
      s += v.g === '?' ? qm(n.x, n.y) : gwMarker(v.g, n.x, n.y);
      if (n.l && !o.nolabels) s += gwLabel(n);
    } else if (n.t === 'note') {
      s += `<path d="M${n.x + 12} ${n.y - n.h / 2} L${n.x} ${n.y - n.h / 2} L${n.x} ${n.y + n.h / 2} L${n.x + 12} ${n.y + n.h / 2}" class="note"/>`;
      s += txt(n.x + 7, n.y, n.l, { max: n.max, anchor: 'start', cls: 'lbl note-txt' });
    } else {
      s += `<rect x="${n.x - n.w / 2}" y="${n.y - n.h / 2}" width="${n.w}" height="${n.h}" rx="9" class="task${n.t === 'sub' ? ' sub' : ''}"/>`;
      if (n.k) s += taskIcon(n.k, n.x - n.w / 2 + 5, n.y - n.h / 2 + 4);
      s += bottomMarkers(n);
      const hasBottom = n.t === 'sub' || n.loop || n.multi;
      if (blank && fill === undefined) s += qm(n.x, n.y - (hasBottom ? 6 : 0));
      else if (!o.nolabels) s += txt(n.x, n.y - (hasBottom ? 7 : 0) + (n.k ? 5 : 0), v.l, { max: n.max });
    }
    return s + '</g>';
  }

  function evLabel(n) {
    const p = n.lpos || 'below';
    if (p === 'above') return txt(n.x, n.y - EV - 9, n.l, { max: 18, valign: 'bottom', cls: 'lbl small' });
    if (p === 'right') return txt(n.x + EV + 6, n.y, n.l, { max: 16, anchor: 'start', cls: 'lbl small' });
    if (p === 'left') return txt(n.x - EV - 6, n.y, n.l, { max: 16, anchor: 'end', cls: 'lbl small' });
    return txt(n.x, n.y + EV + 11, n.l, { max: 18, valign: 'top', cls: 'lbl small' });
  }

  function gwLabel(n) {
    const p = n.lpos || 'above';
    if (p === 'below') return txt(n.x, n.y + GW + 11, n.l, { max: 18, valign: 'top', cls: 'lbl small' });
    if (p === 'left') return txt(n.x - GW - 4, n.y - 14, n.l, { max: 14, anchor: 'end', valign: 'bottom', cls: 'lbl small' });
    if (p === 'right') return txt(n.x + GW + 4, n.y - 14, n.l, { max: 14, anchor: 'start', valign: 'bottom', cls: 'lbl small' });
    return txt(n.x, n.y - GW - 9, n.l, { max: 20, valign: 'bottom', cls: 'lbl small' });
  }

  /* ---------- Rendu complet ---------- */
  function render(def, o = {}) {
    const id = 'd' + (++uid);
    const cw = def.cw || 125, rh = def.rh || 100;
    const N = {};
    const nodes = def.nodes.map(n => Object.assign({}, n));
    for (const n of nodes) {
      if (n.t === 'task' || n.t === 'sub') {
        n.w = n.w || TW;
        n.max = n.max || (n.k ? 15 : 16);
        const lines = n.l ? wrap(n.l, n.max).length : 1;
        const need = lines * 13 + (n.k ? 24 : 18) + ((n.t === 'sub' || n.loop || n.multi) ? 14 : 0);
        n.h = Math.max(n.h || TH, need);
      }
      if (!n.on) { n.x = n.c * cw; n.y = n.r * rh; }
      if (n.t === 'note') {
        n.max = n.max || 30;
        n.h = wrap(n.l, n.max).length * 13 + 10;
        n.w = n.w || n.max * 6.2;
      }
      N[n.id] = n;
    }
    for (const n of nodes) {
      if (n.on) {
        const h = N[n.on];
        n.x = h.x + (n.off || 0);
        n.y = n.side === 't' ? h.y - h.h / 2 : h.y + h.h / 2;
      }
    }

    // Boîte englobante des nœuds
    let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
    for (const n of nodes) {
      const b = nodeBox(n, o);
      bx0 = Math.min(bx0, b[0]); by0 = Math.min(by0, b[1]); bx1 = Math.max(bx1, b[2]); by1 = Math.max(by1, b[3]);
    }
    const pools = (def.pools || []).map(p => Object.assign({}, p));
    const hasLanes = pools.some(p => p.lanes && p.lanes.length);
    const px0 = bx0 - (hasLanes ? 70 : 45), px1 = bx1 + 25;
    const P = {};
    for (const p of pools) {
      p.x = px0; p.w = px1 - px0; p.y = p.top * rh; p.h = (p.bot - p.top) * rh;
      P[p.id] = p;
      bx0 = Math.min(bx0, p.x); by0 = Math.min(by0, p.y); bx1 = Math.max(bx1, p.x + p.w); by1 = Math.max(by1, p.y + p.h);
    }

    let out = '';
    // Piscines & couloirs
    for (const p of pools) {
      out += `<g class="pool${p.black ? ' black' : ''}">`;
      out += `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" class="pool-r"/>`;
      if (p.black) {
        out += `<text class="pool-lbl" x="${p.w > 700 ? p.x + 60 : p.x + p.w / 2}" y="${p.y + p.h / 2}" text-anchor="${p.w > 700 ? 'start' : 'middle'}" dominant-baseline="middle">${esc(p.l)}</text>`;
      } else {
        out += `<rect x="${p.x}" y="${p.y}" width="26" height="${p.h}" class="pool-head"/>`;
        out += `<text class="pool-lbl" transform="translate(${p.x + 14} ${p.y + p.h / 2}) rotate(-90)" text-anchor="middle" dominant-baseline="middle">${esc(p.l)}</text>`;
        for (const ln of (p.lanes || [])) {
          const y = ln.top * rh, h = (ln.bot - ln.top) * rh;
          out += `<rect x="${p.x + 26}" y="${y}" width="${p.w - 26}" height="${h}" class="lane-r"/>`;
          out += `<rect x="${p.x + 26}" y="${y}" width="24" height="${h}" class="lane-head"/>`;
          out += `<text class="lane-lbl" transform="translate(${p.x + 39} ${y + h / 2}) rotate(-90)" text-anchor="middle" dominant-baseline="middle">${esc(ln.l)}</text>`;
        }
      }
      out += '</g>';
    }

    // Flux
    const g = v => ({ x: v[0] * cw, y: v[1] * rh });
    let edgesSvg = '', labelsSvg = '';
    for (const e of def.edges) {
      const [from, to, eo = {}] = e;
      const k = eo.k || 's';
      const A = N[from], B = N[to];
      let pts;
      if (k === 'm') {
        // flux de message (vertical vers / depuis une piscine boîte noire)
        if (P[to] || P[from]) {
          const n = A || B, pool = P[to] || P[from];
          const x = n.x + (eo.dx || 0);
          const poolAbove = pool.y < n.y;
          const ny = poolAbove ? n.y - (isEvent(n) ? EV : n.t === 'gw' ? GW : n.h / 2) : n.y + (isEvent(n) ? EV : n.t === 'gw' ? GW : n.h / 2);
          const py = poolAbove ? pool.y + pool.h : pool.y;
          const nyy = isEvent(n) && eo.dx ? ny : ny;
          pts = A ? [{ x, y: nyy }, { x, y: py }] : [{ x, y: py }, { x, y: nyy }];
        } else {
          pts = [A, ...(eo.via || []).map(g), B].map(p => ({ x: p.x, y: p.y }));
          pts[0] = clip(A, pts[1]); pts[pts.length - 1] = clip(B, pts[pts.length - 2]);
        }
      } else if (k === 'a') {
        const a = A.t === 'note' ? { x: A.x, y: A.y } : clip(A, B);
        const b = B.t === 'note' ? { x: B.x, y: B.y } : clip(B, A);
        pts = [a, b];
      } else {
        let via;
        if (eo.via) via = eo.via.map(g);
        else if (A.x === B.x || A.y === B.y) via = [];
        else {
          let route = eo.route;
          if (!route) route = B.t === 'gw' ? 'h' : (A.t === 'gw' || A.on) ? 'v' : 'm';
          if (route === 'h') via = [{ x: B.x, y: A.y }];
          else if (route === 'v') via = [{ x: A.x, y: B.y }];
          else { const mx = (A.x + B.x) / 2; via = [{ x: mx, y: A.y }, { x: mx, y: B.y }]; }
        }
        pts = [{ x: A.x, y: A.y }, ...via, { x: B.x, y: B.y }];
        pts[0] = clip(A, pts[1]);
        pts[pts.length - 1] = clip(B, pts[pts.length - 2]);
      }
      for (const p of pts) { bx0 = Math.min(bx0, p.x - 10); by0 = Math.min(by0, p.y - 10); bx1 = Math.max(bx1, p.x + 10); by1 = Math.max(by1, p.y + 10); }
      const hl = eo.hl || (o.hl && o.hl.includes(from) && o.hl.includes(to)) || (A && B && A.hl && B.hl);
      const d = 'M' + pts.map(p => `${round(p.x)} ${round(p.y)}`).join(' L');
      const ecls = (k === 'm' ? 'flow-m' : k === 'a' ? 'flow-a' : 'flow-s') + (hl ? ' hl' : '');
      const mk = k === 'm' ? `marker-start="url(#${id}-mc)" marker-end="url(#${id}-mo)"` : k === 'a' ? '' : `marker-end="url(#${id}-ar)"`;
      edgesSvg += `<path d="${d}" class="${ecls}" ${mk} fill="none"/>`;
      // chemin par défaut
      const p0 = pts[0], p1 = pts[1];
      const horiz = Math.abs(p1.y - p0.y) < 0.5;
      const dir = horiz ? Math.sign(p1.x - p0.x) : Math.sign(p1.y - p0.y);
      if (eo.d) {
        const cx = horiz ? p0.x + dir * 11 : p0.x, cy = horiz ? p0.y : p0.y + dir * 11;
        edgesSvg += `<line x1="${cx - 5}" y1="${cy + 5}" x2="${cx + 5}" y2="${cy - 5}" class="flow-s${hl ? ' hl' : ''}"/>`;
      }
      if (eo.l && !o.nolabels) {
        let lx, ly, anchor;
        if (horiz) { lx = p0.x + dir * 7; ly = p0.y - 9; anchor = dir > 0 ? 'start' : 'end'; }
        else { lx = p0.x + 6; ly = p0.y + dir * 14; anchor = 'start'; }
        if (eo.lp) { lx += eo.lp[0]; ly += eo.lp[1]; }
        if (eo.la) anchor = eo.la;
        labelsSvg += txt(lx, ly, eo.l, { anchor, max: eo.max || 18, cls: 'lbl elbl' + (hl ? ' hl' : ''), valign: horiz ? 'bottom' : 'top' });
      }
    }

    const nodesSvg = nodes.filter(n => !n.on).map(n => renderNode(n, o)).join('') + nodes.filter(n => n.on).map(n => renderNode(n, o)).join('');

    const pad = o.nolabels ? 4 : 14;
    const vx = bx0 - pad, vy = by0 - pad, vw = bx1 - bx0 + 2 * pad, vh = by1 - by0 + 2 * pad;
    const defs = `<defs>
      <marker id="${id}-ar" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0 L10 5 L0 10 Z" class="mk-fill"/></marker>
      <marker id="${id}-mo" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" orient="auto" markerUnits="userSpaceOnUse"><path d="M0.5 0.5 L9.5 5 L0.5 9.5 Z" class="mk-open"/></marker>
      <marker id="${id}-mc" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto" markerUnits="userSpaceOnUse"><circle cx="5" cy="5" r="4" class="mk-open"/></marker>
    </defs>`;
    return {
      svg: `<svg class="bpmn" xmlns="http://www.w3.org/2000/svg" viewBox="${round(vx)} ${round(vy)} ${round(vw)} ${round(vh)}" width="${round(vw)}" height="${round(vh)}" role="img">${defs}${out}<g class="edges">${edgesSvg}</g>${nodesSvg}<g class="elabels">${labelsSvg}</g></svg>`,
      width: vw, height: vh
    };
  }

  const round = v => Math.round(v * 10) / 10;

  window.BPMN = { render, wrap };
})();
