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
            <div>
              Genre:{" "}
              {album?.genres.map((genre) => (
                <>{genre?.name}</>
              ))}
            </div>
          </header>

          <section className="personal-section">
            <hr />

            <div className="details-grid">
              <div className="detail-item">
                <div className="label">Prix d'achat :</div>
                <div className="value">
                  {userAlbum?.price ? `${userAlbum.price} €` : "—"}
                </div>

                <div className="label">État du disque :<span className="condition">
                  {userDatas?.userAlbum?.condition?.nameFR || "Non renseigné"}
                </span></div>
                
                <div className="vinylVariant">
                  Variante: {album?.vinylVariant?.nameFR || "Non renseigné"}
                </div>
                <div className="value">
                  {userDatas?.userAlbum?.notes || ""}
                </div>
                <div className="label">Couleur :{album.color || "Standard"}</div>
               
                <div className="value">
                  {album?.format?.name || "Format non renseigné"} -{" "}
                  {album?.format?.speed || "Format non renseigné"}
                </div>
                <div className="value">
                  {album.barCode || "Code bar inconnu"}
                </div>
                <div className="value">
                  {userDatas?.userAlbum?.diskNumber ||
                    "Nombre de disques inconnu"}
                </div>
                <div className="value">
                  {userDatas?.userAlbum?.trackCount ||
                    "Nombre de pistes inconnu"}
                </div>

                {userDatas?.userAlbum?.notes && (
                  <div className="detail-notes">
                    <div className="label">Notes personnelles :</div>
                    <p>{userAlbum.notes}</p>
                  </div>
                )}
              </div>
            </div>
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
