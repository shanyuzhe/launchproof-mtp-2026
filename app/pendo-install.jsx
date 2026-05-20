import Script from 'next/script';

const defaultPendoApiKey = 'e8d019ac-2123-45c3-80b7-a171a94a8fb0';
const pendoApiKey = process.env.NEXT_PUBLIC_PENDO_API_KEY || defaultPendoApiKey;

export default function PendoInstall() {
  const installScript = `
    (function(apiKey) {
      if (!apiKey) {
        window.launchproofAnalyticsStatus = 'Missing Novus/Pendo key';
        return;
      }

      (function(p, e, n, d, o) {
        var v, w, x, y, z;
        o = p[d] = p[d] || {};
        o._q = o._q || [];
        v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'];
        for (w = 0, x = v.length; w < x; ++w) {
          (function(method) {
            o[method] = o[method] || function() {
              o._q[method === v[0] ? 'unshift' : 'push']([method].concat([].slice.call(arguments, 0)));
            };
          })(v[w]);
        }
        y = e.createElement(n);
        y.async = true;
        y.src = 'https://cdn.pendo.io/agent/static/' + apiKey + '/pendo.js';
        y.onload = function() {
          window.launchproofAnalyticsStatus = 'Novus/Pendo SDK loaded; dashboard confirms events separately';
        };
        y.onerror = function() {
          window.launchproofAnalyticsStatus = 'Novus/Pendo SDK load failed; use local event feed as fallback evidence';
        };
        z = e.getElementsByTagName(n)[0];
        z.parentNode.insertBefore(y, z);
      })(window, document, 'script', 'pendo');

      var visitorIdKey = 'launchproof_pendo_visitor_id';
      var visitorId = window.localStorage.getItem(visitorIdKey);

      if (!visitorId) {
        visitorId = 'launchproof-' + Math.random().toString(36).slice(2) + '-' + Date.now();
        window.localStorage.setItem(visitorIdKey, visitorId);
      }

      window.pendo.initialize({
        visitor: {
          id: visitorId,
          role: 'hackathon_judge_or_builder',
          product: 'LaunchProof'
        },
        account: {
          id: 'mind-the-product-2026',
          name: 'Mind the Product World Product Day 2026'
        }
      });

      window.novus = window.pendo;
      window.launchproofAnalyticsStatus = 'Novus/Pendo SDK initialized; waiting for dashboard evidence';
    })(${JSON.stringify(pendoApiKey)});
  `;

  return (
    <Script
      id="pendo-install"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: installScript }}
    />
  );
}
