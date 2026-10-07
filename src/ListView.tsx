import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface PokemonResult {
  name: string;
  url: string;
  id: number;
}

export default function ListView() {
  const [pokemon, setPokemon] = useState<PokemonResult[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'name'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(response => {
        const formattedData = response.data.results.map((p: { name: string; url: string }) => {
          const id = parseInt(p.url.split('/').filter(Boolean).pop() || '0', 10);
          return { name: p.name, url: p.url, id };
        });
        setPokemon(formattedData);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const filteredPokemon = pokemon.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    let comparison = a.id - b.id;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="list-container">
      <h2>Search & Sort Pokemon</h2>
      
      {/* Removed the inline styles here */}
      <div className="controls">
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'id' | 'name')} className="filter-select">
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} className="filter-select">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Removed the inline styles here */}
      <ul className="pokemon-list">
        {sortedPokemon.map((p) => (
          /* Removed the inline styles here */
          <li key={p.id} className="list-item">
            <Link to={`/details/${p.id}`} className="pokemon-link">
              <strong>#{p.id}</strong> {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}