import React, { useEffect, useState } from "react";
import api from "../api";

export default function DashboardSummary() {
	const [analyticsData, setAnalyticsData] = useState(0);
	const [recentEvaluations, setRecentEvaluations] = useState([]);
	const [recentPromotions, setRecentPromotions] = useState([]);

	useEffect(() => {
		// Fetch total officers
		api
			.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard/analytics`)
			.then((res) => setAnalyticsData(res.data))
			.catch((err) => console.error("Erro ao buscar total de oficiais:", err));

		// Fetch recent evaluations
		api
			.get(
				`${
					import.meta.env.VITE_API_BASE_URL
				}/evaluations/oficiaisAvaliadosRecentes`
			)
			.then((res) => setRecentEvaluations(res.data))
			.catch((err) =>
				console.error("Erro ao buscar avaliações recentes:", err)
			);

		// Fetch recent promotions
		api
			.get(`${import.meta.env.VITE_API_BASE_URL}/officers/promocoesRecentes`)
			.then((res) => setRecentPromotions(res.data))
			.catch((err) => console.error("Erro ao buscar promoções recentes:", err));
	}, []);

	return (
		<div className="grid grid-cols-1 md:grid-cols-6 gap-6">
			{/* Total Officers, Total Evaluations, Evaluated Officers */}
			<div className="md:col-span-1 flex flex-col justify-between">
				{/* Total Officers */}
				<div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow text-center">
					<h2 className="text-xl font-bold text-gray-700 dark:text-gray-100">
						Total de Oficiais
					</h2>
					<p className="text-3xl font-bold text-blue-900 dark:text-blue-200">
						{analyticsData.totalOfficers}
					</p>
				</div>

				{/* Total Evaluations */}
				<div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg shadow text-center">
					<h2 className="text-xl font-bold text-gray-700 dark:text-gray-100">
						Avaliações Realizadas
					</h2>
					<p className="text-3xl font-bold text-green-900 dark:text-green-200">
						{analyticsData.totalEvaluations}
					</p>
				</div>

				{/* Evaluated Officers */}
				<div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-lg shadow text-center">
					<h2 className="text-xl font-bold text-gray-700 dark:text-gray-100">
						Oficiais Avaliados
					</h2>
					<p className="text-3xl font-bold text-purple-900 dark:text-purple-200">
						{analyticsData.evaluatedOfficers}
					</p>
				</div>
			</div>

			{/* Recent Evaluations */}
			<div className="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
				<h2 className="text-xl font-bold text-gray-700 dark:text-gray-100">
					Avaliações Recentes
				</h2>
				<div className="overflow-x-auto mt-4">
					<table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
						<thead>
							<tr className="bg-gray-100 dark:bg-gray-800">
								<th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
									Data
								</th>
								<th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
									Oficial
								</th>
								<th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
									Patente
								</th>
								<th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
									Avaliador
								</th>
							</tr>
						</thead>
						<tbody>
							{recentEvaluations.map((evaluation, index) => (
								<tr
									key={index}
									className={`${
										index % 2 === 0
											? "bg-white dark:bg-gray-900"
											: "bg-gray-50 dark:bg-gray-800"
									}`}
								>
									<td className="px-4 py-2 text-gray-600 dark:text-gray-300">
										{evaluation.date
											? new Date(evaluation.date).toLocaleDateString()
											: "Data desconhecida"}
									</td>
									<td className="px-4 py-2 text-gray-600 dark:text-gray-300">
										{evaluation.name || "Oficial desconhecido"}
									</td>
									<td className="px-4 py-2 text-gray-600 dark:text-gray-300">
										{evaluation.rank || "Patente desconhecida"}
									</td>
									<td className="px-4 py-2 text-gray-600 dark:text-gray-300">
										{evaluation.evaluator || "Avaliador desconhecido"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Recent Promotions */}
			<div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
				<h2 className="text-xl font-bold text-gray-700 dark:text-gray-100">
					Promoções Recentes
				</h2>
				<div className="overflow-x-auto mt-4">
					<table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
						<thead>
							<tr className="bg-gray-100 dark:bg-gray-800">
								<th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
									Data
								</th>
								<th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
									Oficial
								</th>
								<th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
									Nova Patente
								</th>
							</tr>
						</thead>
						<tbody>
							{recentPromotions.map((promotion, index) => (
								<tr
									key={index}
									className={`${
										index % 2 === 0
											? "bg-white dark:bg-gray-900"
											: "bg-gray-50 dark:bg-gray-800"
									}`}
								>
									<td className="px-4 py-2 text-gray-600 dark:text-gray-300">
										{promotion.promotedAt
											? new Date(promotion.promotedAt).toLocaleDateString(
													"pt-BR"
											  )
											: "Data desconhecida"}
									</td>
									<td className="px-4 py-2 text-gray-600 dark:text-gray-300">
										{promotion.name || "Oficial desconhecido"}
									</td>
									<td className="px-4 py-2 text-gray-600 dark:text-gray-300">
										{promotion.newRank || "Patente desconhecida"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
