import { useState } from "react";
import { useUser } from "../../contexts/userContext";
import axios from "axios";
import useToast from "../../hooks/useToast";

const Profile = () => {
  const { user } = useUser();
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  // const [changeEmail, setChangeEmail] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const { onError, onSuccess } = useToast();

  const handleSubmitNewPassword = async () => {
    try {
      const response = await axios.post(
        `/api/users/changePassword`,
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
      </form>
    </div>
  );
};

export default Profile;
