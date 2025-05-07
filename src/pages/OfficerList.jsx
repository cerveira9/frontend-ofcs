import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Pencil, Trash2, Users } from "lucide-react";
import EditOfficerForm from "./EditOfficerForm";

export default function OfficerList() {
	const [officers, setOfficers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);
	const editRef = useRef(null);

	useEffect(() => {
		fetchOfficers();
	}, []);

	useEffect(() => {
		function handleClickOutside(event) {
			if (editRef.current && !editRef.current.contains(event.target)) {
				setEditingId(null);
			}
		}

		if (editingId) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [editingId]);

	const fetchOfficers = async () => {
		const res = await axios.get(
			"http://localhost:5000/v1/api/officers/mostrarOficiais"
		);
		setOfficers(res.data);
		setLoading(false);
	};

	const handleDelete = async (id) => {
		const confirm = window.confirm("Você confirma a exclusão do oficial?");
		if (!confirm) return;
		await axios.delete(
			`http://localhost:5000/v1/api/officers/deletarOficial/${id}`
		);
		fetchOfficers();
	};

	const stopEditing = () => setEditingId(null);

	if (loading)
		return (
			<div className="text-center text-gray-500">Carregando oficiais...</div>
		);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{officers.map((officer) => {
				const isEditing = officer._id === editingId;
				return (
					<div
						key={officer._id}
						className={
							`relative group bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all duration-300 ` +
							(isEditing
								? "col-span-1 sm:col-span-2 lg:col-span-3 w-full"
								: "hover:translate-x-2")
						}
						ref={isEditing ? editRef : null}
					>
						<div className="flex justify-between items-start">
							<div className="w-full">
								<div className="flex items-center mb-1">
									<Users className="text-blue-500 mr-2" />
									<h3 className="text-lg font-semibold text-gray-900">
										{officer.name}
									</h3>
								</div>
								<p className="text-sm text-blue-600 font-medium mb-1">
									{officer.rank}
								</p>
								<p className="text-sm text-gray-500">
									Início: {new Date(officer.startDate).toLocaleDateString()}
								</p>
								<p className="text-sm text-gray-500">
									Registro: {new Date(officer.registerDate).toLocaleString()}
								</p>
							</div>

							{!isEditing && (
								<div className="absolute top-4 right-2 h-20 flex flex-col justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-200">
									<button
										className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors"
										onClick={() => setEditingId(officer._id)}
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
							<div className="mt-4 border-t pt-4 transition-all duration-300 ease-in-out">
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
					</div>
				);
			})}
		</div>
	);
}
