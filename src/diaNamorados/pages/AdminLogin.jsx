import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/admin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const baseEnv = (process.env.REACT_APP_URL_NAMORADOS || '').trim();
      const base = baseEnv ? baseEnv.replace(/\/+$/, '') : '';
      const endpoint = base ? `${base}/v1/admin/login` : `/api/v1/admin/login`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
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

      if (res.ok && data.sucesso && data.token) {
        localStorage.setItem('adm_token', data.token);
        toast.success('Login efetuado com sucesso!');
        setTimeout(() => {
          navigate('/namorados/admin');
        }, 1200);
      } else {
        toast.error(data.mensagem || 'Falha ao autenticar. Verifique suas credenciais.');
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
      
      <form className="admin-card" onSubmit={handleLogin}>
        {/* Header */}
        <div className="admin-card-header">
          <div className="admin-logo-wrapper">
            <span className="logo-brand">JrCoffee</span>
            <span className="logo-suffix">Admin</span>
          </div>
          <p className="admin-subtitle">Bem-vindo ao centro de hospitalidade.</p>
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

        {/* Remember me & Forgot Password */}
        <div className="admin-actions-row">
          <label className="admin-remember">
            <input
              type="checkbox"
              className="admin-remember-checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
            />
            <span>Lembrar acesso</span>
          </label>
          <a
            href="#forgot"
            className="admin-forgot-link"
            onClick={(e) => {
              e.preventDefault();
              toast.info('Entre em contato com o suporte para redefinir sua senha.');
            }}
          >
            Esqueceu a senha?
          </a>
        </div>

        {/* Submit button */}
        <button type="submit" className="admin-submit-btn" disabled={loading}>
          {loading ? 'Acessando...' : 'Acessar Painel'}
          {!loading && <ArrowRight size={16} />}
        </button>

        {/* Footer Link to register */}
        <div className="admin-card-footer">
          <p className="admin-footer-text">
            Não tem uma conta?
            <Link to="/namorados/registro" className="admin-footer-link">
              Solicite acesso
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
