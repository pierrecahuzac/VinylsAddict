import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IoHeart,
  IoHeartOutline,
  IoLibrary,
  IoLibraryOutline,
  IoCalendarOutline,
  IoDiscOutline,
  IoBarcodeOutline,
  IoCloseOutline
} from "react-icons/io5";
import { useUser } from "../../contexts/userContext";

import useToast from "../../hooks/useToast";
import type { AlbumData } from "../../types/album";

import { useCollection } from "../../hooks/useCollection";

const MasterAlbum = () => {
  const { id } = useParams<{ id: string }>();
  const { userIsLogged } = useUser();
  const { allMetadata, getAllMetadata } = useCollection();
  const [masterAlbumDetails, setMasterAlbumDetails] =
    useState<AlbumData | null>(null);
  const { onError } = useToast();
  const [isOwned, setIsOwned] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [modalAddAlbumToUserCollection, setModalAddAlbumToUserCollection] =
    useState(false);
  const [albumAddedToCollection, setAlbumAddedToCollection] = useState({
    price: "",
    conditionId: "",
  });

  const albumIsInUserCollection = async () => {
    if (!userIsLogged) return false;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/users/albums/check/${id}`,
        {
          withCredentials: true,
        },
      );
      if (response.data.userAlbum) {
        setIsOwned(true);
        return true;
      }
      return false;
    } catch (error) {
      setIsOwned(false);
      return false;
    }
  };
  const albumIsInUserWishlist = async () => {
    if (!userIsLogged) return false;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/wishlists/albums/check/${id}`,
        {
          withCredentials: true,
        },
      );
      if (response.data.message === "Album présent dans la wishlist") {
        setIsWishlisted(true);
        return true;
      }
      return false;
    } catch (error) {
      setIsWishlisted(false);
      return false;
    }
  };
  const getCatalog = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/albums/${id}`,
        {
          withCredentials: true,
        },
      );
      setMasterAlbumDetails(response.data);
      await albumIsInUserCollection();
      await albumIsInUserWishlist();
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      getCatalog();
      getAllMetadata();
    };
    fetchData();
  }, [id, userIsLogged]);

  const addAlbumToWishlist = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/wishlists/${id}`,
        {},
        {
          withCredentials: true,
        },
      );
      setIsWishlisted(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
      }
    }
  };

  const deleteAlbumFromWishlist = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/wishlists/${id}`,
        {
          withCredentials: true,
        },
      );
      setIsWishlisted(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
      }
    }
  };

  const addAlbumToUserCollection = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/collections/${id}`,
        {
          price: albumAddedToCollection.price,
          conditionId: albumAddedToCollection.conditionId,
        },
        {
          withCredentials: true,
        },
      );
      setModalAddAlbumToUserCollection(false);
      await getCatalog();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        onError(error.response?.data?.message || "Une erreur est survenue");
      }
    }
  };

  const changeDataAlbum = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAlbumAddedToCollection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="h-dvh flex flex-col min-h-full bg-gray-900 text-white">
      {/* Cover Image with Overlay Header */}
      <div className="relative w-full aspect-square md:aspect-video overflow-hidden group">
        <img
          src={masterAlbumDetails?.coverUrl || "/placeholder.jpg"}
          alt={masterAlbumDetails?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />
        
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <h1 className="text-3xl font-bold leading-tight drop-shadow-lg">
            {masterAlbumDetails?.title}
          </h1>
          <p className="text-xl text-[#f1c40f] font-semibold drop-shadow-md mt-1">
            {masterAlbumDetails?.artist}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-8">
        
        {/* Action Buttons */}
        {userIsLogged && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => !isOwned && setModalAddAlbumToUserCollection(true)}
              disabled={isOwned}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all shadow-lg ${
                isOwned 
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/50 cursor-default" 
                : "bg-amber-500 text-gray-950 hover:bg-amber-400 active:scale-95"
              }`}
            >
              {isOwned ? <IoLibrary size={20} /> : <IoLibraryOutline size={20} />}
              <span className="text-sm">{isOwned ? "En collection" : "Posséder"}</span>
            </button>

            <button
              onClick={isWishlisted ? deleteAlbumFromWishlist : addAlbumToWishlist}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all shadow-lg ${
                isWishlisted 
                ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30" 
                : "bg-red-500 text-white hover:bg-red-400 active:scale-95"
              }`}
            >
              {isWishlisted ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
              <span className="text-sm">{isWishlisted ? "En Wishlist" : "Wishlist"}</span>
            </button>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-6 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
          <div className="flex items-start gap-4">
            <IoCalendarOutline className="text-[#f1c40f] mt-1 shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Année de sortie</p>
              <p className="text-gray-100">{masterAlbumDetails?.releaseDate || "Non précisée"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <IoDiscOutline className="text-[#f1c40f] mt-1 shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Format</p>
              <p className="text-gray-100 uppercase">
                {masterAlbumDetails?.format?.name} {masterAlbumDetails?.format?.speed ? `(${masterAlbumDetails.format.speed} RPM)` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <IoBarcodeOutline className="text-[#f1c40f] mt-1 shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Code-barre</p>
              <p className="text-gray-100 font-mono text-sm">{masterAlbumDetails?.barCode || "Non disponible"}</p>
            </div>
          </div>

          {/* Tags Section */}
          <div className="pt-4 border-t border-gray-700 space-y-4">
            <div className="flex flex-wrap gap-2">
              {masterAlbumDetails?.genres?.map((g) => (
                <span key={g.id} className="bg-gray-700 text-gray-300 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-tight">
                  {g.nameFR || g.name}
                </span>
              ))}
              {masterAlbumDetails?.styles?.map((s) => (
                <span key={s.id} className="bg-gray-900 text-[#f1c40f] border border-[#f1c40f]/30 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-tight">
                  {s.nameFR || s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Improved UI */}
      {modalAddAlbumToUserCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
          <div className="bg-gray-800 w-full max-w-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">Ajouter à ma collection</h2>
              <button onClick={() => setModalAddAlbumToUserCollection(false)} className="text-gray-400 hover:text-white transition-colors">
                <IoCloseOutline size={24} />
              </button>
            </div>
            
            <form onSubmit={addAlbumToUserCollection} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Prix d'achat (€)</label>
                <input
                  type="number"
                  name="price"
                  value={albumAddedToCollection.price}
                  onChange={changeDataAlbum}
                  placeholder="20.00"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-[#f1c40f] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">État du disque</label>
                <select
                  name="conditionId"
                  value={albumAddedToCollection.conditionId}
                  onChange={changeDataAlbum}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-[#f1c40f] text-white"
                >
                  <option value="">-- Choisir un état --</option>
                  {allMetadata?.conditions?.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.nameFR || c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full bg-[#f1c40f] text-gray-950 font-bold py-4 rounded-xl hover:bg-amber-400 transition-colors shadow-lg mt-4">
                Confirmer l'ajout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterAlbum;
