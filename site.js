(function () {
  // Lightbox for any element with data-full
  var lb = document.getElementById('lightbox');
  var img = document.getElementById('lb-img');
  var cap = document.getElementById('lb-cap');
  var closeBtn = document.getElementById('lb-close');
  var lastFocus = null;
  function open(src, text, alt) {
    lastFocus = document.activeElement;
    img.src = src; img.alt = alt || text || '';
    cap.textContent = text || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    img.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('[data-full]').forEach(function (el) {
    el.addEventListener('click', function () {
      var inner = el.querySelector('img');
      open(el.getAttribute('data-full'), el.getAttribute('data-cap'), inner && inner.alt);
    });
  });
  if (lb) {
    closeBtn.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
  }

  // Screen scroller buttons
  var sc = document.getElementById('screens');
  if (sc) {
    var step = function () { return sc.clientWidth * 0.8; };
    document.getElementById('prev').addEventListener('click', function () { sc.scrollBy({ left: -step(), behavior: 'smooth' }); });
    document.getElementById('next').addEventListener('click', function () { sc.scrollBy({ left: step(), behavior: 'smooth' }); });
  }

  // Contact form opens a pre-filled email
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.getElementById('form-note');
      var name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
      if (!name || !email || !msg) { note.textContent = 'Please fill in your name, email and message.'; return; }
      var body = msg + '\n\n— ' + name + ' (' + email + ')';
      var url = 'mailto:charanpoojari266@gmail.com?subject=' + encodeURIComponent('Portfolio enquiry from ' + name) + '&body=' + encodeURIComponent(body);
      window.location.href = url;
      note.textContent = 'If your email app did not open, write to charanpoojari266@gmail.com.';
    });
  }
})();

// ---------- GAMEON clickable prototype ----------
(function () {
  var S = window.GAMEON_SCREENS;
  var phone = document.getElementById('phone');
  if (!S || !phone) return;

  // Hotspots per screen: [x, y, w, h] in % of the screen, target screen id, label
  var H = {
    'onb-1': [[28, 89, 36, 9, 'onb-2', 'Get Started']],
    'onb-2': [[0, 8, 100, 92, 'onb-3', 'Continue']],
    'onb-3': [[0, 8, 100, 92, 'onb-4', 'Continue']],
    'onb-4': [[0, 8, 100, 92, 'login-1', 'Continue']],
    'login-1': [[28, 89, 44, 9, 'login-2', 'Ready, set, go']],
    'login-2': [[22, 72, 56, 7, 'type-phone', 'Mobile number'], [21, 78, 5, 4, 'tick', 'Agree to terms'], [27, 81, 44, 7, 'login-3', 'Get OTP']],
    'login-3': [[4, 8, 12, 7, 'login-2', 'Back']],
    'home': [[9, 46, 36, 22, 'sports-1', 'Players'], [9, 68, 36, 23, 'sports-2', 'Tournament'], [26, 91, 18, 9, 'sports-1', 'Sports tab'], [77, 91, 20, 9, 'comm-1', 'Community tab']],
    'sports-1': [[5, 7, 14, 7, 'home', 'Back'], [8, 15, 42, 24, 'sports-2', 'Football'], [5, 92, 18, 8, 'home', 'Home tab'], [80, 92, 18, 8, 'comm-1', 'Community tab']],
    'sports-2': [[5, 8, 14, 7, 'sports-1', 'Back'], [29, 39, 50, 6, 'sports-3', 'Book Now'], [29, 73, 50, 6, 'sports-3', 'Book Now']],
    'sports-3': [[5, 7, 12, 7, 'sports-2', 'Back'], [51, 87, 44, 11, 'sports-4', 'Join game']],
    'sports-4': [[5, 9, 12, 7, 'sports-3', 'Back'], [12, 20, 76, 9, 'pay-0', 'Google Pay'], [12, 31, 76, 9, 'pay-1', 'PhonePe'], [12, 42, 76, 9, 'pay-2', 'Paytm'], [25, 88, 47, 6, 'sports-5', 'Pay now']],
    'sports-5': [[4, 6, 13, 7, 'home', 'Back to home'], [5, 57, 90, 28, 'home', 'Done']],
    'comm-1': [[6, 7, 12, 7, 'home', 'Back'], [26, 47, 40, 6, 'comm-2', 'Join Running Club'], [5, 93, 16, 7, 'home', 'Home tab'], [26, 93, 14, 7, 'sports-1', 'Sports tab']],
    'comm-2': [[6, 6, 12, 7, 'comm-1', 'Back'], [25, 94, 49, 6, 'comm-3', 'Pay now']],
    'comm-3': [[6, 6, 13, 7, 'home', 'Back to home']]
  };
  // OTP keypad keys: [x, y, w, h, digit]
  var KEYS = [];
  var cols = [[3, 32], [35, 31], [67, 31]];
  var rows = [65.5, 72, 78.5];
  for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) KEYS.push([cols[c][0], rows[r], cols[c][1], 6.2, String(r * 3 + c + 1)]);
  KEYS.push([35, 85, 31, 6.2, '0']);
  var OTP_BOX_X = [18.6, 36.4, 54.2, 72];

  var byId = {}; S.forEach(function (s, k) { byId[s.src.split('/').pop().replace('.webp', '')] = k; });
  var img = document.getElementById('screen-img');
  var layer = document.getElementById('hotspots');
  var screenEl = document.getElementById('screen');
  var count = document.getElementById('step-count');
  var title = document.getElementById('step-title');
  var desc = document.getElementById('step-desc');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.flow-tab'));
  var minis = Array.prototype.slice.call(document.querySelectorAll('.mini'));
  var strip = document.getElementById('filmstrip');
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var i = 0, history = [], timer = null, otp = '', pay = -1, phoneTyped = false, ticked = false;
  S.forEach(function (s) { var p = new Image(); p.src = s.src; });

  function idOf(k) { return S[k].src.split('/').pop().replace('.webp', ''); }
  function spot(b, cls) {
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'hs' + (cls ? ' ' + cls : '');
    el.style.left = b[0] + '%'; el.style.top = b[1] + '%'; el.style.width = b[2] + '%'; el.style.height = b[3] + '%';
    el.setAttribute('aria-label', b[5] || b[4]);
    layer.appendChild(el);
    return el;
  }
  function mark(x, y, w, h, html, cls) {
    var el = document.createElement('div');
    el.className = 'ov ' + (cls || '');
    el.style.left = x + '%'; el.style.top = y + '%'; el.style.width = w + '%'; el.style.height = h + '%';
    el.innerHTML = html;
    layer.appendChild(el);
    return el;
  }

  function flash() {
    layer.classList.remove('flash'); void layer.offsetWidth; layer.classList.add('flash');
  }

  function render() {
    var id = idOf(i);
    layer.classList.remove('flash');
    layer.innerHTML = '';
    (H[id] || []).forEach(function (b) {
      var el = spot(b, b[2] > 90 ? 'full' : '');
      el.addEventListener('click', function (e) { e.stopPropagation(); act(b[4]); });
    });
    if (id === 'login-2') {
      if (phoneTyped) mark(32.5, 73.6, 43, 3.8, '98765 43210', 'typed');
      if (ticked) mark(21.7, 79.3, 3, 1.9, '✓', 'tick');
    }
    if (id === 'login-3') {
      KEYS.forEach(function (k) {
        var el = spot([k[0], k[1], k[2], k[3], 'key', 'Key ' + k[4]], 'key');
        el.addEventListener('click', function (e) { e.stopPropagation(); press(k[4]); });
      });
      for (var d = 0; d < otp.length; d++) mark(OTP_BOX_X[d], 51, 14.4, 8.6, otp[d], 'otp');
    }
    if (id === 'sports-4' && pay >= 0) mark(76.6, 25.4 + pay * 11.1, 4, 1.9, '', 'radio');
  }

  function press(dg) {
    if (otp.length >= 4) return;
    otp += dg; render();
    if (otp.length === 4) setTimeout(function () { go('home', 1); }, 450);
  }

  function act(t) {
    if (t === 'type-phone') { phoneTyped = true; render(); return; }
    if (t === 'tick') { ticked = !ticked; render(); return; }
    if (t.indexOf('pay-') === 0) { pay = +t.slice(4); render(); return; }
    var back = history.length && idOf(history[history.length - 1]) === t;
    if (back) { history.pop(); show(byId[t], -1, true); } else go(t, 1);
  }
  function go(t, dir) { history.push(i); show(byId[t], dir, true); }

  function show(n, dir, keepHistory) {
    clearTimeout(timer);
    if (!keepHistory) history = [];
    i = n;
    var s = S[i], id = idOf(i);
    if (id === 'login-3') otp = '';
    if (id === 'login-2' && dir === 1) { phoneTyped = false; ticked = false; }
    if (id === 'sports-4' && dir === 1) pay = -1;
    img.classList.remove('in-left', 'in-right'); void img.offsetWidth;
    img.src = s.src; img.alt = 'GAMEON ' + s.fn + ': ' + s.t;
    img.classList.add(dir === -1 ? 'in-left' : 'in-right');
    render();
    count.textContent = pad(i + 1) + ' / ' + pad(S.length) + ' · ' + s.fn;
    title.textContent = s.t; desc.textContent = s.d;
    tabs.forEach(function (t) { var on = +t.dataset.flow === s.f; t.classList.toggle('active', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); });
    minis.forEach(function (m, k) { m.classList.toggle('active', k === i); });
    var a = minis[i];
    if (a && strip) strip.scrollTo({ left: a.offsetLeft - strip.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' });
    if (id === 'onb-2' || id === 'onb-3' || id === 'onb-4') timer = setTimeout(function () { if (idOf(i) === id) act(H[id][0][4]); }, 2600);
  }

  // Tapping where there is no button flashes the hotspots, like Figma
  screenEl.addEventListener('click', flash);
  document.getElementById('step-back').addEventListener('click', function () {
    if (history.length) show(history.pop(), -1, true); else flash();
  });
  document.getElementById('step-restart').addEventListener('click', function () { show(0, -1); });
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var f = +t.dataset.flow;
      for (var k = 0; k < S.length; k++) if (S[k].f === f) { show(k, k < i ? -1 : 1); break; }
    });
  });
  minis.forEach(function (m) { m.addEventListener('click', function () { var k = +m.dataset.i; show(k, k < i ? -1 : 1); }); });

  show(0, 1);
  setTimeout(flash, 1200);
})();
