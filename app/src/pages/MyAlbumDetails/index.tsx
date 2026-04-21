import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

        const userRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_DEV}/users/albums/${albumId}`,
          {
            withCredentials: true,
          },
        );
        console.log(userRes.data);
        
        setData(userRes.data);
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

  
 

  return (
    <div className="myAlbumDetails">
      <div className="myAlbumDetails-header">
        <div className="myAlbumDetails-cover">
          <img
            src={data?.userAlbum?.album?.coverUrl || "https://via.placeholder.com/400"}
            alt={`${data.userAlbum?.album?.title} cover`}
          />
        </div>
      </div>

      <div className="myAlbumDetails__datas">
        <div className="myAlbumDetails__infos">
          <header className="title-section">
            <h1 className="myAlbumDetails__title-artist">
              {data?.album?.title} <span className="separator">—</span> {data?.album?.artist}
            </h1>
            <p className="metadata">
              Année de sortie : {data?.userAlbum?.releaseDate || "Année inconnue"}
            </p>
            <div>
              Genre:{" "}
              {data?.album?.genres.map((genre) => (
                <span key={genre.id}>{genre?.name}</span>
              ))}
            </div>
          </header>

          <section className="personal-section">
            <hr />

            <div className="details-grid">
              <div className="detail-item">
                <div className="label">Prix d'achat :</div>
                <div className="value">
                  {data?.userAlbum?.price ? `${data.userAlbum.price} €` : "—"}
                </div>

                <div className="label">
                  État du disque :
                  <span className="condition">
                    {data?.userAlbum?.condition?.nameFR || "Non renseigné"}
                  </span>
                </div>

                <div className="vinylVariant">
                  Variante: {data?.userAlbum?.vinylVariant?.nameFR || "Non renseigné"}
                </div>
                <div className="value">{data?.userAlbum?.notes || ""}</div>
                <div className="label">
                  Couleur :{data?.userAlbum?.color || "Standard"}
                </div>

                <div className="value">
                  {data?.album?.format?.name || "Format non renseigné"} -{" "}
                  {data?.album?.format?.speed || "Format non renseigné"}
                </div>
                <div className="value">
                  {data?.album?.barCode || "Code bar inconnu"}
                </div>
                <div className="value">
                  {data?.album?.diskNumber || "Nombre de disques inconnu"}
                </div>
                <div className="value">
                  {data?.album?.trackCount || "Nombre de pistes inconnu"}
                </div>

                {data?.userAlbum?.notes && (
                  <div className="detail-notes">
                    <div className="label">Notes personnelles :</div>
                    <p>{data.userAlbum.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyAlbumDetails;
