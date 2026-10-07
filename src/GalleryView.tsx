import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface PokemonCardData {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export default function GalleryView() {
  const [pokemonList, setPokemonList] = useState<PokemonCardData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryPokemon = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const results = response.data.results;

        const detailPromises = results.map(async (item: { url: string }) => {
          const detailRes = await axios.get(item.url);
          return {
            id: detailRes.data.id,
            name: detailRes.data.name,
            image: detailRes.data.sprites.front_default || detailRes.data.sprites.other?.['official-artwork']?.front_default,
            types: detailRes.data.types.map((t: { type: { name: string } }) => t.type.name),
          };
        });

        const detailedPokemon = await Promise.all(detailPromises);
        setPokemonList(detailedPokemon);
      } catch (err) {
        console.error('Failed to fetch gallery data', err);
        setError('Failed to load Pokémon gallery. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryPokemon();
  }, []);

  const filteredList = selectedType === 'all'
    ? pokemonList
    : pokemonList.filter((p) => p.types.includes(selectedType));

  if (loading) return <div className="gallery-container"><p>Loading Gallery...</p></div>;
  if (error) return <div className="gallery-container"><p>{error}</p></div>;

  return (
    <div className="gallery-container">
      <h2>Pokémon Gallery</h2>

      {/* Attribute Filter Control */}
      <div className="filter-section">
        <label htmlFor="type-filter">Filter by Type: </label>
        <select
          id="type-filter"
          className="filter-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
          <option value="electric">Electric</option>
          <option value="bug">Bug</option>
          <option value="normal">Normal</option>
          <option value="poison">Poison</option>
          <option value="ground">Ground</option>
          <option value="fairy">Fairy</option>
          <option value="fighting">Fighting</option>
          <option value="psychic">Psychic</option>
          <option value="rock">Rock</option>
          <option value="ghost">Ghost</option>
          <option value="ice">Ice</option>
          <option value="dragon">Dragon</option>
        </select>
      </div>

      {/* Gallery Media Grid */}
      <div className="gallery-grid">
        {filteredList.map((p) => (
          <Link key={p.id} to={`/details/${p.id}`} className="pokemon-card">
            <img src={p.image} alt={p.name} loading="lazy" />
            <h3>#{p.id} {p.name}</h3>
            <div className="type-badge-container">
              {p.types.map((t) => (
                <span key={t} className="type-badge">{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {filteredList.length === 0 && (
        <p>No Pokémon found matching type "{selectedType}".</p>
      )}
    </div>
  );
}