import { Outlet } from "react-router-dom";
import Header from "../Header";
import NavBar from "../NavBar";

const Layout = () => {
  return (
    <div className="flex flex-col h-svh w-full  bg-gray-950  shadow-2xl">
      <Header />      
      <main className="flex-1 w-full overflow-y-auto bg-gray-900">        
        <Outlet />
      </main>
      <NavBar />
    </div>
  );
};

export default Layout;
