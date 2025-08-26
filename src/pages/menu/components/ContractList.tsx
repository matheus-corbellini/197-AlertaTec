"use client";

import { useState } from "react";
import { HiSearch, HiPencil, HiTrash } from "react-icons/hi";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Card from "../../../components/Card/Card";
import type { Contract, ContractListProps } from "../../../types/Contract";
import "./ContractList.css";

export default function ContractList({
  contracts,
  onEditContract,
  onDeleteContract,
}: ContractListProps) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContracts = contracts.filter((contract) => {
    const matchesFilter =
      filter === "all" || contract.status.toLowerCase() === filter;
    const matchesSearch =
      contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const generateContract = (contract: Contract) => {
    // Simulação de geração automática de contrato
    const contractTemplate = `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Cliente: ${contract.clientName}
Produto/Serviço: ${contract.product}
Valor: R$ ${contract.value.toLocaleString()}
Data: ${new Date(contract.date).toLocaleDateString("pt-BR")}
Comissão do Vendedor: R$ ${contract.commission.toLocaleString()}

Este contrato foi gerado automaticamente pelo sistema.
    `;

    const blob = new Blob([contractTemplate], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contrato-${contract.clientName.replace(" ", "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="contract-list">
      <div className="list-header">
        <h2>Contratos</h2>
        <div className="list-controls">
          <Input
            type="text"
            placeholder="Buscar contratos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<HiSearch />}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="pendente">Pendentes</option>
            <option value="finalizado">Finalizados</option>
          </select>
        </div>
      </div>

      <div className="contracts-table">
        <div className="table-header">
          <div className="col">Cliente</div>
          <div className="col">Produto</div>
          <div className="col">Valor</div>
          <div className="col">Status</div>
          <div className="col">Data</div>
          <div className="col">Comissão</div>
          <div className="col">Ações</div>
        </div>

        {filteredContracts.map((contract) => (
          <div key={contract.id} className="table-row">
            <div className="col">{contract.clientName}</div>
            <div className="col">{contract.product}</div>
            <div className="col">R$ {contract.value.toLocaleString()}</div>
            <div className="col">
              <span
                className={`status status-${contract.status.toLowerCase()}`}
              >
                {contract.status}
              </span>
            </div>
            <div className="col">
              {new Date(contract.date).toLocaleDateString("pt-BR")}
            </div>
            <div className="col">R$ {contract.commission.toLocaleString()}</div>
            <div className="col actions-col">
              <div className="action-buttons">
                <Button
                  onClick={() => generateContract(contract)}
                  variant="primary"
                  size="small"
                >
                  Gerar Contrato
                </Button>

                {onEditContract && (
                  <Button
                    onClick={() => onEditContract(contract)}
                    variant="secondary"
                    size="small"
                    className="edit-btn"
                  >
                    <HiPencil />
                    Editar
                  </Button>
                )}

                {onDeleteContract && (
                  <Button
                    onClick={() => onDeleteContract(contract.id || "")}
                    variant="danger"
                    size="small"
                    className="delete-btn"
                  >
                    <HiTrash />
                    Remover
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
