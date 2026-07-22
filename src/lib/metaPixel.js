export const META_PIXEL_ID = "2223726624866107";

export const initFacebookPixel = () => {
  if (window.fbq) return;

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;

    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };

    if (!f._fbq) f._fbq = n;

    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];

    t = b.createElement(e);
    t.async = true;
    t.src = v;

    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );

  window.fbq("init", META_PIXEL_ID);
};

export const trackPageView = () => {
  if (!window.fbq) return;

  window.fbq("track", "PageView");
};

export const trackEvent = (eventName, data = {}) => {
  if (!window.fbq) return;

  window.fbq("track", eventName, data);
};
