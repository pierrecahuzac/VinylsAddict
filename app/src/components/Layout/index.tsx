import { Outlet } from "react-router-dom";
import Header from "../Header";
import NavBar from "../NavBar";



const Layout = () => {
  return (
    <div className="flex flex-col h-screen w-100 overflow-hidden bg-black-900">
      <Header />      
      <main className="flex-1 w-100 overflow-y-auto">        
        <Outlet />
      </main>
      <NavBar />
    </div>
  );
};

export default Layout;