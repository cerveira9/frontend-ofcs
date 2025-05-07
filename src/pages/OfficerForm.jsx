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
    await axios.post('http://localhost:5000/v1/api/officers/cadastroOficial', {
      name,
      rank,
      startDate
    });
    setName('');
    setRank(ranks[0]);
    setStartDate('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800">Cadastro de Oficial</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome do oficial"
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Patente</label>
        <select
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ranks.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Cadastrar
        </button>
      </div>
    </form>
  );
}
