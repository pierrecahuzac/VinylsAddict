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
  const navigate = useNavigate();

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
  const openUserDatas = (userId) => {};
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

      {/* Vue rapide des Stats */}
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
                onClick={() => openUserDatas(id)}
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
          <div
            onClick={() => openUserDatas(id)}
            className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between border-dotted hover:border-[#f1c40f]/50 transition-colors group"
          >
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

export default Dashboard;
