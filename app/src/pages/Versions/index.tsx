import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Album from "../../components/Album/index.tsx";
import { IoArrowBackOutline } from "react-icons/io5";

interface VersionAlbum {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  releaseDate?: number | string;
  color?: string;
  vinylVariant?: { name?: string; nameFR?: string } | null;
  format?: { name: string; speed?: string | null } | null;
}

const Versions = () => {
  const { title } = useParams<{ title: string }>();
  const navigate = useNavigate();
  const decodedTitle = title ? decodeURIComponent(title) : "";
  const [albums, setAlbums] = useState<VersionAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      if (!decodedTitle) return;
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_DEV}/albums?title=${encodeURIComponent(decodedTitle)}`,
          { withCredentials: true }
        );
        setAlbums(res.data || []);
      } catch (e) {
        console.error("Erreur fetch versions", e);
        setAlbums([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVersions();
  }, [decodedTitle]);

  const openAlbumDetails = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };

  const artist = albums[0]?.artist || "";

  return (
    <div className="p-4 flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <header className="space-y-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
        >
          <IoArrowBackOutline size={18} /> Retour
        </button>
        <h1 className="text-3xl font-black text-white tracking-tight">
          {decodedTitle}
        </h1>
        {artist && (
          <button
            onClick={() => navigate(`/artist/${encodeURIComponent(artist)}`)}
            className="text-sm text-[#f1c40f] hover:underline"
          >
            {artist}
          </button>
        )}
        <div className="text-gray-400 text-sm">
          {isLoading ? (
            <span className="animate-pulse text-[#f1c40f]">Chargement…</span>
          ) : (
            <>
              <span className="text-[#f1c40f] font-bold">{albums.length}</span> version{albums.length > 1 ? "s" : ""} disponible{albums.length > 1 ? "s" : ""}
            </>
          )}
        </div>
      </header>

      <main className="w-full">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-[#f1c40f] animate-pulse">Chargement des pressages…</p>
          </div>
        ) : albums.length === 0 ? (
          <p className="text-center text-gray-500 py-10 italic">
            Aucune version trouvée pour {decodedTitle}.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {albums.map((item) => (
              <div key={item.id} className="relative">
                <Album
                  id={item.id}
                  title={item.title}
                  artist={item.artist}
                  cover={item.coverUrl}
                  year={String(item.releaseDate ?? "")}
                  color={item.color}
                  onClick={() => openAlbumDetails(item.id)}
                  className="w-full"
                />
                {/* Variante badge */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {item.color && (
                    <span className="bg-gray-900/80 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full border border-white/20">
                      {item.color}
                    </span>
                  )}
                  {item.vinylVariant && (
                    <span className="bg-[#f1c40f] text-gray-900 text-[10px] px-2 py-1 rounded-full font-bold">
                      {item.vinylVariant.nameFR || item.vinylVariant.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Versions;
