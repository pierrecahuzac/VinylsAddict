import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/users/forgot-password`,
        { email },
        { withCredentials: true },
      );
      setMessage(response.data.message);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors de la demande.");
      } else {
        setError("Erreur lors de la demande.");
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
            Mot de passe oublié ?
          </h1>
          <h2 className="text-gray-400 text-sm font-medium">
            Nous t'enverrons un lien pour en choisir un nouveau.
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="vinyls@addict.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#8b5cf6] transition-all placeholder:text-gray-600"
            />
          </div>

          {message && <p className="text-sm text-green-400">{message}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-gray-950 font-black py-4 rounded-2xl hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Envoi..." : "ENVOYER LE LIEN"}
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

export default ForgotPassword;
