import { Routes, Route, Link } from 'react-router-dom';
import ListView from './ListView';
import GalleryView from './GalleryView';
import DetailView from './DetailView';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="nav-link">Pokemon List</Link>
        <Link to="/gallery" className="nav-link">Pokemon Gallery</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/details/:id" element={<DetailView />} />
      </Routes>
    </div>
  );
}