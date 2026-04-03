
import Collection from './pages/collection'
import Thumbnail from './components/thumbnail'
import './App.scss'
import SearchBar from './components/searchBar'
import { Route, Routes } from 'react-router-dom'
function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<Collection />} />
     
    </Routes>
      

    </>
  )
}

export default App
