import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Facebook,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  Save,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import cardapioApi from "../services/cardapioApi";

const DAYS = [
  { key: "seg", label: "Segunda" },
  { key: "ter", label: "Terça" },
  { key: "qua", label: "Quarta" },
  { key: "qui", label: "Quinta" },
  { key: "sex", label: "Sexta" },
  { key: "sab", label: "Sábado" },
  { key: "dom", label: "Domingo" },
];

function buildDefaultHorarios() {
  return DAYS.map(({ key, label }) => ({ key, label, ativo: false, inicio: "", fim: "" }));
}

function parseApiHorarios(raw) {
  if (!raw || typeof raw !== "object") return buildDefaultHorarios();
  return DAYS.map(({ key, label }) => {
    const entry = raw[key] || {};
    return {
      key,
      label,
      ativo: Boolean(entry.aberto),
      inicio: entry.abertura || "",
      fim: entry.fechamento || "",
    };
  });
}

function horariosToApiPayload(horarios) {
  const result = {};
  horarios.forEach(({ key, ativo, inicio, fim }) => {
    result[key] = ativo ? { aberto: true, abertura: inicio, fechamento: fim } : { aberto: false };
  });
  return result;
}

function composeAddress(endereco) {
  return [
    endereco?.logradouro,
    endereco?.numero,
    endereco?.bairro ? `- ${endereco.bairro}` : null,
    endereco?.cidade && endereco?.estado ? `${endereco.cidade}-${endereco.estado}` : null,
  ]
    .filter(Boolean)
    .join(", ");
}

function CardapioAdminHoursPage() {
  const { session } = useOutletContext();
  const authHeaders = session?.token ? { Authorization: `Bearer ${session.token}` } : {};

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [cep, setCep] = useState("");
  const [enderecoCompleto, setEnderecoCompleto] = useState("");
  const [horarios, setHorarios] = useState(buildDefaultHorarios());
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    cardapioApi
      .get("/empresa")
      .then((res) => {
        if (!isMounted) return;
        const data = res?.data || {};
        const endereco = data?.endereco || {};
        const redesSociais = data?.redesSociais || {};
        const horariosRaw = data?.horarios?.horarios || data?.horarios || {};
        setCep(endereco?.cep || "");
        setEnderecoCompleto(composeAddress(endereco));
        setHorarios(parseApiHorarios(horariosRaw));
        setFacebook(redesSociais?.facebook || "");
        setInstagram(redesSociais?.instagram || "");
        setWhatsapp(redesSociais?.whatsapp || "");
      })
      .catch(() => {
        if (isMounted) setHorarios(buildDefaultHorarios());
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  function toggleDia(index) {
    setHorarios((prev) => prev.map((h, i) => (i === index ? { ...h, ativo: !h.ativo } : h)));
  }

  function updateTime(index, field, value) {
    setHorarios((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  }

  async function handleSave() {
    setIsSaving(true);
    setFeedback(null);
    try {
      await cardapioApi.put(
        "/empresa",
        {
          endereco: { cep, logradouro: enderecoCompleto },
          redesSociais: { facebook, instagram, whatsapp },
          horarios: { horarios: horariosToApiPayload(horarios) },
          nomeUsuario: session?.nome,
          usuarioRhId: session?.id,
        },
        { headers: authHeaders }
      );
      setFeedback({ type: "success", message: "Alterações salvas com sucesso!" });
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Não foi possível salvar as alterações.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="cardapio-loading-state">Carregando configurações...</div>;
  }

  return (
    <div className="cardapio-admin-settings-page">
      <header className="cardapio-admin-settings-header">
        <div>
          <h1>Configurações de Horário</h1>
          <p>Ajuste os dados do estabelecimento e horários.</p>
        </div>
        <button
          type="button"
          className="cardapio-admin-settings-save-btn"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save size={18} />
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </header>

      {feedback && (
        <div className={`cardapio-admin-settings-feedback ${feedback.type}`}>
          {feedback.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {feedback.message}
        </div>
      )}

      <div className="cardapio-admin-settings-sections">

        {/* Localização */}
        <section className="cardapio-admin-settings-section">
          <div className="cardapio-admin-settings-section-head">
            <div className="cardapio-admin-settings-section-title">
              <div className="cardapio-admin-settings-section-icon">
                <MapPin size={22} />
              </div>
              <h3>Localização</h3>
            </div>
          </div>
          <div className="cardapio-admin-settings-addr-grid">
            <div className="cardapio-admin-settings-field">
              <label className="cardapio-admin-settings-field-label">CEP</label>
              <input
                type="text"
                className="cardapio-admin-settings-input"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
              />
            </div>
            <div className="cardapio-admin-settings-field">
              <label className="cardapio-admin-settings-field-label">Endereço Completo</label>
              <input
                type="text"
                className="cardapio-admin-settings-input"
                value={enderecoCompleto}
                onChange={(e) => setEnderecoCompleto(e.target.value)}
                placeholder="Av. Principal, 123 - Bairro, Cidade-UF"
              />
            </div>
          </div>
        </section>

        {/* Horários de Funcionamento */}
        <section className="cardapio-admin-settings-section">
          <div className="cardapio-admin-settings-section-head">
            <div className="cardapio-admin-settings-section-title">
              <div className="cardapio-admin-settings-section-icon">
                <Clock size={22} />
              </div>
              <h3>Horários de Funcionamento</h3>
            </div>
          </div>
          <div className="cardapio-admin-hours-grid">
            {horarios.map((item, index) => (
              <div
                key={item.key}
                className={`cardapio-admin-hours-row${item.ativo ? "" : " closed"}`}
              >
                <button
                  type="button"
                  className={`cardapio-admin-hours-toggle ${item.ativo ? "on" : "off"}`}
                  onClick={() => toggleDia(index)}
                  title={item.ativo ? "Desativar" : "Ativar"}
                >
                  <span className="cardapio-admin-hours-toggle-knob" />
                </button>
                <span className="cardapio-admin-hours-day">{item.label}</span>
                <div className="cardapio-admin-hours-times">
                  <input
                    type="text"
                    className="cardapio-admin-hours-time-input"
                    value={item.inicio}
                    onChange={(e) => updateTime(index, "inicio", e.target.value)}
                    disabled={!item.ativo}
                    placeholder="10:00"
                  />
                  <span className="cardapio-admin-hours-sep">até</span>
                  <input
                    type="text"
                    className="cardapio-admin-hours-time-input"
                    value={item.fim}
                    onChange={(e) => updateTime(index, "fim", e.target.value)}
                    disabled={!item.ativo}
                    placeholder="22:00"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Presença Digital */}
        <section className="cardapio-admin-settings-section">
          <div className="cardapio-admin-settings-section-head">
            <div className="cardapio-admin-settings-section-title">
              <div className="cardapio-admin-settings-section-icon">
                <Globe size={22} />
              </div>
              <h3>Presença Digital</h3>
            </div>
          </div>
          <div className="cardapio-admin-settings-social-grid">
            <div className="cardapio-admin-settings-field">
              <label className="cardapio-admin-settings-field-label">
                <Facebook size={11} className="social-icon facebook" />
                Facebook
              </label>
              <input
                type="text"
                className="cardapio-admin-settings-input"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="facebook.com/seu-perfil"
              />
            </div>
            <div className="cardapio-admin-settings-field">
              <label className="cardapio-admin-settings-field-label">
                <Instagram size={11} className="social-icon instagram" />
                Instagram
              </label>
              <input
                type="text"
                className="cardapio-admin-settings-input"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@seuperfil"
              />
            </div>
            <div className="cardapio-admin-settings-field">
              <label className="cardapio-admin-settings-field-label">
                <MessageCircle size={11} className="social-icon whatsapp" />
                WhatsApp
              </label>
              <input
                type="text"
                className="cardapio-admin-settings-input"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default CardapioAdminHoursPage;