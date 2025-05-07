import { useState } from "react";
import api from '../api';

const ranks = [
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

export default function EditOfficerForm({ officer, onCancel, onSuccess }) {
	const [formData, setFormData] = useState({
		name: officer.name,
		rank: officer.rank,
		startDate: officer.startDate?.slice(0, 10),
	});

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const confirmed = window.confirm("Você confirma as alterações?");
		if (!confirmed) return;

		const [year, month, day] = formData.startDate.split("-");
		const correctedDate = new Date(year, month - 1, day);

		const dataToSend = {
			...formData,
			startDate: correctedDate.toISOString(),
		};

		await api.put(
			`/officers/atualizarOficial/${officer._id}`,
			dataToSend
		);
		onSuccess();
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<input
				type="text"
				value={formData.name}
				onChange={(e) => handleChange("name", e.target.value)}
				className="w-full px-3 py-2 border rounded-md"
				placeholder="Nome"
			/>
			<select
				value={formData.rank}
				onChange={(e) => handleChange("rank", e.target.value)}
				className="w-full px-3 py-2 border rounded-md"
			>
				{ranks.map((r) => (
					<option key={r}>{r}</option>
				))}
			</select>
			<input
				type="date"
				value={formData.startDate}
				onChange={(e) => handleChange("startDate", e.target.value)}
				className="w-full px-3 py-2 border rounded-md"
			/>
			<div className="flex justify-end space-x-3">
				<button
					type="button"
					onClick={onCancel}
					className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
				>
					Cancelar
				</button>
				<button
					type="submit"
					className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
				>
					Atualizar
				</button>
			</div>
		</form>
	);
}
