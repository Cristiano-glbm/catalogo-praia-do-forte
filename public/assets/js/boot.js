/* Executa cedo, no <head>. Mantido em arquivo próprio para a CSP não precisar de 'unsafe-inline'. */
document.documentElement.classList.remove("no-js");
/* habilita o estado :active no iOS Safari (substitui o antigo atributo ontouchstart="") */
document.addEventListener("touchstart", function () {}, { passive: true });
