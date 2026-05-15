import React from 'react';
import './NavbarAdmin.css';

function NavbarAdmin({ onSelecionar, paginaAtual }) {
  const botoes = [
    { id: 'cadastro', label: 'Cadastro' },
    { id: 'produtos', label: 'Produtos' },
    { id: 'frutos', label: 'Frutos do Goiás' },
  ];

  return (
    <div className="admin-navbar">
      {botoes.map(btn => (
        <button
          key={btn.id}
          className={paginaAtual === btn.id ? 'ativo' : ''}
          onClick={() => onSelecionar(btn.id)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

export default NavbarAdmin;
