import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/admin.css';

export default function AdminRegistro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nome || !email || !senha || !confirmSenha) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmSenha) {
      toast.error('As senhas não coincidem!');
      return;
    }

    setLoading(true);
    try {
      const baseEnv = (process.env.REACT_APP_URL_NAMORADOS || '').trim();
      const base = baseEnv ? baseEnv.replace(/\/+$/, '') : '';
      const endpoint = base ? `${base}/v1/admin/register` : `/namorados/v1/admin/register`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const contentType = res.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const txt = await res.text();
        console.error('Non-JSON response from', endpoint, txt);
        toast.error('Resposta inesperada do servidor. Verifique o endpoint.');
        setLoading(false);
        return;
      }

      if (res.ok && (data.sucesso || data.token)) {
        toast.success('Conta administrativa criada com sucesso!');
        if (data.token) {
          localStorage.setItem('adm_token', data.token);
        }
        setTimeout(() => {
          navigate('/namorados/login');
        }, 1500);
      } else {
        toast.error(data.mensagem || 'Falha ao registrar conta administrativa.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 99999 }} />
      
      <form className="admin-card" onSubmit={handleRegister}>
        {/* Header */}
        <div className="admin-card-header">
          <div className="admin-logo-wrapper">
            <span className="logo-brand">JrCoffee</span>
            <span className="logo-suffix">Admin</span>
          </div>
          <p className="admin-subtitle">Solicite e crie seu acesso administrativo.</p>
        </div>

        {/* Nome Input */}
        <div className="admin-input-group">
          <label className="admin-label">Nome Completo</label>
          <div className="admin-input-wrapper">
            <span className="admin-input-icon-left">
              <User size={18} />
            </span>
            <input
              type="text"
              className="admin-field"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="admin-input-group">
          <label className="admin-label">Email Corporativo</label>
          <div className="admin-input-wrapper">
            <span className="admin-input-icon-left">
              <Mail size={18} />
            </span>
            <input
              type="email"
              className="admin-field"
              placeholder="nome@jrcoffee.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="admin-input-group">
          <label className="admin-label">Senha de Acesso</label>
          <div className="admin-input-wrapper">
            <span className="admin-input-icon-left">
              <Lock size={18} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              className="admin-field"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="admin-input-icon-right"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="admin-input-group">
          <label className="admin-label">Confirmar Senha</label>
          <div className="admin-input-wrapper">
            <span className="admin-input-icon-left">
              <Lock size={18} />
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="admin-field"
              placeholder="••••••••"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="admin-input-icon-right"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex="-1"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button type="submit" className="admin-submit-btn" style={{ marginTop: '10px' }} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Criar Conta'}
          {!loading && <ArrowRight size={16} />}
        </button>

        {/* Footer Link to login */}
        <div className="admin-card-footer">
          <p className="admin-footer-text">
            Já tem uma conta?
            <Link to="/namorados/login" className="admin-footer-link">
              Acesse o painel
            </Link>
          </p>
        </div>
      </form>

      {/* Page Footer */}
      <div className="admin-page-footer">
        <div className="admin-footer-item">
          <ShieldCheck size={14} />
          <span>Seguro</span>
        </div>
        <div className="admin-footer-item">
          <Globe size={14} />
          <span>Gestão Global</span>
        </div>
      </div>
    </div>
  );
}
