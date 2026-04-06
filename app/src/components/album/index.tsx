// src/components/album/index.tsx

interface AlbumProps {
  title: string;
  artist: string;
  cover?: string;
  id:string;
  year: string
  onClick: () => void;
}

const Album = ({ id, title, artist, cover, year, onClick }: AlbumProps) => {
  return (
    <div
      id={id}
      className="album_card"
      
      onClick={() => {
        
        onClick();
      }}
      style={{ cursor: "pointer", position: "relative", zIndex: 10 }}
    >
      <img
        src={cover || "/placeholder.jpg"}
        alt={title}
        style={{ pointerEvents: "none" }} 
      />
      <div style={{ pointerEvents: "none" }}>
        <h3>{title}</h3>
        <p>{artist}</p>
        <p>{year}</p>
      </div>
    </div>
  );
};

export default Album;
