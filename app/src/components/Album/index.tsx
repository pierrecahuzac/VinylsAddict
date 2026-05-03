import type { AlbumProps } from "../../types/album";

const Album = ({
  id,
  title,
  artist,
  cover,
  year,
  onClick,
  className,
}: AlbumProps) => {
  return (
    <div
      id={id}
      className={`flex items-center bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-700 transition-all shadow-lg border border-gray-700/50 hover:border-[#f1c40f]/50 group ${className}`}
      onClick={() => onClick()}
    >
      <div className="w-20 h-20 flex-shrink-0">
        <img 
          src={cover || "/placeholder.jpg"} 
          alt={title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col p-3 overflow-hidden flex-1">
        <h3 className="text-white font-bold text-base leading-tight group-hover:text-[#f1c40f] transition-colors line-clamp-1">{title}</h3>
        <p className="text-gray-400 text-sm truncate">{artist}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[#f1c40f] text-xs font-medium">{year}</span>
          <span className="text-gray-600 text-[10px] uppercase tracking-widest group-hover:text-gray-400 transition-colors italic">Détails →</span>
        </div>
      </div>
    </div>
  );
};

export default Album;
