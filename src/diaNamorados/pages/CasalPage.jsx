import React from 'react';
import { Users, Camera, Sparkles, ShieldCheck, UtensilsCrossed, Trash2, Phone, AtSign } from 'lucide-react';
import '../styles/casal.css';

// Custom Contact Card Icon
const ContactCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="7" y1="8" x2="17" y2="8" />
    <line x1="7" y1="12" x2="11" y2="12" />
    <line x1="7" y1="16" x2="13" y2="16" />
  </svg>
);

// Custom Cloud Upload Icon
const CloudUploadIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default function CasalPage({
  person1Name,
  setPerson1Name,
  person2Name,
  setPerson2Name,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactWhatsapp,
  setContactWhatsapp,
  contactInstagram,
  setContactInstagram,
  uploadedPhoto,
  setUploadedPhoto,
  specialNotes,
  setSpecialNotes,
  setStep
}) {
  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base = (process.env.REACT_APP_URL_NAMORADOS || '').trim().replace(/\/+$/, '') || 'http://localhost:3003/api';
      const formData = new FormData();
      formData.append('foto', file);

      const res = await fetch(`${base}/v1/evento/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.sucesso) {
        setUploadedPhoto({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          preview: data.url
        });
      } else {
        alert(data.erro || 'Erro ao fazer upload da imagem.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar ao servidor para fazer o upload.');
    }
  };

  const handleRemovePhoto = () => {
    setUploadedPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    setStep(4);
  };

  return (
    <>
      {/* Page Title */}
      <h1 className="reserva-title">Personalize seu Momento</h1>
      <p className="reserva-subtitle" style={{ marginBottom: '40px' }}>
        Configure os detalhes do casal e adicione toques especiais para tornar a noite inesquecível.
      </p>

      {/* Two-Column Grid Layout */}
      <div className="casal-layout-grid">
        
        {/* Left Column */}
        <section className="casal-left-col">
          
          {/* Card 1: Integrantes do Grupo */}
          <div className="casal-card">
            <h2 className="casal-card-title">
              <Users size={20} />
              Integrantes do Grupo
            </h2>

            <div className="casal-field">
              <label className="casal-field-label">Nome Completo (Primeira Pessoa)</label>
              <input
                type="text"
                className="casal-input"
                placeholder="Ex: Isabella Rossi"
                value={person1Name}
                onChange={(e) => setPerson1Name(e.target.value)}
              />
            </div>

            <div className="casal-field" style={{ marginTop: '20px' }}>
              <label className="casal-field-label">Nome Completo (Segunda Pessoa)</label>
              <input
                type="text"
                className="casal-input"
                placeholder="Ex: Gabriel Martins"
                value={person2Name}
                onChange={(e) => setPerson2Name(e.target.value)}
              />
            </div>
          </div>

          {/* Card 2: Informações de Contato */}
          <div className="casal-card">
            <h2 className="casal-card-title">
              <ContactCardIcon />
              Informações de Contato
            </h2>

            <div className="contact-inputs-grid">
              {/* Nome do Contato */}
              <div className="casal-field">
                <label className="casal-field-label">Nome do Contato</label>
                <input
                  type="text"
                  className="casal-input"
                  placeholder="Ex: Gabriel Martins"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              {/* E-mail */}
              <div className="casal-field">
                <label className="casal-field-label">E-mail</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <AtSign size={16} />
                  </span>
                  <input
                    type="email"
                    className="casal-input"
                    placeholder="email@exemplo.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Whatsapp */}
              <div className="casal-field">
                <label className="casal-field-label">WhatsApp</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <Phone size={16} />
                  </span>
                  <input
                    type="text"
                    className="casal-input"
                    placeholder="(11) 99999-9999"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                  />
                </div>
              </div>

              {/* Instagram */}
              <div className="casal-field">
                <label className="casal-field-label">Instagram</label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <AtSign size={16} />
                  </span>
                  <input
                    type="text"
                    className="casal-input"
                    placeholder="Ex: Gab_martins"
                    value={contactInstagram}
                    onChange={(e) => setContactInstagram(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Right Column */}
        <section className="casal-right-col">
          
          {/* Card 3: Foto Especial */}
          <div className="casal-card">
            <h2 className="casal-card-title">
              <Camera size={20} />
              Foto Especial
            </h2>
            <p className="casal-card-subtitle">
              Esta foto será usada no card de boas-vindas da sua mesa.
            </p>

            {/* Upload Area */}
            {!uploadedPhoto ? (
              <div className="upload-dashed-box" onClick={handleUploadClick}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div className="upload-icon">
                  <CloudUploadIcon />
                </div>
                <span className="upload-title">Arrastar uma foto aqui</span>
                <span className="upload-desc">ou clique para selecionar (.JPG, .PNG)</span>
              </div>
            ) : (
              <div className="file-preview-card">
                <img 
                  className="file-thumbnail" 
                  src={uploadedPhoto.preview} 
                  alt="Couple preview" 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=150';
                  }}
                />
                <div className="file-details">
                  <span className="file-name">{uploadedPhoto.name}</span>
                  <span className="file-status">{uploadedPhoto.size} • Pronto</span>
                </div>
                <button className="file-delete-btn" onClick={handleRemovePhoto}>
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Card 4: Toques Finais */}
          <div className="casal-card">
            <h2 className="casal-card-title">
              <Sparkles size={20} />
              Toques Finais
            </h2>

            <div className="casal-field">
              <label className="casal-field-label">Observações e Experiências</label>
              <textarea
                className="casal-textarea"
                placeholder="Se é uma surpresa de aniversário, pedido de casamento ou outra observação... Conte-nos tudo para tornarmos inesquecível."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
              />
            </div>
          </div>

        </section>

      </div>

      {/* Shared Bottom Actions Bar */}
      <div className="status-bar-container">
        <div className="status-bar-content">
          <div className="security-badge">
            <ShieldCheck size={22} className="security-icon" />
            <span>
              Seus dados estão seguros e serão usados exclusivamente para a personalização da sua reserva.
            </span>
          </div>

          <button 
            className="salvar-menu-btn"
            onClick={handleSave}
          >
            Salvar e Ver Menu
            <UtensilsCrossed size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
