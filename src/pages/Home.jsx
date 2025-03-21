import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../services/api"; // Importando API_BASE_URL
import "../styles/Home.css";
import Button from "../components/buttonCadastro.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MaskedInput from "react-text-mask"; // Importando react-text-mask

const Home = () => {
  const [selectedJob, setSelectedJob] = useState("");
  const [aceitouPrivacidade, setAceitouPrivacidade] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controle do Modal
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
    if (!e.target.files || e.target.files.length === 0) {
        return; // Nenhum arquivo foi selecionado
    }

    const file = e.target.files[0];

    if (file) {
        if (file.size > MAX_FILE_SIZE) {
            toast.error("O arquivo deve ter no máximo 20MB!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        console.log("Arquivo selecionado:", file); // Depuração para verificar se o arquivo foi lido
        setFile(file);
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
    const newErrors = {};

// Validação de nome
if (!formData.nome) {
  newErrors.nome = true;
}

// Validação de e-mail
if (!formData.email) {
  newErrors.email = true;
} else {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    newErrors.email = true;
    toast.error("E-mail inválido! Certifique-se de que contém '@' e '.com'", {
      position: "top-right",
      autoClose: 3000,
    });
  }
}

// Validação de telefone
const numeroLimpo = formData.telefone.replace(/\D/g, '');
if (numeroLimpo.length !== 11) {
  newErrors.telefone = true;
  toast.error("Número de telefone incorreto!", {
    position: "top-right",
    autoClose: 3000,
  });
}

// Validação da vaga
if (!selectedJob) {
  newErrors.vaga = true;
}

// Validação do currículo
if (!curriculo) {
  newErrors.curriculo = true;
  toast.error("Por favor, envie seu currículo em PDF!", {
    position: "top-right",
    autoClose: 3000,
  });
}

// Validação da imagem
if (!imagem) {
  newErrors.imagem = true;
}

// Validação do checkbox de privacidade
if (!aceitouPrivacidade) {
  newErrors.privacidade = true;
}

// Se houver erros, impedir o envio e definir os estados corretamente
// Se houver erros, impedir o envio e definir os estados corretamente
if (Object.keys(newErrors).length > 0) {
  setErrors(newErrors);

  // 🔴 Primeiro, verifica erro de e-mail duplicado
  if (newErrors.email) {
      toast.error("E-mail inválido ou já cadastrado!", {
          position: "top-right",
          autoClose: 3000,
      });
  } else if (newErrors.curriculo) {
      toast.error("Por favor, envie seu currículo em PDF!", {
          position: "top-right",
          autoClose: 3000,
      });
  } else {
      toast.error("Preencha todos os campos obrigatórios!", {
          position: "top-right",
          autoClose: 3000,
      });
  }

  return;
}

    // Resetando erros antes do envio
    setErrors({});
  
    const data = new FormData();
    data.append("nome", formData.nome);
    data.append("email", formData.email);
    data.append("telefone", formData.telefone);
    data.append("vaga_id", selectedJob);
    data.append("curriculo_pdf", curriculo); // 🔴 Certifique-se de que o backend aceita essa chave
    data.append("foto", imagem);

  
    try {
      const response = await fetch(`${API_BASE_URL}/candidatos/cadastro`, {
          method: "POST",
          body: data,
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Captura o erro vindo do backend
    
        // 🔴 Verifica se o erro recebido contém "Duplicate entry" no MySQL
        if (errorData.error && errorData.error.includes("Duplicate entry")) {
            newErrors.email = true;
            setErrors(newErrors);
            toast.error("Este e-mail já foi utilizado em outra candidatura!", {
                position: "top-right",
                autoClose: 3000,
            });
            return; // Interrompe o envio imediatamente
        }
    
        // 🔴 Se for outro erro do backend, exiba a mensagem correspondente
        toast.error(errorData.message || "Este e-mail já está sendo utilizado em outra candidatura!", {
            position: "top-right",
            autoClose: 3000,
        });
    
        return;
    }
    
  
      // Se chegou até aqui, significa que o envio foi bem-sucedido
      toast.success("Cadastro enviado com sucesso!", {
          position: "top-right",
          autoClose: 3000,
      });
  
      // Resetar campos após sucesso
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
               className={`email-input cadastro-input ${errors.email ? "input-error" : ""}`}
               required
              />
              <p className="email-hint">Atenção: Apenas um e-mail por pessoa, por favor não repetir e-mail.</p>


            {/* Número de Contato */}
            <label className="cadastro-label">Contato</label>
            <MaskedInput
              mask={['(', /[1-9]/, /\d/, ')', ' ', '9', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
              value={formData.telefone}
              onChange={handleChange}
              render={(ref, props) => (
                <input
                  ref={ref}
                  {...props}
                  type="text"
                  name="telefone"
                  placeholder="Seu Número"
                  className={`cadastro-input ${errors.telefone ? "input-error" : ""}`}
                  required
                />
              )}
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
                <span
                  onClick={() => setShowModal(true)}
                  className="cadastro-privacy-link"
                  style={{ color: 'red', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  termos de privacidade
                </span>

              </label>
            </div>

            {showModal && (
              <div className="privacidade-modal-overlay">
                <div className="privacidade-modal-content">
                  <h2>Política de Privacidade</h2>

                  <div className="privacidade-modal-body">
                    <h3>Política de Privacidade</h3>
                    <p>
                      Ao enviar seu currículo, foto e informações pessoais através do nosso sistema, 
                      você concorda que os dados fornecidos serão utilizados <b>exclusivamente para fins de recrutamento e seleção</b> 
                      para as vagas anunciadas em nossa plataforma.
                    </p>

                    <h4>1. Tipos de Dados Coletados</h4>
                    <p>Durante o cadastro, coletamos as seguintes informações:</p>
                    <ul>
                      <li>Nome completo</li>
                      <li>E-mail de contato</li>
                      <li>Telefone</li>
                      <li>Cargo ou vaga desejada</li>
                      <li>Currículo (PDF)</li>
                      <li>Imagem pessoal (foto de perfil)</li>
                    </ul>

                    <h4>2. Uso dos Dados</h4>
                    <p>
                      Esses dados são utilizados <b>exclusivamente</b> para analisar a compatibilidade do(a) candidato(a) com as vagas disponíveis 
                      e possibilitar o contato para agendamentos ou comunicações relacionadas ao processo seletivo.
                    </p>

                    <h4>3. Compartilhamento dos Dados</h4>
                    <p>
                      Os dados informados <b>não serão compartilhados com terceiros</b> e <b>não serão utilizados para nenhuma finalidade que não seja o processo seletivo</b>. 
                      Somente os responsáveis pela seleção e pela gestão de Recursos Humanos terão acesso aos dados, em ambiente seguro e controlado.
                    </p>

                    <h4>4. Tempo de Armazenamento dos Dados</h4>
                    <p>
                      Os dados serão armazenados <b>temporariamente</b>, durante o período de análise e conclusão do processo seletivo. Os dados serão <b>completamente excluídos de nosso sistema em até 30 dias após o inicio do processo seletivo</b>, 
                      sem possibilidade de recuperação.
                    </p>

                    <h4>5. Segurança e Proteção</h4>
                    <p>
                      Adotamos medidas técnicas e organizacionais para proteger os dados contra acessos não autorizados, perdas, alterações ou destruições. 
                      Nosso sistema utiliza <b>conexões seguras (HTTPS)</b> e armazenamento em servidores com acesso restrito.
                    </p>

                    <h4>6. Direitos do Candidato</h4>
                    <p>
                      Você tem o direito de:
                    </p>
                    <ul>
                      <li>Solicitar informações sobre os dados armazenados.</li>
                      <li>Solicitar a exclusão antecipada dos dados a qualquer momento, antes do prazo final, através de contato direto.</li>
                    </ul>

                    <h4>7. Consentimento</h4>
                    <p>
                      Ao marcar o campo de aceite da Política de Privacidade e enviar seus dados, você <b>concorda integralmente com todos os termos</b> aqui descritos.
                    </p>

                    <h4>8. Contato</h4>
                    <p>
                      Para dúvidas ou solicitações relacionadas aos seus dados, entre em contato pelo e-mail: 
                      <b> contatojrcoffee@provedorjrnet.com.br</b>
                    </p>
                  </div>

                  <div className="privacidade-modal-footer">
                    <button
                      className="privacidade-modal-btn privacidade-modal-btn-accept"
                      onClick={() => {
                        setAceitouPrivacidade(true);
                        setShowModal(false);
                      }}
                    >
                      Concordo
                    </button>
                    <button
                      className="privacidade-modal-btn privacidade-modal-btn-decline"
                      onClick={() => setShowModal(false)}
                    >
                      Não Concordo
                    </button>
                  </div>
                </div>
              </div>
            )}



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
