import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Album from "../../components/Album/index.tsx";
import { IoArrowBackOutline } from "react-icons/io5";

interface ArtistAlbum {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  releaseDate?: number | string;
  color?: string;
}

const Artist = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const artistName = name ? decodeURIComponent(name) : "";
  const [albums, setAlbums] = useState<ArtistAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtistAlbums = async () => {
      if (!artistName) return;
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_DEV}/albums?artist=${encodeURIComponent(artistName)}`,
          { withCredentials: true }
        );
        setAlbums(res.data || []);
      } catch (e) {
        console.error("Erreur fetch artist", e);
        setAlbums([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtistAlbums();
  }, [artistName]);

  const openAlbumDetails = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };

  return (
    <div className="p-4 flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <header className="space-y-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
        >
          <IoArrowBackOutline size={18} /> Retour
        </button>
        <h1 className="text-3xl font-black text-white tracking-tight truncate">
          {artistName}
        </h1>
        <div className="text-gray-400 text-sm">
          {isLoading ? (
            <span className="animate-pulse text-[#f1c40f]">Chargement…</span>
          ) : (
            <>
              <span className="text-[#f1c40f] font-bold">{albums.length}</span> album{albums.length > 1 ? "s" : ""} trouvé{albums.length > 1 ? "s" : ""}
            </>
          )}
        </div>
      </header>

      <main className="w-full">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-[#f1c40f] animate-pulse">Chargement des vinyles…</p>
          </div>
        ) : albums.length === 0 ? (
          <p className="text-center text-gray-500 py-10 italic">
            Aucun album trouvé pour {artistName}.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {albums.map((item) => (
              <Album
                id={item.id}
                key={item.id}
                title={item.title}
                artist={item.artist}
                cover={item.coverUrl}
                year={String(item.releaseDate ?? "")}
                color={item.color}
                onClick={() => openAlbumDetails(item.id)}
                className="w-full"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Artist;
