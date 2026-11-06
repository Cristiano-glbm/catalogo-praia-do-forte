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
  [].forEach.call(document.querySelectorAll("label.cow,label.vid,label.btn,label.icon-btn"), function (l) {
    l.tabIndex = 0;
    l.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); l.click(); } });
  });

  /* ---------- janelas (ficha e vídeo) ---------- */
  var radios = [].slice.call(document.querySelectorAll(".ovr")), none = document.getElementById("o-none"),
      page = document.getElementById("page"), open = null, lastFocus = null;
  function videoEvent(playing) { document.dispatchEvent(new CustomEvent("pf:video", { detail: { playing: playing } })); }
  function resetVideo(r) {
    var v = r && r.nextElementSibling && r.nextElementSibling.querySelector(".vframe");
    if (v && v._poster) {
      v.innerHTML = ""; v.appendChild(v._poster); v._poster = null;
      if (v._link) { v._link.remove(); v._link = null; }
      videoEvent(false);
    }
  }
  function focusables(root) {
    return [].slice.call(root.querySelectorAll('a[href],button:not([disabled]),input:not(.ovr):not([disabled]),iframe,[tabindex="0"]'))
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
    if (prev && prev !== now) resetVideo(prev);
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
    if (e.key === "Escape") { none.checked = true; sync(); return; }
    if (e.key === "Tab") { /* mantém o foco dentro da janela */
      var list = focusables(open.nextElementSibling); if (!list.length) return;
      var first = list[0], last = list[list.length - 1], cur = document.activeElement;
      if (e.shiftKey && (cur === first || list.indexOf(cur) < 0)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (cur === last || list.indexOf(cur) < 0)) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- vídeo: capa -> player do YouTube (modo privacidade) ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".vposter"); if (!a) return;
    var id = a.getAttribute("data-yt");
    if (!/^[A-Za-z0-9_-]{11}$/.test(id || "")) return; /* id inesperado: deixa o link normal abrir o YouTube */
    e.preventDefault();
    var v = a.parentNode, f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&playsinline=1&rel=0&modestbranding=1";
    f.title = a.getAttribute("aria-label") || "Vídeo do lote";
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    f.referrerPolicy = "strict-origin-when-cross-origin";
    f.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox");
    v._poster = a; v.innerHTML = ""; v.appendChild(f);
    var o = document.createElement("a");
    o.className = "vopen"; o.href = a.href; o.target = "_blank"; o.rel = "noopener noreferrer"; o.textContent = "Abrir em tela cheia no YouTube";
    v.parentNode.insertBefore(o, v.nextSibling); v._link = o;
    videoEvent(true); /* o áudio ambiente pausa enquanto o vídeo toca */
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
