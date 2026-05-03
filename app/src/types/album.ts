export interface AlbumFormState {
  title: string;
  artist: string;
  coverUrl: string;
  year: string | number;
  price: string | number;
  formatId: string;
  conditionId: string;
  variantId: string;
  color: string;
  genreId: string;
  styleId: string;
  trackCount?: string | number;
  diskCount?: string | number;
}

export interface AlbumProps {
  title: string;
  artist: string;
  cover?: string;
  id: string;
  year: string;
  onClick: () => void;
  className?: string;
}

export interface MetadataItem {
  id: string;
  name?: string;
  nameEN?: string;
  nameFR?: string;
}

export interface AllMetadata {
  formats?: MetadataItem[] | [] | null;
  conditions?: MetadataItem[] | [] | null;
  variants?: MetadataItem[] | [] | null;
  genres?: MetadataItem[] | [] | null;
  styles?: MetadataItem[] | [] | null;
}

export interface AlbumState {
  artist: string;
  title: string;
  year: string;
  genreId: string;
  conditionId: string;
  variantId: string;
  formatId: string;
  price: string;
  coverUrl: string;
  color: string;
  styleId: string;
  trackCount?: string;
  diskCount?: string;
}

export interface AlbumData {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  releaseDate?: string | number;
  color?: string;
  trackCount?: number;
  diskNumber?: number;
  barCode?: string;
  format?: {
    speed?: string;
    name: string;
  };
  genres?: MetadataItem[];
  styles?: MetadataItem[];
  vinylVariants?: MetadataItem[];
  vinylVariant?: MetadataItem;
}

export interface UserAlbumData {
  id: string;
  price?: number;
  notes?: string;
  condition?: MetadataItem;
  album: AlbumData;
  userId?:string
}

export interface FullAlbumState {
  album: AlbumData;
  userAlbum?: UserAlbumData;
}
