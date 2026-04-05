// src/components/album/index.tsx

interface AlbumProps {
  title: string;
  artist: string;
  cover?: string;
  onClick: () => void;
}

const Album = ({ id, title, artist, cover, onClick }: AlbumProps) => {
  return (
    <div
      id={id}
      className="album_card"
      // On attache la fonction ICI
      onClick={(e) => {
        console.log("Clic DOM déclenché sur l'album");
        onClick();
      }}
      style={{ cursor: "pointer", position: "relative", zIndex: 10 }}
    >
      <img
        src={cover || "/placeholder.jpg"}
        alt={title}
        style={{ pointerEvents: "none" }} // Empêche l'image de voler le clic
      />
      <div style={{ pointerEvents: "none" }}>
        <h3>{title}</h3>
        <p>{artist}</p>
      </div>
    </div>
  );
};

export default Album;
