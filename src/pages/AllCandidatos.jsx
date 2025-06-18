import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/AllCandidatos.css";

const AllCandidatos = () => {
  const [candidatosOriginais, setCandidatosOriginais] = useState([]);
  const [candidatosExibidos, setCandidatosExibidos] = useState([]);
  const [buscaNome, setBuscaNome] = useState("");
  const [ordem, setOrdem] = useState("");
  const [vagas, setVagas] = useState([]);
  const [filtroVaga, setFiltroVaga] = useState("");
  const [curriculoUrl, setCurriculoUrl] = useState(null);

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return window.location.href = "/login";

        const response = await api.get("/candidatos/listar", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCandidatosOriginais(response.data);
        setCandidatosExibidos(response.data);
      } catch (error) {
        if (error.response?.status === 401) window.location.href = "/login";
        console.error("Erro ao buscar candidatos:", error);
      }
    };

    const fetchVagas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return window.location.href = "/login";

        const response = await api.get("/vagas/vagas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVagas(response.data);
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      }
    };

    fetchCandidatos();
    fetchVagas();
  }, []);

  useEffect(() => {
    let resultado = [...candidatosOriginais];

    // Filtro por nome
    if (buscaNome.trim() !== "") {
      resultado = resultado.filter((candidato) =>
        candidato.nome.toLowerCase().includes(buscaNome.toLowerCase())
      );
    }

    // Filtro por vaga
    if (filtroVaga) {
      resultado = resultado.filter((candidato) => candidato.vaga_id.toString() === filtroVaga);
    }

    // Ordenação
    if (ordem === "asc") {
      resultado.sort((a, b) => a.id - b.id);
    } else if (ordem === "desc") {
      resultado.sort((a, b) => b.id - a.id);
    } else if (ordem === "az") {
      resultado.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordem === "za") {
      resultado.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    setCandidatosExibidos(resultado);
  }, [buscaNome, filtroVaga, ordem, candidatosOriginais]);

  const abrirModalCurriculo = (curriculo) => {
    setCurriculoUrl(`https://api.jrcoffee.com.br:5002${curriculo}`);
  };

  const fecharModal = () => setCurriculoUrl(null);

  const vagasComCandidatos = vagas.filter(v =>
    candidatosOriginais.some(c => c.vaga_id === v.id)
  );

  return (
    <div className="candidatos-container">
       <div className="candidatos-filter">
        <h2>Todos Candidatos</h2>

        <div className="filtro-row">
          <div>
            <label className="filter-order">Filtrar por Vagas:</label>
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
          </div>

          <div>
            <label className="filter-order">Ordenar por:</label>
            <select
              className="filtro-select"
              value={ordem}
              onChange={(e) => setOrdem(e.target.value)}
            >
              <option value="">Ordenar por</option>
              <option value="asc">Primeiros a enviar</option>
              <option value="desc">Últimos a enviar</option>
              <option value="az">Nomes A a Z</option>
              <option value="za">Nomes Z a A</option>
            </select>
          </div>

          <div className="candidatos-search">
            <label className="filter-order">Buscar:</label>
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={buscaNome}
              onChange={(e) => setBuscaNome(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* force update */}

      <div className="candidatos-grid">
        {candidatosExibidos.map((candidato) => (
          <div key={candidato.id} className="candidato-card">
            <div className="candidato-info">
              <img
                src={candidato.foto ? `https://api.jrcoffee.com.br:5002${candidato.foto}` : "/img/default-profile.png"}
                alt={candidato.nome}
                className="candidato-foto"
              />
              <div className="candidato-detalhes">
                <strong>{candidato.nome}</strong>
                <p>Vaga: {candidato.vaga}</p>
                <small>Email: {candidato.email}</small><br />
                <small>Telefone: {candidato.telefone}</small>
                <button
                  className="ver-curriculo-btn"
                  onClick={() => abrirModalCurriculo(candidato.curriculo_pdf)}
                >
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
            <iframe src={curriculoUrl} title="Currículo" className="curriculo-viewer" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCandidatos;
