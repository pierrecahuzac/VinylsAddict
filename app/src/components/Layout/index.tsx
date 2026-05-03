import { Outlet } from "react-router-dom";
import Header from "../Header";
import NavBar from "../NavBar";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-950 md:max-w-md m-auto shadow-2xl">
      <Header />      
      <main className="flex-1 w-full overflow-y-auto bg-gray-900">        
        <Outlet />
      </main>
      <NavBar />
    </div>
  );
};

export default Layout;
