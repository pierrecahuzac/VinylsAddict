interface AlbumProps {
  title: string;
  artist: string;
  cover?: string;
  onClick: () => void;
}

const AlbumDetails = ({ title, artist, cover, onClick }: AlbumProps) => {
   // <--- Doit apparaître dans la console au chargement

  return (
    <div 
      className="album_card" 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("CLIC INTERNE SUR :", title);
        onClick();
      }}
      style={{ 
        cursor: 'pointer', 
        userSelect: 'none',
        position: 'relative',
        zIndex: 10
      }}
    >
      <img 
        src={cover || "https://via.placeholder.com/150"} 
        alt={title} 
        style={{ pointerEvents: 'none' }} // L'image ne doit pas capturer le clic
      />
      <div style={{ pointerEvents: 'none' }}>
        <h3>{title}</h3>
        <p>{artist}</p>
      </div>
    </div>
  );
};

export default AlbumDetails;