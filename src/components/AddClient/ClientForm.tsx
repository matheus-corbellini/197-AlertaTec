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
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange =
    (field: keyof ClientFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  return (
    <form onSubmit={handleSubmit} className="client-form">
      <Input
        label="Nome *"
        value={formData.name}
        onChange={handleChange("name")}
        required
        icon={<HiUser />}
      />

      <Input
        label="Email *"
        type="email"
        value={formData.email}
        onChange={handleChange("email")}
        required
        icon={<HiMail />}
      />

      <Input
        label="Telefone *"
        value={formData.phone}
        onChange={handleChange("phone")}
        required
        icon={<HiPhone />}
      />

      <Input
        label="Endereço"
        value={formData.address || ""}
        onChange={handleChange("address")}
        icon={<HiHome />}
      />

      <Input
        label="Empresa"
        value={formData.company || ""}
        onChange={handleChange("company")}
        icon={<HiOfficeBuilding />}
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
