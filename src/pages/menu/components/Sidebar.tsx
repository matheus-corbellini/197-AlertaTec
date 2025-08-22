"use client";

import Button from "../../../components/Button/Button";
import type { SidebarProps } from "../../../types/Contract";
import "./Sidebar.css";

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "contracts", label: "Contratos", icon: "📄" },
    { id: "new-contract", label: "Novo Contrato", icon: "➕" },
    { id: "clients", label: "Clientes", icon: "👥" },
    { id: "quick-proposal", label: "Propostas Rápidas", icon: "🚀" },
    { id: "reports", label: "Relatórios", icon: "📈" },
    { id: "settings", label: "Configurações", icon: "⚙️" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">💼</span>
          <span className="logo-text">SalesSystem</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="transparent"
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-profile">
          <div className="sidebar-user-avatar">V</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Vendedor</span>
            <span className="sidebar-user-role">Sales Rep</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
