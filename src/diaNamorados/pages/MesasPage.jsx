import React, { useEffect } from 'react';
import { Layers, Sofa } from 'lucide-react';
import '../styles/mesas.css';

// Custom Table Furniture Icon
const TableFurnitureIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="8" y1="12" x2="8" y2="20" />
    <line x1="16" y1="12" x2="16" y2="20" />
    <path d="M3 10V20" />
    <path d="M3 14H6" />
    <path d="M21 10V20" />
    <path d="M18 14H21" />
  </svg>
);

// Custom Star Badge Icon
const StarBadgeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#a37c42" />
    <path d="M12 7.5L13.5 11H17L14.2 13L15.3 16.5L12 14.5L8.7 16.5L9.8 13L7 11H10.5L12 7.5Z" fill="#FFFFFF" />
  </svg>
);

// Cutlery Watermark Component
const CutleryWatermark = () => (
  <div className="cutlery-watermark">
    <svg width="220" height="220" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fork */}
      <path d="M35 15V45C35 48.3 37.7 51 41 51V85C41 86.1 41.9 87 43 87H45C46.1 87 47 86.1 47 85V51C50.3 51 53 48.3 53 45V15" stroke="#EFE8E1" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M41 15V35" stroke="#EFE8E1" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M47 15V35" stroke="#EFE8E1" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Knife */}
      <path d="M65 15C59 15 57 25 57 45H65V85C65 86.1 65.9 87 67 87H69C70.1 87 71 86.1 71 85V15H65Z" fill="#EFE8E1" />
      
      {/* Small pink dot in between */}
      <circle cx="51" cy="51" r="2.5" fill="#D3C2BD" />
    </svg>
  </div>
);

// Floor Tables Configuration
const tablesTerreo = [
  { id: '01', capacity: 2, type: 'circle', x: '12%', y: '15%', status: 'disponivel', desc: 'Mesa aconchegante próxima à janela lateral.' },
  { id: '02', capacity: 4, type: 'rectangle', x: '38%', y: '15%', status: 'ocupada', desc: 'Mesa familiar espaçosa.' },
  { id: '03', capacity: 2, type: 'circle', x: '80%', y: '15%', status: 'disponivel', desc: 'Mesa íntima no canto do salão.' },
  { id: '04', capacity: 6, type: 'rectangle', x: '10%', y: '45%', status: 'disponivel', desc: 'Mesa lounge perfeita para grupos.' },
  { id: '05', capacity: 4, type: 'rectangle', x: '58%', y: '45%', status: 'disponivel', desc: 'Esta mesa possui vista privilegiada para o jardim de inverno.' },
  { id: '06', capacity: 4, type: 'rectangle', x: '79%', y: '45%', status: 'disponivel', desc: 'Mesa central com ótima iluminação à luz de velas.' },
  { id: '07', capacity: 2, type: 'circle', x: '59%', y: '75%', status: 'disponivel', desc: 'Mesa de casal com privacidade no centro.' },
  { id: '08', capacity: 2, type: 'circle', x: '80%', y: '75%', status: 'ocupada', desc: 'Mesa para duas pessoas.' }
];

const tablesPrimeiroAndar = [
  { id: '11', capacity: 2, type: 'circle', x: '12%', y: '15%', status: 'disponivel', desc: 'Mesa silenciosa no andar superior com ótima vista.' },
  { id: '12', capacity: 4, type: 'rectangle', x: '38%', y: '15%', status: 'disponivel', desc: 'Mesa com excelente vista do mezanino.' },
  { id: '13', capacity: 2, type: 'circle', x: '80%', y: '15%', status: 'ocupada', desc: 'Mesa romântica superior.' },
  { id: '14', capacity: 6, type: 'rectangle', x: '10%', y: '45%', status: 'ocupada', desc: 'Mesa grande no primeiro andar.' },
  { id: '15', capacity: 4, type: 'rectangle', x: '58%', y: '45%', status: 'disponivel', desc: 'Mesa do andar de cima próxima à adega suspensa.' },
  { id: '16', capacity: 4, type: 'rectangle', x: '79%', y: '45%', status: 'disponivel', desc: 'Mesa clássica suspensa com clima reservado.' },
  { id: '17', capacity: 2, type: 'circle', x: '59%', y: '75%', status: 'disponivel', desc: 'Mesa super reservada no topo do mezanino.' },
  { id: '18', capacity: 2, type: 'circle', x: '80%', y: '75%', status: 'disponivel', desc: 'Mesa no parapeito com vista para o térreo.' }
];

export default function MesasPage({ 
  setStep, 
  selectedFloor, 
  setSelectedFloor, 
  selectedTable, 
  setSelectedTable 
}) {
  const tables = selectedFloor === 'terreo' ? tablesTerreo : tablesPrimeiroAndar;

  // Initialize with Mesa 05 by default if nothing is selected
  useEffect(() => {
    if (!selectedTable) {
      const defaultTable = selectedFloor === 'terreo' 
        ? tablesTerreo.find(t => t.id === '05') 
        : tablesPrimeiroAndar.find(t => t.status === 'disponivel');
      setSelectedTable(defaultTable);
    }
  }, [selectedFloor, selectedTable, setSelectedTable]);

  const handleTableClick = (table) => {
    if (table.status === 'ocupada') return;
    setSelectedTable(table);
  };

  const handleFloorChange = (floor) => {
    setSelectedFloor(floor);
    // Automatically select a matching table on the new floor
    const firstAvail = floor === 'terreo' 
      ? tablesTerreo.find(t => t.id === '05') 
      : tablesPrimeiroAndar.find(t => t.status === 'disponivel');
    setSelectedTable(firstAvail || null);
  };

  const handleConfirm = () => {
    if (!selectedTable) {
      alert('Por favor, selecione uma mesa disponível para continuar.');
      return;
    }
    setStep(3);
  };

  return (
    <>
      {/* Headings */}
      <h1 className="mesas-title">Selecione sua Mesa</h1>
      <p className="mesas-subtitle">
        Escolha o ambiente ideal para sua experiência íntima.
      </p>

      {/* Layout Grid */}
      <div className="mesas-layout-grid">
        
        {/* Map Column (Left) */}
        <section className="map-column">
          {/* Floor tabs selector */}
          <div className="floor-selector-container">
            <button 
              className={`floor-btn ${selectedFloor === 'terreo' ? 'active' : ''}`}
              onClick={() => handleFloorChange('terreo')}
            >
              Térreo
            </button>
            <button 
              className={`floor-btn ${selectedFloor === 'primeiro' ? 'active' : ''}`}
              onClick={() => handleFloorChange('primeiro')}
            >
              Primeiro Andar
            </button>
          </div>

          {/* Legends status bar */}
          <div className="legends-bar">
            <div className="legend-item">
              <span className="legend-indicator disponivel" />
              <span>Disponível</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator selecionada" />
              <span>Selecionada</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator ocupada" />
              <span>Ocupada</span>
            </div>
          </div>

          {/* Map Floor Plan Board */}
          <div className="map-board">
            {/* Cutlery watermark centered behind tables */}
            <CutleryWatermark />

            <div className="map-elements-area">
              {tables.map((table) => {
                const isSelected = selectedTable && selectedTable.id === table.id;
                let tableStatusClass = table.status;
                if (isSelected) {
                  tableStatusClass = 'selecionada';
                }

                return (
                  <div
                    key={table.id}
                    className={`map-table ${table.type} ${tableStatusClass}`}
                    style={{ top: table.y, left: table.x }}
                    onClick={() => handleTableClick(table)}
                  >
                    <span className="table-num">{table.id}</span>
                    <span className="table-lugs">{table.capacity} lug.</span>
                  </div>
                );
              })}

              {/* ESPAÇO LOUNGE pill on Térreo only */}
              {selectedFloor === 'terreo' && (
                <div className="map-lounge-bar" style={{ top: '78%', left: '10%', width: '230px', justifyContent: 'center' }}>
                  Espaço Lounge
                </div>
              )}

              {/* Map Floor Deco Icons in bottom-left corner */}
              <div className="map-deco-icons">
                <Sofa size={18} strokeWidth={1.5} />
                <TableFurnitureIcon />
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar Resumo Column (Right) */}
        <section className="sidebar-column">
          <div className="sidebar-resumo-card">
            <h2 className="resumo-title">Resumo da Reserva</h2>

            {/* Location field */}
            <div className="resumo-field">
              <span className="resumo-field-label">Localização</span>
              <div className="resumo-field-value">
                <div className="resumo-field-icon">
                  <Layers size={18} />
                </div>
                <span className="resumo-field-text">
                  {selectedFloor === 'terreo' ? 'Térreo' : 'Primeiro Andar'}
                </span>
              </div>
            </div>

            {/* Selected table field */}
            <div className="resumo-field">
              <span className="resumo-field-label">Mesa Selecionada</span>
              {selectedTable ? (
                <>
                  <div className="resumo-field-value">
                    <div className="resumo-field-icon">
                      <TableFurnitureIcon />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="resumo-field-text">Mesa {selectedTable.id}</span>
                      <span className="resumo-field-subtext">Até {selectedTable.capacity} pessoas</span>
                    </div>
                  </div>

                  {/* View highlights info box */}
                  {selectedTable.desc && (
                    <div className="resumo-info-box">
                      <div className="resumo-info-icon-wrapper">
                        <StarBadgeIcon />
                      </div>
                      <span className="resumo-info-text">{selectedTable.desc}</span>
                    </div>
                  )}
                </>
              ) : (
                <span className="resumo-field-subtext" style={{ fontStyle: 'italic' }}>Nenhuma mesa selecionada</span>
              )}
            </div>

            {/* Action Confirm Button */}
            <button 
              className="confirmar-mesa-btn"
              onClick={handleConfirm}
              disabled={!selectedTable}
              style={{ opacity: selectedTable ? 1 : 0.6, cursor: selectedTable ? 'pointer' : 'not-allowed' }}
            >
              Confirmar Mesa
            </button>

            {/* Back Link */}
            <a 
              className="voltar-link"
              onClick={(e) => { e.preventDefault(); setStep(1); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Voltar para horário
            </a>
          </div>

          {/* Sidebar Decorative Quote Card */}
          <div className="sidebar-quote-card">
            <img 
              className="sidebar-quote-image" 
              src="/img/interior.jpg" 
              alt="JrCoffee romance"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80';
              }}
            />
            <div className="sidebar-quote-overlay">
              <blockquote className="sidebar-quote-text">
                "Onde o café encontra a poesia de um encontro."
              </blockquote>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
