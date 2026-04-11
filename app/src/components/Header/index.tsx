import { useNavigate } from "react-router";
import SearchBar from "../SearchBar";

import "./Header.scss";
import { useUser } from "../../contexts/userContext";

const Header = () => {
  const  {user} = useUser()
  const title = "Vinyles addict";
  const navigate = useNavigate();
  return (
    <header className="header">
      <h1
        className="header__title"
        onClick={() => {
          navigate("/");
        }}
      >
        {title.toUpperCase()}
      </h1>
      {user?.username ? <h4>Salut {user?.username}</h4> : ""}
      
      <SearchBar />
    </header>
  );
};

export default Header;
