import { useState } from "react";
import api from '../api';

export default function UserRegister() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [officerName, setOfficerName] = useState("");
	const [role, setRole] = useState("federal");
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const token = localStorage.getItem("token");
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

			await api.post(
				`${import.meta.env.VITE_API_BASE_URL}/auth/register`,
				{ username, password, officerName, role },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setSuccess("Usuário cadastrado com sucesso!");
			setError("");
			setUsername("");
			setPassword("");
			setOfficerName("");
			setRole("federal");
		} catch (err) {
			console.error(err.response?.data || err);
			setError("Erro ao cadastrar usuário.");
			setSuccess("");
		}
	};

	return (
		<form
			className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow"
			onSubmit={handleSubmit}
		>
			<h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
				Cadastrar Novo Usuário
			</h2>

			{error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
			{success && <p className="text-green-600 dark:text-green-400 mb-4">{success}</p>}

			<div className="mb-4">
				<label className="block mb-1 text-gray-700 dark:text-gray-300">Usuário</label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 rounded-md"
				/>
			</div>

			<div className="mb-4">
				<label className="block mb-1 text-gray-700 dark:text-gray-300">Senha</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 rounded-md"
				/>
			</div>

			<div className="mb-4">
				<label className="block mb-1 text-gray-700 dark:text-gray-300">Oficial</label>
				<input
					type="text"
					value={officerName}
					onChange={(e) => setOfficerName(e.target.value)}
					required
					className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 rounded-md"
				/>
			</div>

			<div className="mb-6">
				<label className="block mb-1 text-gray-700 dark:text-gray-300">Role</label>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value)}
					className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 rounded-md"
				>
					<option value="federal">Federal</option>
					<option value="admin">Admin</option>
				</select>
			</div>

			<button
				type="submit"
				className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
			>
				Cadastrar
			</button>
		</form>
	);
}
