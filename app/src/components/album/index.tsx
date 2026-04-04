import "../../styles/album.scss";

const Album = ({ title, artist, cover }: { title: string; artist: string; cover: string }) => {
  return (
    <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem" }}>
      <div className="album">
        <img src={cover} alt="" className="album_image" />
        <div className="album_infos">
          <p className="album_artist">
            {artist} -  {title}
          </p> 
          
        </div>
      </div>
    </div>
  );
};

export default Album;
