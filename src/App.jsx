import { useState } from 'react';
import OfficerForm from './pages/OfficerForm';
import EvaluationForm from './pages/EvaluationForm';
import OfficerList from './pages/OfficerList';

export default function App() {
  const [activeTab, setActiveTab] = useState('cadastro');

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Sistema de Avaliação de Oficiais
        </h1>

        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 mx-2 rounded-md transition-colors ${
              activeTab === 'cadastro'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('cadastro')}
          >
            Cadastro de Oficial
          </button>

          <button
            className={`px-4 py-2 mx-2 rounded-md transition-colors ${
              activeTab === 'avaliacao'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('avaliacao')}
          >
            Avaliação de Oficial
          </button>

          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'lista'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('lista')}
          >
            Lista de Oficiais
          </button>

        </div>

        {activeTab === 'cadastro' && <OfficerForm />}
        {activeTab === 'avaliacao' && <EvaluationForm />}
        {activeTab === 'lista' && <OfficerList />}
      </div>
    </div>
  );
}