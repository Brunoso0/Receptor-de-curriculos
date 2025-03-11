import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/NavbarCandidatos.css";

const NavbarCandidatos = () => {
  return (
    <nav className="candidatos-navbar">
      <ul>
        <li>
          <NavLink to="/candidatos/all" activeclassname="active">Todos os Candidatos</NavLink>
        </li>
        <li>
          <NavLink to="/candidatos/jrnet" activeclassname="active">JrNet</NavLink>
        </li>
        <li>
          <NavLink to="/candidatos/jrcoffee" activeclassname="active">JrCoffee</NavLink>
        </li>
        <li>
          <NavLink to="/candidatos/jrprodutora" activeclassname="active">JrProdutora</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarCandidatos;
