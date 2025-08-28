"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  HiUser,
  HiMail,
  HiPhone,
  HiCurrencyDollar,
  HiDocumentText,
  HiUserAdd,
} from "react-icons/hi";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Card from "../../../components/Card/Card";
import type { ContractFormProps } from "../../../types/Contract";
import type { Client } from "../../../types/Client";
import { clientService } from "../../../services/clientServices";
import "./ContractForm.css";
import { useToast } from "../../../contexts/useToast";

export default function ContractForm({ onSubmit }: ContractFormProps) {
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    product: "",
    value: "",
    description: "",
    paymentTerms: "a vista",
    duration: "",
    status: "",
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [clientMode, setClientMode] = useState<"existing" | "new">("existing");
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoadingClients(true);
    try {
      const clientsData = await clientService.getClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let finalClientId = formData.clientId;

      // Se for um novo cliente, salvar primeiro na coleção de clientes
      if (clientMode === "new") {
        finalClientId = await createClient();
        showToast("Cliente salvo com sucesso!", "success");
      }

      // Preparar dados finais com o clientId correto
      const finalFormData = {
        ...formData,
        clientId: finalClientId,
      };

      // Criar o contrato com todos os dados
      await onSubmit(finalFormData);

      // Limpar formulário
      setFormData({
        clientId: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        product: "",
        value: "",
        description: "",
        paymentTerms: "a vista",
        duration: "",
        status: "",
      });

      showToast("Contrato criado com sucesso!", "success");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      showToast("Erro ao criar contrato: " + errorMessage, "error");
    }
  };

  const createClient = async () => {
    const clientId = await clientService.createClient({
      name: formData.clientName,
      email: formData.clientEmail,
      phone: formData.clientPhone,
      status: formData.status,
    });
    return clientId;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    if (clientId) {
      const selectedClient = clients.find((client) => client.id === clientId);
      if (selectedClient) {
        setFormData({
          ...formData,
          clientId: selectedClient.id || "",
          clientName: selectedClient.name,
          clientEmail: selectedClient.email,
          clientPhone: selectedClient.phone,
        });
      }
    } else {
      setFormData({
        ...formData,
        clientId: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
      });
    }
  };

  const handleClientModeChange = (mode: "existing" | "new") => {
    setClientMode(mode);
    if (mode === "new") {
      setFormData({
        ...formData,
        clientId: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      clientId: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      product: "",
      value: "",
      description: "",
      paymentTerms: "a vista",
      duration: "",
      status: "",
    });
    setClientMode("existing");
  };

  return (
    <Card className="contract-form">
      <h2>Novo Contrato</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-sections">
          <Card className="form-section">
            <h3>Informações do Cliente</h3>

            {/* Seletor de modo do cliente */}
            <div className="form-group">
              <label>Tipo de Cliente</label>
              <div className="client-mode-buttons">
                <button
                  type="button"
                  className={`mode-btn ${
                    clientMode === "existing" ? "active" : ""
                  }`}
                  onClick={() => handleClientModeChange("existing")}
                >
                  <HiUser />
                  Cliente Existente
                </button>
                <button
                  type="button"
                  className={`mode-btn ${clientMode === "new" ? "active" : ""}`}
                  onClick={() => handleClientModeChange("new")}
                >
                  <HiUserAdd />
                  Novo Cliente
                </button>
              </div>
            </div>

            {clientMode === "existing" ? (
              <div className="form-group">
                <label htmlFor="clientSelect">Selecionar Cliente</label>
                <select
                  id="clientSelect"
                  onChange={handleClientSelect}
                  value={formData.clientId}
                  className="form-select"
                  disabled={isLoadingClients}
                  required
                >
                  <option value="">
                    {isLoadingClients
                      ? "Carregando clientes..."
                      : "Selecione um cliente"}
                  </option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.email}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="clientName">Nome do Cliente</label>
                  <Input
                    type="text"
                    name="clientName"
                    placeholder="Digite o nome do cliente"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                    icon={<HiUser />}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clientEmail">Email</label>
                  <Input
                    type="email"
                    name="clientEmail"
                    placeholder="Digite o email do cliente"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    required
                    icon={<HiMail />}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clientPhone">Telefone</label>
                  <Input
                    type="tel"
                    name="clientPhone"
                    placeholder="Digite o telefone do cliente"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    required
                    icon={<HiPhone />}
                  />
                </div>
                <div className="client-status-container">
                  <label className="form-label" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-select"
                    onChange={handleChange}
                    value={formData.status}
                    required
                  >
                    <option value="" disabled selected hidden>
                      Selecione o status
                    </option>
                    <option value="Novo">Novo</option>
                    <option value="Em negociação">Em negociação</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </>
            )}

            {/* Informações do cliente selecionado (somente leitura) */}
            {clientMode === "existing" && formData.clientId && (
              <div className="selected-client-info">
                <h4>Cliente Selecionado:</h4>
                <div className="client-details">
                  <p>
                    <HiUser /> <strong>Nome:</strong> {formData.clientName}
                  </p>
                  <p>
                    <HiMail /> <strong>Email:</strong> {formData.clientEmail}
                  </p>
                  <p>
                    <HiPhone /> <strong>Telefone:</strong>{" "}
                    {formData.clientPhone}
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card className="form-section">
            <h3>Detalhes do Contrato</h3>
            <div className="form-group">
              <label htmlFor="product">Produto/Serviço</label>
              <Input
                type="text"
                name="product"
                placeholder="Digite o produto ou serviço"
                value={formData.product}
                onChange={handleChange}
                required
                icon={<HiDocumentText />}
              />
            </div>

            <div className="form-group">
              <label htmlFor="value">Valor (R$)</label>
              <Input
                type="number"
                name="value"
                placeholder="0,00"
                value={formData.value}
                onChange={handleChange}
                required
                icon={<HiCurrencyDollar />}
              />
            </div>

            <div className="form-group">
              <label htmlFor="paymentTerms">Forma de Pagamento</label>
              <select
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className="form-select"
              >
                <option value="à vista">À Vista</option>
                <option value="30 dias">30 dias</option>
                <option value="60 dias">60 dias</option>
                <option value="90 dias">90 dias</option>
                <option value="parcelado">Parcelado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duração (meses)</label>
              <Input
                type="number"
                name="duration"
                placeholder="Duração em meses"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Descrição do contrato"
                className="form-textarea"
              />
            </div>
          </Card>
        </div>

        <div className="form-actions">
          <Button type="submit" variant="primary">
            Criar Contrato
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
