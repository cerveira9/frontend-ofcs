import { useEffect, useState } from 'react';
import api from '../api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await api.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard/analytics`);
    setData(res.data);
  };

  const fetchFilteredAnalytics = async () => {
    const res = await api.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard/analytics`, {
      params: {
        startDate,
        endDate
      }
    });
    setData(res.data);
  };

  if (!data) return <div className="text-center text-gray-500">Carregando dados...</div>;

  const skills = {
    montarOcorrencia: 'Ocorrência',
    abordagem: 'Abordagem',
    registroIdentidade: 'Registro de Identidade',
    negociacao: 'Negociação',
    efetuarPrisao: 'Processo de Prisão',
    posicionamentoPatrulha: 'Patrulhamento',
    conhecimentoLeis: 'Conhecimento de Leis'
  };

  const values = Object.entries(skills).map(([key]) => data.averageSkills[key] || 0);
  const labels = Object.entries(skills).map(([, label]) => label);

  const max = Math.max(...values);
  const min = Math.min(...values);

  const barColors = values.map((val) => {
    if (val === min) return 'rgba(239, 68, 68, 0.8)'; // vermelho
    if (val === max && val >= 7) return 'rgba(34, 197, 94, 0.8)'; // verde
    if (val < 7) return 'rgba(234, 179, 8, 0.8)'; // amarelo
    return 'rgba(59, 130, 246, 0.8)'; // azul padrão
  });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">Dashboard de Desempenho</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-6 rounded-lg shadow text-center">
          <h2 className="text-gray-700 font-medium">Total de Oficiais</h2>
          <p className="text-3xl font-bold text-blue-900">{data.totalOfficers}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow text-center">
          <h2 className="text-gray-700 font-medium">Avaliações Realizadas</h2>
          <p className="text-3xl font-bold text-green-900">{data.totalEvaluations}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg shadow text-center">
          <h2 className="text-gray-700 font-medium">Oficiais Avaliados</h2>
          <p className="text-3xl font-bold text-purple-900">{data.evaluatedOfficers}</p>
        </div>
      </div>

      {/* Filtro de Data */}
      {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <span className="font-medium">até</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <button
          onClick={fetchFilteredAnalytics}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Filtrar
        </button>
      </div> */}

      {/* Gráfico */}
      <div className="bg-white rounded-lg shadow p-6">
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: 'Média por Habilidade',
                data: values,
                backgroundColor: barColors
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 10
              }
            }
          }}
        />
      </div>
    </div>
  );
}
