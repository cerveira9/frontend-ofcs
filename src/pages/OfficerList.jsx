import { useEffect, useState } from 'react';
import axios from 'axios';

export default function OfficerList() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/v1/api/officers/mostrarOficiais')
      .then(res => {
        setOfficers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-gray-500">Carregando oficiais...</div>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {officers.map((officer) => (
        <div key={officer._id} className="bg-gradient-to-br from-slate-800 via-gray-900 to-black text-white shadow-xl rounded-2xl p-6 border border-gray-700 hover:shadow-2xl transition transform hover:scale-[1.02]">
          <h2 className="text-2xl font-semibold mb-2 text-blue-400">{officer.name}</h2>
          <p className="text-sm text-gray-300 italic mb-4">{officer.rank}</p>
          <div className="text-sm space-y-1">
            <p><span className="font-semibold text-gray-400">Início:</span> {new Date(officer.startDate).toLocaleDateString()}</p>
            <p><span className="font-semibold text-gray-400">Registro:</span> {new Date(officer.registerDate).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}