import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';

export default function OfficerList() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/v1/api/officers/mostrarOficiais')
      .then((res) => {
        setOfficers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-center text-gray-500">Carregando oficiais...</div>;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {officers.map((officer, idx) => (
        <div
          key={idx}
          className="bg-white shadow-md hover:shadow-lg border border-gray-200 rounded-xl p-5 transition-all"
        >
          <div className="flex items-center mb-2">
            <Users className="text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">{officer.name}</h3>
          </div>
          <p className="text-sm text-blue-600 font-medium mb-1">{officer.rank}</p>
          <p className="text-sm text-gray-500">
            Início: {new Date(officer.startDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">
            Registro: {new Date(officer.registerDate).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
