# Frontend - Sistema de Avaliação de Oficiais

Interface web moderna desenvolvida em React + TailwindCSS para cadastro, avaliação e visualização de oficiais.

## Tecnologias

- React (Vite)
- TailwindCSS
- Axios
- Lucide-react (ícones)
- PostCSS

## Funcionalidades

### Telas:

- **Cadastro de Oficial**
  - Formulário para nome, patente e data de início.

- **Avaliação de Oficial**
  - Escolhe oficial e avalia 7 habilidades entre 0 e 10.
  - Validação e mensagens de sucesso/erro com animações.

- **Lista de Oficiais**
  - Exibe cards por patente com:
    - Nome e datas
    - Flag de cor com base no tempo na patente
    - Contagem de avaliações
    - Botões de editar, deletar e visualizar avaliações (com animações inline)

### Componentes:

- `OfficerForm`: Cadastro
- `EvaluationForm`: Avaliação
- `OfficerList`: Exibição em cards
- `EditOfficerForm`: Edição
- `ViewEvaluations`: Visualização de avaliações com collapsible

## Instruções

```bash
npm install
npm run dev
