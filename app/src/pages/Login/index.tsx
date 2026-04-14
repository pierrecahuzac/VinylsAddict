import { Link } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

import "./Login.scss";

const Login = () => {
  const { email, setEmail, login, password, setPassword } = useUser();
  return (
    <div className="login">
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
        <div className="btns_CTA">
          <button type="submit" className="btn-save">
            Se connecter
          </button>
          <Link
            to={"/"}
            className="btn-cancel"
            onClick={() => {
              (setEmail(""), setPassword(""));
            }}
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
