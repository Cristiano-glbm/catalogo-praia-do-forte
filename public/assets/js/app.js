(function () {
  "use strict";
  /* Melhorias opcionais: o catálogo funciona também sem JavaScript. */

  /* ---------- contagem regressiva ---------- */
  var START = Date.UTC(2026, 10, 6, 22, 0, 0); /* 06/11/2026 19h (Bahia, UTC-3) */
  var countEl = document.getElementById("count");
  var UNITS = ["dias", "horas", "min", "seg"], cells = null;
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function buildCount() {
    cells = UNITS.map(function (u) {
      var box = document.createElement("div"), b = document.createElement("b"), s = document.createElement("small");
      s.textContent = u; box.appendChild(b); box.appendChild(s); countEl.appendChild(box); return b;
    });
  }
  function tick() {
    if (!countEl) return;
    var d = START - Date.now();
    if (d <= 0) {
      countEl.className = "count live"; cells = null;
      countEl.textContent = d > -6 * 3600e3 ? "O leilão está acontecendo agora." : "Leilão realizado em 06 de novembro.";
      return false;
    }
    if (!cells) { countEl.textContent = ""; countEl.className = "count"; buildCount(); }
    var p = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
    for (var i = 0; i < 4; i++) cells[i].textContent = pad(p[i]);
  }
  if (countEl) { tick(); var timer = setInterval(function () { if (tick() === false) clearInterval(timer); }, 1000); }

  /* ---------- busca ---------- */
  function norm(s) {
    s = String(s || "");
    try { s = s.normalize("NFD").replace(/[̀-ͯ]/g, ""); } catch (e) {}
    return s.toLowerCase();
  }
  var cards = [].slice.call(document.querySelectorAll(".lot"));
  var q = document.getElementById("q"), empty = document.getElementById("empty"), status = document.getElementById("q-status");
  if (q) q.addEventListener("input", function () {
    var n = norm(q.value.trim()), shown = 0;
    cards.forEach(function (c) { var ok = !n || norm(c.textContent).indexOf(n) > -1; c.hidden = !ok; if (ok) shown++; });
    if (empty) empty.hidden = shown > 0;
    if (status) status.textContent = n ? (shown === 1 ? "1 lote encontrado." : shown + " lotes encontrados.") : "";
  });

  /* ---------- filtro: marca o botão ativo para leitores de tela ---------- */
  var chips = [].slice.call(document.querySelectorAll(".chip"));
  function syncChips() {
    var h = location.hash, any = false;
    chips.forEach(function (c) { var on = h && c.getAttribute("href") === h && h.indexOf("#f-") === 0; if (on) any = true; if (on) c.setAttribute("aria-current", "true"); else c.removeAttribute("aria-current"); });
    var all = document.querySelector(".chip-all"); if (all && !any) all.setAttribute("aria-current", "true");
  }
  syncChips(); window.addEventListener("hashchange", syncChips);

  /* ---------- controles feitos com <label>: ficam acessíveis pelo teclado ---------- */
  [].forEach.call(document.querySelectorAll("label.cow,label.vid,label.btn,label.icon-btn,label.vexpand,label.vclose"), function (l) {
    l.tabIndex = 0;
    l.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); l.click(); } });
  });

  /* ---------- janelas (ficha e vídeo) ---------- */
  var radios = [].slice.call(document.querySelectorAll(".ovr")), none = document.getElementById("o-none"),
      page = document.getElementById("page"), open = null, lastFocus = null;
  function videoEvent(playing) { document.dispatchEvent(new CustomEvent("pf:video", { detail: { playing: playing } })); }
  /* ---------- vídeos próprios: prévia em loop no quadro; tela cheia com o vídeo completo ---------- */
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var ignoreExit = false;
  function vidOf(r) { return r && r.nextElementSibling && r.nextElementSibling.querySelector(".vid-el"); }
  function playPrev(v) {
    if (!v) return;
    if (v.dataset.poster && !v.poster) v.poster = v.dataset.poster;
    if (reduceMotion || saveData) return; /* só a capa: sem vídeo se rolando sozinho (movimento reduzido / economia de dados) */
    if (v.dataset.prev && v.getAttribute("src") !== v.dataset.prev) v.src = v.dataset.prev;
    v.muted = true; v.loop = true; v.controls = false;
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  }
  function stopVid(v) {
    if (!v) return;
    try { v.pause(); } catch (e) {}
    if (v.dataset.prev) { v.removeAttribute("src"); try { v.load(); } catch (e) {} } /* cancela download do vídeo completo */
  }
  function videoEvent(playing) { document.dispatchEvent(new CustomEvent("pf:video", { detail: { playing: playing } })); }
  function leaveFull(ck) { if (ck && ck.checked) { ck.checked = false; ck.dispatchEvent(new Event("change")); } }
  [].forEach.call(document.querySelectorAll(".fsck"), function (ck) {
    ck.addEventListener("change", function () {
      var fr = ck.nextElementSibling, v = fr.querySelector(".vid-el");
      if (ck.checked) {
        if (v.dataset.full) { v.src = v.dataset.full; v.loop = false; }
        v.muted = false; v.controls = true; try { v.currentTime = 0; } catch (e) {}
        var p = v.play(); if (p && p.catch) p.catch(function () { v.muted = true; v.play().catch(function () {}); });
        videoEvent(true); /* o som ambiente pausa enquanto o vídeo toca */
        var rf = fr.requestFullscreen || fr.webkitRequestFullscreen;
        if (rf && !/iPhone|iPad|iPod/.test(navigator.userAgent) && screen.orientation && screen.orientation.lock) {
          try {
            var q = rf.call(fr);
            if (q && q.then) q.then(function () { return screen.orientation.lock("landscape"); })
              .catch(function () { /* sem trava de giro: volta ao giro por CSS */ if (document.fullscreenElement) { ignoreExit = true; document.exitFullscreen().catch(function () {}); } });
          } catch (e) {}
        }
        var cl = fr.querySelector(".vclose"); if (cl) try { cl.focus({ preventScroll: true }); } catch (e) {}
      } else {
        if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
        try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
        playPrev(v); videoEvent(false);
        var ex = fr.querySelector(".vexpand"); if (ex && document.activeElement !== ex) try { ex.focus({ preventScroll: true }); } catch (e) {}
      }
    });
  });
  document.addEventListener("fullscreenchange", function () {
    if (ignoreExit) { ignoreExit = false; return; }
    if (!document.fullscreenElement) [].forEach.call(document.querySelectorAll(".fsck:checked"), leaveFull);
  });
  function focusables(root) {
    return [].slice.call(root.querySelectorAll('a[href],button:not([disabled]),input:not(.ovr):not([disabled]),video[controls],[tabindex="0"]'))
      .filter(function (n) { return n.offsetWidth || n.offsetHeight || n.getClientRects().length; });
  }
  /* guarda o botão que abriu a janela, para devolver o foco ao fechar (clicar num <label> foca o rádio escondido) */
  var trigger = null;
  document.addEventListener("click", function (e) {
    var l = e.target.closest && e.target.closest("label[for]");
    if (l && !l.closest(".ov")) trigger = l;
  }, true);
  function sync() {
    var prev = open, now = null;
    radios.forEach(function (r) { if (r.checked && r.id !== "o-none") now = r; });
    if (prev && prev !== now) { [].forEach.call(prev.nextElementSibling.querySelectorAll(".fsck:checked"), leaveFull); stopVid(vidOf(prev)); }
    if (now && now.id.indexOf("o-v-") === 0) playPrev(vidOf(now));
    if (now && !prev) { lastFocus = trigger || document.activeElement; trigger = null; if (page) page.inert = true; }
    if (!now && prev) {
      if (page) page.inert = false;
      var f = lastFocus; lastFocus = null;
      if (f && document.contains(f) && f.focus) try { f.focus({ preventScroll: true }); } catch (e) {}
    }
    open = now;
    if (now) requestAnimationFrame(function () {
      var dlg = now.nextElementSibling, list = dlg ? focusables(dlg) : [];
      var close = dlg && dlg.querySelector('label.icon-btn[for="o-none"]');
      var t = close || list[0]; if (t && t.focus) try { t.focus({ preventScroll: true }); } catch (e) {}
    });
  }
  radios.forEach(function (r) { r.addEventListener("change", sync); });
  document.addEventListener("keydown", function (e) {
    if (!open) return;
    if (e.key === "Escape") {
      var fc = document.querySelector(".fsck:checked");
      if (fc) { leaveFull(fc); return; } /* Esc sai primeiro da tela cheia */
      none.checked = true; sync(); return;
    }
    if (e.key === "Tab") { /* mantém o foco dentro da janela */
      var list = focusables(open.nextElementSibling); if (!list.length) return;
      var first = list[0], last = list[list.length - 1], cur = document.activeElement;
      if (e.shiftKey && (cur === first || list.indexOf(cur) < 0)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (cur === last || list.indexOf(cur) < 0)) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- link direto: #lote-01 ---------- */
  function deep() {
    var h = location.hash.slice(1);
    if (!/^lote-[a-z0-9]{1,4}$/i.test(h)) return;
    var t = document.getElementById("o-" + h);
    if (t && t.classList.contains("ovr")) { t.checked = true; sync(); }
  }
  deep(); window.addEventListener("hashchange", deep);
})();
