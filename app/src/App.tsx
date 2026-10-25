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
import Artist from "./pages/Artist";
import Versions from "./pages/Versions";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import MyStats from "./pages/MyStats";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Catalog />} />
          <Route path="/collection" element={<ProtectedRoute><MyCollection /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><MyWishlist /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/album/:id" element={<MasterAlbum />} />
          <Route path="/artist/:name" element={<Artist />} />
          <Route path="/versions/:title" element={<Versions />} />
          <Route path="/my-stats" element={<ProtectedRoute><MyStats /></ProtectedRoute>} />
          <Route path="/collection/album/:albumId" element={<ProtectedRoute><UserDetailsAlbum /></ProtectedRoute>} />
        </Route>
      </Routes>     
    </>
  );
};

export default App;
