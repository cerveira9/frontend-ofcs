import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Pencil, Trash2, FileSearch } from 'lucide-react';
import EditOfficerForm from './EditOfficerForm';
import ViewEvaluations from './ViewEvaluations';

export default function OfficerList() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [viewingEvalId, setViewingEvalId] = useState(null);
  const editRef = useRef(null);

  const hierarchy = [
    'Cadete', 'Patrol Officer', 'Police Officer', 'Senior Officer', 'Deputy', 'Senior Deputy',
    'Undersheriff / Deputy Chief', 'Sheriff / Chief of Police', 'Forest Ranger', 'Tracker Ranger',
    'Senior Ranger', 'Captain Ranger', 'Commissioner', 'Deputy Marshal', 'Marshal'
  ];

  const flagRules = {
    'Cadete': { green: 5, yellow: 7 },
    // 'Patrol Officer': { green: 5, yellow: 7 },
    // 'Police Officer': { green: 6, yellow: 8 },
    // 'Senior Officer': { green: 7, yellow: 9 },
    // 'Deputy': { green: 10, yellow: 15 },
    // 'Senior Deputy': { green: 15, yellow: 19 }
  };

  const getFlagColor = (rank, startDate) => {
    if (!flagRules[rank]) return null;
    const start = new Date(startDate);
    const today = new Date();
    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    const { green, yellow } = flagRules[rank];
    if (diffDays <= green) return 'green';
    if (diffDays <= yellow) return 'yellow';
    return 'red';
  };

  useEffect(() => { fetchOfficers(); }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (editRef.current && !editRef.current.contains(event.target)) {
        setEditingId(null);
        setViewingEvalId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingId, viewingEvalId]);

  const fetchOfficers = async () => {
    const res = await axios.get('http://localhost:5000/v1/api/officers/mostrarOficiais');
    setOfficers(res.data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Você confirma a exclusão do oficial?")) return;
    await axios.delete(`http://localhost:5000/v1/api/officers/deletarOficial/${id}`);
    fetchOfficers();
  };

  const stopEditing = () => setEditingId(null);
  const stopViewing = () => setViewingEvalId(null);

  const grouped = hierarchy.map(rank => ({
    rank,
    items: officers.filter(o => o.rank === rank)
  })).filter(g => g.items.length > 0);

  if (loading) return <div className="text-center text-gray-500">Carregando oficiais...</div>;

  return (
    <div className="space-y-10">
      {grouped.map(group => (
        <div key={group.rank}>
          <h2 className="text-xl font-bold text-gray-700 border-b border-gray-300 mb-4">
            {group.rank} ({group.items.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map((officer) => {
              const isEditing = officer._id === editingId;
              const isViewing = officer._id === viewingEvalId;
              const flagColor = getFlagColor(officer.rank, officer.startDate);

              return (
                <div
                  key={officer._id}
                  className={`relative group bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all duration-300
                    ${isEditing || isViewing ? 'col-span-1 sm:col-span-2 lg:col-span-3 w-full' : 'hover:translate-x-2'}`}
                  ref={(isEditing || isViewing) ? editRef : null}
                >
                  {flagColor && (
                    <div
                      className={`w-3 h-3 rounded-full absolute top-3 left-3 ${
                        flagColor === 'green' ? 'bg-green-500' : flagColor === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'
                      }`}
                      title={`Flag ${flagColor}`}
                    />
                  )}

                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <div className="flex items-center mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{officer.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        Início: {new Date(officer.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Registro: {new Date(officer.registerDate).toLocaleString()}
                      </p>
                    </div>

                    {!(isEditing || isViewing) && (
                      <div className="absolute top-2 right-2 h-[100px] flex flex-col justify-evenly items-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          className="p-2 rounded-full bg-gray-100 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 transition-colors"
                          onClick={() => { setViewingEvalId(officer._id); stopEditing(); }}
                        >
                          <FileSearch size={18} />
                        </button>
                        <button
                          className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={() => { setEditingId(officer._id); stopViewing(); }}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-red-600 hover:text-red-800 transition-colors"
                          onClick={() => handleDelete(officer._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-4 border-t pt-4">
                      <EditOfficerForm
                        officer={officer}
                        onCancel={stopEditing}
                        onSuccess={() => {
                          stopEditing();
                          fetchOfficers();
                        }}
                      />
                    </div>
                  )}

                  {isViewing && (
                    <div className="mt-4 border-t pt-4">
                      <ViewEvaluations officerId={officer._id} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
