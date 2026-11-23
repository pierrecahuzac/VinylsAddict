import { Link, useNavigate } from "react-router";
import { IoLogOutOutline, IoBuild, IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { useUser } from "../../contexts/userContext";
import { useTheme } from "../../contexts/themeContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, userIsLogged, logout } = useUser();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full h-16 bg-black border-b border-white/10 shrink-0">
      <div className="w-full h-full px-4 flex justify-between items-center">
        <div
          className="text-primary font-black italic text-lg tracking-tighter cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          V<span className="text-white">A</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/cgu"
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#8b5cf6] transition-colors"
          >
            CGU
          </Link>
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            aria-label={theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"}
            title={theme === "dark" ? "Thème clair" : "Thème sombre"}
          >
            {theme === "dark" ? <IoSunnyOutline size={18} /> : <IoMoonOutline size={18} />}
          </button>
          {user && user.role === "ADMIN" && (
            <Link
              to="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b5cf6] text-gray-950 font-bold text-sm hover:scale-105 transition-transform"
            >
              <IoBuild/>
            </Link>
          )}
          {userIsLogged && user && (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b5cf6] text-gray-950 font-bold text-sm hover:scale-105 transition-transform"
              >
                {user.username[0].toUpperCase()}
              </Link>

              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                aria-label="Se déconnecter"
              >
                <IoLogOutOutline size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
