import { useState } from "react";
import api from "../lib/axios";
import type { AllMetadata, AlbumData, UserAlbumData } from "../types/album";

type CollectionScope = "albums" | "userAlbums";

let albumsCache: AlbumData[] | null = null;
let userAlbumsCache: UserAlbumData[] | null = null;
let metadataCache: AllMetadata | null = null;
let genresCache: unknown[] | null = null;

export const clearCollectionCache = () => {
  albumsCache = null;
  userAlbumsCache = null;
  metadataCache = null;
  genresCache = null;
};

export const useCollection = <T = AlbumData>(scope?: CollectionScope) => {
  const initialAlbums = (
    scope === "albums"
      ? albumsCache
      : scope === "userAlbums"
        ? userAlbumsCache
        : null
  ) as T[] | null;

  const [genres, setGenres] = useState<unknown[]>(genresCache ?? []);
  const [albums, setAlbums] = useState<T[]>(initialAlbums ?? []);
  const [isLoading, setIsLoading] = useState(
    Boolean(scope) && initialAlbums === null,
  );
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);
  const [allMetadata, setAllMetadata] = useState<AllMetadata | null>(
    metadataCache,
  );

  const getAllMetadata = async () => {
    if (!metadataCache) setIsMetadataLoading(true);
    try {
      const result = await api.get("/metadatas");

      metadataCache = result.data;
      setAllMetadata(result.data);
    } catch (error) {
      console.error("Erreur Métadonnées:", error);
    } finally {
      setIsMetadataLoading(false);
    }
  };

  const getAllGenres = async () => {
    if (!genresCache) setIsLoading(true);
    try {
      const result = await api.get("/genres");

      genresCache = result.data;
      setGenres(result.data);
    } catch (error) {
      console.error("Erreur Genres:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllAlbums = async () => {
    if (!albumsCache) setIsLoading(true);
    try {
      const result = await api.get("/albums");

      albumsCache = result.data;
      setAlbums(result.data);
    } catch (error) {
      console.error("Erreur Albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllUserAlbums = async () => {
    if (!userAlbumsCache) setIsLoading(true);
    try {
      const result = await api.get("/users/albums");

      userAlbumsCache = result.data.allUserAlbums;
      setAlbums(result.data.allUserAlbums);
    } catch (error) {
      console.error("Erreur Collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    genres,
    albums,
    getAllGenres,
    getAllAlbums,
    getAllUserAlbums,
    isLoading,
    isMetadataLoading,
    getAllMetadata,
    allMetadata,
  };
};
