import React from "react";
import { Outlet } from "react-router-dom";
import NavbarCandidatos from "../components/NavbarCandidatos";

const Candidatos = () => {
  return (
    <div className="candidatos-container">
      <NavbarCandidatos />
      <div className="candidatos-content">
        <Outlet /> {/* Renderiza dinamicamente os conteúdos das empresas aqui */}
      </div>
    </div>
  );
};

export default Candidatos;
