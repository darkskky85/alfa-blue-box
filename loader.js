/* Loads the Alfa Blue Box site into the Wuilt-hosted page on blueboxsa.com.
   Wuilt runs embed <script> tags only after its own JS hydrates, so the embed
   starts this file from an <img onerror> handler, which runs during parsing. */
(function () {
  if (window.__abbLoaded) return;
  window.__abbLoaded = true;
  if (/wuilt\.com$/.test(location.hostname)) return;

  var S = 'https://alfa-blue-box.vercel.app/';
  var K = 'abb_html_v2';
  var D = document;

  function fix(h) {
    return h.replace(/(\s(?:src|href)=")(?!https?:|#|mailto:|tel:|data:|\/\/)([^"]+)"/g, '$1' + S + '$2"');
  }
  function show(h) {
    D.open();
    D.write(h);
    D.close();
  }
  function fail() {
    if (!D.body) return;
    D.body.innerHTML = '<iframe src="' + S + '" style="position:fixed;inset:0;width:100%;height:100%;border:0;visibility:visible" title="Alfa Blue Box"></iframe>';
  }

  var cached = null;
  try { cached = localStorage.getItem(K); } catch (e) {}

  var fresh = fetch(S, { cache: 'no-cache' })
    .then(function (r) { return r.text(); })
    .then(function (h) {
      h = fix(h);
      try { localStorage.setItem(K, h); } catch (e) {}
      return h;
    });

  if (cached) show(cached);
  else fresh.then(show).catch(fail);
})();
