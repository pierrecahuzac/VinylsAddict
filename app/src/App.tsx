import { Route, Routes } from "react-router-dom";

import Collection from "./pages/collection";
import Wishlist from "./pages/whislist";
import ProfilePage from "./pages/user";
import AlbumDetails from "./pages/albumDetails";
import NavBar from "./components/navBar";
import Layout from "./components/layout";
import AlbumsPage from "./pages/albumsPage";

import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<AlbumsPage />} />
          <Route path="/collection/:id" element={<Collection />} />
          <Route path="/wishlist/:id" element={<Wishlist />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/album/:id" element={<AlbumDetails />} />
        </Route>
      </Routes>
      <NavBar />
    </>
  );
};

export default App;
