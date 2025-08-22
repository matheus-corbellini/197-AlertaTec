import { useState, useEffect } from "react";
import {
  calculateMonthlyGeneration,
  calculateTotalSystemValue,
  calculateMonthlySavings,
  calculatePaybackPeriod,
} from "../../../../utils/solarCalculation";
import type {
  QuickProposalFormData,
  ProposalCalculations,
  QuickProposalFormProps,
} from "../../../../types/QuickProposal";
import type { Client } from "../../../../types/Client";
import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Input/Input";
import { clientService } from "../../../../services/clientServices";
import {
  HiUser,
  HiLightningBolt,
  HiSun,
  HiCurrencyDollar,
  HiCalculator,
} from "react-icons/hi";
import "./QuickProposalForm.css";

export default function QuickProposalForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: QuickProposalFormProps) {
  const [formData, setFormData] = useState<QuickProposalFormData>({
    clientId: "",
    monthlyConsumption: 0,
    systemPower: 0,
    energyTariff: 0.85, // Valor padrão brasileiro
    costPerKWp: 4000, // Valor padrão
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [calculations, setCalculations] = useState<ProposalCalculations | null>(
    null
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  // Carregar clientes ao montar o componente
  useEffect(() => {
    loadClients();
  }, []);

  // Calcular automaticamente quando todos os campos estiverem preenchidos
  useEffect(() => {
    if (
      formData.clientId &&
      formData.monthlyConsumption > 0 &&
      formData.systemPower > 0 &&
      formData.energyTariff > 0 &&
      formData.costPerKWp > 0
    ) {
      calculateProposal();
    } else {
      setCalculations(null);
    }
  }, [formData]);

  const loadClients = async () => {
    try {
      const clientsData = await clientService.getClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  const calculateProposal = async () => {
    setIsCalculating(true);

    try {
      // Calcular valores usando as funções existentes
      const monthlyGeneration = calculateMonthlyGeneration(
        formData.systemPower
      );
      const totalSystemValue = calculateTotalSystemValue(
        formData.systemPower,
        formData.costPerKWp
      );
      const monthlySavings = calculateMonthlySavings(
        formData.monthlyConsumption,
        monthlyGeneration,
        formData.energyTariff
      );
      const paybackPeriod = calculatePaybackPeriod(
        totalSystemValue,
        monthlySavings
      );

      // Cálculos adicionais
      const annualSavings = monthlySavings * 12;
      const roiPercentage = (annualSavings / totalSystemValue) * 100;

      setCalculations({
        monthlyGeneration,
        totalSystemValue,
        monthlySavings,
        paybackPeriod,
        annualSavings,
        roiPercentage,
      });
    } catch (error) {
      console.error("Erro ao calcular proposta:", error);
      setCalculations(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const client = clients.find((c) => c.id === clientId);

    setSelectedClient(client || null);
    setFormData((prev) => ({
      ...prev,
      clientId,
      // Se o cliente tem consumo mensal salvo, usar ele
      monthlyConsumption: client?.monthlyConsumption || prev.monthlyConsumption,
    }));
  };

  const handleInputChange =
    (field: keyof QuickProposalFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "clientId" ? e.target.value : Number(e.target.value);
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calculations && selectedClient) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      clientId: "",
      monthlyConsumption: 0,
      systemPower: 0,
      energyTariff: 0.85,
      costPerKWp: 4000,
    });
    setSelectedClient(null);
    setCalculations(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 0) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const isFormValid =
    formData.clientId &&
    formData.monthlyConsumption > 0 &&
    formData.systemPower > 0 &&
    formData.energyTariff > 0 &&
    formData.costPerKWp > 0;

  return (
    <div className="quick-proposal-form">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Dados da Proposta</h3>

          {/* Seleção do Cliente */}
          <div className="client-select-container">
            <label className="form-label" htmlFor="client">
              Cliente *
            </label>
            <div className="input-with-icon">
              <HiUser className="input-icon" />
              <select
                id="client"
                className="form-select"
                value={formData.clientId}
                onChange={handleClientChange}
                disabled={isLoadingClients}
              >
                <option value="">
                  {isLoadingClients ? "Carregando..." : "Selecione um cliente"}
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.company}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Consumo Mensal */}
          <Input
            label="Consumo Mensal (KWh) *"
            type="number"
            placeholder="Ex: 500"
            value={formData.monthlyConsumption.toString()}
            onChange={handleInputChange("monthlyConsumption")}
            required
            min="1"
            step="1"
            icon={<HiLightningBolt />}
          />

          {/* Tamanho do Sistema */}
          <Input
            label="Tamanho do Sistema (KWp) *"
            type="number"
            placeholder="Ex: 3.5"
            value={formData.systemPower.toString()}
            onChange={handleInputChange("systemPower")}
            required
            min="0.1"
            step="0.1"
            icon={<HiSun />}
          />

          {/* Tarifa de Energia */}
          <Input
            label="Tarifa de Energia (R$/KWh) *"
            type="number"
            placeholder="Ex: 0.85"
            value={formData.energyTariff.toString()}
            onChange={handleInputChange("energyTariff")}
            required
            min="0.01"
            step="0.01"
            icon={<HiCurrencyDollar />}
          />

          {/* Custo por KWp */}
          <Input
            label="Custo por KWp (R$) *"
            type="number"
            placeholder="Ex: 4000"
            value={formData.costPerKWp.toString()}
            onChange={handleInputChange("costPerKWp")}
            required
            min="1000"
            step="100"
            icon={<HiCalculator />}
          />
        </div>

        {/* Resultados */}
        {(calculations || isCalculating) && (
          <div className="results-section">
            <h3>Resultados da Proposta</h3>

            {isCalculating ? (
              <div className="calculating">
                <div className="spinner"></div>
                <p>Calculando proposta...</p>
              </div>
            ) : calculations ? (
              <div className="results-grid">
                <div className="result-card">
                  <div className="result-icon">
                    <HiSun />
                  </div>
                  <div className="result-content">
                    <h4>Geração Mensal</h4>
                    <p className="result-value">
                      {formatNumber(calculations.monthlyGeneration, 0)} KWh
                    </p>
                  </div>
                </div>

                <div className="result-card">
                  <div className="result-icon">
                    <HiCurrencyDollar />
                  </div>
                  <div className="result-content">
                    <h4>Valor do Sistema</h4>
                    <p className="result-value">
                      {formatCurrency(calculations.totalSystemValue)}
                    </p>
                  </div>
                </div>

                <div className="result-card">
                  <div className="result-icon">
                    <HiLightningBolt />
                  </div>
                  <div className="result-content">
                    <h4>Economia Mensal</h4>
                    <p className="result-value">
                      {formatCurrency(calculations.monthlySavings)}
                    </p>
                  </div>
                </div>

                <div className="result-card">
                  <div className="result-icon">
                    <HiCalculator />
                  </div>
                  <div className="result-content">
                    <h4>Tempo de Retorno</h4>
                    <p className="result-value">
                      {formatNumber(calculations.paybackPeriod, 0)} meses
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Botões de Ação */}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="transparent"
            onClick={handleReset}
            disabled={isLoading}
          >
            Limpar
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid || !calculations || isLoading}
            loading={isLoading}
          >
            Salvar Proposta
          </Button>
        </div>
      </form>
    </div>
  );
}
