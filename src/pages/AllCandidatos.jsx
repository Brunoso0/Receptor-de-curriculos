import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../services/api";
import "../styles/AllCandidatos.css";

const AllCandidatos = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [filtroVaga, setFiltroVaga] = useState("");
  const [curriculoUrl, setCurriculoUrl] = useState(null);

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login"; // Redireciona se não estiver logado
          return;
        }
    
        const response = await api.get("/candidatos/listar", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCandidatos(response.data);
      } catch (error) {
        console.error("Erro ao buscar candidatos:", error);
        if (error.response && error.response.status === 401) {
          window.location.href = "/login"; // Redireciona se o token for inválido
        }
      }
    };
    

    const fetchVagas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login"; // Redireciona se não estiver logado
          return;
        }
    
        const response = await api.get("/vagas/vagas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVagas(response.data);
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      }
    };
    

    fetchCandidatos();
    fetchVagas();
  }, []);

  // Filtra as vagas para incluir apenas aquelas que possuem candidatos cadastrados
  const vagasComCandidatos = vagas.filter(vaga =>
    candidatos.some(candidato => candidato.vaga_id === vaga.id)
  );

  const abrirModalCurriculo = (curriculo) => {
    setCurriculoUrl(`${API_BASE_URL}${curriculo}`);
  };

  const fecharModal = () => {
    setCurriculoUrl(null);
  };

  return (
    <div className="candidatos-container">
      <div className="candidatos-filter">
        <h2>Todos Candidatos</h2>

        <select
            className="filtro-select"
            value={filtroVaga}
            onChange={(e) => setFiltroVaga(e.target.value)}
        >
            <option value="">Todos</option>
            {vagasComCandidatos.map((vaga) => (
            <option key={vaga.id} value={vaga.id}>
                {vaga.titulo}
            </option>
            ))}
        </select>

        <label className="filter-order">Ordenar por:</label>
        <select
          className="filtro-select order-select"
          onChange={(e) => {
            const value = e.target.value;
            if (value === "asc") {
              setCandidatos([...candidatos].sort((a, b) => a.id - b.id));
            } else if (value === "desc") {
              setCandidatos([...candidatos].sort((a, b) => b.id - a.id));
            } else if (value === "az") {
              setCandidatos([...candidatos].sort((a, b) => a.nome.localeCompare(b.nome)));
            } else if (value === "za") {
              setCandidatos([...candidatos].sort((a, b) => b.nome.localeCompare(a.nome)));
            }
          }}
        >
          <option value="">Ordenar por</option>
          <option value="asc">Primeiros a enviar</option>
          <option value="desc">Ultimos a enviar</option>
          <option value="az">Nomes A a Z</option>
          <option value="za">Nomes Z a A</option>
        </select>
        
      </div>

      <div className="candidatos-grid">
        {candidatos
          .filter((candidato) =>
            filtroVaga
              ? candidato.vaga_id.toString() === filtroVaga
              : true
          )
          .map((candidato) => (
            <div key={candidato.id} className="candidato-card">
              <div className="candidato-info">
                <img
                  src={candidato.foto ? `${API_BASE_URL}${candidato.foto}` : "/img/default-profile.png"}
                  alt={candidato.nome}
                  className="candidato-foto"
                />
                <div className="candidato-detalhes">
                  <strong>{candidato.nome}</strong>
                  <p>Vaga: {candidato.vaga}</p>
                  <small>Email: {candidato.email}</small>
                  <br />
                  <small>Telefone: {candidato.telefone}</small>
                  <button className="ver-curriculo-btn" onClick={() => abrirModalCurriculo(candidato.curriculo_pdf)}>
                    Ver Currículo
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal de Currículo */}
      {curriculoUrl && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={fecharModal}>✖</button>
            <iframe src={curriculoUrl} title="Currículo" className="curriculo-viewer"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCandidatos;