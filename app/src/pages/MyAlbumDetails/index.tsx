import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoHeartOutline } from "react-icons/io5";

import { useUser } from "../../contexts/userContext";

import "./MyAlbumDetails.scss";

interface AlbumData {
  title: string;
  artist: string;
  coverUrl: string;
  releaseDate?: number;
  color?: string;
  trackCount?: number;
  diskNumber?: number;
  barCode?: string;
  format: {
    speed: string;
    name: string;
  };
}

interface UserAlbumData {
  userAlbum: {
    price: number | null;
    notes?: string;
    condition?: {
      nameFR?: string;
    };
  };
}

interface FullAlbumState {
  album: AlbumData;
  userDatas: UserAlbumData;
}

const MyAlbumDetails = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { userIsLogged } = useUser();

  const [data, setData] = useState<FullAlbumState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFullDetails = async () => {
      if (!albumId) return;

      try {
        setLoading(true);
        setError(null);

        const [albumRes, userRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL_DEV}/albums/getOneAlbum/${albumId}`,
            {
              withCredentials: true,
            },
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL_DEV}/albums/getUserAlbum/${albumId}`,
            {
              withCredentials: true,
            },
          ),
        ]);

        setData({
          album: albumRes.data,
          userDatas: userRes.data,
        });
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setError("Impossible de charger les détails de cet album.");
      } finally {
        setLoading(false);
      }
    };

    fetchFullDetails();
  }, [albumId, userIsLogged]);

  if (loading)
    return <div className="status-msg">Chargement des détails...</div>;
  if (error || !data)
    return (
      <div className="status-msg error">{error || "Album introuvable"}</div>
    );

  const { album, userDatas } = data;
  const { userAlbum, condition } = userDatas;

  return (
    <div className="myAlbumDetails">
      <div className="myAlbumDetails-header">
        <div className="myAlbumDetails-cover">
          <img
            src={album.coverUrl || "https://via.placeholder.com/400"}
            alt={`${album.title} cover`}
          />
        </div>
      </div>

      <div className="myAlbumDetails__datas">
        <div className="myAlbumDetails__infos">
          <header className="title-section">
            <h1 className="myAlbumDetails__title-artist">
              {album.title} <span className="separator">—</span> {album.artist}
            </h1>
            <p className="metadata">
              Année de sortie : {album.releaseDate || "Année inconnue"}
            </p>
          </header>

          <section className="personal-section">
            <hr />

            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Prix d'achat :</span>
                <span className="value">
                  {userAlbum?.price ? `${userAlbum.price} €` : "—"}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">État du disque :</span>
                <span className="condition">
                  {userDatas?.userAlbum?.condition.nameFR || "Non renseigné"}
                </span>
                <span className="value">
                  {userDatas?.userAlbum?.notes || ""}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Couleur :</span>
                <span className="value">{album.color || "Standard"}</span>
              </div>
            </div>
            <span className="value">
              {album.format.name || "Format non renseigné"} -{" "}
              {album.format.speed || "Format non renseigné"}
            </span>
            <span className="value">{album.barCode || "Code bar inconnu"}</span>
            <span className="value">
              {album.diskNumber || "Nombre de disques inconnu"}
            </span>
            <span className="value">
              {album.trackCount || "Nombre de pistes inconnu"}
            </span>

            {userAlbum?.notes && (
              <div className="detail-notes">
                <span className="label">Notes personnelles :</span>
                <p>{userAlbum.notes}</p>
              </div>
            )}
          </section>

          {/* <div className="myAlbumDetails__actions">
            <button className="wishlist-btn" title="Ajouter aux favoris">
              <IoHeartOutline size={28} />
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MyAlbumDetails;
