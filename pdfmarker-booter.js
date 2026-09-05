// bridge.js — connects the unmodified PDF Marker UI, running in an
// iframe, to the demonstration pane beside it.
//
// Both documents are served from the same origin, so the parent can
// reach into iframe.contentDocument directly and attach listeners to
// the real controls. UI.html and its app.js stay exactly as shipped
// with the desktop application.
//
// The coupling is to element IDs inside the iframe. If one is renamed
// there, this file goes quiet rather than failing loudly, so every
// lookup is checked and reported to the console.

function bootDemo(config) {
  var frame = typeof config.frame === 'string'
    ? document.querySelector(config.frame) : config.frame;
  var demo = config.demo;
  var defaults = config.defaults || {};
  if (!frame) throw new Error('bridge.js: iframe not found');
  if (!demo) throw new Error('bridge.js: demo controller required');

  // Off by default. See the height block near the bottom for why.
  var autoHeight = config.autoHeight === true;
  var uiZoom = parseFloat(config.uiZoom) || 0;
  var missing = [];

  function bind() {
    var doc;
    try {
      doc = frame.contentDocument || frame.contentWindow.document;
    } catch (err) {
      console.error('bridge.js: cannot reach the iframe document. ' +
        'The demo and the UI must be served from the same origin.', err);
      return;
    }
    if (!doc || !doc.getElementById) return;

    var get = function (id) {
      var el = doc.getElementById(id);
      if (!el) missing.push(id);
      return el;
    };

    var keyword = get('keywordInput');
    var model = get('modelSelect');
    var resSlider = get('resToggle');
    var resNumber = get('resInput');
    var leniency = get('leniencyInput');
    var capital = get('capitalToggle');
    var markBtn = get('markBtn');
    var fileList = get('fileList');

    if (missing.length) {
      console.warn('bridge.js: these IDs were not found inside the iframe — ' +
        missing.join(', ') + '. Those controls will not drive the demo.');
      missing = [];
    }

    // --- Optional zoom ----------------------------------------------
    // Shrinks and reflows the document inside the frame, leaving the
    // frame's own size alone.
    //
    // The catch: UI.html lays out against body { height: 100vh }, and
    // viewport units resolve against the UNZOOMED viewport. At zoom
    // 0.8 in a 640px frame, 100vh computes to 640 CSS px and renders
    // at 512, so the layout stops 128px short and .app-container's
    // height:100% inherits the shortfall.
    //
    // So the root gets an explicit height of frameHeight / zoom, which
    // renders back to exactly the frame height. Driven by the frame's
    // own measured size, not by the content, so there is no feedback
    // loop — the frame height is fixed by the parent stylesheet.
    if (uiZoom > 0 && uiZoom !== 1) {
      doc.documentElement.style.zoom = uiZoom;

      var fitToFrame = function () {
        var h = frame.clientHeight;
        if (!h) return;
        var css = (h / uiZoom) + 'px';
        doc.documentElement.style.height = css;
        if (doc.body) doc.body.style.height = css;
      };
      fitToFrame();
      global.addEventListener('resize', fitToFrame);

      // The frame can be resized by a media query without the window
      // firing resize (e.g. a container query, or fonts loading late).
      if (global.ResizeObserver) {
        new global.ResizeObserver(fitToFrame).observe(frame);
      }
    }

    // --- Settings ---------------------------------------------------
    var toInspect = function () { demo.reset(); };

    if (keyword) {
      keyword.addEventListener('input', function () {
        demo.setKeyword(this.value); toInspect();
      });
    }
    if (model) {
      model.addEventListener('change', function () {
        demo.setEngine(this.value); toInspect();
      });
    }
    if (capital) {
      capital.addEventListener('change', function () {
        demo.setCaseSensitive(this.checked); toInspect();
      });
    }
    if (leniency) {
      leniency.addEventListener('input', function () {
        demo.setLeniency(this.value); toInspect();
      });
    }

    // Resolution: app.js already mirrors the slider and the number
    // field to each other, so listen to both and snap to an exported
    // DPI, writing the snapped value back into both.
    var applyDpi = function (value) {
      var snapped = demo.setDpi(value);
      if (snapped) {
        if (resSlider) resSlider.value = snapped;
        if (resNumber) resNumber.value = snapped;
      }
      toInspect();
    };
    if (resSlider) resSlider.addEventListener('input', function () { applyDpi(this.value); });
    if (resNumber) resNumber.addEventListener('change', function () { applyDpi(this.value); });

    // --- Seed ---------------------------------------------------------
    // Push tuned defaults into the form, then read the form back so the
    // demo and the visible controls agree on startup.
    demo.ready.then(function () {
      if (leniency && defaults.leniency) {
        leniency.value = defaults.leniency;
        if (defaults.leniencyMin) leniency.min = defaults.leniencyMin;
        if (defaults.leniencyMax) leniency.max = defaults.leniencyMax;
        if (defaults.leniencyStep) leniency.step = defaults.leniencyStep;
      }
      if (defaults.dpi) {
        if (resSlider) resSlider.value = defaults.dpi;
        if (resNumber) resNumber.value = defaults.dpi;
      }
      if (model && defaults.model) model.value = defaults.model;

      if (leniency) demo.setLeniency(leniency.value);
      if (model) demo.setEngine(model.value);
      if (capital) demo.setCaseSensitive(capital.checked);
      if (resSlider) demo.setDpi(resSlider.value);
      if (keyword) demo.setKeyword(keyword.value);
    });

    // --- Height -----------------------------------------------------
    // Opt-in, and deliberately so.
    //
    // UI.html is a full-viewport application layout: body is
    // height:100vh, .app-container is height:100%, and the file list
    // is flex:1. Inside an iframe, 100vh resolves to the iframe's own
    // height, so the document's content height is not a property of
    // the content — it is whatever height the frame was given.
    //
    // Measuring it and feeding the result back therefore never
    // settles: measure 700, set 708, the body becomes 708, the flex
    // list stretches, measure 708, set 716, and so on. Give this kind
    // of document a fixed height in CSS instead.
    //
    // The guarded implementation below is for the other case — an
    // iframe whose content actually flows.
    if (autoHeight) {
      var applied = 0;
      var rounds = 0;
      var scheduled = false;
      var observer = null;

      var measure = function () {
        var b = doc.body, e = doc.documentElement;
        if (!b || !e) return 0;
        return Math.max(b.scrollHeight, e.scrollHeight, b.offsetHeight);
      };

      var fit = function () {
        scheduled = false;
        if (rounds > 12) return;

        // Detach while writing, or the write re-triggers the observer.
        if (observer) observer.disconnect();
        var h = measure();
        if (h > 0 && Math.abs(h - applied) > 8) {
          applied = h;
          rounds++;
          frame.style.height = h + 'px';
          if (rounds > 12) {
            console.warn('bridge.js: iframe height did not settle after 12 ' +
              'attempts, so auto-sizing has stopped. The framed document is ' +
              'probably viewport-sized (body { height: 100vh }), which cannot ' +
              'be measured this way. Set a fixed height in CSS and drop ' +
              'autoHeight.');
          }
        }
        if (observer && doc.body) observer.observe(doc.body);
      };

      var schedule = function () {
        if (scheduled) return;
        scheduled = true;
        global.requestAnimationFrame(fit);
      };

      if (global.ResizeObserver && doc.body) {
        observer = new global.ResizeObserver(schedule);
      }
      schedule();
      global.addEventListener('resize', schedule);
    }
  }

  // The iframe may already be loaded by the time this runs.
  if (frame.contentDocument && frame.contentDocument.readyState === 'complete') bind();
  frame.addEventListener('load', bind);

  return { rebind: bind };
}