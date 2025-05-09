import { Sun, Moon, User } from "lucide-react";
import logo from "../assets/icon.png";

export default function Header({ theme, toggleTheme, userRole }) {
    return (
        <header className="fixed top-0 left-0 w-full bg-gray-100 dark:bg-gray-800 shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                {/* Logo ou Título */}
                <div className="flex items-center">
                    <img src={logo} alt="Logo do Sistema" className="w-10 h-10" /> {/* Logo */}
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Oficiais Outland
                    </h1>
                </div>

                {/* Ações no Header */}
                <div className="flex items-center space-x-4">
                    {/* Alternância de Tema */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:opacity-90 transition"
                        title="Alternar Tema"
                    >
                        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {/* Perfil do Usuário */}
                    <div className="flex items-center space-x-2">
                        <User className="w-6 h-6 text-gray-800 dark:text-gray-100" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                            {userRole === "admin" ? "Administrador" : "Federal"}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}