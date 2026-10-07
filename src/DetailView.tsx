import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pokemonId = parseInt(id || '1', 10);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then((response) => {
        setPokemon(response.data);
      })
      .catch((err) => {
        console.error('Error fetching detail data:', err);
        setError('Failed to load Pokémon details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pokemonId]);

  if (loading) return <div className="detail-card"><p>Loading Pokémon details...</p></div>;
  if (error || !pokemon) return <div className="detail-card"><p>{error || 'Pokémon not found.'}</p></div>;

  const imageSrc =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;

  const handlePrev = () => {
    if (pokemonId > 1) {
      navigate(`/details/${pokemonId - 1}`);
    }
  };

  const handleNext = () => {
    if (pokemonId < 151) {
      navigate(`/details/${pokemonId + 1}`);
    }
  };

  return (
    <div className="detail-card">
      <h2 className="detail-title">#{pokemon.id} {pokemon.name}</h2>
      
      {imageSrc && <img src={imageSrc} alt={pokemon.name} className="detail-img" />}

      <div className="detail-stats">
        <p>
          <strong>Height</strong>
          {pokemon.height / 10} m
        </p>
        <p>
          <strong>Weight</strong>
          {pokemon.weight / 10} kg
        </p>
        <p>
          <strong>Types</strong>
          {pokemon.types.map((t) => t.type.name).join(', ')}
        </p>
      </div>

      <div className="nav-buttons">
        <button 
          onClick={handlePrev} 
          disabled={pokemonId <= 1} 
          className="nav-btn"
        >
          &larr; Previous
        </button>
        <button 
          onClick={handleNext} 
          disabled={pokemonId >= 151} 
          className="nav-btn"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}