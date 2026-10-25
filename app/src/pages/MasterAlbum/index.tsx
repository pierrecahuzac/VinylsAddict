import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IoHeart,
  IoHeartOutline,
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
  const navigate = useNavigate();
  const { userIsLogged } = useUser();
  const { allMetadata, getAllMetadata } = useCollection();
  const [masterAlbumDetails, setMasterAlbumDetails] =
    useState<AlbumData | null>(null);
  const { onError } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [modalAddAlbumToUserCollection, setModalAddAlbumToUserCollection] =
    useState(false);
  const [albumAddedToCollection, setAlbumAddedToCollection] = useState({
    price: "",
    conditionId: "",
  });

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
    <div className="relative min-h-full text-white pb-20 overflow-hidden">
      {/* Blurred backdrop */}
      <div
        className="fixed inset-0 -z-10 scale-110 blur-3xl opacity-40"
        style={{
          backgroundImage: `url(${masterAlbumDetails?.coverUrl || "/placeholder.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70" />

      <div className="relative z-10 p-6 space-y-8 max-w-3xl mx-auto w-full flex flex-col items-center">
        {/* Artwork */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 shrink-0">
          <img
            src={masterAlbumDetails?.coverUrl || "/placeholder.jpg"}
            alt={masterAlbumDetails?.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title / Artist */}
        <div className="text-center space-y-2">
          <button
            onClick={() => masterAlbumDetails?.title && navigate(`/versions/${encodeURIComponent(masterAlbumDetails.title)}`)}
            className="text-2xl sm:text-3xl font-bold leading-tight hover:text-[#8b5cf6] transition-colors"
          >
            {masterAlbumDetails?.title}
          </button>
          <button
            onClick={() => masterAlbumDetails?.artist && navigate(`/artist/${encodeURIComponent(masterAlbumDetails.artist)}`)}
            className="text-[#8b5cf6] font-semibold text-lg hover:underline block mx-auto"
          >
            {masterAlbumDetails?.artist}
          </button>
        </div>

        {/* Actions */}
        {userIsLogged && (
          <div className="flex flex-wrap justify-center gap-3 w-full">
            <button
              onClick={() => setModalAddAlbumToUserCollection(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg bg-[#8b5cf6] text-white hover:bg-[#7c3aed] active:scale-95"
            >
              <IoLibraryOutline size={20} />
              <span className="text-sm">Posséder</span>
            </button>
            <button
              onClick={isWishlisted ? deleteAlbumFromWishlist : addAlbumToWishlist}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${
                isWishlisted
                ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30"
                : "bg-white/10 text-white hover:bg-white/20 active:scale-95"
              }`}
            >
              {isWishlisted ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
              <span className="text-sm">{isWishlisted ? "En Wishlist" : "Wishlist"}</span>
            </button>
          </div>
        )}

        {/* Info */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-start gap-4">
            <IoCalendarOutline className="text-[#8b5cf6] mt-1 shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Année</p>
              <p className="text-gray-100">{masterAlbumDetails?.releaseDate || "Non précisée"}</p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-start gap-4">
            <IoDiscOutline className="text-[#8b5cf6] mt-1 shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Format</p>
              <p className="text-gray-100 uppercase">
                {masterAlbumDetails?.format?.name} {masterAlbumDetails?.format?.speed ? `(${masterAlbumDetails.format.speed} RPM)` : ""}
              </p>
            </div>
          </div>
          {masterAlbumDetails?.color && (
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-start gap-4">
              <IoDiscOutline className="text-[#8b5cf6] mt-1 shrink-0" size={20} />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Couleur</p>
                <p className="text-gray-100">{masterAlbumDetails.color}</p>
              </div>
            </div>
          )}
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-start gap-4">
            <IoBarcodeOutline className="text-[#8b5cf6] mt-1 shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Code-barre</p>
              <p className="text-gray-100 font-mono text-sm">{masterAlbumDetails?.barCode || "Non disponible"}</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2">
          {masterAlbumDetails?.genres?.map((g) => (
            <span key={g.id} className="bg-white/10 text-gray-300 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-tight">
              {g.nameFR || g.name}
            </span>
          ))}
          {masterAlbumDetails?.styles?.map((s) => (
            <span key={s.id} className="bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-tight">
              {s.nameFR || s.name}
            </span>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalAddAlbumToUserCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#18181b] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-white/10">
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
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#8b5cf6] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">État du disque</label>
                <select
                  name="conditionId"
                  value={albumAddedToCollection.conditionId}
                  onChange={changeDataAlbum}
                  required
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 focus:outline-none focus:border-[#8b5cf6] text-white"
                >
                  <option value="">-- Choisir un état --</option>
                  {allMetadata?.conditions?.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.nameFR || c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full bg-[#8b5cf6] text-white font-bold py-4 rounded-xl hover:bg-[#7c3aed] transition-colors shadow-lg mt-4">
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
