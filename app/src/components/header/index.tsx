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
    setModaleSignup(false); // Ferme la modale d'inscription si elle est ouverte
    // Ici tu peux ouvrir une modale de connexion ou rediriger vers une page de connexion
    setModaleLogin(true);
  };
  const openSubmit = () => {
    setModaleLogin(false); // Ferme la modale de connexion si elle est ouverte
    // Ici tu peux ouvrir une modale de connexion ou rediriger vers une page de connexion
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
            Connexion{" "}
          </div>{" "}
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
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Se connecter</button>
            <button type="button" onClick={() => setModaleLogin(false)}>
              Annuler
            </button>
          </form>
        </div>
      )}
      {modaleSignup && (
        <div className="modale-signup">
          <form onSubmit={signup}>
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
            <button type="button" onClick={(e) => signup(e)}>
              Créer un compte
            </button>
            <button type="button" onClick={() => setModaleSignup(false)}>
              Annuler
            </button>
            {errorMessage && errorMessage}
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
