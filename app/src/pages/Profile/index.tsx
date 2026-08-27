import { useState } from "react";
import { useUser } from "../../contexts/userContext";
import axios from "axios";
import useToast from "../../hooks/useToast";
import { IoWarningOutline, IoCloseOutline, IoTrashOutline } from "react-icons/io5";

const Profile = () => {
  const { user, deleteAccount } = useUser();
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  // const [changeEmail, setChangeEmail] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { onError, onSuccess } = useToast();

  const handleSubmitNewPassword = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/users/changePassword`,
        {
          currentPassword,
          newPassword,
          newPasswordConfirmation,
        },
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
        setChangePassword(false);
        onSuccess("Mot de passe changé avec succès");
      }
      return;
    } catch (error: any) {
      onError(error.response.data);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await deleteAccount();
      setShowDeleteModal(false);
    } catch {
      // erreur déjà toastée dans le context
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4">
      <h1 className="text-2xl font-bold mb-8">
        Mon profil
      </h1>
      <form
        action=""
        className="w-full max-w-md flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-400">
            Email
          </label>
          <input
            id="email"
            type="text"
            placeholder="Email"
            value={user?.email}
            readOnly
            className="bg-gray-800 border border-gray-700 text-gray-400 p-3 rounded-lg cursor-not-allowed focus:outline-none"
            name="email"
          />
        </div>

        <button 
          type="button" 
          onClick={() => setChangePassword(!changePassword)} 
          className="text-[#f1c40f] hover:underline text-left w-fit transition-colors"
        >
          {changePassword ? "Annuler le changement" : "Changer mon mot de passe ?"}
        </button>

        {changePassword && (
          <div className="flex flex-col gap-4 p-4 border border-gray-700 rounded-xl bg-gray-800/50">
            <input
              type="password"
              placeholder="Mot de passe actuel"
              name="currentPassword"
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:border-[#f1c40f] focus:outline-none"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              name="newPassword"
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:border-[#f1c40f] focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmation du nouveau mot de passe"
              name="newPasswordConfirmation"
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:border-[#f1c40f] focus:outline-none"
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
            />
            <button 
              type="button" 
              className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              onClick={handleSubmitNewPassword}
            >
              Valider le changement
            </button>
          </div>
        )}

        {/* Zone dangereuse */}
        <div className="w-full max-w-md mt-10 pt-8 border-t border-gray-700">
          <h3 className="text-sm font-black uppercase tracking-widest text-red-400 flex items-center gap-2 mb-3">
            <IoWarningOutline size={16} /> Zone dangereuse
          </h3>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex flex-col gap-3">
            <p className="text-sm text-gray-300">
              Supprimer ton compte effacera définitivement ta <span className="font-bold text-white">collection</span>, ta <span className="font-bold text-white">wishlist</span> et tes <span className="font-bold text-white">photos</span>. Tes vinyles créés resteront dans le catalogue mais seront <span className="font-bold text-white">anonymisés</span>.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <IoTrashOutline size={18} /> Supprimer mon compte
            </button>
          </div>
        </div>
      </form>

      {/* Modal confirmation delete */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-md">
          <div className="bg-gray-800 w-full max-w-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <IoWarningOutline className="text-red-500" size={20} /> Supprimer le compte ?
              </h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <IoCloseOutline size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-300 text-sm text-center">
                Cette action est <span className="text-red-400 font-bold">irréversible</span>. Toute ta collection et tes photos seront purgées.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {deleting ? "Suppression..." : "Confirmer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
