import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import ScrollToHash from "../common/ScrollToHash";

function Layout() {
  return (
    <>
      <ScrollToTop />
      <ScrollToHash />

      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
