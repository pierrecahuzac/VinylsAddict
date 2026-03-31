import Header from "../../header";
import '../../../styles/collection.scss'
import Thumbnail from "../../thumbnail";
const Collection = () => {
  return (
    <div className="collection">
     <h1>Vinyles addict</h1> 
      <Header />
     <div className="collection_list">
      <Thumbnail /> 
      <Thumbnail /> 
      <Thumbnail /> 
      <Thumbnail /> 
      <Thumbnail /> 
     </div>
    </div>
  );
};

export default Collection;
