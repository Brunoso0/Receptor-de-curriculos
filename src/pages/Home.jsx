import React, { useState, useEffect } from "react";
import api from "../services/api"; // Importando a API
import "../styles/Home.css";
import Button from "../components/buttonCadastro.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Home = () => {
  const [selectedJob, setSelectedJob] = useState("");
  const [aceitouPrivacidade, setAceitouPrivacidade] = useState(false);

  const [vagas, setVagas] = useState([]); // Estado para armazenar as vagas 
  const [curriculo, setCurriculo] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const response = await api.get("/vagas/vagas"); // Busca as vagas no backend
        setVagas(response.data); // Atualiza o estado com as vagas vindas do backend
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      }
    };
  
    fetchVagas();
  }, []);
  
  

  // Atualiza o estado ao digitar nos campos
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: ""
});


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Atualiza os arquivos selecionados
  
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB em bytes

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
  
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("O arquivo deve ter no máximo 20MB!", {
          position: "top-right",
          autoClose: 3000,
        });
        return; // Impede que o arquivo inválido seja armazenado no estado
      }
  
      setFile(file); // Atualiza o estado apenas se o arquivo for válido
    }
  };
  

  // Manipula o arrastar e soltar arquivos
  const handleDrop = (e, setFile) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
  
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("O arquivo deve ter no máximo 20MB!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
  
      setFile(file);
    }
  };
  

  // Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Criar um objeto para armazenar os erros
    let newErrors = {};
  
    if (!formData.nome) newErrors.nome = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.telefone) newErrors.telefone = true;
    if (!selectedJob) newErrors.vaga = true;
    if (!curriculo) newErrors.curriculo = true;
    if (!imagem) newErrors.imagem = true;
    if (!aceitouPrivacidade) newErrors.privacidade = true;
  
    // Se houver erros, impedir o envio
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Preencha todos os campos obrigatórios!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    // Resetando erros antes do envio
    setErrors({});
  
    const data = new FormData();
    data.append("nome", formData.nome);
    data.append("email", formData.email);
    data.append("telefone", formData.telefone);
    data.append("vaga_id", selectedJob);
    data.append("curriculo_pdf", curriculo);
    data.append("foto", imagem);
  
    try {
      const response = await fetch("http://168.90.147.242:5000/candidatos/cadastro", {
        method: "POST",
        body: data,
      });
  
      if (!response.ok) {
        throw new Error("Erro ao enviar formulário");
      }
  
      toast.success("Cadastro enviado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });
  
      // Resetando o formulário após envio bem-sucedido
      setFormData({ nome: "", email: "", telefone: "" });
      setSelectedJob("");
      setCurriculo(null);
      setImagem(null);
      setAceitouPrivacidade(false);
    } catch (error) {
      toast.error(`Erro ao enviar os dados: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  



  return (
    <div className="cadastro-container">
      <ToastContainer />
      <div className="cadastro-card">
        {/* Lado Esquerdo - Imagem */}
        <div className="cadastro-left">
          <img src="/img/xicara.png" alt="Xícara de café" />
        </div>

        {/* Lado Direito - Formulário */}
        <div className="cadastro-right">
          <h1>
            Trabalhe <b>Conosco</b>
          </h1>
          <form className="cadastro-form" onSubmit={handleSubmit}>
            {/* Nome */}
            <label className="cadastro-label">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu Nome"
              className={`cadastro-input ${errors.nome ? "input-error" : ""}`}
              required
            />


            {/* E-mail */}
            <label className="cadastro-label">E-Mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Seu E-Mail"
              className={`cadastro-input ${errors.email ? "input-error" : ""}`}
              required
            />

            {/* Número de Contato */}
            <label className="cadastro-label">Número para Contato</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="Seu Número"
              className={`cadastro-input ${errors.telefone ? "input-error" : ""}`}
              required
            />

            {/* Seleção de Vagas */}
            <div className={`cadastro-vaga-content ${errors.vaga ? "input-error" : ""}`}>
              <p className="cadastro-vaga-title">Vaga desejada (apenas uma)</p>
              <div className="cadastro-vaga-options">
              {vagas.length > 0 ? (
                vagas.map((vaga) => (
                  <label key={vaga.id} className="cadastro-vaga-label">
                    <input
                      type="radio"
                      name="vaga"
                      value={vaga.id} // Envia o ID da vaga
                      checked={selectedJob === vaga.id}
                      onChange={() => setSelectedJob(vaga.id)}
                      className="cyberpunk-checkbox"
                      required
                    />
                    {vaga.titulo}
                  </label>
                ))
              ) : (
                <p>Carregando vagas...</p>
              )}

              </div>
            </div>

            {/* Upload de Arquivos */}
            <div className="cadastro-upload-section">
              {/* Upload do Currículo */}
              <div
                className="cadastro-upload-box"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, setCurriculo)}
                onClick={() => document.getElementById("curriculo-input").click()}
              >
                <h6>Envie seu Currículo</h6>
                <p className="cadastro-upload-subtitle">Aceitamos apenas PDF</p>
                <div className="cadastro-upload-area">
                  {curriculo ? curriculo.name : "Arraste o arquivo ou clique Aqui"}
                </div>
                <input
                  id="curriculo-input"
                  type="file"
                  name="curriculo"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, setCurriculo)}
                  required
                />
              </div>

              {/* Upload da Imagem */}
              <div
                className="cadastro-upload-box"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, setImagem)}
                onClick={() => document.getElementById("imagem-input").click()}
              >
                <h6>Envie sua Foto</h6>
                <p className="cadastro-upload-subtitle">jpg, webp, png, jpeg</p>
                <div className="cadastro-upload-area">
                  {imagem ? imagem.name : "Arraste o arquivo ou clique Aqui"}
                </div>
                <input
                  id="imagem-input"
                  type="file"
                  name="imagem"
                  accept="image/jpeg, image/png, image/webp"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, setImagem)}
                  required
                />
              </div>
            </div>

            {/* Checkbox de Privacidade */}
            <div className={`cadastro-privacy-checkbox ${errors.privacidade ? "input-error" : ""}`}>
            <input
              type="checkbox"
              id="cadastro-privacy"
              className="cyberpunk-checkbox"
              checked={aceitouPrivacidade}
              onChange={() => setAceitouPrivacidade(!aceitouPrivacidade)}
              required
            />

              <label htmlFor="cadastro-privacy">
                Declaro que li e aceito os{" "}
                <a href="/termos-de-privacidade" className="cadastro-privacy-link">termos de privacidade</a>
              </label>
            </div>

            {/* Botão de Envio */}
            <div className="cadastro-button">
              <Button type="submit" className="cadastro-submit-button">
                Enviar
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Rodapé */}
      <div className="cadastro-footer">
        <p>Estaremos aceitando currículos <b>até o dia ***</b></p>
      </div>
    </div>
  );
};

export default Home;
