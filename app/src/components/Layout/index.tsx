import { Outlet } from "react-router-dom";
import Header from "../Header";
import NavBar from "../NavBar";

import "./Layout.scss";

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