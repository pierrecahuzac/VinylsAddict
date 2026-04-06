import type { SyntheticEvent } from "react";


interface SignupProps {
  signup: (e: SyntheticEvent<HTMLFormElement>) => void | Promise<void>;
  email: string;
  setEmail: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  passwordConfirmation: string;
  setPasswordConfirmation: (value: string) => void;
  setModaleSignup: (value: boolean) => void;
}

const Signup = ({
  signup,
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  passwordConfirmation,
  setPasswordConfirmation,
  setModaleSignup,
}: SignupProps) => {
  return (
    <div className="modale-signup">
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
          {/* Changement en type="submit" pour une meilleure UX (Validation via Entrée) */}
          <button className="btn-save" type="submit">
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
      </form>
    </div>
  );
};

export default Signup;