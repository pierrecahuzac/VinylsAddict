import { type ChangeEvent,  type Dispatch, type SetStateAction, type SyntheticEvent } from "react";


interface AlbumFormState {
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


interface MetadataItem {
  id: string;
  name?: string;
  nameEN?: string;
}

interface AllMetadata {
  formats?: MetadataItem[];
  conditions?: MetadataItem[];
  variants?: MetadataItem[];
  genres?: MetadataItem[];
  style?: MetadataItem[];
}


interface ModaleProps {
  
  submitNewAlbum: (e: SyntheticEvent<HTMLFormElement>) => void | Promise<void>;
  
  album: AlbumFormState;
  changeDataAlbum: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  
 
  allMetadata: AllMetadata | null; 
  
  setModaleAddNewAlbum: Dispatch<SetStateAction<boolean>>;
}

const Modale = ({
  submitNewAlbum,
  album,
  changeDataAlbum,
  allMetadata,
  setModaleAddNewAlbum,
}: ModaleProps) => {
  return (
    <div className="modale_add_new_album">
      <div className="modale_content">
        <h2>Ajouter un vinyle</h2>
        <form onSubmit={submitNewAlbum}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Titre"
              name="title"
              value={album.title}
              onChange={changeDataAlbum}
              required
            />
            <input
              type="text"
              placeholder="Artiste"
              name="artist"
              value={album.artist}
              onChange={changeDataAlbum}
              required
            />
          </div>

          <input
            type="text"
            placeholder="URL Image (Cover)"
            name="coverUrl"
            value={album.coverUrl}
            onChange={changeDataAlbum}
          />

          <div className="form-row">
            <input
              type="number"
              placeholder="Année"
              name="year"
              value={album.year}
              onChange={changeDataAlbum}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Prix"
              name="price"
              value={album.price}
              onChange={changeDataAlbum}
            />
          </div>

          <select name="formatId" value={album.formatId} onChange={changeDataAlbum}>
            <option value="">-- Format --</option>
            {allMetadata?.formats?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <select name="conditionId" value={album.conditionId} onChange={changeDataAlbum}>
            <option value="">-- État du disque --</option>
            {allMetadata?.conditions?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameEN}
              </option>
            ))}
          </select>

          <select name="variantId" value={album.variantId} onChange={changeDataAlbum}>
            <option value="">-- Variante --</option>
            {allMetadata?.variants?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nameEN}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Couleur précise"
            name="color"
            value={album.color}
            onChange={changeDataAlbum}
          />

          <select name="genreId" value={album.genreId} onChange={changeDataAlbum}>
            <option value="">-- Genre --</option>
            {allMetadata?.genres?.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select name="styleId" value={album.styleId} onChange={changeDataAlbum}>
            <option value="">-- Style --</option>
            {allMetadata?.style?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="buttons">
            <button type="submit" className="btn-save">
              Enregistrer
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setModaleAddNewAlbum(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modale;