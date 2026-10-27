import { Outlet } from "react-router-dom";
import Header from "../Header";
import NavBar from "../NavBar";

const Layout = () => {
  return (
    <div className="flex flex-col h-dvh w-full  bg-black  shadow-2xl">
      <Header />      
      <main className="flex-1 w-full overflow-y-auto bg-[#0a0a0a]">        
        <Outlet />
      </main>
      <NavBar />
    </div>
  );
};

export default Layout;
