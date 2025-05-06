import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EvaluationForm() {
  const [officers, setOfficers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [skills, setSkills] = useState({});

  const skillList = [
    'montarOcorrencia',
    'abordagem',
    'registroIdentidade',
    'negociacao',
    'efetuarPrisao',
    'posicionamentoPatrulha',
    'conhecimentoLeis'
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/v1/api/officers/mostrarOficiais').then(res => setOfficers(res.data));
  }, []);

  const submitEval = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/v1/api/evaluations/cadastrarAvaliacao', {
      officerId: selected,
      skills
    });
  };

  return (
    <form className="p-6 bg-white shadow-md rounded-md max-w-2xl mx-auto" onSubmit={submitEval}>
      <h2 className="text-xl font-bold mb-4">Avaliar Oficial</h2>
      <select className="input" onChange={e => setSelected(e.target.value)}>
        <option value="">Selecione o Oficial</option>
        {officers.map(o => <option value={o._id} key={o._id}>{o.name}</option>)}
      </select>

      {skillList.map(skill => (
        <div key={skill} className="mt-4">
          <label>{skill.replace(/([A-Z])/g, ' $1')}:</label>
          <input type="number" min="0" max="10" onChange={e => setSkills(s => ({ ...s, [skill]: parseInt(e.target.value) }))} className="input" />
        </div>
      ))}
      <button className="btn mt-4">Salvar Avaliação</button>
    </form>
  );
}