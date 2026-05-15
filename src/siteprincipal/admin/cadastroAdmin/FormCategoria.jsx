import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

function FormCategoria({ onSuccess }) {
  const [nome, setNome] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome) return;
    api.post('/api/categorias', { nome })
      .then(() => {
        toast.success('Categoria criada com sucesso!');
        setNome('');
        onSuccess();
      })
      .catch(() => toast.error('Erro ao criar categoria.'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Criar Nova Categoria</h3>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da categoria"
      />
      <button type="submit">Adicionar Categoria</button>
    </form>
  );
}

export default FormCategoria;
