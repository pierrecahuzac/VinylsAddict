import { Link } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

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
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-gray-900">
      <div className="w-full max-w-sm space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter italic">REJOINS <span className="text-[#f1c40f]">L'AVENTURE</span></h1>
          <h2 className="text-gray-400 text-sm font-medium">Crée ton compte et commence ta collection.</h2>
        </header>

        <form onSubmit={signup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email</label>
            <input
              type="email"
              placeholder="vinyl@addict.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-[#f1c40f] transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Nom d'utilisateur</label>
            <input
              type="text"
              placeholder="CrateDigger_99"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-[#f1c40f] transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-[#f1c40f] transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Confirmation</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-[#f1c40f] transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              type="submit" 
              className="w-full bg-[#f1c40f] text-gray-950 font-black py-4 rounded-2xl hover:bg-amber-400 active:scale-95 transition-all shadow-xl shadow-[#f1c40f]/10"
            >
              CRÉER MON COMPTE
            </button>
            
            <Link
              to={"/"}
              className="w-full py-4 text-center text-gray-500 font-bold hover:text-white transition-colors"
            >
              Annuler
            </Link>
          </div>
        </form>

        <footer className="text-center pt-2">
          <Link to={"/login"} className="text-sm text-gray-400 hover:text-[#f1c40f] transition-colors">
            Déjà un compte ? <span className="font-bold underline">Connecte-toi !</span>
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default Signup;
