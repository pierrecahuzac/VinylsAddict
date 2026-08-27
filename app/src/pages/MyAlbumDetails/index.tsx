import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  IoTrashOutline, 
  IoCalendarOutline, 
  IoDiscOutline, 
  IoPricetagOutline, 
  IoStarOutline, 
  IoColorPaletteOutline,
  IoAlbumsOutline,
  IoMusicalNotesOutline,
  IoCloseOutline,
  IoImagesOutline,
  IoCloudUploadOutline
} from "react-icons/io5";
import { useUser } from "../../contexts/userContext";
import useToast from "../../hooks/useToast";

import type { FullAlbumState } from "../../types/album";

const getImageUrl = (url: string) => {
  const base = (import.meta.env.VITE_BACKEND_URL_DEV as string | undefined)?.replace(/\/api\/?$/, "") || "";
  return `${base}${url}`;
};

const MyAlbumDetails = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { userIsLogged } = useUser();

  const [data, setData] = useState<FullAlbumState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modaleDeleteAlbum, setModaleDeleteAlbum] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { onSuccess, onError } = useToast();

  useEffect(() => {
    const fetchFullDetails = async () => {
      if (!albumId) return;
      try {
        setLoading(true);
        setError(null);
        const userRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_DEV}/users/albums/${albumId}`,
          {
            withCredentials: true,
          },
        );

        setData(userRes.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log(err.response?.data?.message);
        }
        console.log("Erreur lors du chargement :", err);
        setError("Impossible de charger les détails de cet album.");
      } finally {
        setLoading(false);
      }
    };

    fetchFullDetails();
  }, [albumId, userIsLogged]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-[#f1c40f] animate-pulse">Chargement de ton disque...</p>
      </div>
    );

  if (error || !data)
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
        <p className="text-red-500 font-bold">{error || "Album introuvable"}</p>
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white underline">
          Retourner en arrière
        </button>
      </div>
    );

  const album = data.userAlbum?.album || data.album;
  const userAlbum = data.userAlbum;

  const refreshDetails = async () => {
    if (!albumId) return;
    try {
      const userRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/users/albums/${albumId}`,
        { withCredentials: true },
      );
      setData(userRes.data);
    } catch (err) {
      console.log("Erreur refresh:", err);
    }
  };

  const isAtLimit = (userAlbum?.images?.length || 0) >= 10;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userAlbum) return;

    if (isAtLimit) {
      onError("Limite de 10 photos atteinte pour cet album.");
      e.target.value = "";
      return;
    }

    // validation front légère
    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
      onError("Format non supporté. JPEG/PNG/WebP uniquement.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onError("Image trop lourde (max 5MB).");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/collections/${userAlbum.id}/images`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onSuccess("Photo ajoutée (métadonnées nettoyées) !");
      await refreshDetails();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        onError(err.response?.data?.message || "Erreur lors de l'upload.");
      } else {
        onError("Erreur lors de l'upload.");
      }
    } finally {
      setUploading(false);
      // reset input
      e.target.value = "";
    }
  };

  const handleImageDelete = async (imageId: string) => {
    if (!userAlbum) return;
    try {
      setDeletingImageId(imageId);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/collections/${userAlbum.id}/images/${imageId}`,
        { withCredentials: true }
      );
      onSuccess("Photo supprimée !");
      await refreshDetails();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        onError(err.response?.data?.message || "Erreur lors de la suppression.");
      } else {
        onError("Erreur lors de la suppression.");
      }
    } finally {
      setDeletingImageId(null);
    }
  };

  const submitDeleteUserAlbum = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userAlbum) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/collections/${userAlbum.id}`,
        { withCredentials: true },
      );
      setModaleDeleteAlbum(false);
      navigate(`/collection`);
    } catch (err) {
      console.error("Erreur lors de la suppression de l'album :", err);
      onError("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-900 text-white pb-20">
      {/* Hero Image Section - responsive max-h sur PC */}
      <div className="relative w-full max-w-5xl mx-auto aspect-square md:aspect-[16/10] max-h-[65vh] md:max-h-[480px] overflow-hidden shadow-2xl md:rounded-b-2xl">
        <img
          src={album?.coverUrl || "/placeholder.jpg"}
          alt={`${album?.title} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <p className="text-[#f1c40f] text-sm font-bold uppercase tracking-[0.2em] mb-2 drop-shadow-lg">
            Ma Collection
          </p>
          <button
            onClick={() => album?.title && navigate(`/versions/${encodeURIComponent(album.title)}`)}
            className="text-3xl font-bold leading-tight drop-shadow-lg hover:underline text-left"
          >
            {album?.title}
          </button>
          <button
            onClick={() => album?.artist && navigate(`/artist/${encodeURIComponent(album.artist)}`)}
            className="text-xl text-gray-300 drop-shadow-md hover:text-[#f1c40f] hover:underline text-left block"
          >
            {album?.artist}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-5xl mx-auto w-full">
        {/* Quick Actions (Delete) */}
        <div className="flex justify-end">
          <button
            onClick={() => setModaleDeleteAlbum(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
          >
            <IoTrashOutline size={18} />
            Supprimer de la collection
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-4">
          
          {/* Purchase Info Card */}
          <div className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700/50 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 border-b border-gray-700 pb-2">Infos d'acquisition</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                  <IoPricetagOutline size={12} /> Prix
                </p>
                <p className="text-lg font-bold text-[#f1c40f]">{userAlbum?.price ? `${userAlbum.price} €` : "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                  <IoStarOutline size={12} /> État
                </p>
                <p className="text-gray-100 font-medium">{userAlbum?.condition?.nameFR || "—"}</p>
              </div>
            </div>
          </div>

          {/* Technical Details Card */}
          <div className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700/50 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 border-b border-gray-700 pb-2">Fiche Technique</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div className="flex items-center gap-3 text-sm">
                <IoCalendarOutline className="text-[#f1c40f] shrink-0" size={18} />
                <span className="text-gray-400 mr-2 shrink-0">Sortie :</span>
                <span className="text-gray-100 font-medium truncate">{album?.releaseDate || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <IoDiscOutline className="text-[#f1c40f] shrink-0" size={18} />
                <span className="text-gray-400 mr-2 shrink-0">Format :</span>
                <span className="text-gray-100 font-medium truncate">{album?.format?.name || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <IoColorPaletteOutline className="text-[#f1c40f] shrink-0" size={18} />
                <span className="text-gray-400 mr-2 shrink-0">Couleur :</span>
                <span className="text-gray-100 font-medium truncate">{album?.color || "Standard"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <IoAlbumsOutline className="text-[#f1c40f] shrink-0" size={18} />
                <span className="text-gray-400 mr-2 shrink-0">Disques :</span>
                <span className="text-gray-100 font-medium">{album?.diskNumber || "1"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm col-span-full">
                <IoMusicalNotesOutline className="text-[#f1c40f] shrink-0" size={18} />
                <span className="text-gray-400 mr-2 shrink-0">Pistes :</span>
                <span className="text-gray-100 font-medium">{album?.trackCount || "—"}</span>
              </div>
            </div>
          </div>

          {/* Genres & Styles Section */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap gap-2">
              {album?.genres?.map((g) => (
                <span key={g.id} className="bg-gray-800 text-gray-300 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-tight border border-gray-700">
                  {g.nameFR || g.name}
                </span>
              ))}
              {album?.styles?.map((s) => (
                <span key={s.id} className="bg-[#f1c40f]/10 text-[#f1c40f] border border-[#f1c40f]/20 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-tight">
                  {s.nameFR || s.name}
                </span>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          {userAlbum?.notes && (
            <div className="mt-4 p-4 bg-amber-500/5 border-l-4 border-amber-500 rounded-r-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Mes notes</p>
              <p className="text-gray-300 italic text-sm">"{userAlbum.notes}"</p>
            </div>
          )}

          {/* Photos Collection Section */}
          <div className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700/50 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-700 pb-2">
              <h3 className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isAtLimit ? "text-amber-500" : "text-gray-500"}`}>
                <IoImagesOutline size={14} /> Mes photos ({userAlbum?.images?.length || 0}/10)
              </h3>
              <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isAtLimit || uploading ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-[#f1c40f] text-gray-900 hover:bg-amber-400 cursor-pointer"}`}>
                {uploading ? (
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <IoCloudUploadOutline size={16} />
                )}
                {uploading ? "Envoi..." : isAtLimit ? "Limite atteinte" : "Ajouter"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading || isAtLimit}
                />
              </label>
            </div>

            {isAtLimit && (
              <p className="text-amber-500/80 text-xs text-center -mt-2">Limite de 10 photos atteinte.</p>
            )}

            {(!userAlbum?.images || userAlbum.images.length === 0) ? (
              <p className="text-gray-500 text-sm italic text-center py-4">
                Aucune photo. Ajoute une photo de ta galette — les métadonnées EXIF/GPS seront automatiquement supprimées.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {userAlbum.images.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
                    <button
                      onClick={() => setLightboxUrl(getImageUrl(img.url))}
                      className="w-full h-full"
                      title="Voir en grand"
                    >
                      <img
                        src={getImageUrl(img.url)}
                        alt="vinyle"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </button>
                    <button
                      onClick={() => handleImageDelete(img.id)}
                      disabled={deletingImageId === img.id}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 flex items-center justify-center min-w-[28px] min-h-[28px]"
                      title="Supprimer cette photo"
                    >
                      {deletingImageId === img.id ? (
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <IoTrashOutline size={14} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-gray-500 italic">Les images sont nettoyées côté serveur (EXIF/GPS supprimés) avant stockage. JPEG/PNG→WebP, max 5MB.</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
            aria-label="Fermer"
          >
            <IoCloseOutline size={28} />
          </button>
          <img
            src={lightboxUrl}
            alt="aperçu vinyle"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Delete Modal */}
      {modaleDeleteAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-md">
          <div className="bg-gray-800 w-full max-w-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">Retirer du bac ?</h2>
              <button 
                onClick={() => setModaleDeleteAlbum(false)} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-gray-300 text-center text-sm">
                Es-tu sûr de vouloir retirer <span className="text-white font-bold">{album?.title}</span> de ta collection personnelle ?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setModaleDeleteAlbum(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Garder
                </button>
                <button
                  onClick={submitDeleteUserAlbum}
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

export default MyAlbumDetails;
