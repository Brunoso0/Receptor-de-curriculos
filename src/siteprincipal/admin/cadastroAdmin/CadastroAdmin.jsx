import React, { useEffect, useState } from 'react';
import FormCategoria from './FormCategoria';
import FormProduto from './FormProduto';
import api from '../../services/api';
import '../../styles/Admin.css';

function CadastroAdmin() {
  const [categorias, setCategorias] = useState([]);

  const carregarCategorias = () => {
    api.get('/api/categorias')
      .then(res => setCategorias(res.data))
      .catch(() => console.error('Erro ao carregar categorias'));
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  return (
    <div className="admin-formulario">
      <FormCategoria onSuccess={carregarCategorias} />
      <FormProduto categorias={categorias} onSuccess={carregarCategorias} />
    </div>
  );
}

export default CadastroAdmin;
