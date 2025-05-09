import { useState } from 'react';
import axios from 'axios';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError('Preencha todos os campos.');
    }

    if (newPassword !== confirmPassword) {
      return setError('As senhas novas não coincidem.');
    }

    if (newPassword.length < 6) {
      return setError('A nova senha deve ter pelo menos 6 caracteres.');
    }

    try {
      await axios.post('/auth/alterarSenha', {
        currentPassword,
        newPassword,
      });
      setSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao alterar senha.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Alterar Senha
      </h2>

      {error && (
        <p className="text-red-600 dark:text-red-400 mb-2 text-sm">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 dark:text-green-400 mb-2 text-sm">
          {success}
        </p>
      )}

      <input
        type="password"
        placeholder="Senha atual"
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Nova senha"
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirmar nova senha"
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Atualizar Senha
      </button>
    </form>
  );
}
