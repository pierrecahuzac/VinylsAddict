import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import UserDetailsAlbum from "./pages/MyAlbumDetails";
import MyCollection from "./pages/MyCollection";
import MasterAlbum from "./pages/MasterAlbum";
import MyWishlist from "./pages/MyWishlist";
import Profile from "./pages/Profile";
import Catalog from "./pages/Catalog";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import Layout from "./components/Layout";
import MyStats from "./pages/MyStats";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Catalog />} />
          <Route path="/collection" element={<MyCollection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wishlist" element={<MyWishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/album/:id" element={<MasterAlbum />} />
          <Route path="/my-stats" element={<MyStats />} />
          <Route path="/collection/album/:albumId" element={<UserDetailsAlbum />} />
        </Route>
      </Routes>     
    </>
  );
};

export default App;
