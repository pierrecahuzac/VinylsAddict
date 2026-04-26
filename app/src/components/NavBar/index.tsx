import { Link } from "react-router";

import {
  IoLibraryOutline,
  IoHome,
  IoHeartOutline,
  IoLogOutOutline,
 
  IoPerson,
 
  IoLogIn,
  // IoPersonAddSharp,
  IoPersonAddOutline,
} from "react-icons/io5";

import { useUser } from "../../contexts/userContext";

const NavBar = () => {
  const {
    user,
    userIsLogged,
    isLoading,

    logout,
  } = useUser();

  return (
    <nav className="w-100 h-16 bg-black-800 flex items-center justify-around text-2xl align-middle z-10  bg-gray-950">
      <>
        <Link to={`/`} className="decoration-none text-gray-200">
          <IoHome />
        </Link>
        {!userIsLogged && (
          <>
            <Link to={`/login`} className="decoration-none text-gray-200">
              <IoLogIn />
            </Link>
            <Link to={`/signup`} className="decoration-none text-gray-200">
              <IoPersonAddOutline
              
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
