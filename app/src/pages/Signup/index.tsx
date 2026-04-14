import { Link } from "react-router";


import { useUser } from "../../contexts/userContext";

import "./Signup.scss";

const Signup = () => {
  const {
    email,
    setEmail,
    signup,
    password,
    setPassword,
    username,
    setUsername,
    passwordConfirmation,
    setPasswordConfirmation,
  } = useUser();
  return (
    <div className="signup">
      <form onSubmit={signup}>
        <h2>Créer un compte</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmation du mot de passe"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <div className="buttons">
          <button className="btn-save" type="submit">
            Créer un compte
          </button>
          <Link to={"/"} className="btn-cancel" type="button">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
