import SearchBar from "../searchBar";

import { useUser } from "../../contexts/userContext";
import "../../styles/header.scss";

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
    errorMessage,
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
        <div className="modale-login">
          <form onSubmit={login}>
            <h2>Connexion</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="buttons">
              <button type="submit" className="btn-save">Se connecter</button>
              <button type="button" className="btn-cancel" onClick={() => setModaleLogin(false)}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
      {modaleSignup && (
        <div className="modale-signup">
          <form onSubmit={signup}>
            {" "}
            <h2>Créer un compte</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmation du mot de passe"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <div className="buttons">
              <button
                className="btn-save"
                type="button"
                onClick={(e) => signup(e)}
              >
                Créer un compte
              </button>
              <button
                className="btn-cancel"
                type="button"
                onClick={() => setModaleSignup(false)}
              >
                Annuler
              </button>
            </div>
            {errorMessage && errorMessage}
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
