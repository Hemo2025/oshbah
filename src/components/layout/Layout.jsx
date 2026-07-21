import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import ScrollToHash from "../common/ScrollToHash";
import WhatsAppFloat from "../common/WhatsAppFloat";
function Layout() {
  return (
    <>
      <ScrollToTop />
      <ScrollToHash />

      <Header />
      <Outlet />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export default Layout;
