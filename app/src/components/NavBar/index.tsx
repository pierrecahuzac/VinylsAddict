import { Link, useLocation } from "react-router";
import {
  IoLibraryOutline,
  IoHome,
  IoHeartOutline,
  IoStatsChartOutline,
  IoLogIn,
  IoPersonAddOutline,
} from "react-icons/io5";

import { useUser } from "../../contexts/userContext";

const navItem = (active: boolean) =>
  `flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
    active
      ? "text-[#8b5cf6] bg-[#8b5cf6]/10"
      : "text-gray-400 hover:text-white hover:bg-white/5"
  }`;

const NavBar = () => {
  const { userIsLogged } = useUser();
  const { pathname } = useLocation();

  return (
    <nav className="w-full h-[60px] bg-black/90 backdrop-blur-md flex items-center justify-around text-xl z-10 border-t border-white/10/60 shrink-0">
      <Link to="/" className={navItem(pathname === "/")}>
        <IoHome size={18} />
        <span className="text-[9px] font-medium">Accueil</span>
      </Link>

      {!userIsLogged && (
        <>
          <Link to="/login" className={navItem(pathname === "/login")}>
            <IoLogIn size={18} />
            <span className="text-[9px] font-medium">Connexion</span>
          </Link>
          <Link to="/signup" className={navItem(pathname === "/signup")}>
            <IoPersonAddOutline size={18} />
            <span className="text-[9px] font-medium">Inscription</span>
          </Link>
        </>
      )}

      {userIsLogged && (
        <>
          <Link to="/collection" className={navItem(pathname.startsWith("/collection"))}>
            <IoLibraryOutline size={18} />
            <span className="text-[9px] font-medium">Collection</span>
          </Link>
          <Link to="/wishlist" className={navItem(pathname === "/wishlist")}>
            <IoHeartOutline size={18} />
            <span className="text-[9px] font-medium">Wishlist</span>
          </Link>
          <Link to="/my-stats" className={navItem(pathname === "/my-stats")}>
            <IoStatsChartOutline size={18} />
            <span className="text-[9px] font-medium">Stats</span>
          </Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
