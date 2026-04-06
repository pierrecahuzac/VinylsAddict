import SearchBar from "../searchBar";

import { useUser } from "../../contexts/userContext";
import "../../styles/header.scss";
import Login from "../login";
import Signup from "../signup";

const Header = () => {
  const {
    email,
    setEmail,
    user,
    userIsLogged,
    login,
    signup,
    setModaleSignup,
    modaleLogin,
    setModaleLogin,
    password,
    setPassword,
    username,
    setUsername,
    passwordConfirmation,
    setPasswordConfirmation,
    modaleSignup,
  } = useUser();

  const openLogin = () => {
    console.log("coucou");

    setModaleSignup(false);
    setModaleLogin(true);
  };
  const openSubmit = () => {
    setModaleLogin(false);
    setModaleSignup(true);
  };
  const title = "Vinyles addict";

  return (
    <header className="header">
      <h1 className="header__title">{title.toUpperCase()}</h1>
      {userIsLogged ? (
        <div>Bienvenue, {user?.username}!</div>
      ) : (
        <div className="auth-buttons">
          <div className="auth-buttons-login" onClick={openLogin}>
            Connexion
          </div>
          /
          <div className="auth-buttons-signup" onClick={openSubmit}>
            Créer un compte
          </div>
        </div>
      )}
      <SearchBar />
      {modaleLogin && (
        <Login
          login={login}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          setModaleLogin={setModaleLogin}
        />
      )}
      {modaleSignup && (
        <Signup
          signup={signup}
          email={email}
          setEmail={setEmail}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          passwordConfirmation={passwordConfirmation}
          setPasswordConfirmation={setPasswordConfirmation}
          setModaleSignup={setModaleSignup}
        />
      )}
    </header>
  );
};

export default Header;
