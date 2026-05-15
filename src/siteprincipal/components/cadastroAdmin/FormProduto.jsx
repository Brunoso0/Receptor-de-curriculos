import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

function FormProduto({ categorias, onSuccess }) {
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', categoria_id: '' });
  const [imagem, setImagem] = useState(null);

  const atualizarCampo = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (imagem) formData.append('imagem', imagem);

    api.post('/api/produtos', formData)
      .then(() => {
        toast.success('Produto criado!');
        setForm({ nome: '', descricao: '', preco: '', categoria_id: '' });
        setImagem(null);
        onSuccess();
      })
      .catch(() => toast.error('Erro ao criar produto.'));
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h3>Criar Novo Produto</h3>
      <input value={form.nome} onChange={e => atualizarCampo('nome', e.target.value)} placeholder="Nome" />
      <textarea value={form.descricao} onChange={e => atualizarCampo('descricao', e.target.value)} placeholder="Descrição" />
      <input type="number" value={form.preco} onChange={e => atualizarCampo('preco', e.target.value)} placeholder="Preço" />
      <select value={form.categoria_id} onChange={e => atualizarCampo('categoria_id', e.target.value)} required>
        <option value="">Selecione uma categoria</option>
        {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
      </select>
      <input type="file" onChange={e => setImagem(e.target.files[0])} />
      <button type="submit">Criar Produto</button>
    </form>
  );
}

export default FormProduto;
