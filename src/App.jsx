import { useState, useEffect } from 'react';
import axios from 'axios';
import OfficerForm from './pages/OfficerForm';
import EvaluationForm from './pages/EvaluationForm';
import OfficerList from './pages/OfficerList';
import Login from './pages/Login';

export default function App() {
  const [activeTab, setActiveTab] = useState('cadastro');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica se há token salvo
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
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

        <div className="flex justify-center gap-4 mb-8">
          <TabButton
            label="Cadastro de Oficial"
            isActive={activeTab === 'cadastro'}
            onClick={() => setActiveTab('cadastro')}
          />
          <TabButton
            label="Avaliação de Oficial"
            isActive={activeTab === 'avaliacao'}
            onClick={() => setActiveTab('avaliacao')}
          />
          <TabButton
            label="Lista de Oficiais"
            isActive={activeTab === 'lista'}
            onClick={() => setActiveTab('lista')}
          />
          <TabButton
            label="Logout"
            isActive={false}
            onClick={handleLogout}
            danger
          />
        </div>

        {activeTab === 'cadastro' && <OfficerForm />}
        {activeTab === 'avaliacao' && <EvaluationForm />}
        {activeTab === 'lista' && <OfficerList />}
      </div>
    </div>
  );
}

function TabButton({ label, isActive, onClick, danger = false }) {
  return (
    <button
      className={`px-5 py-2 rounded-lg font-medium shadow transition ${
        isActive
          ? 'bg-blue-600 text-white'
          : danger
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
