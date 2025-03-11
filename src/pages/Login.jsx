import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importando o hook de navegação
import "../styles/Login.css";
import ButtonLogin from "../components/buttonLogin.jsx";
import ButtonRegister from "../components/buttonRegister.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate(); // Hook para navegação
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [registerData, setRegisterData] = useState({ nome: "", email: "", senha: "" });

  const handleChangeLogin = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleChangeRegister = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, isRegister) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await api.post("/auth/register", registerData);
        toast.success("Cadastro realizado! Faça login.", { autoClose: 3000 });
        setIsRegistering(false);
        setRegisterData({ nome: "", email: "", senha: "" });
      } else {
        const response = await api.post("/auth/login", loginData);
        toast.success("Login realizado com sucesso!", { autoClose: 3000 });

        // Aguarda um curto tempo antes de redirecionar
        setTimeout(() => {
          navigate("/candidatos"); // Redireciona para a tela de candidatos
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao processar a requisição.", { autoClose: 3000 });
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="auth-card">
        {/* Lado Esquerdo - Imagem */}
        <div className="auth-left">
          <img src="/img/xicara.png" alt="Xícara de café" />
        </div>

        {/* Lado Direito - Formulário */}
        <div className="auth-right">
          <h1>{isRegistering ? "Criar Conta" : "Acessar Conta"}</h1>

          {/* Formulário de Login */}
          {!isRegistering && (
            <form className="auth-form" onSubmit={(e) => handleSubmit(e, false)}>
              <label className="auth-label">E-Mail</label>
              <input
                type="email"
                name="email"
                placeholder="Seu E-Mail"
                value={loginData.email}
                onChange={handleChangeLogin}
                className="auth-input"
                required
              />

              <label className="auth-label">Senha</label>
              <input
                type="password"
                name="senha"
                placeholder="Sua Senha"
                value={loginData.senha}
                onChange={handleChangeLogin}
                className="auth-input"
                required
              />

              <div className="auth-button">
                <ButtonLogin type="submit" className="auth-submit-button">
                  Entrar
                </ButtonLogin>
              </div>
              <p className="auth-toggle-text" onClick={() => setIsRegistering(true)}>
                Não tem uma conta? <span>Registre-se</span>
              </p>
            </form>
          )}

          {/* Formulário de Registro */}
          {isRegistering && (
            <form className="auth-form" onSubmit={(e) => handleSubmit(e, true)}>
              <label className="auth-label">Nome Completo</label>
              <input
                type="text"
                name="nome"
                placeholder="Seu Nome"
                value={registerData.nome}
                onChange={handleChangeRegister}
                className="auth-input"
                required
              />

              <label className="auth-label">E-Mail</label>
              <input
                type="email"
                name="email"
                placeholder="Seu E-Mail"
                value={registerData.email}
                onChange={handleChangeRegister}
                className="auth-input"
                required
              />

              <label className="auth-label">Senha</label>
              <input
                type="password"
                name="senha"
                placeholder="Sua Senha"
                value={registerData.senha}
                onChange={handleChangeRegister}
                className="auth-input"
                required
              />

              <div className="auth-button">
                <ButtonRegister type="submit" className="auth-submit-button">
                  Registrar
                </ButtonRegister>
              </div>
              <p className="auth-toggle-text" onClick={() => setIsRegistering(false)}>
                Já tem uma conta? <span>Faça login</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
