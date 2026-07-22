import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initFacebookPixel, trackPageView } from "../../lib/metaPixel";

export default function MetaPixelTracker() {
  const location = useLocation();

  useEffect(() => {
    initFacebookPixel();
  }, []);

  useEffect(() => {
    trackPageView();
  }, [location.pathname]);

  return null;
}
