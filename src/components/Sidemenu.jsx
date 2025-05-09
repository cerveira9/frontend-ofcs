import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

export default function Sidemenu({ activeTab, setActiveTab, handleLogout, userRole, setMenuOpen }) {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
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
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        setMenuOpen(!isOpen);
    };

    return (
        <div className="relative">
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleMenu}
                ></div>
            )}

            {/* Sidemenu */}
            <div
                className={`fixed top-0 left-0 h-full bg-gray-100 dark:bg-gray-800 shadow-lg transition-transform transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } w-64 z-50`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        Menu
                    </h2>
                    <button
                        onClick={toggleMenu}
                        className="text-gray-800 dark:text-gray-100 hover:opacity-75"
                    >
                        <X size={24} />
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    {menuItems.map(({ key, label }) => (
                        <button
                            key={key}
                            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                                activeTab === key
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                            onClick={() => setActiveTab(key)}
                        >
                            {label}
                        </button>
                    ))}
                    <button
                        className="w-full text-left px-4 py-2 rounded-lg font-medium transition bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700"
                        onClick={handleLogout}
                    >
                        <LogOut className="inline-block mr-2" />
                        Logout
                    </button>
                </nav>
            </div>

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={toggleMenu}
                    className="fixed top-4 left-4 z-50 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-2 rounded-full shadow-lg hover:opacity-90"
                >
                    <Menu size={24} />
                </button>
            )}
        </div>
    );
}