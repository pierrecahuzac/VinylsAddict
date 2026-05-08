import { useEffect, useState } from "react";
import { useUser } from "../../contexts/userContext";
import axios from "axios";
import { useNavigate } from "react-router";
import useToast from "../../hooks/useToast";
import { IoBuild } from "react-icons/io5";

interface User {
  id: string | null;
  username: string | null;
  role: string | null;
  email: string | null;
  canConnect: boolean | null;
}
const Dashboard = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[] | null>();
  const [albums, setAlbums] = useState<any[]>([]);
  const [modaleUser, setModaleUser] = useState(false);
  const navigate = useNavigate();
  const [userToModify, setUserToModify] = useState("");
  useEffect(() => {
    verifyUserRole();
  }, []);

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchDatas();
    }
  }, [user]);

  const fetchDatas = async () => {
    try {
      await Promise.all([getAllAbums(), getAllUsers()]);
    } catch (error) {
      onError("Une erreur c'est produite: " + error);
    }
  };
  const { onError } = useToast();

  const verifyUserRole = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/users/role`,

        { withCredentials: true },
      );
      if (response.data.role !== "ADMIN") {
        onError("Accès refusé");
        navigate("/");
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  const getAllAbums = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/albums`,
      );
      setAlbums(response.data);
      return;
    } catch (error) {
      onError("Impossible de recupérer la liste de tous les albums");
      console.log(error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/users`,
        {
          withCredentials: true,
        },
      );

      setUsers(response.data.users);
      return;
    } catch (error) {
      onError("Impossible de recupérer la liste des utilisateurs");
      console.log(error.response);
    }
  };
  const openUserDatas = (userId: string) => {
    setModaleUser(true);
  };
  return (
    <div className="p-4 flex flex-col gap-8 bg-gray-950 min-h-full">
      {/* Section En-tête */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <IoBuild className="text-[#f1c40f]" />
          Administration
        </h1>
        <p className="text-gray-400 text-sm italic">
          Vue d'ensemble de la plateforme
        </p>
      </div>
      {modaleUser && (
        <Modale setModaleUser={setModaleUser} userId={userToModify} />
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-lg">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
            Utilisateurs
          </p>
          <p className="text-2xl font-bold text-[#f1c40f]">
            {users?.length || 0}
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-lg">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
            Albums
          </p>
          <p className="text-2xl font-bold text-[#f1c40f]">
            {albums?.length || 0}
          </p>
        </div>
      </div>

      {/* Liste des Utilisateurs */}
      <section className="flex flex-col gap-4 mb-20">
        <h2 className="text-xl font-semibold text-white px-2">
          Gestion des membres
        </h2>

        <div className="flex flex-col gap-3">
          {users &&
            users.map((u: User) => (
              <div
                key={u.id}
                data-id={u.id}
                onClick={() => {
                  (openUserDatas(u.id), setUserToModify(u.id));
                }}
                className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between hover:border-[#f1c40f]/50 transition-colors group"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-white group-hover:text-[#f1c40f] transition-colors">
                    {u.username || "Sans nom"}
                  </span>
                  <span className="text-gray-500 text-xs">{u.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      u.role === "ADMIN"
                        ? "bg-[#f1c40f] text-gray-950"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {u.role}
                  </span>

                  <div
                    className={`h-3 w-3 rounded-full border-2 border-gray-950 ${u.canConnect ? "bg-green-500" : "bg-red-500"}`}
                    title={u.canConnect ? "Accès autorisé" : "Accès bloqué"}
                  ></div>
                </div>
              </div>
            ))}
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between border-dotted hover:border-[#f1c40f]/50 transition-colors group">
            <div className="flex flex-col">
              <span className="font-bold text-white group-hover:text-[#f1c40f] transition-colors"></span>
              <span className="text-gray-500 text-xs"></span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase 
                  }`}
              >
                Ajouter un utilisateur
              </span>

              <div
                className={`h-3 w-3 rounded-full border-2 border-gray-950 border-dotted`}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Modale = ({ setModaleUser, userId }: any) => {
  const { onError } = useToast();
  const [user, setUser] = useState("");
  useEffect(() => {
    userToFetch();
  }, []);

  const userToFetch = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/users/getById`,
        {
          withCredentials: true,
        },
      );
      console.log(response.data);
      setUser(response.data);
    } catch (error) {
      onError("Une erreur c'est produite: " + error);
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-gray-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-800 w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl my-8">
        <form className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Utilisateur
              </label>
              {userId}
              <input
                type="text"
                placeholder="Ex: Dark Side of the Moon"
                name="title"
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1"></label>
              <div> Nom d'utilisateur{user && <div>{user.username}</div>} </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
              Email :
            </label>
            {/* <input
              type="text"
              placeholder="https://..."
              name="email"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
            /> */}
            <div>{user && <div>{user.email}</div>}</div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
              Peut se connecter
            </label>
            <div>{user && <div>{user.canConnect}</div>}</div>
            {/* <input
              type="text"
              placeholder="Ex: 352415..."
              name="barCode"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
            /> */}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Année
              </label>
              <input
                type="number"
                placeholder="1973"
                name="year"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Pistes
              </label>
              <input
                type="number"
                placeholder="10"
                name="trackCount"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Disques
              </label>
              <input
                type="number"
                placeholder="1"
                name="diskCount"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              />
            </div>
          </div>

          {/* Technical Selects */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Format
              </label>
              <select
                name="formatId"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              >
                <option value="">-- Format --</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Variante
              </label>
              <select
                name="variantId"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              >
                <option value="">-- Variante --</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Genre
              </label>
              <select
                name="genreId"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              >
                <option value="">-- Genre --</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                Style
              </label>
              <select
                name="styleId"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              >
                <option value="">-- Style --</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
              Couleur précise
            </label>
            <input
              type="text"
              placeholder="Ex: Transparent Blue"
              name="color"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
            />
          </div>

          {/* Collection Checkbox */}
          {
            <label className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-700 cursor-pointer group">
              <input
                type="checkbox"
                name="addToCollection"
                className="w-5 h-5 rounded border-gray-700 text-[#f1c40f] focus:ring-[#f1c40f] bg-gray-950"
              />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                Je possède cet album
              </span>
            </label>
          }

          {/* Price & Condition */}
          {
            <div className="grid grid-cols-2 gap-4 p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500/70 ml-1">
                  Prix (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="20.00"
                  name="price"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500/70 ml-1">
                  État
                </label>
                <select
                  name="conditionId"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
                >
                  <option value="">-- État --</option>
                </select>
              </div>
            </div>
          }

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-gray-800 pb-2">
            <button
              type="button"
              onClick={() => setModaleUser(false)}
              className="flex-1 px-4 py-4 bg-gray-700 text-white font-bold rounded-2xl hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-4 bg-[#f1c40f] text-gray-950 font-black rounded-2xl hover:bg-amber-400 active:scale-95 transition-all shadow-xl shadow-[#f1c40f]/10"
            >
              ENREGISTRER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Dashboard;
