import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CardapioAdminTopbar({ searchTerm, showOnlyActive, onSearchTermChange, onToggleFilter }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHoursPage = location.pathname.endsWith("/horarios");
  const isCreateGroupPage = location.pathname.endsWith("/grupos/novo");

  return (
    <header className="cardapio-admin-topbar">
      <button
        type="button"
        className={isHoursPage ? "cardapio-topbar-pill active" : "cardapio-topbar-pill"}
        onClick={() => navigate("/menu/admin/horarios")}
      >
        Disponibilidade
      </button>

      <button
        type="button"
        className={
          isCreateGroupPage
            ? "cardapio-topbar-pill cardapio-topbar-pill-muted active"
            : "cardapio-topbar-pill cardapio-topbar-pill-muted"
        }
        onClick={() => navigate("/menu/admin/grupos/novo")}
      >
        Adicionar Grupo
      </button>

      <label className="cardapio-topbar-search">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Buscar produto"
        />
      </label>

      <button
        type="button"
        className="cardapio-topbar-pill cardapio-topbar-pill-muted"
        onClick={onToggleFilter}
      >
        {showOnlyActive ? "Filtro: Ativos" : "Filtro: Todos"}
      </button>
    </header>
  );
}

export default CardapioAdminTopbar;