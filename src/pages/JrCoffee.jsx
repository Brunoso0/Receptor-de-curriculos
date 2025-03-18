import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../services/api";
import "../styles/AllCandidatos.css";

const JrCoffee = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [filtroVaga, setFiltroVaga] = useState("");
  const [curriculoUrl, setCurriculoUrl] = useState(null);
  const [ordenarPor, setOrdenarPor] = useState("");


  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login"; // Redireciona se não estiver logado
          return;
        }
    
        const response = await api.get("/candidatos/listar/empresa/2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCandidatos(response.data);
      } catch (error) {
        console.error("Erro ao buscar candidatos da JrCoffee:", error);
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

  const abrirModalCurriculo = (curriculo) => {
    setCurriculoUrl(`https://api.jrcoffee.com.br:5000${curriculo}`);
  };

  const fecharModal = () => {
    setCurriculoUrl(null);
  };

  return (
    <div className="candidatos-container">
      <div className="candidatos-filter">
        <h2>Candidatos - JrCoffee</h2>

        <select
            className="filtro-select"
            value={filtroVaga}
            onChange={(e) => setFiltroVaga(e.target.value)}
        >
            <option value="">Todos</option>
            {vagas.map((vaga) => (
            <option key={vaga.id} value={vaga.id}>
                {vaga.titulo}
            </option>
            ))}
        </select>

        <label className="filter-order">Ordenar por:</label>
          <select
            className="filtro-select order-select"
            value={ordenarPor}
            onChange={(e) => {
              const value = e.target.value;
              setOrdenarPor(value); // Atualiza o estado
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
            <option value="desc">Últimos a enviar</option>
            <option value="az">Nomes A a Z</option>
            <option value="za">Nomes Z a A</option>
          </select>

      </div>

      <div className="candidatos-grid">
          {candidatos
      .filter((candidato) =>
        filtroVaga ? candidato.vaga_id.toString() === filtroVaga : true
      )
      .map((candidato) => (
          <div key={candidato.id} className="candidato-card">
            <div className="candidato-info">
              <img
                src={candidato.foto ? `https://api.jrcoffee.com.br:5000${candidato.foto}` : "/img/default-profile.png"}
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

export default JrCoffee;
