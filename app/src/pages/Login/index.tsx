import { Link } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

const Login = () => {
  const { email, setEmail, login, password, setPassword } = useUser();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-gray-900">
      <div className="w-full max-w-sm space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter italic">VINYLS<span className="text-[#f1c40f]">ADDICT</span></h1>
          <h2 className="text-gray-400 text-sm font-medium">Content de te revoir ! Connecte-toi.</h2>
        </header>

        <form onSubmit={login} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="vynils@addict.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-[#f1c40f] transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Mot de passe</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-[#f1c40f] transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              type="submit" 
              className="w-full bg-[#f1c40f] text-gray-950 font-black py-4 rounded-2xl hover:bg-amber-400 active:scale-95 transition-all shadow-xl shadow-[#f1c40f]/10"
            >
              SE CONNECTER
            </button>
            
            <Link
              to={"/"}
              onClick={() => { setEmail(""); setPassword(""); }}
              className="w-full py-4 text-center text-gray-500 font-bold hover:text-white transition-colors"
            >
              Retour au catalogue
            </Link>
          </div>
        </form>

        <footer className="text-center pt-6">
          <Link to={"/signup"} className="text-sm text-gray-400 hover:text-[#f1c40f] transition-colors">
            Pas encore de compte ? <span className="font-bold underline">Inscris-toi !</span>
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default Login;
