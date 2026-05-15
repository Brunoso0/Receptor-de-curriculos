import React, { useState } from 'react';
import '../styles/Admin.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavbarAdmin from '../components/navbarAdmin/NavbarAdmin.jsx';
import CadastroAdmin from '../components/cadastroAdmin/CadastroAdmin';
import ListaProdutos from '../components/produtosAdmin/ListaProdutos';
import ListaFrutos from '../components/frutosAdmin/ListaFrutos';

function AdminPage() {
  const [paginaAtual, setPaginaAtual] = useState('cadastro');

  const renderizarComponente = () => {
    switch (paginaAtual) {
      case 'cadastro':
        return <CadastroAdmin />;
      case 'produtos':
        return <ListaProdutos />;
      case 'frutos':
        return <ListaFrutos />;
      default:
        return <h2>Selecione uma opção no menu.</h2>;
    }
  };

  return (
    <div className="admin-painel">
      <ToastContainer position="top-center" autoClose={3000} style={{ zIndex: 9999 }} />
      <h1>Painel de Administração</h1>
      <NavbarAdmin onSelecionar={setPaginaAtual} paginaAtual={paginaAtual} />
      <div className="admin-conteudo">
        {renderizarComponente()}
      </div>
    </div>
  );
}

export default AdminPage;
