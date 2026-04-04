import { Route, Routes } from "react-router-dom";


import Collection from "./pages/collection";
import Wishlist from "./pages/whislist";

import "./App.scss";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Collection />} />
        <Route path="/collection/:id" element={<Collection />} />
        <Route path="/wishlist/:id" element={<Wishlist />} />
      </Routes>
    </>
  );
};

export default App;
