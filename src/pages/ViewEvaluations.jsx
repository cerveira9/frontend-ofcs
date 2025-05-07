import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewEvaluations({ officerId }) {
	const [evaluations, setEvaluations] = useState([]);
	const [openIndex, setOpenIndex] = useState(null);

	useEffect(() => {
		axios
			.get(`http://localhost:5000/v1/api/evaluations/${officerId}`)
			.then((res) => setEvaluations(res.data));
	}, [officerId]);

	const toggleIndex = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	if (!evaluations.length) {
		return (
			<p className="text-gray-500 text-sm">Nenhuma avaliação encontrada.</p>
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
					className="bg-gray-100 rounded-md p-3 shadow-inner"
				>
					<div
						className="cursor-pointer text-blue-600 font-semibold hover:underline"
						onClick={() => toggleIndex(idx)}
					>
						Avaliação na data: {new Date(evalItem.date).toLocaleDateString()}
					</div>

					{openIndex === idx && (
						<div className="mt-2 text-sm text-gray-700 space-y-1">
							{evalItem.skills &&
								Object.entries(evalItem.skills).map(([skill, value]) => (
									<div
										key={skill}
										className="flex justify-between py-1 border-b text-sm text-gray-700"
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
