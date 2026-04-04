import { useUser } from "../../contexts/userContext";

import "../../styles/navBar.scss";

const NavBar = () => {
  const { user, userIsLogged, isLoading } = useUser();
  


  return (
    <nav className="nav-bar">
      <a href="/collection">Collection</a>
      <a href="/wishlist">Wishlist</a>
      <a href="/search">
        {userIsLogged && user && !isLoading ? user.username : "Profil"}
      </a>
    </nav>
  );
};

export default NavBar;
