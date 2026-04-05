import { Link } from "react-router";
import { useUser } from "../../contexts/userContext";

import "../../styles/navBar.scss";
import axios from "axios";

const NavBar = () => {
  const { user, userIsLogged, isLoading, setUser, setEmail, setPassword, setUserIslogged } = useUser();
  const logout = async () => {
    try {
      const result = await axios.post(
        `http://192.168.1.181:33000/api/user/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      console.log(result);
      if (result.status === 200 && !result.data.isLogged) {
        setUser(null);
        setUserIslogged(false);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="nav-bar">
      <Link to={`/collection/${user?.id}`}>Collection</Link>
      <Link to={`/wishlist/${user?.id}`}>Wishlist</Link>
      <Link to={`/profile/${user?.id}`}>
        {userIsLogged && user && !isLoading ? user.username : "Profil"}
      </Link>
      
        {(userIsLogged && user && !isLoading) && <button onClick={logout}>Déconnexion </button> }
     
    </nav>
  );
};

export default NavBar;
