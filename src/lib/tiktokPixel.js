export const trackTikTok = (event, data = {}) => {
  if (typeof window === "undefined") return;
  if (!window.ttq) return;

  window.ttq.track(event, data);
};
