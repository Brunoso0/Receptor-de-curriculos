import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuthErrorMessage, loginWithRh, normalizeCardapioSession } from "../services/auth";
import { getCardapioRouteByRole, getCardapioSession, setCardapioSession } from "../services/session";
import "../styles/CardapioLogin.css";

function CardapioLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const session = getCardapioSession();
    if (session?.role === "admin") {
      navigate(getCardapioRouteByRole(session.role), { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = await loginWithRh({ email, senha });
      const session = normalizeCardapioSession(payload, "admin", email);

      setCardapioSession(session);
      toast.success("Logado com sucesso!");
      navigate(getCardapioRouteByRole(session.role), { replace: true });
    } catch (requestError) {
      const errorMessage = getAuthErrorMessage(requestError);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="cardapio-login-page">
      <div className="cardapio-login-visual-panel">
        <div className="cardapio-login-visual-frame">
          <img src="/img/bebidaslogin.png" alt="Bebida gelada do JR Coffee" />
        </div>
      </div>

      <div className="cardapio-login-form-stage">
        <div className="cardapio-login-card">
          <div className="cardapio-login-brand">
            <img src="/img/logologin.png" alt="JR Coffee" className="cardapio-login-logo" />
          </div>

          <form className="cardapio-login-form" onSubmit={handleSubmit}>
            <label className="cardapio-login-field">
              <span className="cardapio-login-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-7 1.67-7 4v1h14v-1c0-2.33-3.67-4-7-4Z" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Login"
                required
              />
            </label>

            <label className="cardapio-login-field">
              <span className="cardapio-login-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-6 8.73V18h2v-1.27a2 2 0 1 0-2 0ZM10 8V6a2 2 0 0 1 4 0v2Z" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="**********"
                required
              />
              <button
                type="button"
                className="cardapio-password-toggle"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 5c-5.23 0-9.27 4.11-10 7 .73 2.89 4.77 7 10 7s9.27-4.11 10-7c-.73-2.89-4.77-7-10-7Zm0 11a4 4 0 1 1 4-4 4 4 0 0 1-4 4Zm0-6a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z" />
                </svg>
              </button>
            </label>

            <div className="cardapio-login-help-row">
              <span>Esqueceu sua senha?</span>
              <button type="button" className="cardapio-login-help-link">
                Redefina agora!
              </button>
            </div>

            {error ? <div className="cardapio-login-error">{error}</div> : null}

            <div className="cardapio-login-divider" />

            <button type="submit" className="cardapio-submit-button" disabled={isSubmitting}>
              {isSubmitting ? "VALIDANDO..." : "ENTRAR"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CardapioLoginPage;