import { Link, useNavigate } from "react-router";
import { IoLogOutOutline } from "react-icons/io5";
import { useUser } from "../../contexts/userContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, userIsLogged, logout } = useUser();

  return (
    <header className="w-full h-16 bg-gray-950 border-b border-gray-800 shrink-0">
      <div className="w-full h-full px-4 flex justify-between items-center">
        <div
          className="text-primary font-black italic text-lg tracking-tighter cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          V<span className="text-white">A</span>
        </div>
        
        <div className="flex items-center gap-4">
          {userIsLogged && user && (
            <div className="flex items-center gap-3">
              <Link 
                to="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1c40f] text-gray-950 font-bold text-sm hover:scale-105 transition-transform"
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
