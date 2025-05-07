import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import OfficerForm from "./pages/OfficerForm";
import EvaluationForm from "./pages/EvaluationForm";
import OfficerList from "./pages/OfficerList";
import Login from "./pages/Login";
import UserRegister from "./pages/UserRegister";
import ChangePassword from "./pages/ChangePassword";

export default function App() {
	const [activeTab, setActiveTab] = useState("cadastro");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const decoded = jwtDecode(token);
				setIsAuthenticated(true);
				setUserRole(decoded.role);
				axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			} catch (error) {
				console.error("Token inválido:", error);
				localStorage.removeItem("token");
			}
		}
	}, []);

	const handleLoginSuccess = (token) => {
		localStorage.setItem("token", token);
		const decoded = jwtDecode(token);
		setIsAuthenticated(true);
		setUserRole(decoded.role);
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		delete axios.defaults.headers.common["Authorization"];
		setIsAuthenticated(false);
		setUserRole(null);
		setActiveTab("cadastro");
	};

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<Login onLoginSuccess={handleLoginSuccess} />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white px-4 py-10">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
					Sistema de Avaliação de Oficiais
				</h1>

				<div className="flex justify-center gap-4 mb-8 flex-wrap">
					<button
						className={`px-5 py-2 rounded-lg font-medium shadow transition ${
							activeTab === "cadastro"
								? "bg-blue-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
						onClick={() => setActiveTab("cadastro")}
					>
						Cadastro de Oficial
					</button>

					<button
						className={`px-5 py-2 rounded-lg font-medium shadow transition ${
							activeTab === "avaliacao"
								? "bg-blue-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
						onClick={() => setActiveTab("avaliacao")}
					>
						Avaliação de Oficial
					</button>

					<button
						className={`px-5 py-2 rounded-lg font-medium shadow transition ${
							activeTab === "lista"
								? "bg-blue-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
						onClick={() => setActiveTab("lista")}
					>
						Lista de Oficiais
					</button>

					{userRole === "admin" && (
						<button
							className={`px-5 py-2 rounded-lg font-medium shadow transition ${
								activeTab === "usuarios"
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
							onClick={() => setActiveTab("usuarios")}
						>
							Cadastro de Usuários
						</button>
					)}

					{isAuthenticated && (
						<button
							className={`px-5 py-2 rounded-lg font-medium shadow transition ${
								activeTab === "senha"
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
							onClick={() => setActiveTab("senha")}
						>
							Alterar Senha
						</button>
					)}

					<button
						className="px-5 py-2 rounded-lg font-medium shadow transition bg-red-100 text-red-600 hover:bg-red-200"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>

				{activeTab === "cadastro" && <OfficerForm />}
				{activeTab === "avaliacao" && <EvaluationForm />}
				{activeTab === "lista" && <OfficerList />}
				{activeTab === "usuarios" && userRole === "admin" && <UserRegister />}
				{activeTab === "senha" && <ChangePassword />}
			</div>
		</div>
	);
}
