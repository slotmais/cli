import { useState, useEffect, useRef } from "react";

// ========== MOCK DATA ==========
const mockUsers = [
  { id: 1, nome: "Carlos Mendes", email: "admin@climasertao.com", senha: "admin123", nivel: "admin", avatar: "CM" },
  { id: 2, nome: "João Silva", email: "joao@climasertao.com", senha: "tec123", nivel: "tecnico", avatar: "JS", especialidade: "Ar-condicionado" },
  { id: 3, nome: "Pedro Santos", email: "pedro@climasertao.com", senha: "tec123", nivel: "tecnico", avatar: "PS", especialidade: "Elétrica" },
  { id: 4, nome: "Lucas Ferreira", email: "lucas@climasertao.com", senha: "tec123", nivel: "tecnico", avatar: "LF", especialidade: "Refrigeração" },
];

const mockClientes = [
  { id: 1, nome: "Supermercado Bom Preço", cpfCnpj: "12.345.678/0001-90", telefone: "(87) 99123-4567", endereco: "Rua das Flores, 123", bairro: "Centro", cidade: "Petrolina" },
  { id: 2, nome: "Maria José Costa", cpfCnpj: "123.456.789-00", telefone: "(87) 98765-4321", endereco: "Av. Principal, 456", bairro: "Jardim América", cidade: "Petrolina" },
  { id: 3, nome: "Clínica Saúde Total", cpfCnpj: "98.765.432/0001-10", telefone: "(87) 93456-7890", endereco: "Rua do Comércio, 789", bairro: "Centro", cidade: "Juazeiro" },
  { id: 4, nome: "Hotel Sertão Verde", cpfCnpj: "11.222.333/0001-44", telefone: "(87) 99887-6655", endereco: "Av. Beira Rio, 1000", bairro: "Beira Rio", cidade: "Petrolina" },
];

const mockProdutos = [
  { id: 1, marca: "Daikin", modelo: "Split Inverter", btus: 12000, custo: 1800, venda: 2800, estoque: 5, garantia: "12 meses" },
  { id: 2, marca: "Samsung", modelo: "Digital Inverter", btus: 18000, custo: 2200, venda: 3500, estoque: 3, garantia: "12 meses" },
  { id: 3, marca: "LG", modelo: "Dual Inverter", btus: 24000, custo: 2800, venda: 4200, estoque: 2, garantia: "12 meses" },
  { id: 4, marca: "Fujitsu", modelo: "Inverter Plus", btus: 9000, custo: 1600, venda: 2400, estoque: 8, garantia: "18 meses" },
];

const initialOS = [
  { id: 1, numero: "OS-001", clienteId: 1, clienteNome: "Supermercado Bom Preço", bairro: "Centro", tipoServico: "Manutenção preventiva", equipamento: "LG Dual Inverter 24000 BTUs", descricao: "Manutenção preventiva trimestral de 6 equipamentos", valorEstimado: 1200, valorFinal: null, prioridade: "Alta", status: "disponivel", criadoPor: 1, tecnicoId: null, tecnicoNome: null, dataCriacao: "2025-02-20T08:00:00", dataAssumida: null, dataFinalizada: null, lat: null, lng: null, relatorio: null, materiais: [], fotos: [], assinatura: false, log: [{ acao: "OS criada", usuario: "Carlos Mendes", data: "2025-02-20T08:00:00" }] },
  { id: 2, numero: "OS-002", clienteId: 2, clienteNome: "Maria José Costa", bairro: "Jardim América", tipoServico: "Instalação", equipamento: "Samsung Digital Inverter 18000 BTUs", descricao: "Instalação de ar-condicionado split no quarto principal", valorEstimado: 350, valorFinal: null, prioridade: "Média", status: "disponivel", criadoPor: 1, tecnicoId: null, tecnicoNome: null, dataCriacao: "2025-02-21T09:30:00", dataAssumida: null, dataFinalizada: null, lat: null, lng: null, relatorio: null, materiais: [], fotos: [], assinatura: false, log: [{ acao: "OS criada", usuario: "Carlos Mendes", data: "2025-02-21T09:30:00" }] },
  { id: 3, numero: "OS-003", clienteId: 3, clienteNome: "Clínica Saúde Total", bairro: "Centro", tipoServico: "Manutenção corretiva", equipamento: "Daikin Split 12000 BTUs", descricao: "Aparelho com ruído excessivo e baixo rendimento", valorEstimado: 450, valorFinal: 520, prioridade: "Urgente", status: "assumida", criadoPor: 1, tecnicoId: 2, tecnicoNome: "João Silva", dataCriacao: "2025-02-22T07:00:00", dataAssumida: "2025-02-22T07:45:00", dataFinalizada: null, lat: null, lng: null, relatorio: null, materiais: [], fotos: [], assinatura: false, log: [{ acao: "OS criada", usuario: "Carlos Mendes", data: "2025-02-22T07:00:00" }, { acao: "OS assumida", usuario: "João Silva", data: "2025-02-22T07:45:00" }] },
  { id: 4, numero: "OS-004", clienteId: 4, clienteNome: "Hotel Sertão Verde", bairro: "Beira Rio", tipoServico: "Higienização", equipamento: "12 unidades split variados", descricao: "Higienização completa de todos os quartos", valorEstimado: 2400, valorFinal: 2400, prioridade: "Média", status: "finalizada", criadoPor: 1, tecnicoId: 3, tecnicoNome: "Pedro Santos", dataCriacao: "2025-02-18T08:00:00", dataAssumida: "2025-02-18T09:00:00", dataFinalizada: "2025-02-19T17:00:00", lat: -9.3989, lng: -40.5009, relatorio: "Higienização realizada com produtos homologados. Todos os filtros limpos e substituídos onde necessário.", materiais: ["Produto higienizante - 2L", "Filtros - 4 unidades"], fotos: ["foto1.jpg", "foto2.jpg"], assinatura: true, log: [{ acao: "OS criada", usuario: "Carlos Mendes", data: "2025-02-18T08:00:00" }, { acao: "OS assumida", usuario: "Pedro Santos", data: "2025-02-18T09:00:00" }, { acao: "Status: Em execução", usuario: "Pedro Santos", data: "2025-02-18T10:00:00" }, { acao: "OS finalizada", usuario: "Pedro Santos", data: "2025-02-19T17:00:00" }] },
];

const financeiro = {
  receitas: [
    { id: 1, descricao: "OS-004 Hotel Sertão Verde", valor: 2400, data: "2025-02-19", tipo: "servico", status: "recebido" },
    { id: 2, descricao: "Venda Split Samsung 18000", valor: 3500, data: "2025-02-20", tipo: "venda", status: "recebido" },
    { id: 3, descricao: "OS-003 Clínica Saúde Total", valor: 520, data: "2025-02-22", tipo: "servico", status: "pendente" },
  ],
  despesas: [
    { id: 1, descricao: "Compra equipamentos Daikin", valor: 5400, data: "2025-02-15", tipo: "compra", status: "pago" },
    { id: 2, descricao: "Salário técnicos", valor: 8500, data: "2025-02-28", tipo: "salario", status: "pendente" },
    { id: 3, descricao: "Material elétrico", valor: 320, data: "2025-02-20", tipo: "material", status: "pago" },
  ]
};

// ========== ICONS ==========
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    dashboard: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    os: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    clientes: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    tecnicos: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/><path d="M14.5 13.5L17 16l-3 3-1.5-1.5"/></svg>,
    estoque: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
    financeiro: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    vendas: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    logout: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    location: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    clock: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    eye: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    alert: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    wrench: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    menu: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    x: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    car: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-1"/><circle cx="9" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>,
    chart: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    snowflake: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 7l-5-5-5 5"/><path d="M17 17l-5 5-5-5"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M7 7L2 12l5 5"/><path d="M17 7l5 5-5 5"/></svg>,
  };
  return icons[name] || null;
};

// ========== STATUS CONFIG ==========
const statusConfig = {
  disponivel: { label: "DISPONÍVEL", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", dot: "#f59e0b" },
  assumida: { label: "ASSUMIDA", color: "#10b981", bg: "rgba(16,185,129,0.15)", dot: "#10b981" },
  em_deslocamento: { label: "EM DESLOCAMENTO", color: "#3b82f6", bg: "rgba(59,130,246,0.15)", dot: "#3b82f6" },
  em_execucao: { label: "EM EXECUÇÃO", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", dot: "#8b5cf6" },
  aguardando_material: { label: "AGUARDANDO MATERIAL", color: "#f97316", bg: "rgba(249,115,22,0.15)", dot: "#f97316" },
  pausada: { label: "PAUSADA", color: "#6b7280", bg: "rgba(107,114,128,0.15)", dot: "#6b7280" },
  finalizada: { label: "FINALIZADA", color: "#06b6d4", bg: "rgba(6,182,212,0.15)", dot: "#06b6d4" },
  cancelada: { label: "CANCELADA", color: "#ef4444", bg: "rgba(239,68,68,0.15)", dot: "#ef4444" },
};

const prioridadeConfig = {
  "Baixa": { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  "Média": { color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  "Alta": { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  "Urgente": { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

// ========== STYLES ==========
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg-deep: #0a0e1a;
    --bg-card: #0f1629;
    --bg-card2: #151d35;
    --bg-input: #1a2240;
    --border: rgba(99,179,237,0.12);
    --border-bright: rgba(99,179,237,0.3);
    --primary: #1e90ff;
    --primary-dark: #1565c0;
    --accent: #00e676;
    --accent2: #00bcd4;
    --text: #e8f4fd;
    --text-muted: #7ba3c5;
    --text-dim: #3d5a7a;
    --danger: #ef4444;
    --warning: #f59e0b;
    --success: #10b981;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --shadow-glow: 0 0 20px rgba(30,144,255,0.15);
    --radius: 12px;
    --sidebar-width: 240px;
  }

  html, body, #root { height: 100%; }
  
  body {
    background: var(--bg-deep);
    color: var(--text);
    font-family: 'Exo 2', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg-deep); }
  ::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 2px; }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: var(--sidebar-width);
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    transition: transform 0.3s ease;
  }
  .sidebar.mobile-hidden { transform: translateX(-100%); }

  .sidebar-logo {
    padding: 20px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .logo-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--primary), var(--accent2));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .logo-text h2 {
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px; font-weight: 700;
    color: var(--text);
    letter-spacing: 1px;
    line-height: 1.1;
  }
  .logo-text span {
    font-size: 9px;
    color: var(--accent);
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 500;
  }

  .sidebar-nav { flex: 1; padding: 12px 8px; overflow-y: auto; }
  
  .nav-section-label {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 2px;
    color: var(--text-dim);
    text-transform: uppercase;
    padding: 12px 8px 6px;
  }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text-muted);
    font-weight: 500;
    font-size: 13px;
    margin-bottom: 2px;
    position: relative;
  }
  .nav-item:hover { background: rgba(30,144,255,0.08); color: var(--text); }
  .nav-item.active {
    background: rgba(30,144,255,0.15);
    color: var(--primary);
    border-right: 2px solid var(--primary);
  }
  .nav-item .badge {
    margin-left: auto;
    background: var(--danger);
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }

  .sidebar-user {
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .user-avatar {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--primary), var(--accent2));
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    font-size: 12px;
    flex-shrink: 0;
  }
  .user-info { flex: 1; overflow: hidden; }
  .user-info p { font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-info span { font-size: 10px; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; }
  .logout-btn { cursor: pointer; color: var(--text-dim); transition: color 0.2s; }
  .logout-btn:hover { color: var(--danger); }

  /* MAIN */
  .main { margin-left: var(--sidebar-width); flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  
  .topbar {
    height: 56px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center;
    padding: 0 24px;
    gap: 16px;
    flex-shrink: 0;
  }
  .topbar-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--text);
  }
  .topbar-sub { font-size: 11px; color: var(--text-muted); }
  .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
  
  .menu-toggle { display: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: background 0.2s; }
  .menu-toggle:hover { background: rgba(255,255,255,0.05); }

  .content { flex: 1; overflow-y: auto; padding: 24px; }

  /* CARDS */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
  }
  .card-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .card-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px; font-weight: 700;
    letter-spacing: 0.5px;
  }

  /* GRID */
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  
  /* STAT CARD */
  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
  }
  .stat-card:hover { border-color: var(--border-bright); transform: translateY(-2px); }
  .stat-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: var(--radius) var(--radius) 0 0;
  }
  .stat-card.blue::after { background: var(--primary); }
  .stat-card.green::after { background: var(--accent); }
  .stat-card.amber::after { background: var(--warning); }
  .stat-card.cyan::after { background: var(--accent2); }
  .stat-card.purple::after { background: #8b5cf6; }
  .stat-card.red::after { background: var(--danger); }
  .stat-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .stat-value { font-family: 'Rajdhani', sans-serif; font-size: 32px; font-weight: 700; line-height: 1.1; margin: 6px 0 4px; }
  .stat-sub { font-size: 11px; color: var(--text-dim); }
  .stat-icon { position: absolute; right: 16px; top: 16px; opacity: 0.15; }

  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px 18px;
    border-radius: 8px;
    font-family: 'Exo 2', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }
  .btn-primary { background: var(--primary); color: white; }
  .btn-primary:hover { background: #1a7de8; box-shadow: 0 0 16px rgba(30,144,255,0.4); }
  .btn-success { background: var(--success); color: white; }
  .btn-success:hover { background: #0da070; box-shadow: 0 0 16px rgba(16,185,129,0.4); }
  .btn-danger { background: var(--danger); color: white; }
  .btn-danger:hover { background: #dc2626; }
  .btn-warning { background: var(--warning); color: white; }
  .btn-warning:hover { background: #d97706; }
  .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border-bright); }
  .btn-outline:hover { background: rgba(255,255,255,0.05); border-color: var(--primary); color: var(--primary); }
  .btn-ghost { background: transparent; color: var(--text-muted); }
  .btn-ghost:hover { color: var(--text); background: rgba(255,255,255,0.05); }
  .btn-lg { padding: 13px 28px; font-size: 15px; font-weight: 700; border-radius: 10px; }
  .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 6px; }
  .btn-xl { padding: 16px 32px; font-size: 16px; font-weight: 700; border-radius: 12px; letter-spacing: 0.5px; }

  /* STATUS BADGE */
  .status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* TABLE */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead th {
    text-align: left;
    padding: 10px 14px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-dim);
    border-bottom: 1px solid var(--border);
  }
  tbody td {
    padding: 13px 14px;
    border-bottom: 1px solid rgba(99,179,237,0.05);
    font-size: 13px;
    vertical-align: middle;
  }
  tbody tr:hover td { background: rgba(30,144,255,0.03); }
  tbody tr:last-child td { border-bottom: none; }

  /* FORM */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
  .form-input, .form-select, .form-textarea {
    width: 100%;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-family: 'Exo 2', sans-serif;
    font-size: 13px;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(30,144,255,0.1);
  }
  .form-select option { background: var(--bg-card2); }
  .form-textarea { resize: vertical; min-height: 80px; }
  .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  /* OS CARD (mobile) */
  .os-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 12px;
    transition: border-color 0.2s;
    cursor: pointer;
  }
  .os-card:hover { border-color: var(--border-bright); }
  .os-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; gap: 8px; }
  .os-numero { font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 700; color: var(--text-muted); }
  .os-cliente { font-weight: 600; font-size: 15px; margin-bottom: 2px; }
  .os-tipo { font-size: 12px; color: var(--text-muted); }
  .os-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; flex-wrap: wrap; gap: 8px; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--bg-card);
    border: 1px solid var(--border-bright);
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.25s ease;
    box-shadow: var(--shadow), var(--shadow-glow);
  }
  .modal-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0;
    background: var(--bg-card);
    z-index: 1;
    border-radius: 16px 16px 0 0;
  }
  .modal-title { font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700; }
  .modal-body { padding: 24px; }
  .modal-footer { padding: 16px 24px 20px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }

  /* LOGIN */
  .login-page {
    min-height: 100vh;
    background: var(--bg-deep);
    display: flex; align-items: center; justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .login-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(30,144,255,0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 20%, rgba(0,230,118,0.05) 0%, transparent 50%);
  }
  .login-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .login-card {
    background: var(--bg-card);
    border: 1px solid var(--border-bright);
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
    box-shadow: var(--shadow), 0 0 60px rgba(30,144,255,0.1);
    animation: slideUp 0.4s ease;
  }
  .login-logo { text-align: center; margin-bottom: 32px; }
  .login-logo .logo-icon { width: 56px; height: 56px; margin: 0 auto 12px; border-radius: 16px; font-size: 24px; }
  .login-logo h1 { font-family: 'Rajdhani', sans-serif; font-size: 26px; font-weight: 700; letter-spacing: 2px; }
  .login-logo p { font-size: 11px; color: var(--accent); letter-spacing: 3px; text-transform: uppercase; }

  /* NOTIFICATION */
  .notification {
    position: fixed; top: 20px; right: 20px;
    background: var(--bg-card2);
    border: 1px solid var(--border-bright);
    border-radius: 10px;
    padding: 14px 18px;
    display: flex; align-items: center; gap: 10px;
    z-index: 9999;
    animation: slideInRight 0.3s ease;
    box-shadow: var(--shadow);
    min-width: 280px;
  }
  .notification.success { border-color: var(--success); }
  .notification.error { border-color: var(--danger); }
  .notification.warning { border-color: var(--warning); }

  /* TECH PANEL */
  .tech-header {
    background: linear-gradient(135deg, #0d1b3e, #0a2040);
    border-bottom: 2px solid var(--primary);
    padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  
  .assume-btn {
    background: linear-gradient(135deg, #00e676, #00bcd4);
    color: #0a0e1a;
    border: none;
    border-radius: 10px;
    padding: 14px 28px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
    width: 100%;
    justify-content: center;
  }
  .assume-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,230,118,0.4); }

  /* TABS */
  .tabs { display: flex; gap: 4px; background: var(--bg-input); border-radius: 10px; padding: 4px; }
  .tab { flex: 1; padding: 8px 12px; border-radius: 7px; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--text-muted); text-align: center; transition: all 0.2s; }
  .tab.active { background: var(--bg-card2); color: var(--primary); }

  /* PROGRESS BAR */
  .progress-bar { background: var(--bg-input); border-radius: 4px; height: 6px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }

  /* SECTION HEADER */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .section-title { font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }

  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 48px; color: var(--text-dim); }
  .empty-state svg { margin-bottom: 12px; opacity: 0.3; }
  .empty-state p { font-size: 14px; }

  /* DIVIDER */
  .divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }

  /* CHIP */
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }

  /* OVERLAY for mobile */
  .sidebar-overlay {
    display: none;
    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    z-index: 99;
  }
  .sidebar-overlay.visible { display: block; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .pulse { animation: pulse 2s infinite; }

  /* RESPONSIVE */
  @media (max-width: 1200px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 900px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.mobile-visible { transform: translateX(0); }
    .main { margin-left: 0; }
    .menu-toggle { display: flex; }
    .grid-3 { grid-template-columns: 1fr 1fr; }
    .form-grid-2 { grid-template-columns: 1fr; }
    .form-grid-3 { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .content { padding: 16px; }
    .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
    .modal { max-height: 95vh; margin: 0; border-radius: 16px 16px 0 0; align-self: flex-end; }
    .modal-overlay { align-items: flex-end; padding: 0; }
  }
`;

// ========== NOTIFICATION COMPONENT ==========
function Notification({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const colors = { success: "#10b981", error: "#ef4444", warning: "#f59e0b", info: "#1e90ff" };
  return (
    <div className={`notification ${type}`} style={{ borderColor: colors[type] }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[type], flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 500 }}>{msg}</span>
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}

// ========== STATUS BADGE ==========
function StatusBadge({ status }) {
  const s = statusConfig[status] || statusConfig.disponivel;
  return (
    <span className="status-badge" style={{ background: s.bg, color: s.color }}>
      <span className="status-dot" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

// ========== PRIORIDADE BADGE ==========
function PrioridadeBadge({ p }) {
  const c = prioridadeConfig[p] || prioridadeConfig["Média"];
  return <span className="chip" style={{ background: c.bg, color: c.color }}>{p}</span>;
}

// ========== FORMAT HELPERS ==========
const fmt = {
  money: v => `R$ ${Number(v||0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  date: d => d ? new Date(d).toLocaleDateString('pt-BR') : '—',
  datetime: d => d ? new Date(d).toLocaleString('pt-BR') : '—',
  diff: (a, b) => {
    if (!a || !b) return '—';
    const m = Math.round((new Date(b) - new Date(a)) / 60000);
    if (m < 60) return `${m}min`;
    const h = Math.floor(m / 60); const rm = m % 60;
    return `${h}h${rm > 0 ? rm + 'min' : ''}`;
  }
};

// ========== LOGIN PAGE ==========
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    const user = mockUsers.find(u => u.email === email && u.senha === senha);
    if (user) { onLogin(user); }
    else { setErr("E-mail ou senha incorretos."); }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-grid" />
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1e90ff, #00bcd4)" }}>
            <Icon name="snowflake" size={28} color="white" />
          </div>
          <h1 style={{ color: "var(--text)" }}>CLIMA SERTÃO</h1>
          <p>Gestão Técnica Inteligente</p>
        </div>

        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input className="form-input" type="email" placeholder="seu@email.com" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <div className="form-group">
          <label className="form-label">Senha</label>
          <input className="form-input" type="password" placeholder="••••••••" value={senha} onChange={e => { setSenha(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>

        {err && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{err}</div>}

        <button className="btn btn-primary btn-lg" style={{ width: "100%", marginBottom: 16 }} onClick={handleLogin}>
          ENTRAR NO SISTEMA
        </button>

        <div style={{ background: "var(--bg-input)", borderRadius: 8, padding: 12 }}>
          <p style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 8, fontWeight: 600 }}>CONTAS DE DEMONSTRAÇÃO:</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>👨‍💼 admin@climasertao.com / admin123</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>👷 joao@climasertao.com / tec123</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>👷 pedro@climasertao.com / tec123</p>
        </div>
      </div>
    </div>
  );
}

// ========== DASHBOARD ==========
function Dashboard({ os, user }) {
  const abertas = os.filter(o => o.status !== "finalizada" && o.status !== "cancelada").length;
  const disponiveis = os.filter(o => o.status === "disponivel").length;
  const assumidas = os.filter(o => o.status === "assumida" || o.status === "em_execucao" || o.status === "em_deslocamento" || o.status === "aguardando_material").length;
  const finalizadas = os.filter(o => o.status === "finalizada").length;
  const faturamento = os.filter(o => o.status === "finalizada").reduce((sum, o) => sum + (o.valorFinal || 0), 0);
  
  const tecnicoStats = mockUsers.filter(u => u.nivel === "tecnico").map(t => ({
    ...t,
    finalizadas: os.filter(o => o.tecnicoId === t.id && o.status === "finalizada").length,
    emCurso: os.filter(o => o.tecnicoId === t.id && o.status !== "finalizada" && o.status !== "cancelada" && o.status !== "disponivel").length,
    faturamento: os.filter(o => o.tecnicoId === t.id && o.status === "finalizada").reduce((s, o) => s + (o.valorFinal || 0), 0),
  }));

  const recentes = [...os].sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)).slice(0, 5);

  return (
    <div>
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="stat-card blue">
          <div className="stat-icon"><Icon name="os" size={48} /></div>
          <div className="stat-label">OS Abertas</div>
          <div className="stat-value" style={{ color: "var(--primary)" }}>{abertas}</div>
          <div className="stat-sub">em andamento</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon"><Icon name="alert" size={48} /></div>
          <div className="stat-label">Disponíveis</div>
          <div className="stat-value" style={{ color: "var(--warning)" }}>{disponiveis}</div>
          <div className="stat-sub">aguardando técnico</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><Icon name="wrench" size={48} /></div>
          <div className="stat-label">Em Execução</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>{assumidas}</div>
          <div className="stat-sub">com técnico</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon"><Icon name="check" size={48} /></div>
          <div className="stat-label">Finalizadas</div>
          <div className="stat-value" style={{ color: "var(--accent2)" }}>{finalizadas}</div>
          <div className="stat-sub">faturamento: {fmt.money(faturamento)}</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title"><Icon name="tecnicos" size={16} style={{ display: "inline" }} /> Performance dos Técnicos</span>
          </div>
          {tecnicoStats.map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div className="user-avatar">{t.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t.nome}</span>
                  <span style={{ fontSize: 12, color: "var(--accent)" }}>{t.finalizadas} OS</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(100, t.finalizadas * 25)}%`, background: "linear-gradient(90deg, var(--primary), var(--accent2))" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                  <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{t.especialidade}</span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{fmt.money(t.faturamento)}</span>
                </div>
              </div>
              {t.emCurso > 0 && <div className="badge" style={{ background: "var(--primary)", color: "white", padding: "2px 7px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{t.emCurso}</div>}
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">OS Recentes</span>
          </div>
          {recentes.map(o => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <StatusBadge status={o.status} />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.clienteNome}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{o.tipoServico}</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", flexShrink: 0 }}>{fmt.date(o.dataCriacao)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Resumo Financeiro do Mês</span>
        </div>
        <div className="grid-3">
          <div style={{ textAlign: "center", padding: "16px", background: "rgba(16,185,129,0.08)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.2)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>RECEITAS</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--success)" }}>
              {fmt.money(financeiro.receitas.filter(r => r.status === "recebido").reduce((s, r) => s + r.valor, 0))}
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "16px", background: "rgba(239,68,68,0.08)", borderRadius: 10, border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>DESPESAS</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--danger)" }}>
              {fmt.money(financeiro.despesas.filter(d => d.status === "pago").reduce((s, d) => s + d.valor, 0))}
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "16px", background: "rgba(30,144,255,0.08)", borderRadius: 10, border: "1px solid rgba(30,144,255,0.2)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>LUCRO LÍQUIDO</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--primary)" }}>
              {fmt.money(
                financeiro.receitas.filter(r => r.status === "recebido").reduce((s, r) => s + r.valor, 0) -
                financeiro.despesas.filter(d => d.status === "pago").reduce((s, d) => s + d.valor, 0)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== OS MODAL ==========
function OSModal({ onClose, onSave, clientes, tecnicos }) {
  const [form, setForm] = useState({
    clienteId: "", tipoServico: "Instalação", equipamento: "", descricao: "",
    valorEstimado: "", prioridade: "Média", direcionamento: "livre",
    tecnicoId: "", formaPagamento: "À vista"
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const selectedCliente = clientes.find(c => c.id === parseInt(form.clienteId));

  const handleSave = () => {
    if (!form.clienteId || !form.equipamento || !form.descricao) return;
    const cliente = clientes.find(c => c.id === parseInt(form.clienteId));
    onSave({
      clienteId: parseInt(form.clienteId),
      clienteNome: cliente?.nome || "",
      bairro: cliente?.bairro || "",
      tipoServico: form.tipoServico,
      equipamento: form.equipamento,
      descricao: form.descricao,
      valorEstimado: parseFloat(form.valorEstimado) || 0,
      prioridade: form.prioridade,
      tecnicoId: form.direcionamento === "tecnico" ? parseInt(form.tecnicoId) || null : null,
      tecnicoNome: form.direcionamento === "tecnico" ? (tecnicos.find(t => t.id === parseInt(form.tecnicoId))?.nome || null) : null,
      formaPagamento: form.formaPagamento,
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Nova Ordem de Serviço</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid-2">
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Cliente *</label>
              <select className="form-select" value={form.clienteId} onChange={e => set("clienteId", e.target.value)}>
                <option value="">Selecionar cliente...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            {selectedCliente && (
              <div style={{ gridColumn: "1 / -1", background: "var(--bg-input)", borderRadius: 8, padding: 12, fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 16 }}>
                <span>📍 {selectedCliente.endereco}, {selectedCliente.bairro}</span>
                <span>📞 {selectedCliente.telefone}</span>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Tipo de Serviço *</label>
              <select className="form-select" value={form.tipoServico} onChange={e => set("tipoServico", e.target.value)}>
                {["Instalação", "Manutenção preventiva", "Manutenção corretiva", "Higienização", "Serviço elétrico", "Refrigeração"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Prioridade</label>
              <select className="form-select" value={form.prioridade} onChange={e => set("prioridade", e.target.value)}>
                {["Baixa", "Média", "Alta", "Urgente"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Equipamento *</label>
            <input className="form-input" placeholder="Marca, modelo, BTUs..." value={form.equipamento} onChange={e => set("equipamento", e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição do Problema *</label>
            <textarea className="form-textarea" placeholder="Descreva detalhadamente..." value={form.descricao} onChange={e => set("descricao", e.target.value)} />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Valor Estimado (R$)</label>
              <input className="form-input" type="number" placeholder="0,00" value={form.valorEstimado} onChange={e => set("valorEstimado", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Forma de Pagamento</label>
              <select className="form-select" value={form.formaPagamento} onChange={e => set("formaPagamento", e.target.value)}>
                {["À vista", "PIX", "Cartão de crédito", "Parcelado", "Boleto"].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Direcionamento</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[["livre", "🔓 Livre"], ["tecnico", "👷 Técnico Específico"]].map(([v, l]) => (
                <button key={v} className={`btn ${form.direcionamento === v ? "btn-primary" : "btn-outline"} btn-sm`} onClick={() => set("direcionamento", v)}>{l}</button>
              ))}
            </div>
          </div>

          {form.direcionamento === "tecnico" && (
            <div className="form-group">
              <label className="form-label">Técnico Responsável</label>
              <select className="form-select" value={form.tecnicoId} onChange={e => set("tecnicoId", e.target.value)}>
                <option value="">Selecionar técnico...</option>
                {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome} — {t.especialidade}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!form.clienteId || !form.equipamento || !form.descricao}>
            <Icon name="plus" size={14} /> Criar OS
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== OS DETAIL MODAL ==========
function OSDetailModal({ os, user, onClose, onUpdate }) {
  const [tab, setTab] = useState("info");
  const [relatorio, setRelatorio] = useState(os.relatorio || "");
  const [novoMaterial, setNovoMaterial] = useState("");
  const [valorFinal, setValorFinal] = useState(os.valorFinal || "");
  const [capturandoGPS, setCapturandoGPS] = useState(false);

  const isTecnico = user.nivel === "tecnico";
  const isOwner = os.tecnicoId === user.id;
  const canEdit = !isTecnico || isOwner;

  const statusOptions = [
    { v: "em_deslocamento", l: "🚗 Em deslocamento" },
    { v: "em_execucao", l: "🔧 Em execução" },
    { v: "aguardando_material", l: "⏳ Aguardando material" },
    { v: "pausada", l: "⏸ Pausada" },
  ];

  const handleStatusChange = (newStatus) => {
    onUpdate(os.id, { status: newStatus }, `Status: ${statusConfig[newStatus]?.label}`);
  };

  const handleFinalizar = () => {
    if (!relatorio) { alert("Relatório técnico é obrigatório!"); return; }
    setCapturandoGPS(true);

    const doFinalizar = (lat, lng) => {
      setCapturandoGPS(false);
      onUpdate(os.id, {
        status: "finalizada",
        relatorio,
        valorFinal: parseFloat(valorFinal) || os.valorEstimado,
        lat, lng,
        dataFinalizada: new Date().toISOString(),
      }, "OS finalizada");
      onClose();
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => doFinalizar(pos.coords.latitude, pos.coords.longitude),
        () => doFinalizar(null, null),
        { timeout: 5000 }
      );
    } else { doFinalizar(null, null); }
  };

  const addMaterial = () => {
    if (!novoMaterial) return;
    onUpdate(os.id, { materiais: [...os.materiais, novoMaterial] }, null, true);
    setNovoMaterial("");
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>{os.numero}</div>
            <span className="modal-title">{os.clienteNome}</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <StatusBadge status={os.status} />
            <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={16} /></button>
          </div>
        </div>
        <div className="modal-body" style={{ padding: "16px 24px" }}>
          <div className="tabs" style={{ marginBottom: 20 }}>
            {[["info", "Detalhes"], ["status", "Status"], ["execucao", "Execução"], ["log", "Histórico"]].map(([v, l]) => (
              <div key={v} className={`tab ${tab === v ? "active" : ""}`} onClick={() => setTab(v)}>{l}</div>
            ))}
          </div>

          {tab === "info" && (
            <div>
              <div className="form-grid-2">
                <div>
                  <div className="form-label">Cliente</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{os.clienteNome}</div>
                </div>
                <div>
                  <div className="form-label">Prioridade</div>
                  <div style={{ marginBottom: 12 }}><PrioridadeBadge p={os.prioridade} /></div>
                </div>
                <div>
                  <div className="form-label">Tipo de Serviço</div>
                  <div style={{ fontSize: 13, marginBottom: 12 }}>{os.tipoServico}</div>
                </div>
                <div>
                  <div className="form-label">Equipamento</div>
                  <div style={{ fontSize: 13, marginBottom: 12 }}>{os.equipamento}</div>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <div className="form-label">Descrição</div>
                  <div style={{ fontSize: 13, marginBottom: 12, color: "var(--text-muted)" }}>{os.descricao}</div>
                </div>
                <div>
                  <div className="form-label">Valor Estimado</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)", marginBottom: 12 }}>{fmt.money(os.valorEstimado)}</div>
                </div>
                {os.valorFinal && <div>
                  <div className="form-label">Valor Final</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)", marginBottom: 12 }}>{fmt.money(os.valorFinal)}</div>
                </div>}
                <div>
                  <div className="form-label">Criado em</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>{fmt.datetime(os.dataCriacao)}</div>
                </div>
                {os.tecnicoNome && <div>
                  <div className="form-label">Técnico Responsável</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", marginBottom: 12 }}>👷 {os.tecnicoNome}</div>
                </div>}
                {os.dataAssumida && <div>
                  <div className="form-label">Tempo até Aceite</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{fmt.diff(os.dataCriacao, os.dataAssumida)}</div>
                </div>}
                {os.dataFinalizada && <div>
                  <div className="form-label">Tempo Total</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{fmt.diff(os.dataCriacao, os.dataFinalizada)}</div>
                </div>}
              </div>
              {os.lat && os.lng && (
                <div style={{ marginTop: 12, padding: 12, background: "rgba(30,144,255,0.08)", borderRadius: 10, border: "1px solid rgba(30,144,255,0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Icon name="location" size={16} color="var(--primary)" />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>Local de Finalização</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                    📍 Lat: {os.lat.toFixed(6)}, Lng: {os.lng.toFixed(6)}
                  </div>
                  <a href={`https://maps.google.com/?q=${os.lat},${os.lng}`} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "var(--primary)", color: "white", borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                    <Icon name="location" size={12} /> Ver no Google Maps
                  </a>
                </div>
              )}
            </div>
          )}

          {tab === "status" && canEdit && os.status !== "finalizada" && os.status !== "cancelada" && (
            <div>
              <div className="form-label" style={{ marginBottom: 12 }}>Atualizar Status da OS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {statusOptions.map(s => (
                  <button key={s.v} className={`btn ${os.status === s.v ? "btn-primary" : "btn-outline"}`} onClick={() => handleStatusChange(s.v)}>
                    {s.l} {os.status === s.v && "✓"}
                  </button>
                ))}
              </div>
            </div>
          )}
          {tab === "status" && (os.status === "finalizada" || os.status === "cancelada" || !canEdit) && (
            <div className="empty-state"><p>Sem ações disponíveis para este status.</p></div>
          )}

          {tab === "execucao" && (
            <div>
              {canEdit && os.status !== "finalizada" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Relatório Técnico *</label>
                    <textarea className="form-textarea" placeholder="Descreva detalhadamente o serviço realizado..." value={relatorio} onChange={e => setRelatorio(e.target.value)} rows={5} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Valor Final (R$)</label>
                    <input className="form-input" type="number" value={valorFinal} onChange={e => setValorFinal(e.target.value)} placeholder={os.valorEstimado} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Materiais Utilizados</label>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input className="form-input" value={novoMaterial} onChange={e => setNovoMaterial(e.target.value)} placeholder="Ex: Gás R32 - 1kg" onKeyDown={e => e.key === "Enter" && addMaterial()} />
                      <button className="btn btn-outline btn-sm" onClick={addMaterial}><Icon name="plus" size={14} /></button>
                    </div>
                    {os.materiais.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {os.materiais.map((m, i) => (
                          <span key={i} style={{ background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", fontSize: 12 }}>📦 {m}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {capturandoGPS ? (
                    <div style={{ textAlign: "center", padding: 20, color: "var(--accent)" }}>
                      <div className="pulse">📍 Capturando localização GPS...</div>
                    </div>
                  ) : (
                    <button className="btn btn-success btn-lg" style={{ width: "100%" }} onClick={handleFinalizar} disabled={os.status === "disponivel"}>
                      <Icon name="check" size={18} /> FINALIZAR SERVIÇO
                    </button>
                  )}
                  {os.status === "disponivel" && <p style={{ textAlign: "center", fontSize: 12, color: "var(--warning)", marginTop: 8 }}>⚠️ Você precisa assumir a OS antes de finalizar.</p>}
                </>
              )}
              {os.relatorio && (
                <div style={{ marginTop: 16, padding: 14, background: "rgba(16,185,129,0.08)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--success)", marginBottom: 8 }}>✅ RELATÓRIO FINALIZADO</div>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{os.relatorio}</p>
                </div>
              )}
            </div>
          )}

          {tab === "log" && (
            <div>
              <div className="form-label" style={{ marginBottom: 12 }}>Histórico de Ações</div>
              {os.log.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{l.acao}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{l.usuario} • {fmt.datetime(l.data)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== OS PAGE (ADMIN) ==========
function OSPage({ os, setOS, user, showNotif }) {
  const [showNew, setShowNew] = useState(false);
  const [detail, setDetail] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const tecnicos = mockUsers.filter(u => u.nivel === "tecnico");

  const filtered = os.filter(o => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.clienteNome.toLowerCase().includes(search.toLowerCase()) && !o.numero.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreate = (data) => {
    const id = Math.max(...os.map(o => o.id)) + 1;
    const numero = `OS-${String(id).padStart(3, "0")}`;
    const now = new Date().toISOString();
    const newOS = {
      id, numero,
      ...data,
      status: data.tecnicoId ? "assumida" : "disponivel",
      criadoPor: user.id,
      dataCriacao: now,
      dataAssumida: data.tecnicoId ? now : null,
      dataFinalizada: null, lat: null, lng: null,
      relatorio: null, materiais: [], fotos: [], assinatura: false,
      valorFinal: null,
      log: [{ acao: "OS criada", usuario: user.nome, data: now }],
    };
    if (data.tecnicoId) newOS.log.push({ acao: "OS direcionada para técnico", usuario: user.nome, data: now });
    setOS(prev => [newOS, ...prev]);
    setShowNew(false);
    showNotif(`${numero} criada com sucesso!`, "success");
  };

  const handleUpdate = (id, updates, logMsg, silent) => {
    setOS(prev => prev.map(o => {
      if (o.id !== id) return o;
      const updated = { ...o, ...updates };
      if (logMsg) updated.log = [...(o.log || []), { acao: logMsg, usuario: user.nome, data: new Date().toISOString() }];
      return updated;
    }));
    if (!silent) setDetail(prev => prev ? { ...prev, ...updates } : null);
    if (logMsg && !silent) showNotif("OS atualizada!", "success");
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Ordens de Serviço</h2>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          <Icon name="plus" size={14} /> Nova OS
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input className="form-input" placeholder="🔍 Buscar cliente, número..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 260 }} />
        <div className="tabs" style={{ flex: 1 }}>
          {[["all", "Todas"], ["disponivel", "Disponíveis"], ["assumida", "Assumidas"], ["em_execucao", "Em Execução"], ["finalizada", "Finalizadas"]].map(([v, l]) => (
            <div key={v} className={`tab ${filter === v ? "active" : ""}`} onClick={() => setFilter(v)}>
              {l} <span style={{ opacity: 0.6 }}>({os.filter(o => v === "all" ? true : o.status === v).length})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Técnico</th>
                <th>Prioridade</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--text-dim)", padding: 32 }}>Nenhuma OS encontrada.</td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} onClick={() => setDetail(o)} style={{ cursor: "pointer" }}>
                  <td><span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, color: "var(--primary)" }}>{o.numero}</span></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.clienteNome}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{o.bairro}</div>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{o.tipoServico}</td>
                  <td>
                    {o.tecnicoNome ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="user-avatar" style={{ width: 24, height: 24, fontSize: 10 }}>
                          {mockUsers.find(u => u.id === o.tecnicoId)?.avatar || "?"}
                        </div>
                        <span style={{ fontSize: 12 }}>{o.tecnicoNome}</span>
                      </div>
                    ) : <span style={{ color: "var(--text-dim)", fontSize: 12 }}>—</span>}
                  </td>
                  <td><PrioridadeBadge p={o.prioridade} /></td>
                  <td style={{ fontWeight: 600, color: "var(--accent)" }}>{fmt.money(o.valorEstimado)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td style={{ fontSize: 11, color: "var(--text-dim)" }}>{fmt.date(o.dataCriacao)}</td>
                  <td><button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setDetail(o); }}><Icon name="eye" size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && <OSModal onClose={() => setShowNew(false)} onSave={handleCreate} clientes={mockClientes} tecnicos={tecnicos} />}
      {detail && <OSDetailModal os={detail} user={user} onClose={() => setDetail(null)} onUpdate={handleUpdate} />}
    </div>
  );
}

// ========== TECH PANEL ==========
function TechPanel({ user, os, setOS, showNotif }) {
  const [tab, setTab] = useState("disponiveis");
  const [detail, setDetail] = useState(null);

  const disponiveis = os.filter(o => o.status === "disponivel" || (o.status === "disponivel" && o.tecnicoId === user.id));
  const minhasOS = os.filter(o => o.tecnicoId === user.id && o.status !== "finalizada" && o.status !== "cancelada");
  const finalizadas = os.filter(o => o.tecnicoId === user.id && o.status === "finalizada");

  const handleAssume = (osId) => {
    const now = new Date().toISOString();
    setOS(prev => prev.map(o => {
      if (o.id !== osId || o.status !== "disponivel") return o;
      return {
        ...o,
        status: "assumida",
        tecnicoId: user.id,
        tecnicoNome: user.nome,
        dataAssumida: now,
        log: [...(o.log || []), { acao: "OS assumida", usuario: user.nome, data: now }]
      };
    }));
    showNotif("Serviço assumido com sucesso!", "success");
    setTab("minhas");
  };

  const handleUpdate = (id, updates, logMsg, silent) => {
    setOS(prev => prev.map(o => {
      if (o.id !== id) return o;
      const updated = { ...o, ...updates };
      if (logMsg) updated.log = [...(o.log || []), { acao: logMsg, usuario: user.nome, data: new Date().toISOString() }];
      return updated;
    }));
    if (!silent) setDetail(prev => prev ? { ...prev, ...updates } : null);
    if (logMsg && !silent) showNotif("OS atualizada!", "success");
  };

  const OSCard = ({ o, showAssume }) => (
    <div className="os-card" onClick={() => setDetail(o)}>
      <div className="os-card-header">
        <div>
          <div className="os-numero">{o.numero}</div>
          <div className="os-cliente">{o.clienteNome}</div>
          <div className="os-tipo">{o.tipoServico} • {o.bairro}</div>
        </div>
        <PrioridadeBadge p={o.prioridade} />
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {o.descricao}
      </div>
      <div className="os-card-footer">
        <StatusBadge status={o.status} />
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{fmt.money(o.valorEstimado)}</span>
      </div>
      {showAssume && (
        <button className="assume-btn" style={{ marginTop: 12 }}
          onClick={e => { e.stopPropagation(); handleAssume(o.id); }}>
          <Icon name="check" size={18} /> ASSUMIR SERVIÇO
        </button>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: 20, background: "linear-gradient(135deg, rgba(30,144,255,0.15), rgba(0,188,212,0.1))", borderRadius: var => "var(--radius)", border: "1px solid var(--border-bright)", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <div className="user-avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{user.avatar}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Olá, {user.nome.split(" ")[0]}! 👷</div>
          <div style={{ fontSize: 12, color: "var(--accent)" }}>{user.especialidade} • {minhasOS.length} OS em andamento</div>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 16 }}>
        <div className={`tab ${tab === "disponiveis" ? "active" : ""}`} onClick={() => setTab("disponiveis")}>
          Disponíveis {disponiveis.length > 0 && <span className="badge" style={{ background: "var(--warning)" }}>{disponiveis.length}</span>}
        </div>
        <div className={`tab ${tab === "minhas" ? "active" : ""}`} onClick={() => setTab("minhas")}>
          Minhas OS {minhasOS.length > 0 && <span className="badge" style={{ background: "var(--primary)" }}>{minhasOS.length}</span>}
        </div>
        <div className={`tab ${tab === "historico" ? "active" : ""}`} onClick={() => setTab("historico")}>
          Histórico
        </div>
      </div>

      {tab === "disponiveis" && (
        disponiveis.length === 0 ?
          <div className="empty-state"><Icon name="check" size={40} color="var(--text-dim)" /><p>Nenhum serviço disponível no momento.</p></div> :
          disponiveis.map(o => <OSCard key={o.id} o={o} showAssume={true} />)
      )}
      {tab === "minhas" && (
        minhasOS.length === 0 ?
          <div className="empty-state"><Icon name="wrench" size={40} color="var(--text-dim)" /><p>Nenhum serviço em andamento.</p></div> :
          minhasOS.map(o => <OSCard key={o.id} o={o} showAssume={false} />)
      )}
      {tab === "historico" && (
        finalizadas.length === 0 ?
          <div className="empty-state"><p>Nenhum serviço finalizado ainda.</p></div> :
          finalizadas.map(o => <OSCard key={o.id} o={o} showAssume={false} />)
      )}

      {detail && <OSDetailModal os={detail} user={user} onClose={() => setDetail(null)} onUpdate={handleUpdate} />}
    </div>
  );
}

// ========== CLIENTES PAGE ==========
function ClientesPage() {
  const [clientes] = useState(mockClientes);
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Clientes</h2>
        <button className="btn btn-primary"><Icon name="plus" size={14} /> Novo Cliente</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nome</th><th>CPF/CNPJ</th><th>Telefone</th><th>Endereço</th><th>Cidade</th></tr></thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.nome}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{c.cpfCnpj}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{c.telefone}</td>
                  <td style={{ fontSize: 12 }}>{c.endereco}, {c.bairro}</td>
                  <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.cidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ========== ESTOQUE PAGE ==========
function EstoquePage() {
  const [produtos, setProdutos] = useState(mockProdutos);
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Estoque de Produtos</h2>
        <button className="btn btn-primary"><Icon name="plus" size={14} /> Novo Produto</button>
      </div>
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="stat-card blue">
          <div className="stat-label">Total Produtos</div>
          <div className="stat-value" style={{ color: "var(--primary)" }}>{produtos.length}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Total em Estoque</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>{produtos.reduce((s, p) => s + p.estoque, 0)}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Estoque Baixo</div>
          <div className="stat-value" style={{ color: "var(--warning)" }}>{produtos.filter(p => p.estoque <= 2).length}</div>
          <div className="stat-sub">≤ 2 unidades</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-label">Valor Total</div>
          <div className="stat-value" style={{ color: "var(--accent2)", fontSize: 22 }}>{fmt.money(produtos.reduce((s, p) => s + p.venda * p.estoque, 0))}</div>
        </div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Produto</th><th>BTUs</th><th>Custo</th><th>Venda</th><th>Margem</th><th>Estoque</th><th>Garantia</th></tr></thead>
            <tbody>
              {produtos.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.marca}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.modelo}</div>
                  </td>
                  <td style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600 }}>{p.btus.toLocaleString()} BTUs</td>
                  <td style={{ color: "var(--danger)" }}>{fmt.money(p.custo)}</td>
                  <td style={{ color: "var(--success)", fontWeight: 600 }}>{fmt.money(p.venda)}</td>
                  <td>
                    <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                      {(((p.venda - p.custo) / p.venda) * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td>
                    <span style={{ color: p.estoque <= 2 ? "var(--danger)" : p.estoque <= 5 ? "var(--warning)" : "var(--success)", fontWeight: 700, fontSize: 16, fontFamily: "'Rajdhani',sans-serif" }}>
                      {p.estoque}
                    </span>
                    {p.estoque <= 2 && <span style={{ marginLeft: 6, fontSize: 10, color: "var(--danger)" }}>⚠️ Baixo</span>}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.garantia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ========== FINANCEIRO PAGE ==========
function FinanceiroPage() {
  const [tab, setTab] = useState("receitas");
  const totalReceitas = financeiro.receitas.reduce((s, r) => s + r.valor, 0);
  const totalDespesas = financeiro.despesas.reduce((s, d) => s + d.valor, 0);
  const lucro = totalReceitas - totalDespesas;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Financeiro</h2>
        <button className="btn btn-primary"><Icon name="plus" size={14} /> Novo Lançamento</button>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="stat-card green">
          <div className="stat-label">Receitas</div>
          <div className="stat-value" style={{ color: "var(--success)", fontSize: 24 }}>{fmt.money(totalReceitas)}</div>
          <div className="stat-sub">{financeiro.receitas.filter(r => r.status === "recebido").length} recebido(s)</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Despesas</div>
          <div className="stat-value" style={{ color: "var(--danger)", fontSize: 24 }}>{fmt.money(totalDespesas)}</div>
          <div className="stat-sub">{financeiro.despesas.filter(d => d.status === "pago").length} pago(s)</div>
        </div>
        <div className={`stat-card ${lucro >= 0 ? "blue" : "red"}`}>
          <div className="stat-label">Lucro Líquido</div>
          <div className="stat-value" style={{ color: lucro >= 0 ? "var(--primary)" : "var(--danger)", fontSize: 24 }}>{fmt.money(lucro)}</div>
          <div className="stat-sub">saldo do período</div>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 16 }}>
        <div className={`tab ${tab === "receitas" ? "active" : ""}`} onClick={() => setTab("receitas")}>Receitas</div>
        <div className={`tab ${tab === "despesas" ? "active" : ""}`} onClick={() => setTab("despesas")}>Despesas</div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Descrição</th><th>Tipo</th><th>Valor</th><th>Data</th><th>Status</th></tr></thead>
            <tbody>
              {(tab === "receitas" ? financeiro.receitas : financeiro.despesas).map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.descricao}</td>
                  <td><span className="chip" style={{ background: "rgba(30,144,255,0.1)", color: "var(--primary)" }}>{r.tipo}</span></td>
                  <td style={{ fontWeight: 700, color: tab === "receitas" ? "var(--success)" : "var(--danger)" }}>{fmt.money(r.valor)}</td>
                  <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{fmt.date(r.data)}</td>
                  <td>
                    <span style={{ color: (r.status === "recebido" || r.status === "pago") ? "var(--success)" : "var(--warning)", fontSize: 12, fontWeight: 600 }}>
                      {r.status === "recebido" ? "✅ Recebido" : r.status === "pago" ? "✅ Pago" : "⏳ Pendente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ========== TECNICOS PAGE ==========
function TecnicosPage({ os }) {
  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Equipe Técnica</h2>
        <button className="btn btn-primary"><Icon name="plus" size={14} /> Novo Técnico</button>
      </div>
      <div className="grid-3">
        {mockUsers.filter(u => u.nivel === "tecnico").map(t => {
          const finalizadas = os.filter(o => o.tecnicoId === t.id && o.status === "finalizada");
          const emCurso = os.filter(o => o.tecnicoId === t.id && o.status !== "finalizada" && o.status !== "cancelada" && o.status !== "disponivel");
          const fat = finalizadas.reduce((s, o) => s + (o.valorFinal || 0), 0);
          return (
            <div key={t.id} className="card" style={{ textAlign: "center" }}>
              <div className="user-avatar" style={{ width: 56, height: 56, margin: "0 auto 12px", fontSize: 20, borderRadius: 16 }}>{t.avatar}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{t.nome}</div>
              <div style={{ fontSize: 12, color: "var(--accent)", marginBottom: 16 }}>{t.especialidade}</div>
              <hr className="divider" />
              <div className="grid-2" style={{ textAlign: "center", gap: 10 }}>
                <div style={{ padding: 10, background: "var(--bg-input)", borderRadius: 8 }}>
                  <div style={{ fontSize: 20, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, color: "var(--success)" }}>{finalizadas.length}</div>
                  <div style={{ fontSize: 10, color: "var(--text-dim)" }}>Finalizadas</div>
                </div>
                <div style={{ padding: 10, background: "var(--bg-input)", borderRadius: 8 }}>
                  <div style={{ fontSize: 20, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, color: "var(--primary)" }}>{emCurso.length}</div>
                  <div style={{ fontSize: 10, color: "var(--text-dim)" }}>Em Curso</div>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: "10px", background: "rgba(0,230,118,0.08)", borderRadius: 8, border: "1px solid rgba(0,230,118,0.15)" }}>
                <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 2 }}>FATURAMENTO</div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>{fmt.money(fat)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========== MAIN APP ==========
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [os, setOS] = useState(initialOS);
  const [notif, setNotif] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showNotif = (msg, type = "info") => setNotif({ msg, type, key: Date.now() });

  if (!user) return (
    <>
      <style>{styles}</style>
      <LoginPage onLogin={u => { setUser(u); setPage(u.nivel === "tecnico" ? "tecnico" : "dashboard"); }} />
    </>
  );

  const isAdmin = user.nivel === "admin";
  const dispOSCount = os.filter(o => o.status === "disponivel").length;

  const adminNav = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "os", icon: "os", label: "Ordens de Serviço", badge: dispOSCount > 0 ? dispOSCount : null },
    { id: "clientes", icon: "clientes", label: "Clientes" },
    { id: "tecnicos", icon: "tecnicos", label: "Técnicos" },
    { id: "estoque", icon: "estoque", label: "Estoque" },
    { id: "financeiro", icon: "financeiro", label: "Financeiro" },
  ];

  const pageTitle = {
    dashboard: "Dashboard", os: "Ordens de Serviço", clientes: "Clientes",
    tecnicos: "Técnicos", estoque: "Estoque", financeiro: "Financeiro", tecnico: "Painel do Técnico"
  };

  const renderPage = () => {
    if (!isAdmin) return <TechPanel user={user} os={os} setOS={setOS} showNotif={showNotif} />;
    switch (page) {
      case "dashboard": return <Dashboard os={os} user={user} />;
      case "os": return <OSPage os={os} setOS={setOS} user={user} showNotif={showNotif} />;
      case "clientes": return <ClientesPage />;
      case "tecnicos": return <TecnicosPage os={os} />;
      case "estoque": return <EstoquePage />;
      case "financeiro": return <FinanceiroPage />;
      default: return <Dashboard os={os} user={user} />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      {notif && <Notification key={notif.key} msg={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}

      <div className="app">
        <div className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`} onClick={() => setSidebarOpen(false)} />

        <aside className={`sidebar ${sidebarOpen ? "mobile-visible" : ""}`}>
          <div className="sidebar-logo">
            <div className="logo-icon"><Icon name="snowflake" size={20} color="white" /></div>
            <div className="logo-text">
              <h2>CLIMA SERTÃO</h2>
              <span>Gestão Técnica</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {isAdmin ? (
              <>
                <div className="nav-section-label">Principal</div>
                {adminNav.map(n => (
                  <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => { setPage(n.id); setSidebarOpen(false); }}>
                    <Icon name={n.icon} size={16} />
                    {n.label}
                    {n.badge && <span className="badge">{n.badge}</span>}
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="nav-section-label">Técnico</div>
                <div className={`nav-item active`}>
                  <Icon name="wrench" size={16} />
                  Meus Serviços
                </div>
              </>
            )}
          </nav>

          <div className="sidebar-user">
            <div className="user-avatar">{user.avatar}</div>
            <div className="user-info">
              <p>{user.nome}</p>
              <span>{user.nivel === "admin" ? "Administrador" : "Técnico"}</span>
            </div>
            <div className="logout-btn" onClick={() => setUser(null)} title="Sair">
              <Icon name="logout" size={16} />
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Icon name="menu" size={20} />
            </button>
            <div>
              <div className="topbar-title">{pageTitle[page] || "CLIMA SERTÃO"}</div>
              <div className="topbar-sub">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div className="topbar-right">
              {dispOSCount > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "6px 10px" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--warning)" }} className="pulse" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--warning)" }}>{dispOSCount} OS aguardando</span>
                </div>
              )}
              <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12, cursor: "default" }}>{user.avatar}</div>
            </div>
          </div>

          <div className="content">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}
