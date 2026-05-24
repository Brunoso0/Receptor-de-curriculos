// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  LayoutGrid, 
  Hourglass, 
  Calendar, 
  History, 
  HelpCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Bell,
  Coffee,
  Menu as MenuIcon,
  Clock,
  CalendarDays,
  MoreVertical,
  Trash2,
  Check,
  User,
  Users,
  Activity,
  GlassWater,
  Utensils,
  Wine,
  Gift,
  ChevronRightSquare,
  Plus,
  Pencil,
  UploadCloud,
  Droplet,
  Leaf,
  Flame,
  Heart,
  Info,
  DollarSign,
  Coins,
  Download,
  SlidersHorizontal,
  Save,
  Banknote
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/adminDashboard.css';

// Mock Reservations Database
const MOCK_RESERVATIONS = [
  {
    id: 'JRC-2024-VLTN',
    cpf: '123.456.789-00',
    name: 'Isabella Rossi & Gabriel Martins',
    table: 'Mesa 14 • Térreo',
    time: '20:30',
    people: '02',
    status: 'Confirmado',
    arrival: 'CHEGADA EM: 10 MIN',
    note: 'Comemoração de 5 anos de namoro. Entregar o presente (relógio) discretamente após o prato principal.',
    restrictions: '',
    photo: '/img/couple_checkin.png',
    confirmed: false,
    waiterNotified: false
  },
  {
    id: 'JRC-2024-AMOR',
    cpf: '987.654.321-11',
    name: 'Mariana Silva & Lucas Souza',
    table: 'Mesa 05 • Varanda',
    time: '21:00',
    people: '02',
    status: 'Confirmado',
    arrival: 'CHEGADA EM: 25 MIN',
    note: 'Comemoração de aniversário de casamento. Trazer um espumante de cortesia na sobremesa.',
    restrictions: '',
    photo: '/img/cafe1.png',
    confirmed: false,
    waiterNotified: false
  },
  {
    id: 'JRC-2024-ROSA',
    cpf: '111.222.333-44',
    name: 'Juliana Costa & Pedro Alves',
    table: 'Mesa 12 • Térreo',
    time: '19:45',
    people: '02',
    status: 'Confirmado',
    arrival: 'ATRASADO: 5 MIN',
    note: 'Pedido de noivado surpresa! Colocar pétalas de rosa na mesa antes da chegada.',
    restrictions: '',
    photo: '/img/bebidaslogin.png',
    confirmed: false,
    waiterNotified: false
  }
];

// Mock Tables Database
const INITIAL_TABLES = [
  { id: 1, status: 'Ocupada', name: 'Ana & Mateus', time: '19:45', footer: 'RESERVADO', highlight: true, loading: false, size: 'normal' },
  { id: 2, status: 'Aguardando', name: 'Mesa Disponível', time: '20:30', footer: 'LIVRE', highlight: false, loading: false, size: 'normal' },
  { id: 3, status: 'Ocupada', name: 'Julia & Ricardo', time: '19:15', footer: 'PEDIDO EM PREPARO', highlight: false, loading: false, size: 'normal' },
  { id: 4, status: 'Ocupada', name: 'Carla & Felipe', time: '19:30', footer: 'SOBREMESA', highlight: false, loading: false, size: 'normal' },
  { id: 5, status: 'Finalizada', name: 'Beatriz & João', time: '20:05', footer: 'LIMPEZA PENDENTE', highlight: false, loading: false, size: 'normal' },
  { id: 6, status: 'Aguardando', name: 'Mesa Disponível', time: '21:00', footer: 'LIVRE', highlight: false, loading: false, size: 'normal' },
  { id: 7, status: 'Ocupada', name: 'Patrícia & Paulo', time: '20:00', footer: 'DRINKS', highlight: false, loading: false, size: 'normal' },
  { id: 8, status: 'Ocupada', name: 'Fernanda & Fábio', time: '20:10', footer: 'RESERVADO', highlight: true, loading: false, size: 'normal' },
  { id: 9, status: 'Aguardando', name: 'Carregando...', time: '', footer: '', highlight: false, loading: true, size: 'normal' },
  { id: 10, status: 'Aguardando', name: 'Carregando...', time: '', footer: '', highlight: false, loading: true, size: 'normal' },
  { id: 11, status: 'Ocupada', name: 'Carregando...', time: '', footer: '', highlight: false, loading: true, size: 'small' },
  { id: 12, status: 'Ocupada', name: 'André & Sofia', time: '20:35', footer: 'SOBREMESA', highlight: false, loading: false, size: 'normal' }, // Mesa 12 is active and occupied
  { id: 13, status: 'Ocupada', name: 'Carregando...', time: '', footer: '', highlight: false, loading: true, size: 'small' },
  { id: 14, status: 'Ocupada', name: 'Carregando...', time: '', footer: '', highlight: false, loading: true, size: 'small' },
  { id: 15, status: 'Finalizada', name: 'Carregando...', time: '', footer: '', highlight: false, loading: true, size: 'small' }
];

// Detailed Database for Tables (when clicked)
const TABLE_DETAILS_MAP = {
  12: {
    coupleName: 'André & Sofia',
    photo: '/img/couple_andre_sofia.png',
    category: 'Mesa VIP',
    guests: '2 Pessoas',
    arrival: 'Chegou às 20:35',
    hasHeart: true,
    order: {
      entrada: 'Carpaccio de Beterraba com Queijo de Cabra e Mel Trufado',
      pratos: [
        { name: 'Risotto de Cogumelos Porcini & Azeite de Ervas', tag: 'André' },
        { name: 'Filé Mignon em Crosta de Pistache ao Molho de Vinho', tag: 'Sofia' }
      ],
      sobremesa: 'Petit Gâteau de Chocolate Belga com Sorvete de Lavanda'
    },
    drinks: [
      { name: 'Vinho Cabernet Sauvignon Reserva', badge: 'Garrafa' },
      { name: 'Água com Gás e Limão Siciliano', badge: 'x2' }
    ],
    specialRequest: 'Entregar presente após o prato principal. Tocar música instrumental suave.',
    alertNote: 'Aniversário de 5 anos de namoro.',
    timeline: [
      { time: '21:15', text: 'Pratos principais servidos.' },
      { time: '20:50', text: 'Entrada servida e vinho decantado.' },
      { time: '20:35', text: 'Check-in realizado pela recepção.' }
    ]
  },
  1: {
    coupleName: 'Ana & Mateus',
    photo: '/img/couple_checkin.png',
    category: 'Mesa Premium',
    guests: '2 Pessoas',
    arrival: 'Chegou às 19:45',
    hasHeart: true,
    order: {
      entrada: 'Bruschetta de Tomate Cereja com Rúcula e Parmesão',
      pratos: [
        { name: 'Salmão Grelhado com Molho de Alcaparras', tag: 'Ana' },
        { name: 'Medalhão de Mignon com Risotto de Brie', tag: 'Mateus' }
      ],
      sobremesa: 'Taça de Morangos ao Champagne com Sorvete Cremoso'
    },
    drinks: [
      { name: 'Champagne Laurent-Perrier Brut', badge: 'Garrafa' },
      { name: 'Água Mineral sem Gás', badge: 'x2' }
    ],
    specialRequest: 'Mesa próxima à janela decorada com pétalas de rosas vermelhas.',
    alertNote: 'Comemoração de noivado surpresa!',
    timeline: [
      { time: '20:45', text: 'Prato principal finalizado.' },
      { time: '20:10', text: 'Entrada servida.' },
      { time: '19:45', text: 'Check-in realizado.' }
    ]
  },
  3: {
    coupleName: 'Julia & Ricardo',
    photo: '/img/cafe1.png',
    category: 'Mesa Salão',
    guests: '2 Pessoas',
    arrival: 'Chegou às 19:15',
    hasHeart: false,
    order: {
      entrada: 'Ceviche Clássico de Robalo com Leite de Tigre',
      pratos: [
        { name: 'Gnocchi de Mandioquinha ao Ragu de Costela', tag: 'Julia' },
        { name: 'Paleta de Cordeiro com Purê de Pistache', tag: 'Ricardo' }
      ],
      sobremesa: 'Crème Brûlée Clássico com Raspas de Laranja'
    },
    drinks: [
      { name: 'Vinho Carmenere Reserva Especial', badge: 'Garrafa' },
      { name: 'Soda Italiana de Maçã Verde', badge: 'x2' }
    ],
    specialRequest: 'Apresentar violinista na mesa durante a entrega da sobremesa.',
    alertNote: 'Aniversário de Casamento (10 anos).',
    timeline: [
      { time: '20:15', text: 'Pratos principais em preparo.' },
      { time: '19:35', text: 'Entrada consumida e pratos solicitados.' },
      { time: '19:15', text: 'Check-in realizado.' }
    ]
  }
};

export default function AdminDashboard() {
  const baseEnv = (process.env.REACT_APP_URL_NAMORADOS || '').trim();
  const base = baseEnv ? baseEnv.replace(/\/+$/, '') : 'http://localhost:3003/api';

  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [currentTab, setCurrentTab] = useState('floorplan');
  const [searchQuery, setSearchQuery] = useState('');
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const [activeResIndex, setActiveResIndex] = useState(0);
  const [scanning, setScanning] = useState(false);
  
  // Receitas View State
  const [receitaBase, setReceitaBase] = useState(480);
  const [receitaTaxaServico, setReceitaTaxaServico] = useState(10);
  const [receitaUpgradeVip, setReceitaUpgradeVip] = useState(0);
  const [receitaBuque, setReceitaBuque] = useState(0);
  
  // Custom added rates state
  const [customRates, setCustomRates] = useState([]);
  const [isAddingRate, setIsAddingRate] = useState(false);
  const [newRateNome, setNewRateNome] = useState('');
  const [newRateValor, setNewRateValor] = useState('');
  const [newRateTipo, setNewRateTipo] = useState('fixed'); // 'fixed' or 'percent'

  // Receitas reservations state
  const [receitasReservations, setReceitasReservations] = useState([]);

  // Reservation list inline editor state
  const [editingResId, setEditingResId] = useState(null);
  const [editingResValue, setEditingResValue] = useState('');
  const [activeActionDropdownResId, setActiveActionDropdownResId] = useState(null);

  // Floor Plan State
  const [tables, setTables] = useState([]);
  const [horarioSlot, setHorarioSlot] = useState('19:00');
  const [tableFilter, setTableFilter] = useState('Todos'); // 'Todos', 'Aguardando', 'Ocupadas'
  const [activeDropdownTable, setActiveDropdownTable] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null); // Triggers details screen when not null
  const [tableDetails, setTableDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Quick Search Modal State
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');

  // Fetch functions
  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('adm_token') || '';
      const res = await fetch(`${base}/v1/admin/mesas?horario_slot=${horarioSlot}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.sucesso) {
        setTables(data.mesas);
      }
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
    }
  };

  const fetchTableDetails = async (id) => {
    setLoadingDetails(true);
    try {
      const token = localStorage.getItem('adm_token') || '';
      const res = await fetch(`${base}/v1/admin/mesas/${id}/detalhes?horario_slot=${horarioSlot}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.sucesso) {
        setTableDetails(data.detalhe);
      } else {
        setTableDetails(null);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da mesa:', error);
      setTableDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchReceitas = async () => {
    try {
      const token = localStorage.getItem('adm_token') || '';
      const res = await fetch(`${base}/v1/admin/reservas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.sucesso) {
        const mapped = data.reservas.map(r => {
          const coupleName = r.integrantes.length > 0 
            ? r.integrantes.map(i => i.nome_integrante.split(' ')[0]).join(' & ') 
            : r.cliente.nome_completo;
          return {
            id: r.id,
            name: coupleName,
            email: r.cliente.email,
            date: new Date(r.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
            time: r.mesa.horario_slot,
            table: `Mesa ${r.mesa.numero_mesa}`,
            status: r.finalizada ? 'FINALIZADO' : r.check_in_realizado ? 'OCUPADO' : 'CONFIRMADO',
            value: Number(r.valor_total)
          };
        });
        setReceitasReservations(mapped);
      }
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    }
  };

  // SSE Notifications
  useEffect(() => {
    const sseUrl = `${base.replace(/\/api$/, '')}/api/v1/admin/notificacoes-checkin`;
    const eventSource = new EventSource(sseUrl);
    
    eventSource.onmessage = (event) => {
      try {
        const dadosCasal = JSON.parse(event.data);
        toast.info(`🔔 Check-in Realizado: ${dadosCasal.nome_cliente} na Mesa ${dadosCasal.mesa}!`, {
          autoClose: 5000
        });
        fetchTables();
        if (selectedTableId) {
          fetchTableDetails(selectedTableId);
        }
      } catch (err) {
        console.error('Erro ao processar SSE:', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [horarioSlot, selectedTableId]);

  // Sync effect for tables and details
  useEffect(() => {
    if (currentTab === 'floorplan') {
      fetchTables();
    }
  }, [currentTab, horarioSlot]);

  useEffect(() => {
    if (selectedTableId) {
      fetchTableDetails(selectedTableId);
    }
  }, [selectedTableId]);

  useEffect(() => {
    if (currentTab === 'receita') {
      fetchReceitas();
    }
  }, [currentTab]);

  // Financial Handlers
  const handleSaveReceitas = () => {
    toast.success('Alterações financeiras salvas com sucesso!');
  };

  const handleUpdateResValue = async (id) => {
    const numericValue = parseFloat(editingResValue.replace(/[^\d.]/g, ''));
    if (isNaN(numericValue) || numericValue < 0) {
      toast.error('Por favor, insira um valor numérico válido.');
      return;
    }
    try {
      const token = localStorage.getItem('adm_token') || '';
      const res = await fetch(`${base}/v1/admin/reservas/${id}/valor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ valor: numericValue })
      });
      const data = await res.json();
      if (res.ok && data.sucesso) {
        setReceitasReservations(prev => prev.map(res => res.id === id ? { ...res, value: numericValue } : res));
        setEditingResId(null);
        toast.success('Valor da reserva atualizado com sucesso!');
      } else {
        toast.error('Erro ao atualizar valor no servidor.');
      }
    } catch (error) {
      toast.error('Erro de conexão ao atualizar valor.');
    }
  };

  const handleAddCustomRate = (e) => {
    e.preventDefault();
    if (!newRateNome.trim()) {
      toast.error('Insira o nome do item/taxa.');
      return;
    }
    const val = parseFloat(newRateValor.replace(/[^\d.]/g, ''));
    if (isNaN(val) || val <= 0) {
      toast.error('Insira um valor numérico maior que zero.');
      return;
    }
    const newRate = {
      id: Date.now(),
      nome: newRateNome.trim(),
      valor: val,
      tipo: newRateTipo
    };
    setCustomRates(prev => [...prev, newRate]);
    setNewRateNome('');
    setNewRateValor('');
    setIsAddingRate(false);
    toast.success('Novo item/taxa adicionado!');
  };

  const handleDeleteCustomRate = (id) => {
    setCustomRates(prev => prev.filter(r => r.id !== id));
    toast.success('Item/taxa removido.');
  };

  const fetchMenuItems = async () => {
    try {
      const res = await fetch(`${base}/v1/evento/cardapio`);
      const data = await res.json();
      
      if (res.ok) {
        const allItems = [
          ...data.entradas.map(i => ({ ...i, categoria: 'Entrada' })),
          ...data.principais.map(i => ({ ...i, categoria: 'Prato Principal' })),
          ...data.sobremesas.map(i => ({ ...i, categoria: 'Sobremesa' })),
          ...data.bebidas.map(i => ({ ...i, categoria: 'Bebida' }))
        ];
        
        setMenuItems(allItems.map(item => ({
          id: item.id,
          nome: item.nome,
          categoria: item.categoria,
          descricao: item.descricao,
          imagem: '/img/Saladas.png'
        })));
      }
    } catch (error) {
      toast.error('Erro ao buscar o cardápio do servidor.');
    }
  };

  useEffect(() => {
    if (currentTab === 'menu') {
      fetchMenuItems();
    }
  }, [currentTab]);

  // Menu Form State
  const [menuFormId, setMenuFormId] = useState(null); // null = add mode
  const [menuFormNome, setMenuFormNome] = useState('');
  const [menuFormCategoria, setMenuFormCategoria] = useState('Entrada');
  const [menuFormDescricao, setMenuFormDescricao] = useState('');
  const [menuFormImagem, setMenuFormImagem] = useState('');
  const [menuFilter, setMenuFilter] = useState('Todos'); // 'Todos', 'Entrada', 'Prato Principal', 'Sobremesa'

  // CRUD Event Handlers
  // Handler de alérgenos removido

  const handleMenuReset = () => {
    setMenuFormId(null);
    setMenuFormNome('');
    setMenuFormCategoria('Entrada');
    setMenuFormDescricao('');
    setMenuFormImagem('');
  };

  const handleMenuEdit = (dish) => {
    setMenuFormId(dish.id);
    setMenuFormNome(dish.nome);
    setMenuFormCategoria(dish.categoria);
    setMenuFormDescricao(dish.descricao);
    setMenuFormImagem(dish.imagem);
    
    // Smooth scroll to form on mobile or focus
    const formElement = document.getElementById('menu-form-title');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMenuDelete = async (id) => {
    if (window.confirm('Tem certeza de que deseja remover este prato do cardápio?')) {
      const token = localStorage.getItem('adm_token') || '';
      
      try {
        const res = await fetch(`${base}/v1/admin/cardapio/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok || res.status === 204) {
          toast.success('Prato removido com sucesso!');
          fetchMenuItems();
          
          if (menuFormId === id) {
            handleMenuReset();
          }
        } else {
          const data = await res.json();
          throw new Error(data.erro || 'Erro ao deletar prato');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem excede o tamanho máximo de 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setMenuFormImagem(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    if (!menuFormNome.trim()) {
      toast.error('O nome do prato é obrigatório.');
      return;
    }

    const tipoItemMap = {
      'Entrada': 'entrada',
      'Prato Principal': 'principal',
      'Sobremesa': 'sobremesa',
      'Bebida': 'bebida'
    };

    const payload = {
      nome: menuFormNome,
      descricao: menuFormDescricao,
      tipo_item: tipoItemMap[menuFormCategoria],
      estoque_disponivel: 100,
      ativo: true
    };

    const token = localStorage.getItem('adm_token') || '';

    try {
      if (menuFormId) {
        const res = await fetch(`${base}/v1/admin/cardapio/${menuFormId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || 'Erro ao atualizar prato');
        
        toast.success('Prato atualizado com sucesso!');
      } else {
        const res = await fetch(`${base}/v1/admin/cardapio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || 'Erro ao criar prato');
        
        toast.success('Novo prato adicionado ao menu!');
      }

      fetchMenuItems();
      handleMenuReset();

    } catch (error) {
      toast.error(error.message);
    }
  };

  const navigate = useNavigate();
  const currentRes = reservations[activeResIndex];

  // Calculators for stats
  const totalTables = tables.length;
  const waitingTablesCount = tables.filter(t => t.status === 'Aguardando').length;
  const occupiedTablesCount = tables.filter(t => t.status === 'Ocupada').length;
  const finalizedTablesCount = tables.filter(t => t.status === 'Finalizada').length;

  // Search logic for Check-in View
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      toast.info('Por favor, digite um nome, ID ou Voucher.');
      return;
    }

    try {
      const token = localStorage.getItem('adm_token') || '';
      const res = await fetch(`${base}/v1/admin/reservas/buscar?busca=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.sucesso && data.reservas.length > 0) {
        const mapped = data.reservas.map(r => {
          const coupleName = r.integrantes.length > 0 
            ? r.integrantes.map(i => i.nome_integrante).join(' & ') 
            : r.cliente.nome_completo;
          return {
            id: r.token_voucher,
            cpf: 'N/A',
            name: coupleName,
            table: `Mesa ${r.mesa.numero_mesa} • ${r.mesa.andar === 0 ? 'Térreo' : 'Mezanino'}`,
            time: r.mesa.horario_slot,
            people: r.integrantes.length.toString() || '2',
            status: r.finalizada ? 'Finalizado' : r.check_in_realizado ? 'Presente' : 'Confirmado',
            arrival: r.check_in_realizado ? 'CHEGOU' : 'AGUARDANDO',
            note: r.observacoes || '',
            restrictions: 'Nenhuma',
            photo: r.foto_url || '/img/copo-perfiil.png',
            confirmed: r.check_in_realizado,
            waiterNotified: false
          };
        });
        setReservations(mapped);
        setActiveResIndex(0);
        toast.success(`Reserva de ${mapped[0].name.split('&')[0].trim()} localizada!`);
      } else {
        toast.error('Reserva não encontrada. Verifique os dados digitados.');
      }
    } catch (error) {
      toast.error('Erro de conexão ao buscar reserva.');
    }
  };

  // Quick Search Action (Sidebar button)
  const handleQuickSearchSubmit = async (e) => {
    e.preventDefault();
    if (!quickSearchInput.trim()) {
      toast.info('Digite o termo de busca.');
      return;
    }
    
    try {
      const token = localStorage.getItem('adm_token') || '';
      const res = await fetch(`${base}/v1/admin/reservas/buscar?busca=${encodeURIComponent(quickSearchInput)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.sucesso && data.reservas.length > 0) {
        const mapped = data.reservas.map(r => {
          const coupleName = r.integrantes.length > 0 
            ? r.integrantes.map(i => i.nome_integrante).join(' & ') 
            : r.cliente.nome_completo;
          return {
            id: r.token_voucher,
            cpf: 'N/A',
            name: coupleName,
            table: `Mesa ${r.mesa.numero_mesa} • ${r.mesa.andar === 0 ? 'Térreo' : 'Mezanino'}`,
            time: r.mesa.horario_slot,
            people: r.integrantes.length.toString() || '2',
            status: r.finalizada ? 'Finalizado' : r.check_in_realizado ? 'Presente' : 'Confirmado',
            arrival: r.check_in_realizado ? 'CHEGOU' : 'AGUARDANDO',
            note: r.observacoes || '',
            restrictions: 'Nenhuma',
            photo: r.foto_url || '/img/copo-perfiil.png',
            confirmed: r.check_in_realizado,
            waiterNotified: false
          };
        });
        setReservations(mapped);
        setActiveResIndex(0);
        setShowQuickSearch(false);
        setQuickSearchInput('');
        setCurrentTab('checkin');
        setSelectedTableId(null);
        toast.success(`Redirecionando para Check-in de ${mapped[0].name.split('&')[0].trim()}!`);
      } else {
        toast.error('Reserva não encontrada no sistema.');
      }
    } catch (error) {
      toast.error('Erro de conexão ao realizar busca rápida.');
    }
  };

  // Simulated Digital Scanner logic
  const handleSimulateScan = async () => {
    if (scanning) return;
    setScanning(true);
    toast.info('Alinhando leitor digital...');

    try {
      const token = localStorage.getItem('adm_token') || '';
      const res = await fetch(`${base}/v1/admin/reservas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.sucesso && data.reservas.length > 0) {
        const pending = data.reservas.filter(r => !r.check_in_realizado);
        const target = pending.length > 0 ? pending[Math.floor(Math.random() * pending.length)] : data.reservas[0];
        
        const coupleName = target.integrantes.length > 0 
          ? target.integrantes.map(i => i.nome_integrante).join(' & ') 
          : target.cliente.nome_completo;

        const mapped = {
          id: target.token_voucher,
          cpf: 'N/A',
          name: coupleName,
          table: `Mesa ${target.mesa.numero_mesa} • ${target.mesa.andar === 0 ? 'Térreo' : 'Mezanino'}`,
          time: target.mesa.horario_slot,
          people: target.integrantes.length.toString(),
          status: target.check_in_realizado ? 'Presente' : 'Confirmado',
          arrival: target.check_in_realizado ? 'CHEGOU' : 'AGUARDANDO',
          note: target.observacoes || '',
          restrictions: 'Nenhuma',
          photo: target.foto_url || '/img/copo-perfiil.png',
          confirmed: target.check_in_realizado,
          waiterNotified: false
        };

        setTimeout(() => {
          setReservations([mapped]);
          setActiveResIndex(0);
          setScanning(false);
          toast.success(`[QR Code Escaneado] Voucher #${target.token_voucher} carregado!`);
        }, 1500);
      } else {
        setScanning(false);
        toast.error('Nenhuma reserva encontrada para simular.');
      }
    } catch (e) {
      setScanning(false);
      toast.error('Erro de conexão ao simular scanner.');
    }
  };

  // Confirm reservation arrival
  const handleConfirmArrival = async (id) => {
    try {
      const res = await fetch(`${base}/v1/evento/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token_voucher: id })
      });
      const data = await res.json();
      if (res.ok && data.sucesso) {
        toast.success(`Entrada confirmada com sucesso!`);
        setReservations(prev => prev.map(res => {
          if (res.id === id) {
            return { ...res, confirmed: true, status: 'Presente' };
          }
          return res;
        }));
        fetchTables();
      } else {
        toast.error(data.erro || 'Falha ao confirmar check-in.');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor.');
    }
  };

  // Notify waiter
  const handleNotifyWaiter = (id) => {
    toast.success(`Garçom notificado para a mesa!`);
    setReservations(prev => prev.map(res => {
      if (res.id === id) {
        return { ...res, waiterNotified: true };
      }
      return res;
    }));
  };

  // Notify Waiter for specific table (Table details page)
  const handleNotifyWaiterForTable = (tableId) => {
    toast.success(`Garçom notificado para atendimento imediato na Mesa ${tableId}!`);
  };

  // Clean / Reset table state to free/vacant
  const handleCleanTable = (tableId) => {
    handleUpdateTableStatus(tableId, 'Livre');
    setSelectedTableId(null);
  };

  // Update Table Status from Actions Dropdown
  const handleUpdateTableStatus = async (tableId, newStatus) => {
    try {
      const token = localStorage.getItem('adm_token') || '';
      const res = await fetch(`${base}/v1/admin/mesas/${tableId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, horario_slot: horarioSlot })
      });
      const data = await res.json();
      if (res.ok && data.sucesso) {
        toast.success(`Mesa ${tableId} alterada para ${newStatus}!`);
        fetchTables();
        if (selectedTableId === tableId) {
          fetchTableDetails(tableId);
        }
      } else {
        toast.error('Erro ao atualizar status da mesa.');
      }
    } catch (error) {
      toast.error('Erro de conexão ao alterar status da mesa.');
    }
    setActiveDropdownTable(null);
  };

  // Log out
  const handleLogout = () => {
    localStorage.removeItem('adm_token');
    toast.success('Desconectado com sucesso!');
    setTimeout(() => {
      navigate('/namorados/login');
    }, 1000);
  };

  // Switch Tab helper
  const handleTabSwitch = (tab) => {
    setCurrentTab(tab);
    setSelectedTableId(null); // Clear selected table details on tab switch
  };

  // Placeholder view builder for uncompleted tabs
  const renderPlaceholderView = (title, Icon, description) => {
    return (
      <div className="placeholder-view animate-fade-in">
        <div className="placeholder-icon-wrapper">
          {Icon && <Icon size={36} />}
        </div>
        <h3 className="placeholder-title">{title}</h3>
        <p className="placeholder-desc">{description}</p>
      </div>
    );
  };

  // Menu Management view builder
  const renderMenuManagementView = () => {
    // Filter dishes by menuFilter
    const filteredMenuItems = menuItems.filter(item => {
      if (menuFilter === 'Todos') return true;
      return item.categoria === menuFilter;
    });

    return (
      <div className="menu-management-view animate-fade-in">
        <div className="menu-grid-container">
          
          {/* Left Column: Novo Prato / Form */}
          <div className="menu-form-card">
            <h3 className="menu-card-section-title" id="menu-form-title">
              {menuFormId ? 'Editar Prato' : 'Novo Prato'}
            </h3>
            
            <form onSubmit={handleMenuSubmit} className="menu-creation-form">
              {/* Image upload area */}
              <div className="form-group">
                <label className="form-label-uppercase">Imagem do Prato</label>
                
                <div 
                  className={`image-upload-zone ${menuFormImagem ? 'has-image' : ''}`}
                  onClick={() => document.getElementById('menu-image-file').click()}
                >
                  {menuFormImagem ? (
                    <div className="image-preview-container">
                      <img src={menuFormImagem} alt="Preview do prato" className="image-upload-preview" />
                      <button 
                        type="button" 
                        className="remove-preview-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuFormImagem('');
                        }}
                        title="Remover imagem"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder-content">
                      <UploadCloud size={36} className="upload-cloud-icon" />
                      <span className="upload-main-text">Arraste ou clique para upload</span>
                      <span className="upload-sub-text">PNG, JPG (Max. 5MB)</span>
                    </div>
                  )}
                </div>
                
                <input 
                  type="file" 
                  id="menu-image-file" 
                  className="hidden-file-input" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Name input */}
              <div className="form-group">
                <label className="form-label-uppercase" htmlFor="dish-name">Nome do Prato</label>
                <input 
                  type="text" 
                  id="dish-name"
                  className="form-text-input" 
                  placeholder="Ex: Risotto de Açafrão com Lagosta" 
                  value={menuFormNome}
                  onChange={(e) => setMenuFormNome(e.target.value)}
                  maxLength={60}
                />
              </div>

              {/* Category and Price row */}
              <div className="form-row-two-columns">
                <div className="form-group">
                  <label className="form-label-uppercase" htmlFor="dish-category">Categoria</label>
                  <select 
                    id="dish-category" 
                    className="form-select-input"
                    value={menuFormCategoria}
                    onChange={(e) => setMenuFormCategoria(e.target.value)}
                  >
                    <option value="Entrada">Entrada</option>
                    <option value="Prato Principal">Prato Principal</option>
                    <option value="Sobremesa">Sobremesa</option>
                  </select>
                </div>

                <div className="form-group">
                  {/* Campo de preço removido */}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label-uppercase" htmlFor="dish-description">Descrição Gourmet</label>
                <textarea 
                  id="dish-description" 
                  className="form-textarea-input" 
                  placeholder="Descreva os sabores e a apresentação..."
                  value={menuFormDescricao}
                  onChange={(e) => setMenuFormDescricao(e.target.value)}
                  rows={4}
                  maxLength={200}
                ></textarea>
              </div>

              {/* Allergens checkboxes */}
              <div className="form-group">
                {/* Campo de alérgenos removido */}
              </div>

              {/* Buttons row */}
              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary form-submit-btn">
                  {menuFormId ? (
                    <>
                      <CheckCircle size={16} />
                      Salvar Alterações
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Adicionar ao Menu
                    </>
                  )}
                </button>

                {menuFormId && (
                  <button 
                    type="button" 
                    className="btn btn-outline form-cancel-btn"
                    onClick={handleMenuReset}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Pratos Cadastrados */}
          <div className="registered-dishes-panel">
            <div className="panel-header-with-actions">
              <h3 className="menu-card-section-title">Pratos Cadastrados</h3>
              
              {/* Category Filter Controls styled matching the top right icons */}
              <div className="menu-grid-filter-bar">
                <button 
                  type="button" 
                  className={`menu-filter-icon-btn ${menuFilter === 'Todos' ? 'active' : ''}`}
                  onClick={() => setMenuFilter('Todos')}
                  title="Todos os Pratos"
                >
                  <Utensils size={16} />
                  <span className="filter-btn-text">Todos</span>
                </button>
                
                <button 
                  type="button" 
                  className={`menu-filter-icon-btn ${menuFilter === 'Entrada' ? 'active' : ''}`}
                  onClick={() => setMenuFilter('Entrada')}
                  title="Entradas"
                >
                  <Sparkles size={16} />
                  <span className="filter-btn-text">Entradas</span>
                </button>

                <button 
                  type="button" 
                  className={`menu-filter-icon-btn ${menuFilter === 'Prato Principal' ? 'active' : ''}`}
                  onClick={() => setMenuFilter('Prato Principal')}
                  title="Pratos Principais"
                >
                  <Coffee size={16} />
                  <span className="filter-btn-text">Principais</span>
                </button>

                <button 
                  type="button" 
                  className={`menu-filter-icon-btn ${menuFilter === 'Sobremesa' ? 'active' : ''}`}
                  onClick={() => setMenuFilter('Sobremesa')}
                  title="Sobremesas"
                >
                  <GlassWater size={16} />
                  <span className="filter-btn-text">Sobremesas</span>
                </button>
              </div>
            </div>

            <div className="menu-items-cards-grid">
              {filteredMenuItems.map((dish) => {
                // Removido: lógica de alérgenos

                return (
                  <div key={dish.id} className="menu-item-card animate-fade-in">
                    {/* Image & Badge overlay */}
                    <div className="card-image-wrapper">
                      <img 
                        src={dish.imagem} 
                        alt={dish.nome} 
                        className="menu-item-card-img"
                        onError={(e) => {
                          e.target.src = '/img/Saladas.png';
                        }}
                      />
                      <span className={`category-tag-badge ${dish.categoria.toLowerCase().replace(/\s/g, '-')}`}>
                        {dish.categoria === 'Sobremesa' ? 'SOBREMESA' : dish.categoria.toUpperCase()}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="menu-item-card-body">
                      <div className="item-title-price-row">
                        <h4 className="menu-item-title">{dish.nome}</h4>
                      </div>
                      
                      <p className="menu-item-card-description">
                        {dish.descricao || 'Nenhuma descrição fornecida.'}
                      </p>
                    </div>

                    {/* Card Footer Actions & Allergens */}
                    <div className="menu-item-card-footer">
                      {/* Linha de alérgenos removida */}

                      <div className="menu-item-actions-buttons">
                        <button 
                          type="button" 
                          className="menu-action-btn edit" 
                          onClick={() => handleMenuEdit(dish)}
                          title="Editar Prato"
                        >
                          <Pencil size={15} />
                        </button>
                        <button 
                          type="button" 
                          className="menu-action-btn delete" 
                          onClick={() => handleMenuDelete(dish.id)}
                          title="Remover Prato"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Dashed Add Card */}
              <div 
                className="menu-item-card dashed-add-card"
                onClick={() => {
                  handleMenuReset();
                  const input = document.getElementById('dish-name');
                  if (input) input.focus();
                }}
              >
                <div className="dashed-card-content">
                  <div className="dashed-card-circle-plus">
                    <Plus size={26} />
                  </div>
                  <span className="dashed-card-text">Adicionar novo item</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 'checkin':
        return renderCheckinView();
      case 'floorplan':
        return selectedTableId ? renderTableDetailsView() : renderFloorplanView();
      case 'waitlist':
        return renderPlaceholderView('Waitlist', Hourglass, 'Gerencie a fila de espera da recepção. Acompanhe o tempo de espera estimado e envie alertas SMS.');
      case 'receita':
        return renderReceitasView();
      case 'history':
        return renderPlaceholderView('History', History, 'Histórico completo de check-ins realizados, tempos de permanência e logs das operações de atendimento.');
      case 'menu':
        return renderMenuManagementView();
      default:
        return renderFloorplanView();
    }
  };

  // Receitas view builder
  const renderReceitasView = () => {
    // Dynamic totals
    const baseConfirmadoOffset = 42850 - 1500;
    const basePendenteOffset = 15200 - 1020;
    
    const totalConfirmado = baseConfirmadoOffset + receitasReservations
      .filter(r => r.status === 'CONFIRMADO')
      .reduce((sum, r) => sum + Number(r.value || 0), 0);
      
    const totalPendente = basePendenteOffset + receitasReservations
      .filter(r => r.status === 'PENDENTE')
      .reduce((sum, r) => sum + Number(r.value || 0), 0);

    const formatCurrency = (val) => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    // Chart math
    const sexConf = totalConfirmado * 0.18;
    const sexPend = totalPendente * 0.05;
    const sexSum = sexConf + sexPend;

    const sabConf = totalConfirmado * 0.32;
    const sabPend = totalPendente * 0.28;
    const sabSum = sabConf + sabPend;

    const domConf = totalConfirmado * 0.38;
    const domPend = totalPendente * 0.52;
    const domSum = domConf + domPend;

    const segConf = totalConfirmado * 0.12;
    const segPend = totalPendente * 0.15;
    const segSum = segConf + segPend;

    const maxDailySum = Math.max(sexSum, sabSum, domSum, segSum) || 1;

    const getBarStyles = (conf, pend, sum) => {
      const heightPct = (sum / maxDailySum) * 90; // scale up to 90% of container height
      const confPct = sum > 0 ? (conf / sum) * 100 : 0;
      const pendPct = sum > 0 ? (pend / sum) * 100 : 0;
      return { heightPct, confPct, pendPct };
    };

    const sexBar = getBarStyles(sexConf, sexPend, sexSum);
    const sabBar = getBarStyles(sabConf, sabPend, sabSum);
    const domBar = getBarStyles(domConf, domPend, domSum);
    const segBar = getBarStyles(segConf, segPend, segSum);

    return (
      <div className="receitas-view-container animate-fade-in">
        {/* Top Cards Grid */}
        <div className="receitas-top-cards-grid">
          {/* Card 1: Confirmadas */}
          <div className="receita-summary-card card-confirmadas">
            <div className="receita-card-meta">
              <span className="receita-card-label">CONFIRMADAS</span>
              <Banknote className="receita-card-icon" size={24} />
            </div>
            <div className="receita-card-amount">
              <span className="amount-currency">R$</span>
              <span className="amount-value">{totalConfirmado.toLocaleString('pt-BR')},00</span>
            </div>
          </div>

          {/* Card 2: Pendentes */}
          <div className="receita-summary-card card-pendentes">
            <div className="receita-card-meta">
              <span className="receita-card-label">PENDENTES</span>
              <div className="receita-card-icon-container">
                <Clock className="receita-card-icon" size={24} />
              </div>
            </div>
            <div className="receita-card-amount">
              <span className="amount-currency text-rose">R$</span>
              <span className="amount-value text-rose">{totalPendente.toLocaleString('pt-BR')},00</span>
            </div>
            <span className="receita-card-subtext">Estimado para 28 mesas em espera</span>
          </div>

          {/* Card 3: Valor Base Reserva */}
          <div className="receita-summary-card card-base-reserva">
            <span className="receita-base-title">Valor Base Reserva</span>
            <span className="receita-base-subtitle">PREÇO POR CASAL (PADRÃO)</span>
            
            <div className="receita-base-input-wrapper">
              <span className="input-currency">R$</span>
              <input 
                type="number" 
                className="receita-base-input"
                value={receitaBase}
                onChange={(e) => setReceitaBase(Number(e.target.value))}
                placeholder="450"
              />
            </div>

            <div className="receita-base-info-box">
              <Info size={16} className="info-icon" />
              <p className="info-text">Este valor inclui Welcome Drink e Menu Degustação (5 tempos).</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Chart & Additional Values */}
        <div className="receitas-middle-grid">
          {/* Chart Card */}
          <div className="receitas-chart-card">
            <div className="chart-header-row">
              <h3 className="chart-card-title">Arrecadação Estimada</h3>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color legend-confirmada"></span>
                  <span className="legend-label">Confirmada</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color legend-pendente"></span>
                  <span className="legend-label">Pendente</span>
                </div>
              </div>
            </div>

            <div className="chart-visualization-container">
              {/* SEX */}
              <div className="chart-bar-column">
                <div className="chart-bar-stacked" style={{ height: `${sexBar.heightPct}%` }}>
                  <div className="bar-part-pendente" style={{ height: `${sexBar.pendPct}%` }}></div>
                  <div className="bar-part-confirmada" style={{ height: `${sexBar.confPct}%` }}></div>
                </div>
                <span className="chart-bar-label">SEX</span>
              </div>

              {/* SÁB */}
              <div className="chart-bar-column">
                <div className="chart-bar-stacked" style={{ height: `${sabBar.heightPct}%` }}>
                  <div className="bar-part-pendente" style={{ height: `${sabBar.pendPct}%` }}></div>
                  <div className="bar-part-confirmada" style={{ height: `${sabBar.confPct}%` }}></div>
                </div>
                <span className="chart-bar-label">SÁB</span>
              </div>

              {/* DOM */}
              <div className="chart-bar-column">
                <div className="chart-bar-stacked" style={{ height: `${domBar.heightPct}%` }}>
                  <div className="bar-part-pendente" style={{ height: `${domBar.pendPct}%` }}></div>
                  <div className="bar-part-confirmada" style={{ height: `${domBar.confPct}%` }}></div>
                </div>
                <span className="chart-bar-label">DOM (VALENTINE)</span>
              </div>

              {/* SEG */}
              <div className="chart-bar-column">
                <div className="chart-bar-stacked" style={{ height: `${segBar.heightPct}%` }}>
                  <div className="bar-part-pendente" style={{ height: `${segBar.pendPct}%` }}></div>
                  <div className="bar-part-confirmada" style={{ height: `${segBar.confPct}%` }}></div>
                </div>
                <span className="chart-bar-label">SEG</span>
              </div>
            </div>
          </div>

          {/* Additional Values Card */}
          <div className="receitas-adicionais-card">
            <h3 className="adicionais-card-title">Valores Adicionais</h3>

            <div className="adicionais-items-list">
              {/* Taxa de Serviço */}
              <div className="adicionais-item-row">
                <div className="adicionais-item-meta">
                  <span className="item-label">Taxa de Serviço</span>
                  <span className="item-subtext">Obrigatório p/ reserva</span>
                </div>
                <div className="adicionais-input-container">
                  <input 
                    type="number" 
                    className="adicionais-small-input"
                    value={receitaTaxaServico}
                    onChange={(e) => setReceitaTaxaServico(Number(e.target.value))}
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>

              {/* Upgrade Mesa VIP */}
              <div className="adicionais-item-row">
                <div className="adicionais-item-meta">
                  <span className="item-label">Upgrade Mesa VIP</span>
                  <span className="item-subtext">Mesa janela/vista</span>
                </div>
                <div className="adicionais-input-container">
                  <span className="input-prefix">R$</span>
                  <input 
                    type="number" 
                    className="adicionais-small-input value-input"
                    value={receitaUpgradeVip}
                    onChange={(e) => setReceitaUpgradeVip(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Bouquet de Rosas */}
              <div className="adicionais-item-row">
                <div className="adicionais-item-meta">
                  <span className="item-label">Bouquet de Rosas</span>
                  <span className="item-subtext">Item pré-pedido</span>
                </div>
                <div className="adicionais-input-container">
                  <span className="input-prefix">R$</span>
                  <input 
                    type="number" 
                    className="adicionais-small-input value-input"
                    value={receitaBuque}
                    onChange={(e) => setReceitaBuque(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Render Custom Rates */}
              {customRates.map((rate) => (
                <div key={rate.id} className="adicionais-item-row custom-item-row">
                  <div className="adicionais-item-meta">
                    <div className="custom-item-header">
                      <span className="item-label">{rate.nome}</span>
                      <button 
                        type="button" 
                        className="delete-custom-rate-btn"
                        onClick={() => handleDeleteCustomRate(rate.id)}
                        title="Remover taxa"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <span className="item-subtext">Taxa adicional personalizada</span>
                  </div>
                  <div className="adicionais-input-container">
                    {rate.tipo === 'fixed' ? <span className="input-prefix">R$</span> : null}
                    <input 
                      type="number" 
                      className="adicionais-small-input value-input"
                      value={rate.valor}
                      onChange={(e) => {
                        const newVal = parseFloat(e.target.value);
                        setCustomRates(prev => prev.map(cr => cr.id === rate.id ? { ...cr, valor: isNaN(newVal) ? 0 : newVal } : cr));
                      }}
                    />
                    {rate.tipo === 'percent' ? <span className="input-suffix">%</span> : null}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Rate Form inline */}
            {isAddingRate ? (
              <form onSubmit={handleAddCustomRate} className="add-custom-rate-form animate-fade-in">
                <div className="rate-form-inputs">
                  <input 
                    type="text" 
                    placeholder="Nome da taxa" 
                    className="rate-name-input"
                    value={newRateNome}
                    onChange={(e) => setNewRateNome(e.target.value)}
                    required
                  />
                  <div className="rate-value-type-row">
                    <input 
                      type="number" 
                      placeholder="Valor" 
                      className="rate-value-input"
                      value={newRateValor}
                      onChange={(e) => setNewRateValor(e.target.value)}
                      required
                    />
                    <select 
                      className="rate-type-select"
                      value={newRateTipo}
                      onChange={(e) => setNewRateTipo(e.target.value)}
                    >
                      <option value="fixed">R$</option>
                      <option value="percent">%</option>
                    </select>
                  </div>
                </div>
                <div className="rate-form-actions">
                  <button type="submit" className="rate-btn-confirm">Adicionar</button>
                  <button 
                    type="button" 
                    className="rate-btn-cancel" 
                    onClick={() => {
                      setIsAddingRate(false);
                      setNewRateNome('');
                      setNewRateValor('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <button 
                type="button" 
                className="btn-nova-taxa"
                onClick={() => setIsAddingRate(true)}
              >
                <Plus size={16} />
                <span>NOVA TAXA OU ITEM</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Section: Details Table */}
        <div className="receitas-table-card">
          <div className="table-card-header-row">
            <h3 className="table-card-title">Detalhamento de Reservas</h3>
            <div className="table-actions-buttons">
              <button type="button" className="table-action-icon-btn" title="Filtrar">
                <SlidersHorizontal size={16} />
              </button>
              <button type="button" className="table-action-icon-btn" title="Exportar CSV">
                <Download size={16} />
              </button>
            </div>
          </div>

          <div className="receitas-table-wrapper">
            <table className="receitas-details-table">
              <thead>
                <tr>
                  <th className="th-cliente">CLIENTE</th>
                  <th className="th-data">DATA/HORA</th>
                  <th className="th-status">STATUS</th>
                  <th className="th-valor">VALOR TOTAL</th>
                  <th className="th-acoes">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {receitasReservations.map((res) => {
                  const initials = res.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);

                  return (
                    <tr key={res.id}>
                      {/* Cliente */}
                      <td className="td-cliente">
                        <div className="client-cell-info">
                          <div className="client-avatar-circle">{initials}</div>
                          <div className="client-name-email">
                            <span className="client-name-bold">{res.name}</span>
                            <span className="client-email-muted">{res.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Data/Hora */}
                      <td className="td-data">
                        <div className="date-time-cell">
                          <span className="date-main">{res.date}</span>
                          <span className="time-mesa-muted">{res.time} ({res.table})</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="td-status">
                        <span className={`status-pill ${res.status.toLowerCase()}`}>
                          {res.status}
                        </span>
                      </td>

                      {/* Valor Total */}
                      <td className="td-valor">
                        {editingResId === res.id ? (
                          <div className="inline-value-editor">
                            <span className="currency-prefix">R$</span>
                            <input 
                              type="text"
                              className="inline-value-input"
                              value={editingResValue}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (/^[0-9.,]*$/.test(val)) {
                                  setEditingResValue(val);
                                }
                              }}
                              autoFocus
                            />
                            <button 
                              type="button" 
                              className="inline-save-btn"
                              onClick={() => handleUpdateResValue(res.id)}
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              type="button" 
                              className="inline-cancel-btn"
                              onClick={() => setEditingResId(null)}
                            >
                              <Plus size={14} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                          </div>
                        ) : (
                          <span className="valor-text-bold">
                            {formatCurrency(res.value)}
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="td-acoes">
                        <div className="actions-dropdown-wrapper">
                          <button 
                            type="button" 
                            className="btn-dots-actions"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionDropdownResId(activeActionDropdownResId === res.id ? null : res.id);
                            }}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeActionDropdownResId === res.id && (
                            <div className="actions-dropdown-menu">
                              <button 
                                type="button" 
                                onClick={() => {
                                  setEditingResId(res.id);
                                  setEditingResValue(res.value.toString());
                                  setActiveActionDropdownResId(null);
                                }}
                              >
                                Alterar Valor da Reserva
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Check-in view builder
  const renderCheckinView = () => {
    return (
      <div className="dashboard-grid">
        {/* Leitor Digital Card */}
        <div className="card">
          <div className="scanner-card-header">
            <h3 className="card-title">Leitor Digital</h3>
            <span className="camera-badge">Câmera Ativa</span>
          </div>

          <div className="camera-viewer">
            <div className="camera-bg-effects">
              <div className="bokeh-light bokeh-1"></div>
              <div className="bokeh-light bokeh-2"></div>
            </div>

            <div className="scanner-target"></div>
            <div className="scanner-target scanner-target-right-top"></div>
            
            <div className="camera-lens">
              <div className="camera-lens-inner">
                <div className="camera-glass"></div>
              </div>
            </div>

            <div className="scan-line"></div>
          </div>

          <p className="scanner-caption">
            Posicione o QR Code do cliente no centro para escanear
          </p>

          <button 
            type="button" 
            className="scan-button-sim"
            onClick={handleSimulateScan}
            disabled={scanning}
          >
            {scanning ? 'Escaneando QR Code...' : 'Simular Leitura de QR Code'}
          </button>
        </div>

        {/* Reserva Localizada Card */}
        {currentRes ? (
          <div className="card reserva-card">
            <div className="reserva-card-header">
              <div>
                <p className="reserva-title-sub">Reserva Localizada</p>
                <h3 className="reserva-id">ID: #{currentRes.id}</h3>
              </div>
              <div className="reserva-status-badges">
                <span className="arrival-badge">{currentRes.arrival}</span>
                <span className="status-label">Status: {currentRes.status}</span>
              </div>
            </div>

            <div className="reserva-card-body">
              <div className="profile-section">
                <div className="profile-img-container">
                  <img 
                    src={currentRes.photo} 
                    alt={currentRes.name} 
                    className="profile-img"
                    onError={(e) => {
                      e.target.src = '/img/copo-perfiil.png';
                    }}
                  />
                </div>
                <div className="profile-info">
                  <h4 className="profile-name">{currentRes.name}</h4>
                  <div className="profile-location">
                    <MapPin size={16} />
                    <span>{currentRes.table}</span>
                  </div>
                </div>
              </div>

              <div className="details-grid">
                <div className="details-box">
                  <div className="details-label">Horário</div>
                  <div className="details-value">{currentRes.time}</div>
                </div>
                <div className="details-box">
                  <div className="details-label">Pessoas</div>
                  <div className="details-value">{currentRes.people}</div>
                </div>
              </div>

              <div className="highlight-panel occasion">
                <div className="panel-header-row">
                  <Sparkles size={14} />
                  <span>NOTA DE OCASIÃO</span>
                </div>
                <p className="panel-text">
                  "{currentRes.note}"
                </p>
              </div>


              <div className="action-buttons-row">
                <button 
                  type="button" 
                  className={`btn btn-primary ${currentRes.confirmed ? 'success' : ''}`}
                  onClick={() => handleConfirmArrival(currentRes.id)}
                  disabled={currentRes.confirmed}
                >
                  {currentRes.confirmed ? (
                    <>
                      <CheckCircle size={16} />
                      Entrada Confirmada
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Confirmar Entrada
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  className={`btn btn-outline ${currentRes.waiterNotified ? 'notified' : ''}`}
                  onClick={() => handleNotifyWaiter(currentRes.id)}
                >
                  <Bell size={16} />
                  {currentRes.waiterNotified ? 'Garçom Notificado' : 'Notificar Garçom'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card reserva-card empty-state-card">
            <div className="empty-state-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', textAlign: 'center', padding: '40px', color: '#8c7f76' }}>
              <div className="empty-icon-circle" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(163,124,66,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Users size={24} style={{ color: '#a37c42' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px', color: '#5c4e46' }}>Nenhuma Reserva Carregada</h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '280px', lineHeight: '1.4' }}>
                Use a busca rápida na barra lateral ou simule o escaneamento de um QR code para exibir os dados do check-in.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Floor Plan (Status das Mesas) view builder
  const renderFloorplanView = () => {
    const filteredTables = tables.filter(table => {
      if (tableFilter === 'Todos') return true;
      if (tableFilter === 'Aguardando') return table.status === 'Aguardando';
      if (tableFilter === 'Ocupadas') return table.status === 'Ocupada';
      return true;
    });

    const normalTables = filteredTables.filter(t => t.size === 'normal');
    const footerTables = filteredTables.filter(t => t.size === 'small');

    return (
      <div className="floorplan-view animate-fade-in">
        
        {/* Slot Selection Tabs */}
        <div className="slot-selector-container-dashboard" style={{ display: 'flex', gap: '12px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '10px', width: 'fit-content', border: '1px solid var(--border)' }}>
          <button 
            type="button" 
            className={`menu-filter-icon-btn ${horarioSlot === '19:00' ? 'active' : ''}`}
            onClick={() => setHorarioSlot('19:00')}
            style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: horarioSlot === '19:00' ? 'var(--gold-gradient)' : 'transparent', color: horarioSlot === '19:00' ? '#111' : 'var(--text)' }}
          >
            <Clock size={16} />
            <span style={{ fontWeight: '600' }}>Primeiro Turno (19:00)</span>
          </button>
          
          <button 
            type="button" 
            className={`menu-filter-icon-btn ${horarioSlot === '21:30' ? 'active' : ''}`}
            onClick={() => setHorarioSlot('21:30')}
            style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: horarioSlot === '21:30' ? 'var(--gold-gradient)' : 'transparent', color: horarioSlot === '21:30' ? '#111' : 'var(--text)' }}
          >
            <Clock size={16} />
            <span style={{ fontWeight: '600' }}>Segundo Turno (21:30)</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">TOTAL</div>
            <div className="stat-value total">{totalTables} Mesas</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">AGUARDANDO</div>
            <div className="stat-value waiting">{waitingTablesCount} Mesas</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">OCUPADAS</div>
            <div className="stat-value occupied">{occupiedTablesCount} Mesas</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">FINALIZADAS</div>
            <div className="stat-value finalized">{finalizedTablesCount} Mesas</div>
          </div>
        </div>

        {/* Normal Tables Grid */}
        <div className="tables-grid">
          {normalTables.map((table) => {
            const isHighlighted = table.highlight;
            const isLoading = table.loading;
            
            if (isLoading) {
              return (
                <div key={table.id} className="table-card loading">
                  <div className="loading-circle">{table.id}</div>
                  <div className="loading-text">Carregando...</div>
                </div>
              );
            }

            return (
              <div 
                key={table.id} 
                className={`table-card ${isHighlighted ? 'highlight' : ''}`}
                onClick={() => {
                  // Direct to details on card click if occupied
                  if (table.status === 'Ocupada' || table.status === 'Finalizada') {
                    setSelectedTableId(table.id);
                  } else {
                    toast.info(`Mesa ${table.id} está disponível. Faça o check-in do casal para ocupar.`);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Header */}
                <div className="table-card-header">
                  <div className="table-number-circle">{table.id}</div>
                  
                  {/* Status Tag */}
                  {table.status === 'Ocupada' ? (
                    isHighlighted ? (
                      <span className="table-status-badge occupied-dot">• Ocupada</span>
                    ) : (
                      <span className="table-status-text occupied">Ocupada</span>
                    )
                  ) : table.status === 'Aguardando' ? (
                    <span className="table-status-badge waiting">Aguardando</span>
                  ) : (
                    <span className="table-status-badge finalized">Finalizada</span>
                  )}
                </div>

                {/* Body */}
                <div className="table-card-body">
                  <h4 className={`table-customer-name ${table.status === 'Aguardando' ? 'available' : ''}`}>
                    {table.name}
                  </h4>
                  
                  <div className="table-time-detail">
                    {table.status === 'Ocupada' && (
                      <>
                        <Clock size={14} />
                        <span>Chegada: {table.time}</span>
                      </>
                    )}
                    {table.status === 'Aguardando' && (
                      <>
                        <CalendarDays size={14} />
                        <span>Próx: {table.time}</span>
                      </>
                    )}
                    {table.status === 'Finalizada' && (
                      <>
                        <Check size={14} />
                        <span>Saída: {table.time}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="table-card-footer">
                  <span className={`table-footer-status ${table.footer.toLowerCase().replace(/\s/g, '-')}`}>
                    {table.footer}
                  </span>
                  
                  {table.footer === 'LIMPEZA PENDENTE' ? (
                    <div 
                      className="trash-icon-btn" 
                      onClick={(e) => {
                        e.stopPropagation(); // Stop parent click
                        handleUpdateTableStatus(table.id, 'Livre');
                      }}
                    >
                      <Activity size={15} style={{ opacity: 0.8 }} />
                    </div>
                  ) : (
                    <div className="dropdown-action-wrapper">
                      <button 
                        type="button" 
                        className="table-dots-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownTable(activeDropdownTable === table.id ? null : table.id);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeDropdownTable === table.id && (
                        <div className="table-dropdown-menu">
                          <button type="button" onClick={() => handleUpdateTableStatus(table.id, 'Ocupada')}>
                            Marcar Ocupada
                          </button>
                          <button type="button" onClick={() => handleUpdateTableStatus(table.id, 'Aguardando')}>
                            Marcar Aguardando
                          </button>
                          <button type="button" onClick={() => handleUpdateTableStatus(table.id, 'Finalizada')}>
                            Marcar Finalizada
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Tables Grid (smaller loading cards) */}
        {footerTables.length > 0 && (
          <div className="footer-tables-grid">
            {footerTables.map((table) => (
              <div key={table.id} className="table-card loading small">
                <div className="loading-circle small">{table.id}</div>
                <div className="loading-text small">Carregando...</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Table Details (Mesa [ID] Details) View Builder
  const renderTableDetailsView = () => {
    if (loadingDetails) {
      return (
        <div className="placeholder-view animate-fade-in" style={{ padding: '60px 20px' }}>
          <h3 className="placeholder-title">Carregando detalhes da mesa...</h3>
        </div>
      );
    }
    if (!tableDetails) {
      return (
        <div className="placeholder-view animate-fade-in" style={{ padding: '60px 20px' }}>
          <h3 className="placeholder-title">Nenhuma reserva ativa para a Mesa {selectedTableId}.</h3>
          <button type="button" className="btn btn-outline" onClick={() => setSelectedTableId(null)} style={{ marginTop: '12px' }}>
            Voltar ao Mapa
          </button>
        </div>
      );
    }
    const details = tableDetails;

    return (
      <div className="table-details-view animate-fade-in">
        <button 
          type="button" 
          className="btn btn-outline" 
          onClick={() => setSelectedTableId(null)}
          style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', background: 'transparent', padding: '8px 16px', borderRadius: '8px', color: 'var(--text)', cursor: 'pointer' }}
        >
          <ChevronLeft size={16} />
          Voltar ao Mapa de Mesas
        </button>
        {/* Three Columns Section Grid */}
        <div className="details-columns-grid">
          
          {/* Column 1: Profile Details Card */}
          <div className="details-col-card profile-card-details">
            <div className="details-profile-avatar-wrapper">
              <div className="details-profile-avatar-container">
                <img 
                  src={details.photo} 
                  alt={details.coupleName} 
                  className="details-profile-img"
                  onError={(e) => {
                    e.target.src = '/img/copo-perfiil.png';
                  }}
                />
              </div>
              {details.hasHeart && (
                <div className="details-heart-badge">
                  <svg viewBox="0 0 24 24" className="heart-icon-svg" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              )}
            </div>
            
            <h3 className="details-couple-name">{details.coupleName}</h3>
            
            <div className="details-table-sub">
              <MapPin size={16} />
              <span>{details.category} • {details.guests}</span>
            </div>

            <div className="details-status-box">
              <span className="status-box-label">STATUS DA RESERVA</span>
              <div className="status-box-row">
                <span className="status-box-value">{details.arrival}</span>
                <span className="status-box-check-icon">
                  <Check size={14} strokeWidth={3} />
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Order Details ("Detalhes do Pedido") */}
          <div className="details-col-card order-card-details">
            <div className="col-card-header">
              <Utensils size={18} className="col-icon" />
              <h4 className="col-title">Detalhes do Pedido</h4>
            </div>

            <div className="order-items-list">
              <div className="order-course-section">
                <span className="course-title">ENTRADA (Para compartilhar)</span>
                <p className="course-desc">{details.order.entrada}</p>
              </div>

              <div className="order-course-section">
                <span className="course-title">PRATOS PRINCIPAIS</span>
                <div className="main-dishes-list">
                  {details.order.pratos.map((prato, i) => (
                    <div key={i} className="dish-item-row">
                      <p className="course-desc dish-name">{prato.name}</p>
                      <span className="client-tag">{prato.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-course-section">
                <span className="course-title">SOBREMESA</span>
                <p className="course-desc">{details.order.sobremesa}</p>
              </div>
            </div>
          </div>

          {/* Column 3: Drinks & Notes */}
          <div className="details-col-right-wrapper">
            
            {/* Drinks Card */}
            <div className="details-col-card drinks-card-details">
              <div className="col-card-header">
                <Wine size={18} className="col-icon" />
                <h4 className="col-title">Bebidas</h4>
              </div>
              <div className="drinks-items-list">
                {details.drinks.map((drink, i) => (
                  <div key={i} className="drink-item-row">
                    <p className="drink-name">{drink.name}</p>
                    <span className="drink-qty-badge">{drink.badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Surprises & Notes Card */}
            <div className="details-col-card surprises-card-details">
              <div className="col-card-header">
                <Sparkles size={18} className="col-icon" />
                <h4 className="col-title">Surpresas & Notas</h4>
              </div>
              
              <div className="surprises-card-inner">
                <span className="surprise-box-label">SOLICITAÇÃO ESPECIAL</span>
                <p className="surprise-box-text">
                  "{details.specialRequest}"
                </p>
              </div>

              <div className="surprises-card-footer">
                <Gift size={18} />
                <span className="surprise-footer-text">{details.alertNote}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Timeline Section */}
        <div className="timeline-card">
          <h4 className="timeline-title">Linha do Tempo</h4>
          
          <div className="timeline-vertical-flow">
            <div className="timeline-connector-line"></div>
            
            {details.timeline.map((event, i) => (
              <div key={i} className="timeline-event-row">
                <div className="timeline-dot-indicator"></div>
                <div className="timeline-event-content">
                  <span className="timeline-event-time">{event.time}</span>
                  <p className="timeline-event-text">{event.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="dashboard-container" onClick={() => {
      setActiveDropdownTable(null);
      setActiveActionDropdownResId(null);
    }}>
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 99999 }} />

      {/* QUICK SEARCH FLOATING MODAL */}
      {showQuickSearch && (
        <div className="quick-search-modal-overlay" onClick={() => setShowQuickSearch(false)}>
          <div className="quick-search-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="quick-search-modal-title">Busca Rápida</h3>
            <form onSubmit={handleQuickSearchSubmit} className="quick-search-form">
              <input 
                type="text" 
                className="quick-search-modal-input" 
                placeholder="ID, nome ou CPF da reserva..." 
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                autoFocus
              />
              <div className="quick-search-modal-buttons">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowQuickSearch(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-search">
                  Buscar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        
        {/* Toggle Button */}
        <button 
          type="button" 
          className="sidebar-toggle-btn" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Minimizar Menu"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Brand/Header */}
        <div>
          <div className="sidebar-brand">
            <h1 className="brand-title">JrCoffee</h1>
            <p className="brand-subtitle">Reception Desk</p>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="sidebar-menu">
            <button 
              type="button" 
              className={`menu-item ${currentTab === 'checkin' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('checkin')}
              data-tooltip="Check-in"
            >
              <span className="menu-item-icon"><QrCode size={20} /></span>
              <span className="menu-item-text">Check-in</span>
            </button>

            <button 
              type="button" 
              className={`menu-item ${currentTab === 'floorplan' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('floorplan')}
              data-tooltip="Floor Plan"
            >
              <span className="menu-item-icon"><LayoutGrid size={20} /></span>
              <span className="menu-item-text">Floor Plan</span>
            </button>

            <button 
              type="button" 
              className={`menu-item ${currentTab === 'waitlist' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('waitlist')}
              data-tooltip="Waitlist"
            >
              <span className="menu-item-icon"><Hourglass size={20} /></span>
              <span className="menu-item-text">Waitlist</span>
            </button>

            <button 
              type="button" 
              className={`menu-item ${currentTab === 'receita' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('receita')}
              data-tooltip="Receita"
            >
              <span className="menu-item-icon"><DollarSign size={20} /></span>
              <span className="menu-item-text">Receita</span>
            </button>

            <button 
              type="button" 
              className={`menu-item ${currentTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('history')}
              data-tooltip="History"
            >
              <span className="menu-item-icon"><History size={20} /></span>
              <span className="menu-item-text">History</span>
            </button>

            <button 
              type="button" 
              className={`menu-item ${currentTab === 'menu' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('menu')}
              data-tooltip="Gestão do Menu"
            >
              <span className="menu-item-icon"><MenuIcon size={20} /></span>
              <span className="menu-item-text">Gestão do Menu</span>
            </button>
          </nav>
          
          {/* Quick Search Button in Sidebar */}
          <div className="sidebar-quick-search-wrapper" style={{ marginTop: '20px' }}>
            <button 
              type="button" 
              className="quick-search-btn"
              onClick={() => setShowQuickSearch(true)}
              data-tooltip="Quick Search"
            >
              <Search size={18} />
              <span className="quick-search-text">Quick Search</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer Items */}
      </aside>

      <main className="main-content">
        <header className="main-header">
          {/* ...header content removido para correção... */}
        </header>
        {/* Main Tab Render */}
        {renderTabContent()}
      </main>
    </div>
  );
}
