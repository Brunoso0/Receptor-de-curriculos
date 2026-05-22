import React, { useEffect, useState, useRef } from 'react';
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



// Floor Tables Configuration
const tablesTerreo = [
  { id: '01', capacity: 2, type: 'rectangle', x: '2.5%', y: '74%', status: 'disponivel', desc: 'Mesa aconchegante próxima à janela Frontal, com sofá acolchoado.' },
  { id: '02', capacity: 2, type: 'rectangle', x: '10%', y: '74%', status: 'ocupada', desc: 'Mesa aconchegante próxima à janela Frontal, com sofá acolchoado.' },
  { id: '03', capacity: 2, type: 'rectangle', x: '16.5%', y: '74%', status: 'disponivel', desc: 'Mesa aconchegante próxima à janela Frontal, com sofá acolchoado.' },
  { id: '04', capacity: 2, type: 'rectangle', x: '24%', y: '74%', status: 'disponivel', desc: 'Mesa aconchegante próxima à janela Frontal, com sofá acolchoado.' },
  { id: '05', capacity: 2, type: 'rectangle', x: '55.7%', y: '76%', status: 'disponivel', desc: 'Mesa aconchegante próxima à janela Frontal, com sofá acolchoado.' },
  { id: '06', capacity: 2, type: 'rectangle', x: '62.5%', y: '76%', status: 'disponivel', desc: 'Mesa aconchegante próxima à janela Frontal, com sofá acolchoado.' },
  { id: '07', capacity: 2, type: 'rectangle', x: '69.3%', y: '76%', status: 'disponivel', desc: 'Mesa aconchegante próxima à janela Frontal, com sofá acolchoado.' },
  { id: '08', capacity: 2, type: 'rectangle', x: '56.5%', y: '58%', status: 'ocupada', desc: 'Mesa para duas pessoas.' },
  { id: '09', capacity: 2, type: 'rectangle', x: '56.5%', y: '49.1%', status: 'disponivel', desc: 'Mesa para duas pessoas.' },
  { id: '10', capacity: 2, type: 'rectangle', x: '66.9%', y: '58%', status: 'ocupada', desc: 'Mesa para duas pessoas.' },
  { id: '11', capacity: 2, type: 'rectangle', x: '66.9%', y: '49.1%', status: 'disponivel', desc: 'Mesa para duas pessoas.' },
  { id: '12', capacity: 2, type: 'rectangle', x: '78.5%', y: '62%', status: 'disponivel', desc: 'Mesa para duas pessoas.' },
  { id: '13', capacity: 2, type: 'rectangle', x: '78.5%', y: '78%', status: 'disponivel', desc: 'Mesa para duas pessoas.' },
  { id: '14', capacity: 2, type: 'rectangle', x: '92.9%', y: '82%', status: 'disponivel', desc: 'Mesa aconchegante próxima à janela lateral, com sofá acolchoado.' },
  { id: '15', capacity: 2, type: 'rectangle', x: '92.6%', y: '64%', status: 'disponivel', desc: 'Mesa aconchegante próxima à janela lateral, com sofá acolchoado.' },
  { id: '16', capacity: 2, type: 'rectangle', x: '92.6%', y: '43%', status: 'ocupada', desc: 'Mesa aconchegante próxima à janela lateral, com sofá acolchoado.' },
  { id: '17', capacity: 2, type: 'rectangle', x: '92.6%', y: '25%', status: 'ocupada', desc: 'Mesa aconchegante próxima à janela lateral, com sofá acolchoado.' },
  { id: '18', capacity: 10, type: 'rectangle', x: '22.6%', y: '45%', status: 'disponivel', desc: 'Mesa aconchegante com sofá acolchoado para grupo de pessoas.' }
];

const tablesPrimeiroAndar = [
  { id: '19', capacity: 2, type: 'rectangle', x: '12%', y: '15%', status: 'disponivel', desc: 'Mesa para duas pessoas.' },
  { id: '20', capacity: 2, type: 'rectangle', x: '28%', y: '15%', status: 'disponivel', desc: 'Mesa para duas pessoas.' },
  { id: '21', capacity: 2, type: 'rectangle', x: '44%', y: '15%', status: 'ocupada', desc: 'Mesa para duas pessoas.' },
  { id: '22', capacity: 2, type: 'rectangle', x: '60%', y: '15%', status: 'ocupada', desc: 'Mesa para duas pessoas.' },
  { id: '23', capacity: 2, type: 'rectangle', x: '10%', y: '45%', status: 'ocupada', desc: 'Mesa para duas pessoas.' },
  { id: '24', capacity: 2, type: 'rectangle', x: '35%', y: '45%', status: 'disponivel', desc: 'Mesa para duas pessoas.' },
  { id: '25', capacity: 2, type: 'rectangle', x: '58%', y: '45%', status: 'disponivel', desc: 'Mesa para duas pessoas.' },
  { id: '26', capacity: 2, type: 'rectangle', x: '79%', y: '45%', status: 'disponivel', desc: 'Mesa para duas pessoas.' },
  { id: '27', capacity: 2, type: 'rectangle', x: '59%', y: '75%', status: 'disponivel', desc: 'Mesa para duas pessoas.' },
  { id: '28', capacity: 2, type: 'rectangle', x: '80%', y: '75%', status: 'disponivel', desc: 'Mesa para duas pessoas.' }
];

export default function MesasPage({ 
  setStep, 
  selectedFloor, 
  setSelectedFloor, 
  selectedTable, 
  setSelectedTable 
}) {
  const [svgMarkup, setSvgMarkup] = useState(null);
  const [tablePoints, setTablePoints] = useState({});
  const svgWrapperRef = useRef(null);
  const mapElementsRef = useRef(null);
  const resizeTimerRef = useRef(null);
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

  // Load SVG markup inline when térreo is selected so we can read element positions
  useEffect(() => {
    let cancelled = false;
    if (selectedFloor === 'terreo' || selectedFloor === 'primeiro') {
      const file = selectedFloor === 'terreo' ? '/plantas/terreo.svg' : '/plantas/1andar.svg';
      fetch(file)
        .then(res => res.text())
        .then(text => {
          if (!cancelled) setSvgMarkup(text);
        })
        .catch(() => {
          if (!cancelled) setSvgMarkup(null);
        });
    } else {
      setSvgMarkup(null);
      setTablePoints({});
    }
    return () => { cancelled = true; };
  }, [selectedFloor]);

  // Compute mesa element centers and set tablePoints
  const computeTablePoints = () => {
    try {
      const mapEl = mapElementsRef.current;
      const svgRoot = svgWrapperRef.current && svgWrapperRef.current.querySelector('svg');
      if (!mapEl || !svgRoot) return;
      const containerRect = mapEl.getBoundingClientRect();
      const activeTables = selectedFloor === 'terreo' ? tablesTerreo : tablesPrimeiroAndar;
      const newPoints = {};
      activeTables.forEach((t) => {
        const idx = parseInt(t.id, 10);
        const svgId = `mesa${idx}`;
        const svgNode = svgRoot.getElementById ? svgRoot.getElementById(svgId) : svgRoot.querySelector(`#${svgId}`);
        if (svgNode) {
          const box = svgNode.getBoundingClientRect();
          const centerX = box.left + box.width / 2 - containerRect.left;
          const centerY = box.top + box.height / 2 - containerRect.top;
          newPoints[t.id] = { left: Math.round(centerX), top: Math.round(centerY) };
        }
      });
      setTablePoints(newPoints);
    } catch (err) {
      // ignore
    }
  };

  // After SVG is injected, compute positions and attach resize listeners
  useEffect(() => {
    if (!svgMarkup) return;
    // compute shortly after injection so DOM is ready
    const initialTimer = setTimeout(() => computeTablePoints(), 80);

    const onResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => computeTablePoints(), 120);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      clearTimeout(initialTimer);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [svgMarkup]);

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
            <div className="map-wrapper">
              {/* Floor SVG for Térreo (from public/plantas/terreo.svg) */}
              {svgMarkup && (
                  <div
                    className="floor-svg"
                    ref={svgWrapperRef}
                    aria-hidden
                    dangerouslySetInnerHTML={{ __html: svgMarkup }}
                  />
                )}

              <div className="map-elements-area" ref={mapElementsRef}>
                {tables.map((table) => {
                  const isSelected = selectedTable && selectedTable.id === table.id;
                  let tableStatusClass = table.status;
                  if (isSelected) {
                    tableStatusClass = 'selecionada';
                  }

                  const point = tablePoints[table.id];
                  const style = point
                    ? { left: `${point.left}px`, top: `${point.top}px`, transform: 'translate(-50%, -50%)' }
                    : { top: table.y, left: table.x };

                  return (
                    <div
                      key={table.id}
                      className={`map-table ${table.type} ${tableStatusClass}`}
                      style={style}
                      onClick={() => handleTableClick(table)}
                    >
                      <span className="table-num">{table.id}</span>
                    </div>
                  );
                })}

                {/* Map Floor Deco Icons in bottom-left corner */}
                <div className="map-deco-icons">
                  <Sofa size={18} strokeWidth={1.5} />
                  <TableFurnitureIcon />
                </div>
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
