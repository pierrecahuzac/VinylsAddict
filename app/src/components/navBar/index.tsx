import { Link } from "react-router";

import {
  IoLibraryOutline,
  IoHome,
  IoHeartOutline,
  IoLogOutOutline,
  IoPerson,
} from "react-icons/io5";
import { useUser } from "../../contexts/userContext";

import "../../styles/navBar.scss";

const NavBar = () => {
  const {
    user,
    userIsLogged,
    isLoading,
  
    logout,
  } = useUser();

  return (
    <nav className="nav-bar">
      <Link to={`/`}>
        <IoHome />
      </Link>
      {userIsLogged && (
        <>
          <Link to={`/collection/${user?.id}`}>
            <IoLibraryOutline />
          </Link>
          <Link to={`/wishlist/${user?.id}`}>
            <IoHeartOutline />
          </Link>
        </>
      )}

      <Link to={`/profile/${user?.id}`}>
        {userIsLogged && !isLoading && <IoPerson />}
      </Link>

      {userIsLogged && user && !isLoading && (
        <button onClick={logout}>
          <IoLogOutOutline />{" "}
        </button>
      )}
    </nav>
  );
};

export default NavBar;
