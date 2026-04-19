import { Link } from "react-router";

import {
  IoLibraryOutline,
  IoHome,
  IoHeartOutline,
  IoLogOutOutline,
  // IoLogOut,
  IoPerson,
  // IoExitOutline,
  // IoExit,
  // IoLogInOutline,
  IoLogIn,
  // IoPersonAddSharp,
  IoPersonAddOutline,
} from "react-icons/io5";

import { useUser } from "../../contexts/userContext";

import "./NavBar.scss";

const NavBar = () => {
  const {
    user,
    userIsLogged,
    isLoading,

    logout,
  } = useUser();

  return (
    <nav className="nav-bar">
      <>
        <Link to={`/`}>
          <IoHome />
        </Link>
        {!userIsLogged && (
          <>
            <Link to={`/login`}>
              <IoLogIn />
            </Link>
            <Link to={`/signup`}>
              <IoPersonAddOutline
              // style={{color:"white"}}
              />
            </Link>
          </>
        )}
      </>

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
      {userIsLogged && !isLoading && (
        <Link to={`/profile/${user?.id}`}>
          <IoPerson />
        </Link>
      )}

      {userIsLogged && user && !isLoading && (
        <IoLogOutOutline onClick={logout} />
      )}
    </nav>
  );
};

export default NavBar;
