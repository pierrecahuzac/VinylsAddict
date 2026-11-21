import { IoAddOutline } from "react-icons/io5";

interface AddAlbumFabProps {
  onClick: () => void;
  label?: string;
}

const AddAlbumFab = ({ onClick, label = "Ajouter un vinyle" }: AddAlbumFabProps) => (
  <button
    className="fixed bottom-24 right-6 w-14 h-14 bg-[#8b5cf6] text-gray-900 rounded-full text-3xl font-bold shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-10"
    onClick={onClick}
    aria-label={label}
    title={label}
  >
    <IoAddOutline size={28} />
  </button>
);

export default AddAlbumFab;
