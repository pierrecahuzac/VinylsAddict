import type { ModaleProps } from "../../types/modale";


const Modale = ({
  submitNewAlbum,
  album,
  changeDataAlbum,
  allMetadata,
  setModaleAddNewAlbum,
  addAlbumToCollection,
  setAddAlbumToCollection,
  isCollectionContext = false,
}: ModaleProps) => {
  console.log(allMetadata);
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-gray-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-800 w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl my-8">
       
        
        <form onSubmit={submitNewAlbum} className="p-6 space-y-5">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Titre</label>
              <input
                type="text"
                placeholder="Ex: Dark Side of the Moon"
                name="title"
                value={album.title}
                onChange={changeDataAlbum}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Artiste</label>
              <input
                type="text"
                placeholder="Ex: Pink Floyd"
                name="artist"
                value={album.artist}
                onChange={changeDataAlbum}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">URL de la pochette</label>
            <input
              type="text"
              placeholder="https://..."
              name="coverUrl"
              value={album.coverUrl}
              onChange={changeDataAlbum}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Année</label>
              <input
                type="number"
                placeholder="1973"
                name="year"
                value={album.year}
                onChange={changeDataAlbum}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Pistes</label>
              <input
                type="number"
                placeholder="10"
                name="trackCount"
                value={album.trackCount}
                onChange={changeDataAlbum}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Disques</label>
              <input
                type="number"
                placeholder="1"
                name="diskCount"
                value={album.diskCount}
                onChange={changeDataAlbum}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              />
            </div>
          </div>

          {/* Technical Selects */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Format</label>
              <select
                name="formatId"
                value={album.formatId}
                onChange={changeDataAlbum}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              >
                <option value="">-- Format --</option>
                {allMetadata?.formats?.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Variante</label>
              <select
                name="variantId"
                value={album.variantId}
                onChange={changeDataAlbum}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              >
                <option value="">-- Variante --</option>
                {allMetadata?.variants?.map((v) => (
                  <option key={v.id} value={v.id}>{v.nameFR || v.nameEN || v.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Genre</label>
              <select
                name="genreId"
                value={album.genreId}
                onChange={changeDataAlbum}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              >
                <option value="">-- Genre --</option>
                {allMetadata?.genres?.map((g) => (
                  <option key={g.id} value={g.id}>{g.nameFR || g.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Style</label>
              <select
                name="styleId"
                value={album.styleId}
                onChange={changeDataAlbum}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
              >
                <option value="">-- Style --</option>
                {allMetadata?.style?.map((s) => (
                  <option key={s.id} value={s.id}>{s.nameFR || s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Couleur précise</label>
            <input
              type="text"
              placeholder="Ex: Transparent Blue"
              name="color"
              value={album.color}
              onChange={changeDataAlbum}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
            />
          </div>

          {/* Collection Checkbox */}
          {!isCollectionContext && (
            <label className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-700 cursor-pointer group">
              <input
                type="checkbox"
                name="addToCollection"
                checked={addAlbumToCollection}
                onChange={() => setAddAlbumToCollection(!addAlbumToCollection)}
                className="w-5 h-5 rounded border-gray-700 text-[#f1c40f] focus:ring-[#f1c40f] bg-gray-950"
              />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Je possède cet album</span>
            </label>
          )}

          {/* Price & Condition */}
          {(addAlbumToCollection || isCollectionContext) && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500/70 ml-1">Prix (€)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="20.00"
                  name="price"
                  value={album.price}
                  onChange={changeDataAlbum}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500/70 ml-1">État</label>
                <select
                  name="conditionId"
                  value={album.conditionId}
                  onChange={changeDataAlbum}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f1c40f] transition-all"
                >
                  <option value="">-- État --</option>
                  {allMetadata?.conditions?.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameFR || c.nameEN || c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-gray-800 pb-2">
            <button
              type="button"
              className="flex-1 px-4 py-4 bg-gray-700 text-white font-bold rounded-2xl hover:bg-gray-600 transition-colors"
              onClick={() => setModaleAddNewAlbum(false)}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-4 bg-[#f1c40f] text-gray-950 font-black rounded-2xl hover:bg-amber-400 active:scale-95 transition-all shadow-xl shadow-[#f1c40f]/10"
            >
              ENREGISTRER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modale;
