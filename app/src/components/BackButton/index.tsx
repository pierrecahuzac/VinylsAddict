import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

interface BackButtonProps {
  fallback?: string;
  label?: string;
  className?: string;
}

const BackButton = ({
  fallback = "/",
  label = "Retour",
  className = "",
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Si l'utilisateur est arrivé directement par URL, on évite de quitter le site.
    if (window.history.length > 1) navigate(-1);
    else navigate(fallback);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 text-sm text-gray-400 hover:text-white transition ${className}`}
    >
      <IoArrowBackOutline size={18} />
      {label}
    </button>
  );
};

export default BackButton;
