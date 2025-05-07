import { useState } from 'react';
import OfficerForm from './pages/OfficerForm';
import EvaluationForm from './pages/EvaluationForm';
import OfficerList from './pages/OfficerList';

export default function App() {
  const [activeTab, setActiveTab] = useState('cadastro');

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Sistema de Avaliação de Oficiais
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-5 py-2 rounded-lg font-medium shadow transition ${
              activeTab === 'cadastro'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('cadastro')}
          >
            Cadastro de Oficial
          </button>

          <button
            className={`px-5 py-2 rounded-lg font-medium shadow transition ${
              activeTab === 'avaliacao'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('avaliacao')}
          >
            Avaliação de Oficial
          </button>

          <button
            className={`px-5 py-2 rounded-lg font-medium shadow transition ${
              activeTab === 'lista'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
