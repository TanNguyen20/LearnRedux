import './App.css';
// import { useState } from 'react';
// import Counter from './pages/Counter';
// import { useGetPokemonByNameQuery } from './services/pokemon';
// import { Select, MenuItem } from '@mui/material';

// export default function App() {
//   const { data, error, isLoading } = useGetPokemonByNameQuery('weedle')
//   const [pokemon, setPokemon] = useState('weedle');

//   const handleChange = (event) => {
//     setPokemon(event.target.value);
//   };
//   return (
//     <div className="App">
//       <header className="App-header">
//         <Counter />
//         <Select
//           label="Pokemon"
//           labelId="select-label"
//           id="simple-select"
//           value={pokemon}
//           onChange={handleChange}>
//           <MenuItem value="weedle">Weedle</MenuItem>
//           <MenuItem value="kakuna">Kakuna</MenuItem>
//           <MenuItem value="beedrill">Beedrill</MenuItem>
//         </Select>
//         {error ? (
//           <>Oh no, there was an error</>
//         ) : isLoading ? (
//           <>Loading...</>
//         ) : data ? (
//           <>
//             <h3>{data.species.name}</h3>
//             <img src={data.sprites.front_shiny} alt={data.species.name} />
//           </>
//         ) : null}
//       </header>
//     </div>
//   );
// }

// ----------------------------------------------------------------------

import Router from './routes';

export default function App() {
    return <Router />;
}
