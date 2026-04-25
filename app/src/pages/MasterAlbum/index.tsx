import axios from "axios";
import { useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { IoHeartOutline, IoLibrary, IoLibraryOutline  } from "react-icons/io5";
import { useUser } from "../../contexts/userContext";

import useToast from "../../hooks/useToast";
import type { AlbumData } from "../../types/album";

import { useCollection } from "../../hooks/useCollection";

import "./MasterAlbum.scss";

const MasterAlbum = () => {
  const { id } = useParams<{ id: string }>();
  const { userIsLogged } = useUser();
  const { allMetadata, getAllMetadata } = useCollection();
  const [masterAlbumDetails, setMasterAlbumDetails] =
    useState<AlbumData | null>(null);
  const { onError } = useToast();
  const [isOwned, setIsOwned] = useState(false);
  const [modalAddAlbumToUserCollection, setModalAddAlbumToUserCollection] =
    useState(false);
  const [addAlbumToCollection, setAddAlbumToCollection] = useState({
    price: "",
    variantId: "",
    conditionId: "",
  });
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const masterAlbumDetails = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_DEV}/albums/${id}`,
          {
            withCredentials: true,
          },
        );
        setMasterAlbumDetails(masterAlbumDetails.data);
        await albumIsInUserCollection();
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };
    getAllMetadata();
    fetchData();
  }, [id, userIsLogged]);

  if (!masterAlbumDetails) return <div>Chargement...</div>;

  const addToUserWishlist = async () => {
    if (!userIsLogged) {
      onError(
        `Vous devez être connecté à l'application pour utiliser cette fonctionnalité`,
      );
    }
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/wishlists/${id}`,
        {},
        {
          withCredentials: true,
        },
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const openModalAddAlbumToUserCollection = async () => {
    if (!userIsLogged) {
      onError(
        `Vous devez être connecté à l'application pour utiliser cette fonctionnalité`,
      );
    }
    setModalAddAlbumToUserCollection(true);
  };
  const addAlbumToUserCollection = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/collections/${id}`,
        {
          price: albumAddedToCollection.price,
          conditionId: albumAddedToCollection.conditionId,
        },
        {
          withCredentials: true,
        },
      );
      console.log(result);
      setModalAddAlbumToUserCollection(false);
      await albumIsInUserCollection();
    } catch (error) {
      onError(error.response.data.message);
      //console.log(error.response.data.message);
    }
  };

  const changeDataAlbum = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setAlbumAddedToCollection({
      ...albumAddedToCollection,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="master-album">
      <div className="master-album-header">
        <div className="master-album-cover">
          <img
            src={
              masterAlbumDetails?.coverUrl || "https://via.placeholder.com/200"
            }
            alt={masterAlbumDetails?.title}
          />
        </div>
      </div>
      <div className="master-album__datas">
        <div className="master-album__infos">
          <div className="master-album__title-artist">
            {masterAlbumDetails?.title} - {masterAlbumDetails?.artist}
          </div>
          <div>Année: {masterAlbumDetails?.releaseDate}</div>
          <div>Couleur: {masterAlbumDetails?.color}</div>
          <div>Code-barres: {masterAlbumDetails?.barCode}</div>
          <div>Nombre de disques: {masterAlbumDetails?.diskNumber}</div>
          <div>Nombre de pistes: {masterAlbumDetails?.trackCount}</div>
          <div>Format: {masterAlbumDetails?.format?.name}</div>
          <div>Vitesse: {masterAlbumDetails?.format?.speed}</div>
          {/* <div>Description: {masterAlbumDetails?.format?.description}</div> */}
          <div>
            Genres:{" "}
            {masterAlbumDetails?.genres?.map((g) => g.nameFR).join(", ")}
          </div>
          <div>
            Styles:{" "}
            {masterAlbumDetails?.styles?.map((s) => s.nameFR).join(", ")}
          </div>
          <div>
            Variante:{" "}
            {masterAlbumDetails?.vinylVariants
              ?.map((vv) => vv.nameFR)
              .join(", ")}
          </div>

          <div className="master-album__actions">
            <div className="master-album__add-to-wishlist">
              <IoHeartOutline onClick={addToUserWishlist} />
            </div>
            {userIsLogged && (
              <div
                className="album-card__owned-badge"
                title={isOwned ? "Dans ma collection" : "Ajouter à ma collection"}
              >
                {isOwned ? (
                  <IoLibrary onClick={openModalAddAlbumToUserCollection} />
                ) : (
                  <IoLibraryOutline onClick={openModalAddAlbumToUserCollection} />
                )}
              </div>
            )}
          </div>
        </div>
        {modalAddAlbumToUserCollection && (
          <div className="modal">
            <div className="modal-content">
              <h2>Ajouter à ma collection</h2>
              <form action="submit">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Prix"
                  name="price"
                  value={albumAddedToCollection.price}
                  onChange={changeDataAlbum}
                />

                <select
                  name="conditionId"
                  value={albumAddedToCollection.conditionId}
                  onChange={changeDataAlbum}
                >
                  <option value="">-- État --</option>
                  {allMetadata?.conditions?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameFR}
                    </option>
                  ))}
                </select>
                <button onClick={(e) => addAlbumToUserCollection(e)}>
                  Ajouter
                </button>
                <button onClick={() => setModalAddAlbumToUserCollection(false)}>
                  Annuler
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterAlbum;
