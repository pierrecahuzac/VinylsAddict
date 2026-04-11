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
}

export interface MetadataItem {
  id: string;
  name?: string;
  nameEN?: string;
}

export interface AllMetadata {
  formats?: MetadataItem[];
  conditions?: MetadataItem[];
  variants?: MetadataItem[];
  genres?: MetadataItem[];
  style?: MetadataItem[];
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
}

export interface AlbumData {
  title: string;
  artist: string;
  coverUrl: string;
  releaseDate?: number;
}

export interface UserAlbumData {
  price?: number;
  color?: string;
  condition?: { nameFR: string };
  notes?: string;
}
