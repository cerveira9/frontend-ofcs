import { useEffect, useState, useRef } from "react";
import api from "../api";
import { Pencil, Trash2, FileSearch, ArrowUp } from "lucide-react";
import EditOfficerForm from "./EditOfficerForm";
import ViewEvaluations from "./ViewEvaluations";

export default function OfficerList({ userRole }) {
	const [officers, setOfficers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);
	const [viewingEvalId, setViewingEvalId] = useState(null);
	const editRef = useRef(null);

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

	const flagRules = {
		Cadete: { green: 5, yellow: 7 },
	};

	const getFlagColor = (rank, startDate) => {
		if (!flagRules[rank]) return null;
		const start = new Date(startDate);
		const today = new Date();
		const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
		const { green, yellow } = flagRules[rank];
		if (diffDays <= green) return "green";
		if (diffDays <= yellow) return "yellow";
		return "red";
	};

	useEffect(() => {
		fetchOfficers();
	}, []);

	useEffect(() => {
		function handleClickOutside(event) {
			if (editRef.current && !editRef.current.contains(event.target)) {
				setEditingId(null);
				setViewingEvalId(null);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [editingId, viewingEvalId]);

	const fetchOfficers = async () => {
		const res = await api.get(
			`${import.meta.env.VITE_API_BASE_URL}/officers/mostrarOficiais`
		);
		setOfficers(res.data);
		setLoading(false);
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Você confirma a exclusão do oficial?")) return;
		await api.delete(
			`${import.meta.env.VITE_API_BASE_URL}/officers/deletarOficial/${id}`
		);
		fetchOfficers();
	};

	const stopEditing = () => setEditingId(null);
	const stopViewing = () => setViewingEvalId(null);

	const grouped = hierarchy
		.map((rank) => ({
			rank,
			items: officers.filter((o) => o.rank === rank),
		}))
		.filter((g) => g.items.length > 0);

	if (loading)
		return (
			<div className="text-center text-gray-500 dark:text-gray-400">
				Carregando oficiais...
			</div>
		);

	return (
		<div className="space-y-10">
			{grouped.map((group) => (
				<div key={group.rank}>
					<h2 className="text-xl font-bold text-gray-700 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 mb-4">
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
									className={`relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm transition-all duration-300 overflow-visible min-w-[280px]
                    ${
											isEditing || isViewing
												? "col-span-1 sm:col-span-2 lg:col-span-3 w-full"
												: "hover:translate-x-2"
										}`}
									ref={isEditing || isViewing ? editRef : null}
								>
									{flagColor && (
										<div
											className={`w-3 h-3 rounded-full absolute top-3 left-3 ${
												flagColor === "green"
													? "bg-green-500"
													: flagColor === "yellow"
													? "bg-yellow-400"
													: "bg-red-500"
											}`}
											title={`Flag ${flagColor}`}
										/>
									)}

									<div className="flex justify-between items-start">
										<div className="w-full">
											<div className="flex items-center mb-1">
												<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
													{officer.name}
												</h3>
											</div>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Início:{" "}
												{new Date(officer.startDate).toLocaleDateString()}
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Registro:{" "}
												{new Date(officer.registerDate).toLocaleDateString()}
											</p>
										</div>

										{!(isEditing || isViewing) && (
											<div className="absolute top-3 right-3 grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
												<button
													className="p-2 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 hover:bg-green-200 hover:dark:bg-green-700 hover:text-green-900"
													onClick={async () => {
														const nextRankIndex =
															hierarchy.indexOf(officer.rank) + 1;
														const nextRank = hierarchy[nextRankIndex];

														if (!nextRank)
															return alert(
																"Este oficial já está na patente mais alta."
															);

														const confirmed = window.confirm(
															`Confirma a promoção de ${officer.name} de ${officer.rank} para ${nextRank}?`
														);
														if (!confirmed) return;

														try {
															await api.put(
																`${
																	import.meta.env.VITE_API_BASE_URL
																}/officers/promoverOficial/${officer._id}`
															);
															fetchOfficers();
														} catch {
															alert("Erro ao promover oficial.");
														}
													}}
													title="Promover"
												>
													<ArrowUp size={18} />
												</button>

												<button
													className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 hover:dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300"
													onClick={() => {
														setViewingEvalId(officer._id);
														stopEditing();
													}}
													title="Avaliações"
												>
													<FileSearch size={18} />
												</button>

												<button
													className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 hover:dark:bg-blue-800 text-blue-600 dark:text-blue-300"
													onClick={() => {
														setEditingId(officer._id);
														stopViewing();
													}}
													title="Editar"
												>
													<Pencil size={18} />
												</button>

												<button
													className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 hover:dark:bg-red-800 text-red-600 dark:text-red-300"
													onClick={() => handleDelete(officer._id)}
													title="Excluir"
												>
													<Trash2 size={18} />
												</button>
											</div>
										)}
									</div>

									{isEditing && (
										<div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
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
										<div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
											<ViewEvaluations
												officerId={officer._id}
												userRole={userRole || "federal"}
											/>
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
