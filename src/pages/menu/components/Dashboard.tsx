import Button from "../../../components/Button/Button";
import Card from "../../../components/Card/Card";
import type { DashboardProps } from "../../../types/Contract";
import "./Dashboard.css";

export default function Dashboard({ contracts }: DashboardProps) {
  const totalValue = contracts.reduce(
    (sum, contract) => sum + contract.value,
    0
  );
  const totalCommission = contracts.reduce(
    (sum, contract) => sum + contract.commission,
    0
  );
  const activeContracts = contracts.filter((c) => c.status === "Ativo").length;
  const pendingContracts = contracts.filter(
    (c) => c.status === "Pendente"
  ).length;

  const recentContracts = contracts.slice(-3).reverse();

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Valor Total</h3>
            <p className="stat-value">R$ {totalValue.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <h3>Comissões</h3>
            <p className="stat-value">R$ {totalCommission.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Contratos Ativos</h3>
            <p className="stat-value">{activeContracts}</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pendentes</h3>
            <p className="stat-value">{pendingContracts}</p>
          </div>
        </Card>
      </div>

      <div className="dashboard-sections">
        <Card className="recent-contracts">
          <h2>Contratos Recentes</h2>
          <div className="contracts-list">
            {recentContracts.map((contract) => (
              <Card key={contract.id} className="contract-item">
                <div className="contract-info">
                  <h4>{contract.clientName}</h4>
                  <p>{contract.product}</p>
                </div>
                <div className="contract-value">
                  <span className="value">
                    R$ {contract.value.toLocaleString()}
                  </span>
                  <span
                    className={`status status-${contract.status.toLowerCase()}`}
                  >
                    {contract.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="quick-actions">
          <h2>Ações Rápidas</h2>
          <div className="actions-grid">
            <Button variant="transparent" className="action-btn">
              <span className="action-icon">📄</span>
              <span>Novo Contrato</span>
            </Button>
            <Button variant="transparent" className="action-btn">
              <span className="action-icon">📊</span>
              <span>Relatórios</span>
            </Button>
            <Button variant="transparent" className="action-btn">
              <span className="action-icon">👥</span>
              <span>Clientes</span>
            </Button>
            <Button variant="transparent" className="action-btn">
              <span className="action-icon">⚙️</span>
              <span>Configurações</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
