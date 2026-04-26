import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IoHeart,
  IoHeartOutline,
  IoLibrary,
  IoLibraryOutline,
} from "react-icons/io5";
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

  const deleteAlbumFromCollection = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL_DEV}/collections/${id}`,
        {
          withCredentials: true,
        },
      );
      setIsOwned(false);
      await getCatalog();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
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
    <div className="masterAlbum-container">
      <div className="masterAlbum-content">
        <div className="masterAlbum-cover">
          <img
            src={
              masterAlbumDetails?.coverUrl || "https://via.placeholder.com/200"
            }
            alt={masterAlbumDetails?.title}
          />
        </div>
        <div className="masterAlbum-infos">
          <h1 className="masterAlbum-title">
            {masterAlbumDetails?.title} - {masterAlbumDetails?.artist}
          </h1>
          <div>Année: {masterAlbumDetails?.releaseDate}</div>
          <div>
            Format: {masterAlbumDetails?.format?.name} (
            {masterAlbumDetails?.format?.speed})
          </div>
          <div>Code barre: {masterAlbumDetails?.barCode}</div>
          <div>
            Genre(s):{" "}
            {masterAlbumDetails?.genres
              ?.map((g) => g.nameFR || g.name)
              .join(", ")}
          </div>
          <div>
            Style(s):{" "}
            {masterAlbumDetails?.styles
              ?.map((s) => s.nameFR || s.name)
              .join(", ")}
          </div>
          <div>
            Variante(s):{" "}
            {masterAlbumDetails?.vinylVariants
              ?.map((vv) => vv.nameFR || vv.name)
              .join(", ")}
          </div>
        </div>

        {userIsLogged && (
          <div className="masterAlbum-actions">
            <button
              className="action-btn"
              onClick={
                 () => setModalAddAlbumToUserCollection(true)
              }
            >
              {isOwned ? (
                <>
                  <IoLibrary className="icon owned" /> Dans ma collection
                </>
              ) : (
                <>
                  <IoLibraryOutline className="icon" /> Ajouter à ma collection
                </>
              )}
            </button>

            <button
              className="action-btn"
              onClick={
                isWishlisted ? deleteAlbumFromWishlist : addAlbumToWishlist
              }
            >
              {isWishlisted ? (
                <>
                  <IoHeart className="icon wishlisted" /> Dans ma wishlist
                </>
              ) : (
                <>
                  <IoHeartOutline className="icon" /> Ajouter à ma wishlist
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {modalAddAlbumToUserCollection && (
        <div className="modal">
          <div className="modal-content">
            <h2>Ajouter à ma collection</h2>
            <form onSubmit={addAlbumToUserCollection}>
              <div className="form-group">
                <label>Prix d'achat</label>
                <input
                  type="number"
                  name="price"
                  value={albumAddedToCollection.price}
                  onChange={changeDataAlbum}
                  placeholder="Prix"
                />
              </div>
              <div className="form-group">
                <label>État du disque</label>
                <select
                  name="conditionId"
                  value={albumAddedToCollection.conditionId}
                  onChange={changeDataAlbum}
                  required
                >
                  <option value="">-- Choisir un état --</option>
                  {allMetadata?.conditions?.map(
                    (c: { id: number; name: string; nameFR?: string }) => (
                      <option key={c.id} value={c.id}>
                        {c.nameFR || c.name}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  Ajouter
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setModalAddAlbumToUserCollection(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterAlbum;
