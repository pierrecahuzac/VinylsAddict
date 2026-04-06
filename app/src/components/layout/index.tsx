import { Outlet } from "react-router-dom";
import Header from "../header";
import NavBar from "../navBar";
import "../../styles/layout.scss";

const Layout = () => {
  return (
    <div className="app-layout">
      <Header />
      
      <main className="app-content">
        
        <Outlet />
      </main>

      <NavBar />
    </div>
  );
};

export default Layout;