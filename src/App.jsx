import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import OfficerForm from "./pages/OfficerForm";
import EvaluationForm from "./pages/EvaluationForm";
import OfficerList from "./pages/OfficerList";
import Login from "./pages/Login";
import UserRegister from "./pages/UserRegister";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import AuditLogsPage from "./pages/AuditLogsPage";

export default function App() {
	const [activeTab, setActiveTab] = useState("cadastro");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [theme, setTheme] = useState("light");

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

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") || "light";
		setTheme(savedTheme);
		document.documentElement.classList.toggle("dark", savedTheme === "dark");
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

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
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-gray-100">
				<Login onLoginSuccess={handleLoginSuccess} />
			</div>
		);
	}

	return (
		<div className="min-h-screen px-4 py-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-center w-full">
						Sistema de Avaliação de Oficiais
					</h1>
					<button
						onClick={toggleTheme}
						className="absolute top-6 right-6 px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:opacity-90 transition"
					>
						{theme === "light" ? "🌙 Modo Escuro" : "☀️ Modo Claro"}
					</button>
				</div>

				<div className="flex justify-center gap-4 mb-8 flex-wrap">
					{[
						{ key: "cadastro", label: "Cadastro de Oficial" },
						{ key: "avaliacao", label: "Avaliação de Oficial" },
						{ key: "lista", label: "Lista de Oficiais" },
						...(userRole === "admin"
							? [
									{ key: "usuarios", label: "Cadastro de Usuários" },
									{ key: "dashboard", label: "Dashboard" },
									{ key: "logs", label: "Logs de Auditoria" },
							  ]
							: []),
						{ key: "senha", label: "Alterar Senha" },
					].map(({ key, label }) => (
						<button
							key={key}
							className={`px-5 py-2 rounded-lg font-medium shadow transition ${
								activeTab === key
									? "bg-blue-600 text-white"
									: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
							}`}
							onClick={() => setActiveTab(key)}
						>
							{label}
						</button>
					))}

					<button
						className="px-5 py-2 rounded-lg font-medium shadow transition bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>

				{activeTab === "cadastro" && <OfficerForm />}
				{activeTab === "avaliacao" && <EvaluationForm />}
				{activeTab === "lista" && <OfficerList />}
				{activeTab === "usuarios" && userRole === "admin" && <UserRegister />}
				{activeTab === "dashboard" && userRole === "admin" && <Dashboard />}
				{activeTab === "logs" && userRole === "admin" && <AuditLogsPage />}
				{activeTab === "senha" && <ChangePassword />}
			</div>
		</div>
	);
}
