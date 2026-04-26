import { useNavigate } from "react-router";

const Header = () => {
  
  const title = "Vinyles addict";
  const navigate = useNavigate();
  return (
    <header className="w-full h-16" >
      <h1
        className="w-80 m-auto h-16 text-yellow-300 text-3xl justify-center items-center flex cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        {title.toUpperCase()}
      </h1>
     
      
 
    </header>
  );
};

export default Header;
