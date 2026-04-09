import { useNavigate } from "react-router";
import SearchBar from "../SearchBar";

import "./Header.scss";

const Header = () => {
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
      <SearchBar />
    </header>
  );
};

export default Header;
