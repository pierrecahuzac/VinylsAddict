import axios from "axios";
import { useEffect, useState } from "react";
import Album from "../../components/Album";
import { useNavigate } from "react-router";
import type { AlbumData } from "../../types/album";
import { IoTrashOutline, IoCloseOutline } from "react-icons/io5";

interface WishlistEntry extends AlbumData {
  wishlistId: string;
}

const MyWishlist = () => {
  const [userWishlist, setUserWishlist] = useState<WishlistEntry[]>([]);
  
  const [modaleDeleteFromWishlist, setModaleDeleteFromWishlist] =
    useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserWishlist = async () => {
    try {
      const result = await axios.get(
        `/api/wishlists`,
        {
          withCredentials: true,
        },
      );

      setUserWishlist(result.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la liste d'envies",
        error,
      );
    }
  };

  useEffect(() => {
    fetchUserWishlist();
  }, []);

  const openAlbumDetails = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };

  const submitDeleteAlbumFromWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>,
    albumId: string,
  ) => {
    e.preventDefault();
    if (!userWishlist) return;
    try {
      const result = await axios.delete(
        `/api/wishlists/${albumId}`,
        {
          withCredentials: true,
        },
      );
      if (result.status === 200) {
        setModaleDeleteFromWishlist(false);
        setAlbumToDelete(null);
        await fetchUserWishlist();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'album :", error);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6 bg-gray-900 min-h-full">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Ma Wishlist</h1>
        <div className="text-gray-400 text-sm">
          Tu as <span className="text-red-500 font-bold">{userWishlist.length}</span> album{userWishlist.length > 1 ? "s" : ""} qui te font envie.
        </div>
      </header>

      <main className="w-full">
        {userWishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
            <p className="italic">Ta liste d'envies est vide pour le moment.</p>
            <button 
              onClick={() => navigate("/")}
              className="text-[#f1c40f] hover:underline font-medium"
            >
              Parcourir le catalogue →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {userWishlist.map((album) => (
              <div key={album.wishlistId} className="relative group">
                <Album
                  id={album.id}
                  title={album.title}
                  artist={album.artist}
                  cover={album.coverUrl}
                  year={String(album.releaseDate)}
                  onClick={() => openAlbumDetails(album.id)}
                  className="w-full"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAlbumToDelete(album.id);
                    setModaleDeleteFromWishlist(true);
                  }}
                  className="absolute top-2 right-2 p-2 bg-gray-950/60 backdrop-blur-md text-gray-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10 border border-white/5"
                  aria-label="Supprimer de la wishlist"
                >
                  <IoTrashOutline size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Confirmation de suppression */}
      {modaleDeleteFromWishlist && albumToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
          <div className="bg-gray-800 w-full max-w-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">Supprimer l'album ?</h2>
              <button 
                onClick={() => {
                  setModaleDeleteFromWishlist(false);
                  setAlbumToDelete(null);
                }} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-gray-300 text-center">
                Es-tu sûr de vouloir retirer cet album de ta wishlist ?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setModaleDeleteFromWishlist(false);
                    setAlbumToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={(e) => submitDeleteAlbumFromWishlist(e, albumToDelete)}
                  className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
