import { useState, useEffect } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import type { ClientFormData } from "../../types/Client";
import {
  HiUser,
  HiMail,
  HiPhone,
  HiHome,
  HiOfficeBuilding,
  HiLightningBolt,
} from "react-icons/hi";
import "./ClientForm.css";

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  client?: ClientFormData | null;
}

export default function ClientForm({
  onSubmit,
  onCancel,
  isLoading,
  client,
}: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    status: "",
    monthlyConsumption: undefined,
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        company: "",
        status: "",
        monthlyConsumption: undefined,
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange =
    (field: keyof ClientFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        field === "monthlyConsumption"
          ? e.target.value
            ? Number(e.target.value)
            : undefined
          : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };
  return (
    <form onSubmit={handleSubmit} className="client-form">
      <Input
        label="Nome *"
        placeholder="Nome do cliente"
        value={formData.name}
        onChange={handleChange("name")}
        required
        icon={<HiUser />}
      />

      <Input
        label="Email *"
        placeholder="Email do cliente"
        type="email"
        value={formData.email}
        onChange={handleChange("email")}
        required
        icon={<HiMail />}
      />
      <div className="client-status-container">
        <label className="form-label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          className="form-select"
          onChange={handleChange("status")}
          value={formData.status}
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

      <Input
        label="Telefone *"
        placeholder="(55) 99999-9999"
        value={formData.phone}
        onChange={handleChange("phone")}
        required
        icon={<HiPhone />}
      />

      <Input
        label="Endereço"
        placeholder="Endereço do cliente  "
        value={formData.address || ""}
        onChange={handleChange("address")}
        icon={<HiHome />}
      />

      <Input
        label="Empresa"
        placeholder="Empresa do cliente"
        value={formData.company || ""}
        onChange={handleChange("company")}
        icon={<HiOfficeBuilding />}
      />

      <Input
        label="Consumo Mensal (kWh)"
        placeholder="Ex: 350"
        type="number"
        value={formData.monthlyConsumption?.toString() || ""}
        onChange={handleChange("monthlyConsumption")}
        icon={<HiLightningBolt />}
      />

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Cliente"}
        </Button>
      </div>
    </form>
  );
}
