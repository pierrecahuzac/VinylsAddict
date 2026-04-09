import { Route, Routes } from "react-router-dom";

import MyCollection from "./pages/MyCollection";
import MyWishlist from "./pages/MyWishlist";
import Profile from "./pages/Profile";
import MasterAlbum from "./pages/MasterAlbum";
import NavBar from "./components/NavBar";
import Layout from "./components/Layout";
import Catalog from "./pages/Catalog";

import { ToastContainer } from "react-toastify";
import UserDetailsAlbum from "./pages/MyAlbumDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Catalog />} />
          <Route path="/collection/:id" element={<MyCollection />} />
          <Route path="/wishlist/:id" element={<MyWishlist />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/album/:id" element={<MasterAlbum />} />
          <Route path="/collection/album/:albumId" element={<UserDetailsAlbum />} />
        </Route>
      </Routes>
      <NavBar />
    </>
  );
};

export default App;
