import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../services/api"; 
import "../styles/Home.css";
import Button from "../components/buttonCadastro.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MaskedInput from "react-text-mask";

// --- CONFIGURAÇÃO DA EMPRESA ---
// 1 = JR Produtora, 2 = JR Net, 3 = JR Coffee
const COMPANY_ID = 3; 

const Home = () => {
  const [selectedJob, setSelectedJob] = useState("");
  const [aceitouPrivacidade, setAceitouPrivacidade] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [vagas, setVagas] = useState([]); 
  const [curriculo, setCurriculo] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [errors, setErrors] = useState({});
  const [showEmailExistsModal, setShowEmailExistsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [duplicateTitle, setDuplicateTitle] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: ""
  });

  // --- CARREGAR VAGAS (Lógica Nova) ---
  useEffect(() => {
    const fetchVagas = async () => {
      try {
        // Chama a rota pública filtrando pelo ID da JR Coffee
        const response = await api.get(`/public/vacancies?companyId=${COMPANY_ID}`);
        setVagas(response.data);
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
        toast.error("Erro ao carregar vagas disponíveis.");
      }
    };
    fetchVagas();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  const handleFileChange = (e, setFile) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file) {
        if (file.size > MAX_FILE_SIZE) {
            toast.error("O arquivo deve ter no máximo 20MB!");
            return;
        }
        setFile(file);
    }
  };

  const handleDrop = (e, setFile) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("O arquivo deve ter no máximo 20MB!");
        return;
      }
      setFile(file);
    }
  };

  // --- ENVIO DO FORMULÁRIO (Lógica Nova) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validações
    if (!formData.nome) newErrors.nome = true;
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true;
    const numeroLimpo = formData.telefone.replace(/\D/g, '');
    if (numeroLimpo.length < 10) newErrors.telefone = true; // Aceita 10 ou 11
    if (!selectedJob) newErrors.vaga = true;
    if (!curriculo) newErrors.curriculo = true;
    if (!aceitouPrivacidade) newErrors.privacidade = true;
    // Foto é opcional no banco (photo_path nullable), mas se quiser obrigar:
    // if (!imagem) newErrors.imagem = true; 

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Verifique os campos obrigatórios marcados em vermelho.");
      return;
    }

    setErrors({});

    const data = new FormData();
    data.append("nome", formData.nome);
    data.append("email", formData.email);
    data.append("telefone", formData.telefone);
    data.append("vaga_id", selectedJob); // ID da vaga selecionada
    data.append("curriculo_pdf", curriculo);
    if (imagem) data.append("foto", imagem);

    try {
      // Chama a nova rota pública de cadastro
      const response = await fetch(`${API_BASE_URL}/public/apply`, {
          method: "POST",
          body: data, // Não precisa de Headers Content-Type com FormData, o navegador define
      });

      const result = await response.json();

      if (!response.ok) {
        // Tratamento de erros (Duplicidade)
        if (response.status === 409) {
            setDuplicateTitle("Cadastro Existente");
            setDuplicateMessage(result.message || "Seus dados já constam em nosso banco.");
            setShowEmailExistsModal(true);
        } else {
            toast.error(result.message || "Erro ao enviar currículo.");
        }
        return;
      }

      // Sucesso
      setShowSuccessModal(true);
      setFormData({ nome: "", email: "", telefone: "" });
      setSelectedJob("");
      setCurriculo(null);
      setImagem(null);
      setAceitouPrivacidade(false);

    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="cadastro-container">
      <ToastContainer />
      
      {/* --- MODAIS (Igual ao original) --- */}
      {showEmailExistsModal && (
        <div className="email-exists-modal-overlay" onClick={() => setShowEmailExistsModal(false)}>
          <div className="email-exists-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{duplicateTitle}</h2>
            <p>{duplicateMessage}</p>
            <button className="email-exists-modal-button" onClick={() => setShowEmailExistsModal(false)}>Entendi</button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="cadastro-success-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="cadastro-success-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Inscrição concluída</h2>
            <p>Recebemos sua candidatura com sucesso. Boa sorte!</p>
            <button className="cadastro-success-modal-button" onClick={() => setShowSuccessModal(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="cadastro-card">
        <div className="cadastro-left">
          <video src="/video/cafe.mp4" autoPlay muted loop playsInline />
        </div>

        <div className="cadastro-right">
          <h1>Trabalhe <b>Conosco</b></h1>
          
          <form className="cadastro-form" onSubmit={handleSubmit}>
            
            {/* Campos de Texto (Nome, Email, Tel) Mantidos Iguais */}
            <label className="cadastro-label">Nome</label>
            <input 
                type="text" name="nome" value={formData.nome} onChange={handleChange} 
                className={`cadastro-input ${errors.nome ? "input-error" : ""}`} placeholder="Seu Nome" required 
            />

            <label className="cadastro-label">E-Mail</label>
            <input 
                type="email" name="email" value={formData.email} onChange={handleChange} 
                className={`cadastro-input ${errors.email ? "input-error" : ""}`} placeholder="Seu E-Mail" required 
            />
            
            <label className="cadastro-label">Contato</label>
            <MaskedInput
              mask={['(', /[1-9]/, /\d/, ')', ' ', '9', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
              value={formData.telefone} onChange={handleChange}
              render={(ref, props) => (
                <input ref={ref} {...props} type="text" name="telefone" className={`cadastro-input ${errors.telefone ? "input-error" : ""}`} placeholder="(00) 9 0000-0000" required />
              )}
            />

            {/* --- LISTAGEM DE VAGAS DINÂMICA --- */}
            <div className={`cadastro-vaga-content ${errors.vaga ? "input-error" : ""}`}>
              <p className="cadastro-vaga-title">Vaga desejada (apenas uma)</p>
              <div className="cadastro-vaga-options">
                {vagas.length > 0 ? (
                  vagas.map((vaga) => (
                    <label key={vaga.id} className="cadastro-vaga-label">
                      <input
                        type="radio"
                        name="vaga"
                        value={vaga.id}
                        checked={parseInt(selectedJob) === vaga.id}
                        onChange={() => setSelectedJob(vaga.id)}
                        className="cyberpunk-checkbox"
                        required
                      />
                      {vaga.title} {/* Atenção: Backend retorna 'title', não 'titulo' */}
                    </label>
                  ))
                ) : (
                  <p style={{color: '#fff', fontStyle: 'italic'}}>Nenhuma vaga aberta no momento.</p>
                )}
              </div>
            </div>

            {/* --- UPLOADS (Mantidos Iguais) --- */}
            <div className="cadastro-upload-section">
               {/* Currículo */}
               <div className="cadastro-upload-box" onClick={() => document.getElementById("curriculo-input").click()}>
                <h6>Envie seu Currículo</h6>
                <p className="cadastro-upload-subtitle">Aceitamos apenas PDF</p>
                <div className="cadastro-upload-area">{curriculo ? curriculo.name : "Clique para selecionar"}</div>
                <input id="curriculo-input" type="file" accept=".pdf" style={{display:'none'}} onChange={(e) => handleFileChange(e, setCurriculo)} />
               </div>

               {/* Foto */}
               <div className="cadastro-upload-box" onClick={() => document.getElementById("imagem-input").click()}>
                <h6>Envie sua Foto</h6>
                <p className="cadastro-upload-subtitle">jpg, png, webp</p>
                <div className="cadastro-upload-area">{imagem ? imagem.name : "Clique para selecionar"}</div>
                <input id="imagem-input" type="file" accept="image/*" style={{display:'none'}} onChange={(e) => handleFileChange(e, setImagem)} />
               </div>
            </div>

            {/* Checkbox Privacidade e Botão (Mantidos) */}
            <div className={`cadastro-privacy-checkbox ${errors.privacidade ? "input-error" : ""}`}>
                <input type="checkbox" id="cadastro-privacy" className="cyberpunk-checkbox" checked={aceitouPrivacidade} onChange={() => setAceitouPrivacidade(!aceitouPrivacidade)} required />
                <label htmlFor="cadastro-privacy">Declaro que li e aceito os <span onClick={() => setShowModal(true)} style={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }}>termos de privacidade</span></label>
            </div>

            <div className="cadastro-button">
              <Button type="submit" className="cadastro-submit-button">Enviar Inscrição</Button>
            </div>

          </form>
        </div>
      </div>
      
      {/* Modal de Privacidade (código mantido igual ao original) */}
      {showModal && (
        <div className="privacidade-modal-overlay">
            {/* ... Conteúdo do modal de privacidade ... */}
             <div className="privacidade-modal-content">
                  <h2>Política de Privacidade</h2>
                  {/* ... Texto da política ... */}
                  <div className="privacidade-modal-footer">
                    <button className="privacidade-modal-btn privacidade-modal-btn-accept" onClick={() => { setAceitouPrivacidade(true); setShowModal(false); }}>Concordo</button>
                    <button className="privacidade-modal-btn privacidade-modal-btn-decline" onClick={() => setShowModal(false)}>Não Concordo</button>
                  </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default Home;