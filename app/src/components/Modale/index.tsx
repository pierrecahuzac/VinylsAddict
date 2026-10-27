import { useState, type ChangeEvent } from "react";
import type { ModaleProps } from "../../types/modale";
import type { MetadataItem } from "../../types/album";
import api from "../../lib/axios";
import { useBarcodeScanner } from "../../hooks/useBarcodeScanner";

const proxiedImage = (url?: string) =>
  url
    ? `${import.meta.env.VITE_BACKEND_URL_DEV}/discogs/image?url=${encodeURIComponent(url)}`
    : "";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const GENRE_ALIASES: Record<string, string> = {
  rock: "rock",
  pop: "pop",
  jazz: "jazz",
  "hip hop": "hip-hop",
  electronic: "electronic",
  blues: "blues",
  classical: "classical",
  reggae: "reggae",
  soul: "soul",
  funk: "funk",
  disco: "disco",
};

const COLOR_WORDS = [
  "black", "white", "red", "blue", "green", "yellow", "orange", "purple",
  "pink", "gold", "silver", "grey", "gray", "brown", "clear", "transparent",
  "translucent", "opaque", "turquoise", "violet", "maroon", "beige", "cream",
];

const getDiscogsVinylFormat = (release: any) =>
  (release.formats || []).find((format: any) =>
    normalize(format.name || "").includes("vinyl"),
  ) || release.formats?.[0] || {};

const matchDiscogsFormat = (release: any, formats: MetadataItem[] = []) => {
  const discogsFormat = getDiscogsVinylFormat(release);
  const descriptions: string[] = discogsFormat.descriptions || [];
  const haystack = normalize(
    [discogsFormat.name, discogsFormat.text, ...descriptions]
      .filter(Boolean)
      .join(" "),
  );

  const isMaxi = /\bmaxi\b/.test(haystack);
  const isEp = /\bep\b/.test(haystack);
  const isSingle = /\bsingle\b/.test(haystack);
  const type = isMaxi ? "maxi" : isEp ? "ep" : isSingle ? "single" : "lp";

  if (/\b78\b/.test(haystack)) {
    const found78 = formats.find((format) =>
      normalize(format.name || "").includes("78"),
    );
    if (found78) return found78.id;
  }

  const sizeMatch = haystack.match(/\b(12|10|7)\b/);
  const size = sizeMatch
    ? sizeMatch[1]
    : type === "single"
      ? "7"
      : type === "ep"
        ? "10"
        : "12";

  const scored = formats.map((format) => {
    const name = normalize(format.name || "");
    let score = 0;
    if (name.split(" ").includes(size)) score += 4;
    if (name.includes(type)) score += 3;
    if (type === "lp" && !/(single|ep|maxi)/.test(name)) score += 1;
    return { id: format.id, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].id : "";
};

const matchDiscogsVariant = (release: any, variants: MetadataItem[] = []) => {
  const discogsFormat = getDiscogsVinylFormat(release);
  const haystack = normalize(
    [discogsFormat.text, ...(discogsFormat.descriptions || []), release.notes]
      .filter(Boolean)
      .join(" "),
  );

  const found = variants.find((variant) => {
    const name = normalize(variant.nameEN || variant.name || "");
    if (!name || name === "black") return false;
    if (name === "picture disc") return haystack.includes("picture");
    return haystack.includes(name);
  });

  return found?.id || "";
};

const hasColorWord = (value: string) => {
  const normalized = normalize(value);
  return COLOR_WORDS.some((word) =>
    new RegExp(`\\b${word}\\b`).test(normalized),
  );
};

const findDiscogsColor = (release: any) => {
  const discogsFormat = getDiscogsVinylFormat(release);
  const candidates = [
    discogsFormat.text,
    ...(discogsFormat.descriptions || []),
  ]
    .filter(Boolean)
    .map((value: string) => value.trim())
    .filter(Boolean);

  const text = candidates[0];
  if (text && hasColorWord(text)) return text;

  const colorLabels = [...new Set(candidates.filter(hasColorWord))];
  return colorLabels.join(", ");
};

const matchDiscogsGenre = (release: any, genres: MetadataItem[] = []) => {
  const discogsGenres = (release.genres || []).map(normalize);
  const discogsStyles = (release.styles || []).map(normalize).join(" ");

  for (const discogsGenre of discogsGenres) {
    let target = GENRE_ALIASES[discogsGenre];
    if (discogsGenre === "funk soul") {
      target = discogsStyles.includes("funk")
        ? "funk"
        : discogsStyles.includes("disco")
          ? "disco"
          : "soul";
    }
    if (!target) continue;
    const targetName = normalize(target);
    const found = genres.find(
      (genre) =>
        normalize(genre.name || "") === targetName ||
        normalize(genre.nameFR || "") === targetName,
    );
    if (found) return found.id;
  }

  return "";
};

const matchDiscogsStyle = (release: any, styles: MetadataItem[] = []) => {
  const discogsStyles = (release.styles || []).map(normalize);
  if (!discogsStyles.length) return "";

  for (const discogsStyle of discogsStyles) {
    const exact = styles.find(
      (style) =>
        normalize(style.name || style.nameEN || style.nameFR || "") === discogsStyle,
    );
    if (exact) return exact.id;
  }

  for (const discogsStyle of discogsStyles) {
    const fuzzy = styles.find((style) => {
      const name = normalize(style.name || style.nameEN || style.nameFR || "");
      return name && (discogsStyle.includes(name) || name.includes(discogsStyle));
    });
    if (fuzzy) return fuzzy.id;
  }

  return "";
};

const Modale = ({
  submitNewAlbum,
  album,
  changeDataAlbum,
  setAlbum,
  allMetadata,
  setModaleAddNewAlbum,
  addAlbumToCollection,
  setAddAlbumToCollection,
  isCollectionContext = false,
}: ModaleProps) => {
  const [discogsQuery, setDiscogsQuery] = useState("");
  const [discogsResults, setDiscogsResults] = useState<any[]>([]);
  const [isSearchingDiscogs, setIsSearchingDiscogs] = useState(false);

  const handleDiscogsSearch = async () => {
    if (!discogsQuery.trim()) return;
    setIsSearchingDiscogs(true);
    try {
      const res = await api.get(
        `/discogs/search?q=${encodeURIComponent(discogsQuery)}&type=release&per_page=10`,
      );
      const results = res.data.results || [];
      setDiscogsResults(results);

      if (results.length) {
        try {
          const editionsRes = await api.get("/discogs/editions", {
            params: { ids: results.map((item: any) => item.id).join(",") },
          });
          const editionsById = new Map(
            (editionsRes.data.editions || []).map((edition: any) => [
              String(edition.id),
              edition,
            ]),
          );
          setDiscogsResults(
            results.map((item: any) => ({
              ...item,
              editionInfo: editionsById.get(String(item.id)),
            })),
          );
        } catch (err) {
          console.error("Erreur chargement des éditions Discogs:", err);
        }
      }
    } catch (err) {
      console.error("Erreur recherche Discogs:", err);
    } finally {
      setIsSearchingDiscogs(false);
    }
  };

  const handleSelectDiscogsRelease = async (releaseId: number) => {
    try {
      setIsSearchingDiscogs(true);
      const res = await api.get(`/discogs/releases/${releaseId}`);
      const release = res.data;

      const artistName = release.artists
        ? release.artists.map((a: any) => a.name.replace(/\s\(\d+\)$/, "")).join(", ")
        : "";
      const title = release.title || "";
      const year = release.year ? String(release.year) : "";
      const coverUrl = release.images?.[0]?.uri || release.thumb || "";
      const trackCount = release.tracklist?.filter(
        (track: any) => track.type_ !== "heading",
      ).length;

      const barcode =
        release.identifiers?.find(
          (identifier: any) =>
            normalize(identifier.type || "") === "barcode" &&
            identifier.value &&
            normalize(identifier.value) !== "none",
        )?.value || "";

      const vinylFormats = (release.formats || []).filter((item: any) =>
        normalize(item.name || "").includes("vinyl"),
      );
      const diskCount = vinylFormats.reduce(
        (total: number, item: any) => total + (Number(item.qty) || 1),
        0,
      );

      const formatId = matchDiscogsFormat(release, allMetadata?.formats || []);
      const variantId = matchDiscogsVariant(release, allMetadata?.variants || []);
      const color = findDiscogsColor(release);
      const genreId = matchDiscogsGenre(release, allMetadata?.genres || []);

      const genreStyles =
        allMetadata?.genres?.find((genre) => genre.id === genreId)?.styles ||
        allMetadata?.styles?.filter((style) => style.genreId === genreId) ||
        [];
      const styleId = matchDiscogsStyle(release, genreStyles);

      if (setAlbum) {
        setAlbum((prev: any) => ({
          ...prev,
          title,
          artist: artistName,
          year,
          coverUrl,
          barCode: barcode || prev.barCode,
          trackCount: trackCount ? String(trackCount) : prev.trackCount,
          diskCount: diskCount ? String(diskCount) : prev.diskCount,
          formatId: formatId || prev.formatId,
          variantId: variantId || prev.variantId,
          color: color || prev.color,
          genreId: genreId || prev.genreId,
          styleId: styleId || "",
        }));
      }
    } catch (err) {
      console.error("Erreur chargement release Discogs:", err);
    } finally {
      setIsSearchingDiscogs(false);
      setDiscogsResults([]);
      setDiscogsQuery("");
    }
  };

  const { start: startBarcodeScanner, stop: stopBarcodeScanner, isScanning: isScanningBarcode } =
    useBarcodeScanner(async (code: string) => {
        try {
          const res = await api.get(
            `/discogs/search?q=${encodeURIComponent(code)}&type=release&per_page=5`,
          );
          const results = res.data.results || [];
          if (results.length) {
            await handleSelectDiscogsRelease(results[0].id);
          }
        } catch (err) {
          console.error("Erreur scan code-barres:", err);
        }
    });

  const toggleBarcodeScanner = async () => {
    if (isScanningBarcode) {
      await stopBarcodeScanner();
    } else {
      await startBarcodeScanner();
    }
  };

  const handleGenreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const genreId = e.target.value;
    if (setAlbum) {
      setAlbum((prev: any) => ({ ...prev, genreId, styleId: "" }));
    } else {
      changeDataAlbum(e);
    }
  };

  const selectedGenre = allMetadata?.genres?.find(
    (genre) => genre.id === album.genreId,
  );
  const availableStyles: MetadataItem[] = album.genreId
    ? selectedGenre?.styles?.length
      ? selectedGenre.styles
      : allMetadata?.styles?.filter(
          (style) => style.genreId === album.genreId,
        ) || []
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white/5 w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl my-8">
        
        <form onSubmit={submitNewAlbum} className="p-6 space-y-5">
          {/* Discogs Auto-fill Widget */}
          <div className="p-4 bg-[#8b5cf6]/10 rounded-xl border border-[#8b5cf6]/30 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Daft Punk Discovery..."
                value={discogsQuery}
                onChange={(e) => setDiscogsQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleDiscogsSearch(); } }}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#8b5cf6] transition-all"
              />
              <button
                type="button"
                onClick={handleDiscogsSearch}
                disabled={isSearchingDiscogs || !discogsQuery.trim()}
                className="px-4 py-3 bg-[#8b5cf6] text-gray-950 font-bold text-sm rounded-xl hover:bg-amber-400 disabled:opacity-50 transition-all shrink-0"
              >
                {isSearchingDiscogs ? "..." : "Chercher"}
              </button>
              <button
                type="button"
                onClick={toggleBarcodeScanner}
                disabled={isSearchingDiscogs}
                className="px-4 py-3 bg-[#0a0a0a] border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/10 disabled:opacity-50 transition-all shrink-0"
              >
                {isScanningBarcode ? "Arrêter" : "Scanner"}
              </button>
            </div>
            <div id="barcode-scanner-reader" className="w-full bg-black rounded-xl" />
            {discogsResults.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-2 bg-[#0a0a0a] p-2 rounded-xl border border-white/10">
                {discogsResults.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectDiscogsRelease(item.id)}
                    className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                  >
                    <img
                      src={proxiedImage(item.cover_image || item.thumb) || "/VA_logo.webp"}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const image = e.currentTarget;
                        if (!image.src.endsWith("/VA_logo.webp")) {
                          image.src = "/VA_logo.webp";
                        }
                      }}
                      className="w-12 h-12 object-cover rounded-md bg-black/50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                      <p className="text-gray-400 text-[10px] truncate">
                        {[
                          item.year || "Année inconnue",
                          item.country,
                          item.editionInfo?.edition ||
                            item.editionInfo?.color ||
                            item.format?.join(", "),
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                      {(item.editionInfo?.label || item.catno) && (
                        <p className="text-gray-500 text-[10px] truncate">
                          {[item.editionInfo?.label, item.editionInfo?.catno || item.catno]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
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
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
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
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Code barre</label>
            <input
              type="text"
              placeholder="Ex: 352415..."
              name="barCode"
              value={album.barCode?.toString() || ""}
              onChange={changeDataAlbum}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
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
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
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
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
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
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
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
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
              >
                <option value="">-- Format --</option>
                {allMetadata?.formats?.map((f: MetadataItem) => (
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
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
              >
                <option value="">-- Variante --</option>
                {allMetadata?.variants?.map((v: MetadataItem) => (
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
                onChange={handleGenreChange}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
              >
                <option value="">-- Genre --</option>
                {allMetadata?.genres?.map((g: MetadataItem) => (
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
                disabled={!album.genreId}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all disabled:opacity-50"
              >
                <option value="">{album.genreId ? "-- Style --" : "-- Genre d'abord --"}</option>
                {availableStyles.map((s: MetadataItem) => (
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
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
            />
          </div>

          {/* Collection Checkbox */}
          {!isCollectionContext && (
            <label className="flex items-center gap-3 p-4 bg-[#0a0a0a]/50 rounded-xl border border-white/10 cursor-pointer group">
              <input
                type="checkbox"
                name="addToCollection"
                checked={addAlbumToCollection}
                onChange={() => setAddAlbumToCollection(!addAlbumToCollection)}
                className="w-5 h-5 rounded border-white/10 text-[#8b5cf6] focus:ring-[#8b5cf6] bg-black"
              />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Je possède cet album</span>
            </label>
          )}

          {/* Price & Condition */}
          {(addAlbumToCollection || isCollectionContext) && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#8b5cf6]/5 rounded-xl border border-amber-500/20">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#8b5cf6]-500/70 ml-1">Prix (€)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="20.00"
                  name="price"
                  value={album.price}
                  onChange={changeDataAlbum}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#8b5cf6]-500/70 ml-1">État</label>
                <select
                  name="conditionId"
                  value={album.conditionId}
                  onChange={changeDataAlbum}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
                >
                  <option value="">-- État --</option>
                  {allMetadata?.conditions?.map((c: MetadataItem) => (
                    <option key={c.id} value={c.id}>{c.nameFR || c.nameEN || c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white/5 pb-2">
            <button
              type="button"
              className="flex-1 px-4 py-4 bg-gray-700 text-white font-bold rounded-2xl hover:bg-gray-600 transition-colors"
              onClick={() => setModaleAddNewAlbum(false)}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-4 bg-[#8b5cf6] text-gray-950 font-black rounded-2xl hover:bg-amber-400 active:scale-95 transition-all shadow-xl shadow-[#8b5cf6]/10"
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
