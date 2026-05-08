import { Link } from "react-router";
import {
  IoLibraryOutline,
  IoHome,
  IoHeartOutline,
  IoStatsChartOutline,
  IoLogIn,
  IoPersonAddOutline,
} from "react-icons/io5";

import { useUser } from "../../contexts/userContext";

const NavBar = () => {
  const { userIsLogged } = useUser();

  return (
    <nav className="w-full h-16 bg-gray-950 flex items-center justify-around text-2xl z-10 border-t border-gray-800 fixed bottom-0 left-0">
      <Link to="/" className="text-gray-400 hover:text-[#f1c40f] transition-colors">
        <IoHome />
      </Link>
      
      {!userIsLogged && (
        <>
          <Link to="/login" className="text-gray-400 hover:text-[#f1c40f] transition-colors">
            <IoLogIn />
          </Link>
          <Link to="/signup" className="text-gray-400 hover:text-[#f1c40f] transition-colors">
            <IoPersonAddOutline />
          </Link>
        </>
      )}

      {userIsLogged && (
        <>
          <Link to="/collection" className="text-gray-400 hover:text-[#f1c40f] transition-colors">
            <IoLibraryOutline />
          </Link>
          <Link to="/wishlist" className="text-gray-400 hover:text-[#f1c40f] transition-colors">
            <IoHeartOutline />
          </Link>
          <Link to="/my-stats" className="text-gray-400 hover:text-[#f1c40f] transition-colors">
            <IoStatsChartOutline />
          </Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
