import { useState } from 'react';
import axios from 'axios';

const ranks = [
  'Cadete',
  'Patrol Officer',
  'Police Officer',
  'Senior Officer',
  'Deputy',
  'Senior Deputy',
  'Undersheriff / Deputy Chief',
  'Sheriff / Chief of Police'
];

export default function OfficerForm() {
  const [name, setName] = useState('');
  const [rank, setRank] = useState(ranks[0]);
  const [startDate, setStartDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/v1/api/officers/cadastroOficial', { name, rank, startDate });
    setName(''); setRank(ranks[0]); setStartDate('');
  };

  return (
    <form className="p-6 bg-white shadow-md rounded-md max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Cadastrar Oficial</h2>
      <input className="input" type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
      <select className="input" value={rank} onChange={e => setRank(e.target.value)}>
        {ranks.map(r => <option key={r}>{r}</option>)}
      </select>
      <input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
      <button className="btn mt-4" type="submit">Cadastrar</button>
    </form>
  );
}