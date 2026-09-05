// demo.js — demonstration pane for the PDF Marker portfolio embed.
//
// Standalone. Knows nothing about app.js, the settings form, or the DOM
// outside its mount element. app.js drives it through the returned
// controller; nothing here reaches back out.
//
// The OCR stage is precomputed (see export_demo_data.py). Clustering and
// keyword matching run live here, so leniency and keyword can be anything
// the visitor types.
//
// Data files are consumed exactly as export_demo_data.py writes them:
// pixel coordinates in the rendered page's own space, with image,
// image_width and image_height carried per set. The SVG viewBox is set
// to those dimensions, so no normalisation step is needed.

(function (global) {
  'use strict';

  // ---------------------------------------------------------------
  // Paragraph reconstruction.
  // Port of group_snippets_into_paragraphs() in paddleOCR_reader.py /
  // tesseractOCR_reader.py. Structure matters: this is seed-and-grow,
  // and a candidate is tested against EVERY member of the paragraph,
  // not against the paragraph's bounding box. Testing the bbox gives
  // different — wrong — grouping.
  // ---------------------------------------------------------------
  let T = { SAME_LINE: 0.7, HORIZONTAL: 1.4, VERTICAL: 2.8, OVERLAP: 0.5, SIZE_RATIO: 2 };

  function avgLh(a, b) { return (a.lh + b.lh) / 2; }

  function isSameLine(a, b, k) {
    return Math.abs(a.cy - b.cy) < avgLh(a, b) * T.SAME_LINE * k;
  }
  function nearHorizontal(a, b, k) {
    let gap = Math.max(a.l, b.l) - Math.min(a.r, b.r);
    return gap < avgLh(a, b) * T.HORIZONTAL * k;
  }
  function nearVertical(a, b, k) {
    return Math.abs(a.cy - b.cy) < avgLh(a, b) * T.VERTICAL * k;
  }
  function overlapHorizontal(a, b) {
    let nl, nr, wl, wr;
    if ((a.r - a.l) < (b.r - b.l)) { nl = a.l; nr = a.r; wl = b.l; wr = b.r; }
    else { nl = b.l; nr = b.r; wl = a.l; wr = a.r; }
    let ol = Math.max(nl, wl), or_ = Math.min(nr, wr);
    if (or_ <= ol) return false;
    return (or_ - ol) >= T.OVERLAP * (nr - nl);
  }

  function inSameParagraph(a, b, k) {
    let h1 = a.lh, h2 = b.lh;
    if (h1 === 0 || h2 === 0) return false;
    // Guard: never weld a drop cap or heading onto body text.
    if (Math.max(h1, h2) / Math.min(h1, h2) > T.SIZE_RATIO) return false;
    if (isSameLine(a, b, k) && nearHorizontal(a, b, k)) return true;
    if (nearVertical(a, b, k) && overlapHorizontal(a, b)) return true;
    return false;
  }

  function groupIntoParagraphs(snippets, k) {
    let unselected = snippets.slice().sort(function (p, q) {
      return p.t - q.t || p.l - q.l;
    });
    let paragraphs = [];

    while (unselected.length) {
      let members = [unselected.shift()];
      let added = true;
      while (added) {
        added = false;
        for (let i = unselected.length - 1; i >= 0; i--) {
          let cand = unselected[i];
          let fits = false;
          for (let m = 0; m < members.length; m++) {
            if (inSameParagraph(cand, members[m], k)) { fits = true; break; }
          }
          if (fits) { members.push(cand); unselected.splice(i, 1); added = true; }
        }
      }
      paragraphs.push(buildParagraph(members));
    }
    return paragraphs;
  }

  // Port of read_paragraph._recalc(). The sort before joining is load
  // bearing: the keyword matcher consumes tokens in order, so text
  // assembled in merge order rather than reading order fails to match
  // paragraphs that are in fact correct.
  function buildParagraph(members) {
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    for (let i = 0; i < members.length; i++) {
      let s = members[i];
      if (s.l < l) l = s.l;
      if (s.t < t) t = s.t;
      if (s.r > r) r = s.r;
      if (s.b > b) b = s.b;
    }
    let ordered = members.slice().sort(function (p, q) { return p.t - q.t || p.l - q.l; });
    let text = ordered.map(function (s) { return s.text || ''; }).join(' ').trim();
    return { l: l, t: t, r: r, b: b, members: members, text: text };
  }

  // ---------------------------------------------------------------
  // Keyword matching. Port of match() in the PDFmarker modules:
  // ordered subsequence over tokens, gaps allowed, so a phrase split
  // across lines still matches once those lines are one paragraph.
  // ---------------------------------------------------------------
  function matches(paragraph, keywords, caseSensitive) {
    if (!keywords.length) return false;
    let tokens = paragraph.text.split(/\s+/).filter(Boolean);
    if (!tokens.length) return false;
    let remaining = keywords.slice();
    for (let i = 0; i < tokens.length; i++) {
      let token = caseSensitive ? tokens[i] : tokens[i].toLowerCase();
      while (remaining.length) {
        let part = caseSensitive ? remaining[0] : remaining[0].toLowerCase();
        if (token.indexOf(part) !== -1) remaining.shift();
        else break;
      }
      if (!remaining.length) return true;
    }
    return false;
  }

  // ---------------------------------------------------------------
  // Controller
  // ---------------------------------------------------------------
  let SVG_NS = 'http://www.w3.org/2000/svg';

  function create(options) {
    let mount = typeof options.mount === 'string'
      ? document.querySelector(options.mount) : options.mount;
    if (!mount) throw new Error('demo.js: mount element not found');

    let dataDir = (options.dataDir || 'data').replace(/\/$/, '');
    let onStatus = options.onStatus || function () {};

    let state = {
      model: 'tesseractOCR',
      dpi: 180,
      leniency: 1.3,
      keyword: 'PDF marker demo',
      caseSensitive: false,
      showDetections: true,
      view: 'inspect',        // 'inspect' | 'output'
      manifest: null,
      snippets: [],
      paragraphs: [],
      ready: false
    };

    let cache = {};           // "model@dpi" -> snippet array
    let pending = 0;          // guards out-of-order fetch resolution
    let els = buildScaffold(mount);
    let readout = document.getElementsByClassName("dm-readout")[0]
    window.addEventListener('mousemove', (event) => {
      const { clientX, clientY } = event;
      
      readout.style.left = `${clientX + 10}px`;
      readout.style.top = `${clientY + 10}px`;
    });


    // -------- scaffold --------
    function buildScaffold(root) {
      root.innerHTML =
        '<div class="dm-stage">' +
          '<div class="dm-canvas">' +
            '<img class="dm-page" alt="Demo document page">' +
            '<svg class="dm-overlay" preserveAspectRatio="none" viewBox="0 0 1000 1000">' +
              '<g class="dm-l-detect"></g><g class="dm-l-para"></g>' +
            '</svg>' +
          '</div>' +
          '<div class="dm-readout">' +
            '<span class="dm-peek"></span>' +
          '</div>' +
        '</div>';
      return {
        img: root.querySelector('.dm-page'),
        svg: root.querySelector('.dm-overlay'),
        detect: root.querySelector('.dm-l-detect'),
        para: root.querySelector('.dm-l-para'),
        peek: root.querySelector('.dm-peek')
      };
    }

    function rect(cls, box) {
      let r = document.createElementNS(SVG_NS, 'rect');
      r.setAttribute('class', cls);
      r.setAttribute('x', box.l.toFixed(2));
      r.setAttribute('y', box.t.toFixed(2));
      r.setAttribute('width', (box.r - box.l).toFixed(2));
      r.setAttribute('height', (box.b - box.t).toFixed(2));
      return r;
    }

    // -------- data --------
    function key(model, dpi) { return model + '@' + dpi; }

    function loadSet() {
      let k = key(state.model, state.dpi);
      if (cache[k]) { adopt(cache[k]); return Promise.resolve(); }

      let entry = state.manifest.sets.filter(function (s) {
        return s.model === state.model && s.dpi === state.dpi && s.page === 0;
      })[0];
      if (!entry) {
        onStatus({ type: 'error', message: 'No exported data for ' + k });
        return Promise.resolve();
      }

      let ticket = ++pending;
      onStatus({ type: 'loading', message: 'Loading ' + state.model + ' at ' + state.dpi + ' DPI' });

      return fetch(dataDir + '/' + entry.file)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (d) {
          cache[k] = d;
          if (ticket !== pending) return;      // a newer request superseded this one
          adopt(d);
        })
        .catch(function (err) {
          onStatus({ type: 'error', message: 'Could not load ' + entry.file + ' — ' + err.message });
        });
    }

    // Every set carries its own rendered-page dimensions. The viewBox
    // must track them or the boxes drift as DPI changes. The backdrop
    // image may be overridden once in the manifest: the page looks
    // identical at every DPI, so a single low-resolution JPEG lines up
    // perfectly with high-DPI coordinates and saves the download.
    function adopt(payload) {
      state.snippets = payload.snippets || [];

      let w = payload.image_width, h = payload.image_height;
      if (w && h) els.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

      let img = (state.manifest && state.manifest.sets.find(entry => entry.dpi === state.dpi).image) || payload.image;
      if (img) {
        let src = dataDir + '/' + img;
        if (els.img.getAttribute('src') !== src) els.img.setAttribute('src', src);
      }
      recompute();
    }

    // -------- render --------
    function recompute() {
      if (!state.snippets.length) return;

      state.paragraphs = groupIntoParagraphs(state.snippets, state.leniency);
      let keywords = state.keyword.split(/\s+/).filter(Boolean);

      let hits = 0;
      for (let i = 0; i < state.paragraphs.length; i++) {
        let p = state.paragraphs[i];
        p.hit = matches(p, keywords, state.caseSensitive);
        if (p.hit) hits++;
      }

      draw();
      onStatus({
        type: 'result',
        detections: state.snippets.length,
        paragraphs: state.paragraphs.length,
        hits: hits,
        view: state.view
      });
    }

    function draw() {
      let output = state.view === 'output';

      // Raw detections: hidden in output view, since the real
      // application only ever emits the red annotations.
      els.detect.innerHTML = '';
      if (state.showDetections && !output) {
        let frag = document.createDocumentFragment();
        state.snippets.forEach(function (s) {
          let r = rect('dm-detect', s);
          r.addEventListener('mouseenter', function () { peek(s.text); });
          r.addEventListener('mouseleave', function () { peek(''); });
          frag.appendChild(r);
        });
        els.detect.appendChild(frag);
      }

      els.para.innerHTML = '';
      let pf = document.createDocumentFragment();
      state.paragraphs.forEach(function (p) {
        if (output && !p.hit) return;
        let r = rect('dm-para' + (p.hit ? ' is-hit' : ''), p);
        r.addEventListener('mouseenter', function () { peek(p.text); });
        r.addEventListener('mouseleave', function () { peek(''); });
        pf.appendChild(r);
      });
      els.para.appendChild(pf);

      els.svg.classList.toggle('is-output', output);
    }

    function peek(text) {
      const max_length = 300;
      els.peek.textContent = text ? '«' + text.slice(0, max_length) + (text.length > max_length ? '…' : '') + '»' : '';
      if (els.peek.textContent.length > 0) {
        readout.style.display = "flex";
      }
      else {
        readout.style.display = "none";
      }
    }

    // -------- boot --------
    let ready = fetch(dataDir + '/manifest.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (m) {
        state.manifest = m;
        if (!m.sets || !m.sets.length) throw new Error('manifest has no sets');
        // Start on a DPI that actually exists rather than the hardcoded
        // default, in case the exported list changes.
        if (m.dpis && m.dpis.indexOf(state.dpi) === -1) state.dpi = m.dpis[0];
        state.ready = true;
        onStatus({ type: 'ready', manifest: m });
        return loadSet();
      })
      .catch(function (err) {
        onStatus({ type: 'error', message: 'Demo data unavailable — ' + err.message });
      });

    // -------- public API --------
    let api = {
      ready: ready,

      setEngine: function (model) {
        if (model === state.model) return;
        state.model = model;
        if (state.ready) loadSet();
      },
      setDpi: function (dpi) {
        dpi = parseInt(dpi, 10);
        if (!dpi || dpi === state.dpi) return;
        // Snap to the nearest exported DPI; the slider is continuous,
        // the exported sets are not.
        let available = state.manifest ? state.manifest.dpis : [dpi];
        let nearest = available.reduce(function (best, d) {
          return Math.abs(d - dpi) < Math.abs(best - dpi) ? d : best;
        }, available[0]);
        if (nearest === state.dpi) return;
        state.dpi = nearest;
        if (state.ready) loadSet();
        return nearest;
      },
      setLeniency: function (k) {
        k = parseFloat(k);
        if (!(k > 0) || k === state.leniency) return;
        state.leniency = k;
        recompute();
      },
      setKeyword: function (text) {
        text = text || '';
        if (text === state.keyword) return;
        state.keyword = text;
        recompute();
      },
      setCaseSensitive: function (on) {
        on = !!on;
        if (on === state.caseSensitive) return;
        state.caseSensitive = on;
        recompute();
      },
      setShowDetections: function (on) {
        state.showDetections = !!on;
        draw();
      },
      annotate: function () {
        state.view = 'output';
        recompute();
      },
      reset: function () {
        state.view = 'inspect';
        recompute();
      },
      snapshot: function () {
        return {
          model: state.model, dpi: state.dpi, leniency: state.leniency,
          keyword: state.keyword, view: state.view,
          detections: state.snippets.length,
          paragraphs: state.paragraphs.length,
          hits: state.paragraphs.filter(function (p) { return p.hit; }).length
        };
      }
    };

    return api;
  }

  global.PDFMarkerDemo = {
    create: create,
    // Exposed for testing or reuse outside the demo pane.
    groupIntoParagraphs: groupIntoParagraphs,
    matches: matches
  };

})(window);