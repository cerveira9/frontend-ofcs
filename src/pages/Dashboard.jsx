import { useEffect, useState } from "react";
import api from "../api";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const skillLabels = {
	montarOcorrencia: "Ocorrência",
	abordagem: "Abordagem",
	registroIdentidade: "Registro de Identidade",
	negociacao: "Negociação",
	efetuarPrisao: "Processo de Prisão",
	posicionamentoPatrulha: "Patrulhamento",
	conhecimentoLeis: "Conhecimento de Leis",
};

export default function Dashboard() {
	const [data, setData] = useState(null);
	const [officers, setOfficers] = useState([]);
	const [officerId, setOfficerId] = useState("");
	const [patents, setPatents] = useState([]);
	const [selectedPatent, setSelectedPatent] = useState("");
	const [officerName, setOfficerName] = useState("");

	useEffect(() => {
		fetchAnalytics();
		fetchOfficers();
	}, []);

	const fetchAnalytics = async () => {
		const res = await api.get(
			`${import.meta.env.VITE_API_BASE_URL}/dashboard/analytics`
		);
		setData(res.data);
		setOfficerId("");
		setSelectedPatent("");
	};

	const fetchOfficers = async () => {
		const res = await api.get(
			`${import.meta.env.VITE_API_BASE_URL}/officers/mostrarOficiais`
		);
		setOfficers(res.data);
	};

	const fetchOfficerStats = async (id) => {
		if (!id) return;
		const res = await api.get(
			`${import.meta.env.VITE_API_BASE_URL}/dashboard/analytics/${id}`
		);
		setData(res.data);
		setOfficerId(id);
		setOfficerName(officers.find((o) => o._id === id)?.name || "");
		setPatents(res.data.ranks || []);
		setSelectedPatent("");
	};

	const fetchPatentStats = async (rank) => {
		const res = await api.get(
			`${import.meta.env.VITE_API_BASE_URL}/dashboard/analytics/${officerId}`,
			{
				params: { rank },
			}
		);
		setData(res.data);
		setSelectedPatent(rank);
	};

	if (!data)
		return <div className="text-center text-gray-500 dark:text-gray-300">Carregando dados...</div>;

	const skills = Object.entries(skillLabels);
	const currentSet =
		officerId && selectedPatent
			? data.averageSkills[selectedPatent]
			: officerId
			? data.averageSkills.geral
			: data.averageSkills;

	const values = skills.map(([key]) => parseFloat(currentSet?.[key] || 0));
	const labels = skills.map(([, label]) => label);

	const max = Math.max(...values);
	const min = Math.min(...values);

	const barColors = values.map((val) => {
		if (val === min) return "rgba(239, 68, 68, 0.8)";
		if (val === max && val >= 7) return "rgba(34, 197, 94, 0.8)";
		if (val < 7) return "rgba(234, 179, 8, 0.8)";
		return "rgba(59, 130, 246, 0.8)";
	});

	const hierarchy = [
		"Cadete",
		"Patrol Officer",
		"Police Officer",
		"Senior Officer",
		"Deputy",
		"Senior Deputy",
		"Undersheriff / Deputy Chief",
		"Sheriff / Chief of Police",
		"Forest Ranger",
		"Tracker Ranger",
		"Senior Ranger",
		"Captain Ranger",
		"Commissioner",
		"Deputy Marshal",
		"Marshal",
	];

	const groupedOfficers = hierarchy
		.map((rank) => ({
			rank,
			items: officers.filter((o) => o.rank === rank),
		}))
		.filter((g) => g.items.length > 0);

	return (
		<div className="max-w-5xl mx-auto p-6 space-y-8">
			<h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
				Dashboard de Desempenho
			</h1>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow text-center">
					<h2 className="text-gray-700 dark:text-gray-100 font-medium">Total de Oficiais</h2>
					<p className="text-3xl font-bold text-blue-900 dark:text-blue-200">
						{data.totalOfficers}
					</p>
				</div>
				<div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg shadow text-center">
					<h2 className="text-gray-700 dark:text-gray-100 font-medium">Avaliações Realizadas</h2>
					<p className="text-3xl font-bold text-green-900 dark:text-green-200">
						{data.totalEvaluations}
					</p>
				</div>
				<div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-lg shadow text-center">
					<h2 className="text-gray-700 dark:text-gray-100 font-medium">Oficiais Avaliados</h2>
					<p className="text-3xl font-bold text-purple-900 dark:text-purple-200">
						{data.evaluatedOfficers}
					</p>
				</div>
			</div>

			<div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<select
						className="border dark:border-gray-600 dark:bg-gray-900 dark:text-white px-4 py-2 rounded w-full sm:w-auto"
						value={officerId}
						onChange={(e) => fetchOfficerStats(e.target.value)}
					>
						<option value="">Selecione um Oficial</option>
						{groupedOfficers.map((group) => (
							<optgroup key={group.rank} label={group.rank}>
								{group.items.map((o) => (
									<option key={o._id} value={o._id}>
										{o.name}
									</option>
								))}
							</optgroup>
						))}
					</select>

					{officerId && (
						<button
							onClick={fetchAnalytics}
							className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-white px-4 py-2 rounded hover:bg-red-200 dark:hover:bg-red-700 transition"
						>
							Voltar para Média Geral
						</button>
					)}
				</div>

				{officerId && patents.length > 1 && (
					<div className="flex flex-wrap items-center gap-4 mt-2">
						<label className="text-sm text-gray-700 dark:text-gray-300 font-medium">
							Selecionar Patente:
						</label>
						{patents.map((rank) => (
							<label key={rank} className="flex items-center gap-2 text-sm dark:text-white">
								<input
									type="radio"
									name="rankFilter"
									value={rank}
									checked={selectedPatent === rank}
									onChange={() => fetchPatentStats(rank)}
								/>
								{rank}{" "}
								{data.evaluationsByRank?.[rank] !== undefined &&
									`(${data.evaluationsByRank[rank]})`}
							</label>
						))}
						<label className="flex items-center gap-2 text-sm font-medium dark:text-white">
							<input
								type="radio"
								name="rankFilter"
								value=""
								checked={selectedPatent === ""}
								onChange={() => fetchOfficerStats(officerId)}
							/>
							Todas
						</label>
					</div>
				)}
			</div>

			<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
				<Bar
					data={{
						labels,
						datasets: [
							{
								label: officerId
									? `Média de ${officerName}`
									: "Média Geral por Habilidade",
								data: values,
								backgroundColor: barColors,
							},
						],
					}}
					options={{
						responsive: true,
						plugins: {
							legend: { display: false },
						},
						scales: {
							y: {
								beginAtZero: true,
								max: 10,
								ticks: {
									color: "#9ca3af", // cinza-400
								},
							},
							x: {
								ticks: {
									color: "#9ca3af", // cinza-400
								},
							},
						},
					}}
				/>
			</div>
		</div>
	);
}
