import { Route, Routes } from "react-router-dom";


import Collection from "./pages/collection";

import "./App.scss";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Collection />} />
      </Routes>
    </>
  );
};

export default App;
