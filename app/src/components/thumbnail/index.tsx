import SAOR from "../../assets/img/admist_the_ruins_front.jpg";
import Blackbraid from "../../assets/img/blackbraid3_front.jpg";

import "../../styles/thumbnail.scss";
const Thumbnail = () => {
  return (
    <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem" }}>
      <div className="thumbnail">
        <img src={SAOR} alt="" className="thumbnail_image" />
      </div>
      <div className="thumbnail">
        <img src={Blackbraid} alt="" className="thumbnail_image" />
      </div>
    </div>
  );
};

export default Thumbnail;
