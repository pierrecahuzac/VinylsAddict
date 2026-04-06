import {   type SyntheticEvent } from "react";

interface LoginProps {
  
  login: (e: SyntheticEvent<HTMLFormElement>) => void | Promise<void>;
  email: string;
  setEmail: (value: string) => void; 
  password: string;
  setPassword: (value: string) => void; 
  setModaleLogin: (value: boolean) => void;
}

const Login = ({
  login,
  email,
  setEmail,
  password,
  setPassword,
  setModaleLogin,
}: LoginProps) => {
  return (
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
          <button type="submit" className="btn-save">
            Se connecter
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => setModaleLogin(false)}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;