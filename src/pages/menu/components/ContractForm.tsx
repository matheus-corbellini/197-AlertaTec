"use client";

import type React from "react";
import { useState } from "react";
import {
  HiUser,
  HiMail,
  HiPhone,
  HiCurrencyDollar,
  HiDocumentText,
} from "react-icons/hi";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Card from "../../../components/Card/Card";
import type { ContractFormProps } from "../../../types/Contract";
import "./ContractForm.css";

export default function ContractForm({ onSubmit }: ContractFormProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    product: "",
    value: "",
    description: "",
    paymentTerms: "a vista",
    duration: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      product: "",
      value: "",
      description: "",
      paymentTerms: "a vista",
      duration: "",
    });
    alert("Contrato criado com sucesso!");
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

  return (
    <Card className="contract-form">
      <h2>Novo Contrato</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-sections">
          <Card className="form-section">
            <h3>Informações do Cliente</h3>
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
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
