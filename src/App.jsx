import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import DashboardSummary from "./pages/DashboardSummary";
import OfficerForm from "./pages/OfficerForm";
import EvaluationForm from "./pages/EvaluationForm";
import OfficerList from "./pages/OfficerList";
import Login from "./pages/Login";
import UserRegister from "./pages/UserRegister";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import AuditLogsPage from "./pages/AuditLogsPage";
import Sidemenu from "./components/Sidemenu";
import Header from "./components/Header";

export default function App() {
	const [activeTab, setActiveTab] = useState("inicial");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [theme, setTheme] = useState("light");
    const [isMenuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const decoded = jwtDecode(token);
				const now = Date.now();
				const expiration = decoded.exp * 1000;

				if (expiration <= now) {
					handleLogout(); // Token já expirado
					alert("Sua sessão expirou. Faça login novamente.");
					return;
				}

				setIsAuthenticated(true);
				setUserRole(decoded.role);
				axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

				const timeoutWarning = expiration - now - 30000;
				const timeoutLogout = expiration - now;

				const warningTimer = setTimeout(() => {
					alert("Sua sessão está prestes a expirar. Você será deslogado.");
				}, Math.max(timeoutWarning, 0)); // Evita valores negativos

				const logoutTimer = setTimeout(() => {
					alert("Sua sessão expirou. Faça login novamente.");
					handleLogout();
				}, timeoutLogout);

				return () => {
					clearTimeout(warningTimer);
					clearTimeout(logoutTimer);
				};
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
		setActiveTab("inicial");
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		delete axios.defaults.headers.common["Authorization"];
		setIsAuthenticated(false);
		setUserRole(null);
		setActiveTab("inicial");
	};

	if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-gray-100">
                <Login onLoginSuccess={handleLoginSuccess} />
            </div>
        );
    }

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
			<Header theme={theme} toggleTheme={toggleTheme} userRole={userRole} />

			<Sidemenu
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				handleLogout={handleLogout}
				userRole={userRole}
				setMenuOpen={setMenuOpen}
			/>

			<div
				className={`p-8 transition-all duration-300 ${
					isMenuOpen ? "ml-64" : "ml-0"
				} pt-24`}
			>
				{activeTab === "inicial" && <DashboardSummary />}
				{activeTab === "cadastro" && <OfficerForm />}
				{activeTab === "avaliacao" && <EvaluationForm />}
				{activeTab === "lista" && <OfficerList userRole={userRole} />}
				{activeTab === "usuarios" && userRole === "admin" && <UserRegister />}
				{activeTab === "dashboard" && <Dashboard />}
				{activeTab === "logs" && userRole === "admin" && <AuditLogsPage />}
				{activeTab === "senha" && <ChangePassword />}
			</div>
		</div>
	);
}
