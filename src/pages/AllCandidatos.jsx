import React, { useState, useEffect, useMemo } from 'react';
import api, { API_ROOT_URL } from "../services/api"; // O seu serviço de API original
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  FileText, 
  ChevronRight,
  Calendar,
  X,
  Maximize2,
  Download,
  ExternalLink,
  ArrowUpDown,
  UserCheck,
  ChevronLeft
} from 'lucide-react';

import "../styles/AllCandidatos.css"; // O seu ficheiro de estilos separado

const BASE_URL = API_ROOT_URL;

// Modal para visualização da Foto
const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div className="modal-overlay-custom" onClick={onClose}>
      <div className="image-modal-content">
        <button onClick={onClose} className="modal-close-btn">
          <X size={24} />
        </button>
        <img 
          src={imageUrl} 
          alt="Foto ampliada" 
          className="full-image-preview"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

// Modal para visualização do Currículo (PDF)
const ResumeModal = ({ candidate, onClose }) => {
  if (!candidate) return null;
  const pdfUrl = candidate.curriculo_pdf.startsWith('http') 
    ? candidate.curriculo_pdf 
    : `${BASE_URL}${candidate.curriculo_pdf}`;

  return (
    <div className="modal-overlay-custom" onClick={onClose}>
      <div className="resume-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="resume-modal-header">
          <div className="candidate-meta">
            <img 
               src={candidate.foto ? `${BASE_URL}${candidate.foto}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.nome)}&background=random`} 
               className="mini-avatar" 
               alt="" 
            />
            <div className="header-info">
              <h2>{candidate.nome}</h2>
              <span className="vaga-tag">{candidate.vaga}</span>
            </div>
          </div>
          <div className="header-actions">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="action-icon-btn">
              <ExternalLink size={20} />
            </a>
            <button onClick={onClose} className="action-icon-btn close">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="resume-viewer-body">
          <iframe src={`${pdfUrl}#toolbar=0`} title="Visualizador de Currículo" />
        </div>
        <div className="resume-modal-footer">
          <button onClick={onClose} className="secondary-btn">Fechar</button>
          <a href={pdfUrl} download className="primary-btn">
            <Download size={18} /> Baixar PDF
          </a>
        </div>
      </div>
    </div>
  );
};

const CandidateCard = ({ candidato, onPhotoClick, onResumeClick }) => {
  const fotoUrl = candidato.foto 
    ? `${BASE_URL}${candidato.foto}` 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(candidato.nome)}&background=random`;

  return (
    <div className="candidate-card-new">
      <div className="card-body">
        <div className="avatar-section">
          <div className="avatar-wrapper" onClick={() => onPhotoClick(fotoUrl)}>
            <img src={fotoUrl} alt={candidato.nome} className="candidate-avatar-img" />
            <div className="avatar-overlay">
              <Maximize2 size={24} color="white" />
            </div>
          </div>
          <div className="candidate-title">
            <h3>{candidato.nome}</h3>
            <span className="role-badge">{candidato.vaga}</span>
          </div>
        </div>
        
        <div className="contact-info-list">
          <div className="contact-item">
            <div className="icon-box"><Mail size={16} /></div>
            <span>{candidato.email}</span>
          </div>
          <div className="contact-item">
            <div className="icon-box"><Phone size={16} /></div>
            <span>{candidato.telefone}</span>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="submission-info">
          <span className="id-label">ID #{candidato.id}</span>
          <div className="date-box">
            <Calendar size={12} />
            {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>
        <button className="view-resume-btn" onClick={() => onResumeClick(candidato)}>
          Currículo <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const AllCandidatos = () => {
  const [candidatosOriginais, setCandidatosOriginais] = useState([]);
  const [candidatosExibidos, setCandidatosExibidos] = useState([]);
  const [buscaNome, setBuscaNome] = useState("");
  const [ordem, setOrdem] = useState("");
  const [vagas, setVagas] = useState([]);
  const [filtroVaga, setFiltroVaga] = useState("");
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
        const response = await api.get("/vagas/vagas");
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
    if (buscaNome.trim() !== "") {
      resultado = resultado.filter((c) => c.nome.toLowerCase().includes(buscaNome.toLowerCase()));
    }
    if (filtroVaga) {
      resultado = resultado.filter((c) => c.vaga_id.toString() === filtroVaga);
    }
    
    if (ordem === "asc") resultado.sort((a, b) => a.id - b.id);
    else if (ordem === "desc") resultado.sort((a, b) => b.id - a.id);
    else if (ordem === "az") resultado.sort((a, b) => a.nome.localeCompare(b.nome));
    else if (ordem === "za") resultado.sort((a, b) => b.nome.localeCompare(a.nome));
    
    setCandidatosExibidos(resultado);
    setCurrentPage(1);
  }, [buscaNome, filtroVaga, ordem, candidatosOriginais]);

  const vagasComCandidatos = vagas.filter(v => candidatosOriginais.some(c => c.vaga_id === v.id));

  // Paginação com ellipsis inteligente
  const totalPages = Math.ceil(candidatosExibidos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = candidatosExibidos.slice(indexOfFirstItem, indexOfLastItem);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage <= 3) {
        pages.push(2, 3, 4, 5, 'ellipsis-end', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push('ellipsis-start');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push('ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="rh-portal-wrapper">
      <header className="main-header">
        <div className="header-container">
          <div className="branding">
            <div className="logo-icon"><UserCheck size={24} strokeWidth={2.5} /></div>
            <div className="title-area">
              <h1>Painel de Candidatos</h1>
              <p>JR COFFEE • RECRUTAMENTO</p>
            </div>
          </div>
          <div className="header-stats">
            <span className="stats-label">TOTAL FILTRADO</span>
            <span className="stats-value">{candidatosExibidos.length}</span>
          </div>
        </div>
      </header>

      <main className="content-area">
        <div className="search-bar-container">
          <div className="search-input-group">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome..."
              value={buscaNome}
              onChange={(e) => setBuscaNome(e.target.value)}
            />
          </div>
          <div className="divider-v" />
          <div className="filters-group">
            <div className="filter-select-wrapper">
              <Filter size={18} />
              <select value={filtroVaga} onChange={(e) => setFiltroVaga(e.target.value)}>
                <option value="">Todas as Vagas</option>
                {vagasComCandidatos.map((v) => <option key={v.id} value={v.id}>{v.titulo}</option>)}
              </select>
            </div>
            <div className="filter-select-wrapper">
              <ArrowUpDown size={18} />
              <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
                <option value="">Ordenar</option>
                <option value="desc">Mais recentes</option>
                <option value="asc">Mais antigos</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {candidatosExibidos.length > 0 ? (
          <>
            <div className="candidates-grid">
              {currentItems.map(c => (
                <CandidateCard 
                  key={c.id} 
                  candidato={c} 
                  onPhotoClick={setSelectedImage}
                  onResumeClick={setSelectedCandidate}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-footer">
                <div className="pagination-info">
                  Exibindo <strong>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, candidatosExibidos.length)}</strong> de {candidatosExibidos.length}
                </div>
                <div className="pagination-controls">
                  <button 
                    className="page-btn" 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16}/> Anterior
                  </button>
                  <div className="page-numbers">
                    {getPageNumbers().map((page, index) => (
                      typeof page === 'string' ? (
                        <span key={index} className="page-ellipsis">•</span>
                      ) : (
                        <button 
                          key={index} 
                          className={`page-number ${currentPage === page ? 'active' : ''}`} 
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>
                  <button 
                    className="page-btn" 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                  >
                    Próximo <ChevronRight size={16}/>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><Search size={40} /></div>
            <h3>Nenhum resultado</h3>
            <p>Ajuste os filtros para ver mais candidatos.</p>
          </div>
        )}
      </main>

      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
      <ResumeModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
    </div>
  );
};

export default AllCandidatos;