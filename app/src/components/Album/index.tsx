import type { AlbumProps } from "../../types/album";

const Album = ({
  id,
  title,
  artist,
  cover,
  year,
  color,
  onClick,
  className,
}: AlbumProps) => {
  return (
    <div
      id={id}
      className={`group cursor-pointer ${className}`}
      onClick={() => onClick()}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/5 shadow-lg ring-1 ring-white/5 transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
        <img
          src={cover || "/placeholder.jpg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-white font-semibold text-sm leading-tight line-clamp-1 group-hover:text-[#8b5cf6] transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-xs truncate mt-0.5">{artist}</p>
        {(year || color) && (
          <span className="text-gray-500 text-[10px] font-medium mt-1 block">
            {year} {color && `• ${color}`}
          </span>
        )}
      </div>
    </div>
  );
};

export default Album;
