import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useUser } from "../../contexts/userContext";

import type { FullAlbumState } from "../../types/album";

import "./MyAlbumDetails.scss";

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
    return <div className="status-msg">Chargement des détails...</div>;
  if (error || !data)
    return (
      <div className="status-msg error">{error || "Album introuvable"}</div>
    );

  const album = data.userAlbum?.album || data.album;
  const userAlbum = data.userAlbum;

  return (
    <div className="myAlbumDetails">
      <div className="myAlbumDetails-header">
        <div className="myAlbumDetails-cover">
          <img
            src={album?.coverUrl || "https://via.placeholder.com/400"}
            alt={`${album?.title} cover`}
          />
        </div>
      </div>
      <div className="myAlbumDetails__datas">
        <div className="myAlbumDetails__infos">
          <header className="title-section">
            <h1 className="myAlbumDetails__artist-title">
              {album?.artist}
              <span className="separator">—</span>
              {album?.title}
            </h1>
            <p className="metadata">
              Année de sortie : {album?.releaseDate || "Année inconnue"}
            </p>
            <div>
              Genre :{" "}
              {album?.genres?.map((genre) => (
                <span key={genre.id}>{genre?.nameFR || genre?.name}</span>
              ))}
            </div>
            <div>
              {(album?.styles?.length ?? 0) > 1 ? "Styles" : "Style"} :{" "}
              {album?.styles?.map((style) => (
                <span key={style.id}>{style?.nameFR || style?.name}</span>
              ))}
            </div>
          </header>
          <section className="personal-section">
            <div className="details-grid">
              <div className="detail-item">
                <div className="label">
                  Prix d'achat : {userAlbum?.price ? `${userAlbum.price} €` : "—"}
                </div>
                <div className="label">
                  État du disque : {userAlbum?.condition?.nameFR || "Non renseigné"}
                </div>
                <div className="label">
                  Variante : {album?.vinylVariant?.nameFR || "Non renseigné"}
                </div>
                {userAlbum?.notes && (
                  <div className="label">Notes : {userAlbum.notes}</div>
                )}
                <div className="label">
                  Couleur : {album?.color || "Standard"}
                </div>
                <div className="label">
                  Format : {album?.format?.name || "Format non renseigné"}
                </div>
                <div className="label">
                  Nombre de disques : {album?.diskNumber || "inconnu"}
                </div>
                <div className="label">
                  Nombre de pistes : {album?.trackCount || "inconnu"}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyAlbumDetails;
