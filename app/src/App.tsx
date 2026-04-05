import { Route, Routes } from "react-router-dom";


import Collection from "./pages/collection";
import Wishlist from "./pages/whislist";
import ProfilePage from "./pages/user";
import AlbumDetails from "./pages/albumDetails";

import "./App.scss";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Collection />} />
        <Route path="/collection/:id" element={<Collection />} />
        <Route path="/wishlist/:id" element={<Wishlist />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
       <Route path="/album/:id" element={<AlbumDetails />} />
  {/* Tes autres routes */}
      </Routes>
    </>
  );
};

export default App;
