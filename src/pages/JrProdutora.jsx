import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../services/api";
import "../styles/AllCandidatos.css";

const JrNet = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [filtroVaga, setFiltroVaga] = useState("");
  const [curriculoUrl, setCurriculoUrl] = useState(null);

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const response = await api.get("/candidatos/listar/empresa/3"); // JrNet
        setCandidatos(response.data);
      } catch (error) {
        console.error("Erro ao buscar candidatos da JrProdutora:", error);
      }
    };

    const fetchVagas = async () => {
      try {
        const response = await api.get("/vagas/vagas");
        setVagas(response.data);
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      }
    };

    fetchCandidatos();
    fetchVagas();
  }, []);

  const abrirModalCurriculo = (curriculo) => {
    setCurriculoUrl(`${API_BASE_URL}${curriculo}`);
  };

  const fecharModal = () => {
    setCurriculoUrl(null);
  };

  return (
    <div className="candidatos-container">
      <div className="candidatos-filter">
        <h2>Candidatos - JrNet</h2>

        <select
            className="filtro-select"
            value={filtroVaga}
            onChange={(e) => setFiltroVaga(e.target.value)}
        >
            <option value="">Filtrar por Vaga</option>
            {vagas.map((vaga) => (
            <option key={vaga.id} value={vaga.id}>
                {vaga.titulo}
            </option>
            ))}
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

export default JrNet;
