/* Som ambiente de fundo com controle de volume e mudo (canto superior direito).
   - Não toca com som antes de o visitante interagir (política de autoplay dos navegadores):
     tenta iniciar sozinho e, se bloqueado, começa no primeiro toque/clique/tecla.
   - Lembra volume e "mudo" (localStorage, opcional).
   - Pausa ao trocar de aba e enquanto um vídeo do catálogo está tocando.
   - Sem JavaScript simplesmente não existe (nenhum controle morto na tela). */
(function () {
  "use strict";
  var script = document.currentScript;
  var SRC = (script && script.getAttribute("data-src")) || "assets/audio/ambiente.m4a";
  var DEFAULT_VOL = 0.6;           /* posição inicial da barra (0–1) */
  var KEY = "pf-ambient-v1";
  var host = document.querySelector(".bar .wrap");
  if (!host || !window.HTMLAudioElement) return;

  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ vol: state.vol, muted: state.muted })); } catch (e) {} }
  var saved = load();
  var state = { vol: typeof saved.vol === "number" ? clamp(saved.vol, 0, 1) : DEFAULT_VOL, muted: saved.muted === true };

  /* ---------- áudio (criado só aqui: sem JS não há <audio> inerte na página) ---------- */
  var audio = new Audio();
  audio.loop = true; audio.preload = "none"; audio.src = SRC; audio.setAttribute("playsinline", "");

  /* iOS ignora audio.volume (somente leitura): nesse caso o ganho passa pela Web Audio API */
  var useWA = false, ctx = null, gain = null, noVolume = false;
  try { audio.volume = 0.5; useWA = Math.abs(audio.volume - 0.5) > 0.01; audio.volume = 1; } catch (e) { useWA = true; }
  function ensureCtx() {
    if (!useWA || ctx || noVolume) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { noVolume = true; return; }
    try {
      ctx = new AC(); var node = ctx.createMediaElementSource(audio);
      gain = ctx.createGain(); gain.gain.value = 0; node.connect(gain); gain.connect(ctx.destination);
    } catch (e) { ctx = null; noVolume = true; }
  }
  var level = 0, raf = 0;
  function setLevel(x) { level = x; if (useWA) { if (gain) gain.gain.value = x; } else audio.volume = x; }
  function fadeTo(target, ms, done) {
    cancelAnimationFrame(raf);
    var from = level, t0 = performance.now();
    if (!ms || noVolume) { setLevel(noVolume ? 1 : target); if (done) done(); return; }
    (function step(now) {
      var k = clamp((now - t0) / ms, 0, 1); setLevel(from + (target - from) * k);
      if (k < 1) raf = requestAnimationFrame(step); else if (done) done();
    })(t0);
  }
  /* curva quadrática: o meio da barra soa como "metade" do volume */
  function target() { return state.muted ? 0 : (noVolume ? 1 : Math.pow(state.vol, 2)); }

  /* ---------- interface ---------- */
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M4 9.5v5h3.6l4.4 4v-13l-4.4 4H4z" fill="currentColor" stroke="none"/>' +
    '<g class="i-on"><path d="M15.4 9.1a4.2 4.2 0 0 1 0 5.8"/><path d="M18.2 6.4a8 8 0 0 1 0 11.2"/></g>' +
    '<g class="i-off"><path d="m15.6 9.6 5 4.8M20.6 9.6l-5 4.8"/></g></svg>';
  var amb = document.createElement("div");
  amb.className = "amb"; amb.setAttribute("role", "group"); amb.setAttribute("aria-label", "Música de fundo"); amb.setAttribute("data-state", "waiting");
  amb.innerHTML = '<button type="button" class="amb-btn">' + ICON + '</button>' +
    '<div class="amb-tray"><span class="amb-lbl" aria-hidden="true">Música de fundo</span>' +
    '<input class="amb-vol" type="range" min="0" max="100" step="1" aria-label="Volume da música de fundo"></div>';
  host.appendChild(amb);
  var btn = amb.querySelector(".amb-btn"), vol = amb.querySelector(".amb-vol");

  var playing = false;        /* a música deve estar tocando (não mudo e já iniciada) */
  var resumeOnShow = false, resumeAfterVideo = false, videoActive = false, armed = false;

  function render() {
    var on = playing && !state.muted;
    amb.setAttribute("data-state", on ? "on" : (state.muted ? "muted" : "waiting"));
    var label = on ? "Silenciar música de fundo" : "Ativar música de fundo";
    btn.setAttribute("aria-label", label); btn.title = label;
    var pct = Math.round(state.vol * 100);
    vol.value = String(pct); vol.style.setProperty("--p", pct + "%"); vol.setAttribute("aria-valuetext", pct + "%");
    if (noVolume) amb.classList.add("no-vol");
  }

  /* ---------- reprodução ---------- */
  function start(fadeMs) {
    ensureCtx();
    if (ctx && ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
    cancelAnimationFrame(raf); setLevel(0);
    var p; try { p = audio.play(); } catch (e) { return Promise.reject(e); }
    return Promise.resolve(p).then(function () { playing = true; fadeTo(target(), fadeMs == null ? 1400 : fadeMs); render(); });
  }
  function stop(ms) {
    fadeTo(0, ms == null ? 350 : ms, function () { audio.pause(); });
  }
  function waitForGesture() { /* autoplay bloqueado: inicia no primeiro gesto do visitante */
    if (armed) return; armed = true;
    var evs = ["click", "touchend", "keydown"];
    function handler(e) {
      if (e.target && e.target.closest && e.target.closest(".amb")) return; /* o controle cuida de si */
      if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
      if (state.muted) return;
      start().then(function () { evs.forEach(function (n) { document.removeEventListener(n, handler, true); }); armed = false; })
             .catch(function () { /* continua aguardando o próximo gesto */ });
    }
    evs.forEach(function (n) { document.addEventListener(n, handler, true); });
  }
  function begin() {
    start().catch(function () { playing = false; render(); waitForGesture(); });
  }

  /* ---------- eventos do controle ---------- */
  var trayTimer = 0;
  function openTray() {
    amb.classList.add("is-open"); clearTimeout(trayTimer);
    trayTimer = setTimeout(function () {
      var kb = amb.matches(":focus-within") && document.activeElement && document.activeElement.matches(":focus-visible");
      if (kb) return openTray(); amb.classList.remove("is-open");
    }, 4000);
  }
  btn.addEventListener("click", function () {
    if (state.muted || !playing) {
      state.muted = false; if (state.vol === 0) state.vol = DEFAULT_VOL; save();
      start().catch(function () { playing = false; render(); });
    } else { state.muted = true; save(); stop(); }
    render(); openTray();
  });
  vol.addEventListener("input", function () {
    var v = clamp(Number(vol.value) / 100, 0, 1); state.vol = v;
    var wasMuted = state.muted; state.muted = v === 0; save();
    if (state.muted) { if (playing) stop(250); }
    else if (wasMuted || !playing) start(300).catch(function () { playing = false; render(); });
    else fadeTo(target(), 80);
    render(); openTray();
  });
  amb.addEventListener("focusin", function () { if (btn.matches(":focus-visible") || vol.matches(":focus-visible")) openTray(); });
  amb.addEventListener("pointerdown", function () { clearTimeout(trayTimer); });
  amb.addEventListener("pointerup", function () { openTray(); });
  document.addEventListener("pointerdown", function (e) { if (!amb.contains(e.target)) amb.classList.remove("is-open"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") amb.classList.remove("is-open"); });

  /* ---------- pausas automáticas ---------- */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { if (playing && !state.muted && !audio.paused) { resumeOnShow = true; cancelAnimationFrame(raf); audio.pause(); } }
    else if (resumeOnShow) {
      resumeOnShow = false;
      if (!state.muted && !videoActive) start(900).catch(function () { playing = false; render(); waitForGesture(); });
    }
  });
  document.addEventListener("pf:video", function (e) {
    videoActive = !!(e.detail && e.detail.playing);
    if (videoActive) { if (playing && !state.muted && !audio.paused) { resumeAfterVideo = true; stop(250); } }
    else if (resumeAfterVideo) {
      resumeAfterVideo = false;
      if (!state.muted) start(900).catch(function () { playing = false; render(); });
    }
  });
  audio.addEventListener("error", function () { amb.remove(); playing = false; }); /* arquivo ausente: remove o controle */

  render();
  if (!state.muted) begin();
})();
