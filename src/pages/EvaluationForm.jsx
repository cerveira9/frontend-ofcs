import { useEffect, useState } from "react";
import api from "../api";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function EvaluationForm() {
	const [officers, setOfficers] = useState([]);
	const [selected, setSelected] = useState("");
	const [skills, setSkills] = useState({});
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");

	const skillList = [
		"Ocorrência",
		"Abordagem",
		"Registro de Identidade",
		"Negociação",
		"Processo de Prisão",
		"Patrulhamento",
		"Conhecimento de Leis",
	];

	const labelToKey = {
		Ocorrência: "montarOcorrencia",
		Abordagem: "abordagem",
		"Registro de Identidade": "registroIdentidade",
		Negociação: "negociacao",
		"Processo de Prisão": "efetuarPrisao",
		Patrulhamento: "posicionamentoPatrulha",
		"Conhecimento de Leis": "conhecimentoLeis",
	};

	useEffect(() => {
		api
			.get(`${import.meta.env.VITE_API_BASE_URL}/officers/mostrarOficiais`)
			.then((res) => setOfficers(res.data))
			.catch(() => setError("Erro ao carregar oficiais."));
	}, []);

	const handleChange = (skill, value) => {
		const formattedValue = value.replace(",", ".");

		const val = parseFloat(formattedValue);
		if (!isNaN(val) && val >= 0 && val <= 10) {
			setSkills((prev) => ({ ...prev, [skill]: formattedValue }));
		} else if (value === "") {
			setSkills((prev) => ({ ...prev, [skill]: "" }));
		}
	};

	const submitEval = async (e) => {
		e.preventDefault();
		if (!selected || Object.keys(skills).length < skillList.length) {
			setError("Preencha todos os campos antes de enviar.");
			return;
		}

		const convertedSkills = {};
		for (const [label, value] of Object.entries(skills)) {
			const key = labelToKey[label];
			if (key) convertedSkills[key] = parseFloat(value);
		}

		try {
			await api.post(
				`${import.meta.env.VITE_API_BASE_URL}/evaluations/cadastrarAvaliacao`,
				{
					officerId: selected,
					skills: convertedSkills,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			setSuccess(true);
			setError("");
			setSkills({});
			setSelected("");
			setTimeout(() => setSuccess(false), 3000);
		} catch {
			setError("Erro ao salvar a avaliação.");
		}
	};

	return (
		<form
			className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-3xl mx-auto transition-all"
			onSubmit={submitEval}
		>
			<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
				Avaliar Oficial
			</h2>

			<div className="mb-4">
				<label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
					Oficial Avaliado
				</label>
				<select
					className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
					value={selected}
					onChange={(e) => setSelected(e.target.value)}
				>
					<option value="">Selecione o Oficial</option>
					{[
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
					].map((rank) => {
						const group = officers.filter((o) => o.rank === rank);
						if (!group.length) return null;
						return (
							<optgroup key={rank} label={rank}>
								{group.map((o) => (
									<option key={o._id} value={o._id}>
										{o.name}
									</option>
								))}
							</optgroup>
						);
					})}
				</select>
			</div>

			<div className="grid sm:grid-cols-2 gap-4">
				{skillList.map((skill) => (
					<div key={skill} className="flex flex-col">
						<label className="mb-1 text-gray-700 dark:text-gray-300">
							{skill}
						</label>
						<input
							type="text"
							value={skills[skill] ?? ""}
							onChange={(e) => handleChange(skill, e.target.value)}
							className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Nota de 0 a 10 (ex.: 9,5)"
						/>
					</div>
				))}
			</div>

			{error && (
				<div className="mt-4 flex items-center text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-800/20 p-3 rounded-md">
					<AlertTriangle className="w-5 h-5 mr-2" />
					{error}
				</div>
			)}

			{success && (
				<div className="mt-4 flex items-center text-sm text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-800/20 p-3 rounded-md">
					<CheckCircle className="w-5 h-5 mr-2" />
					Avaliação salva com sucesso!
				</div>
			)}

			<div className="flex justify-end mt-6">
				<button
					type="submit"
					className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
				>
					Salvar Avaliação
				</button>
			</div>
		</form>
	);
}
