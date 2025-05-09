import { useEffect, useState } from "react";
import api from "../api";
import { Trash2 } from "lucide-react";

export default function ViewEvaluations({ officerId, userRole }) {
	const [evaluations, setEvaluations] = useState([]);
	const [openIndex, setOpenIndex] = useState(null);

	useEffect(() => {
		loadEvaluations();
	}, [officerId]);

	const loadEvaluations = async () => {
		const res = await api.get(
			`${import.meta.env.VITE_API_BASE_URL}/evaluations/${officerId}`
		);
		setEvaluations(res.data);
	};

	const toggleIndex = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Tem certeza que deseja deletar esta avaliação?"))
			return;
		try {
			await api.delete(
				`${
					import.meta.env.VITE_API_BASE_URL
				}/evaluations/deletarAvaliacao/${id}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			await loadEvaluations();
		} catch (err) {
			alert("Erro ao deletar avaliação.");
			console.error(err);
		}
	};

	if (!evaluations.length) {
		return (
			<p className="text-gray-500 dark:text-gray-400 text-sm">
				Nenhuma avaliação encontrada.
			</p>
		);
	}

	const skillLabels = {
		montarOcorrencia: "Ocorrência",
		abordagem: "Abordagem",
		registroIdentidade: "Registro de Identidade",
		negociacao: "Negociação",
		efetuarPrisao: "Processo de Prisão",
		posicionamentoPatrulha: "Patrulhamento",
		conhecimentoLeis: "Conhecimento de Leis",
	};

	return (
		<div className="space-y-3">
			{evaluations.map((evalItem, idx) => (
				<div
					key={evalItem._id}
					className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 shadow-inner"
				>
					<div
						className="cursor-pointer text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center justify-between"
						onClick={() => toggleIndex(idx)}
					>
						<span>
							Data: {new Date(evalItem.date).toLocaleDateString()} | Patente:{" "}
							{evalItem.rankAtEvaluation || "N/A"} | Avaliador:{" "}
							{evalItem.evaluator?.officerName || "Desconhecido"}
						</span>
						{userRole === "admin" && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleDelete(evalItem._id);
								}}
								className="ml-3 p-1 rounded-full text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900 transition"
								title="Excluir avaliação"
							>
								<Trash2 size={18} />
							</button>
						)}
					</div>

					{openIndex === idx && (
						<div className="mt-2 text-sm text-gray-700 dark:text-gray-200 space-y-1">
							{evalItem.skills &&
								Object.entries(evalItem.skills).map(([skill, value]) => (
									<div
										key={skill}
										className="flex justify-between py-1 border-b border-gray-300 dark:border-gray-600 text-sm"
									>
										<span>{skillLabels[skill] || skill}</span>
										<span className="font-semibold">{value}</span>
									</div>
								))}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
