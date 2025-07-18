import { useState, useEffect } from "react";
import Card from "../../../components/Card/Card";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/AddClient/Modal";
import ClientForm from "../../../components/AddClient/ClientForm";
import { HiUser, HiMail, HiPhone } from "react-icons/hi";
import { clientService } from "../../../services/clientServices";
import type { Client, ClientFormData } from "../../../types/Client";
import "./Clients.css";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar clientes ao montar o componente
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const clientsData = await clientService.getClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      alert("Erro ao carregar clientes. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClient = async (clientData: ClientFormData) => {
    setIsSubmitting(true);
    try {
      await clientService.createClient(clientData);
      await loadClients(); // Recarregar lista
      setIsModalOpen(false);
      alert("Cliente adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      alert("Erro ao adicionar cliente. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Tem certeza que deseja remover este cliente?")) return;

    try {
      await clientService.deleteClient(clientId);
      await loadClients(); // Recarregar lista
      alert("Cliente removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover cliente:", error);
      alert("Erro ao remover cliente. Tente novamente.");
    }
  };

  return (
    <div className="clients-page">
      <div className="clients-header">
        <h2>Clientes</h2>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Novo Cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="loading">Carregando clientes...</div>
      ) : clients.length === 0 ? (
        <div className="empty-state">Nenhum cliente encontrado</div>
      ) : (
        <div className="clients-list">
          {clients.map((client) => (
            <Card key={client.id} className="client-card">
              <div className="client-info">
                <div className="client-avatar">
                  <HiUser />
                </div>
                <div>
                  <div className="client-name">{client.name}</div>
                  <div className="client-email">
                    <HiMail /> {client.email}
                  </div>
                  <div className="client-phone">
                    <HiPhone /> {client.phone}
                  </div>
                  {client.company && (
                    <div className="client-company">🏢 {client.company}</div>
                  )}
                </div>
              </div>
              <div className="client-actions">
                <Button variant="secondary" size="small">
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => client.id && handleDeleteClient(client.id)}
                >
                  Remover
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Cliente"
      >
        <ClientForm
          onSubmit={handleAddClient}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
