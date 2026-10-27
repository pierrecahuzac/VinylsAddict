import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import type { AlbumFormState, AllMetadata } from "./album";

export interface ModaleProps {
  submitNewAlbum: (e: SyntheticEvent<HTMLFormElement>) => void | Promise<void>;
  album: AlbumFormState;
  changeDataAlbum: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  setAlbum?: Dispatch<SetStateAction<any>>;
  allMetadata: AllMetadata | null;
  setModaleAddNewAlbum: Dispatch<SetStateAction<boolean>>;
  addAlbumToCollection: boolean;
  setAddAlbumToCollection: Dispatch<SetStateAction<boolean>>;
  isCollectionContext?: boolean;
}