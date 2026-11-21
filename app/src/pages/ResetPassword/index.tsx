import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import PasswordInput from "../../components/PasswordInput";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Lien de réinitialisation invalide.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/users/reset-password`,
        { token, password, passwordConfirmation: confirmation },
        { withCredentials: true },
      );
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de la réinitialisation.");
      } else {
        setError("Erreur lors de la réinitialisation.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-[#0a0a0a]">
      <div className="w-full max-w-sm space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Nouveau mot de passe
          </h1>
          <h2 className="text-gray-400 text-sm font-medium">
            Choisis un mot de passe d'au moins 8 caractères.
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
              Nouveau mot de passe
            </label>
            <PasswordInput
              name="password"
              placeholder="••••••••"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#8b5cf6] transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
              Confirmer le mot de passe
            </label>
            <PasswordInput
              name="passwordConfirmation"
              placeholder="••••••••"
              value={confirmation}
              autoComplete="new-password"
              onChange={(e) => setConfirmation(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#8b5cf6] transition-all placeholder:text-gray-600"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-primary text-gray-950 font-black py-4 rounded-2xl hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "RÉINITIALISER"}
          </button>
        </form>

        <footer className="text-center">
          <Link to="/login" className="text-sm text-gray-400 hover:text-primary transition-colors">
            Retour à la connexion
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default ResetPassword;
