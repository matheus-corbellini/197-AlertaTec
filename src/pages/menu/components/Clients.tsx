import { useState, useEffect } from "react";
import Card from "../../../components/Card/Card";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/AddClient/Modal";
import ClientForm from "../../../components/AddClient/ClientForm";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import { HiUser, HiMail, HiPhone } from "react-icons/hi";
import { clientService } from "../../../services/clientServices";
import { useToast } from "../../../contexts/useToast";
import type { Client, ClientFormData } from "../../../types/Client";
import "./Clients.css";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("Todos");
  const { showToast } = useToast();

  const filteredClientes = clients.filter((client) => {
    if (selectedFilter === "Todos") {
      return true;
    }
    return client.status === selectedFilter;
  });

  const statusOptions = [
    "Todos",
    "Novo",
    "Em negociação",
    "Ativo",
    "Cancelado",
  ];

  const getClientCount = (status: string) => {
    if (status === "Todos") return clients.length;
    return clients.filter((client) => client.status === status).length;
  };

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
      showToast("Erro ao carregar clientes. Tente novamente.", "error");
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
      showToast("Cliente adicionado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      showToast("Erro ao adicionar cliente. Tente novamente.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    setClientToDelete(clientId);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      await clientService.deleteClient(clientToDelete);
      await loadClients();
      showToast("Cliente removido com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao remover cliente:", error);
      showToast("Erro ao remover cliente. Tente novamente.", "error");
    } finally {
      setClientToDelete(null);
    }
  };

  const handleEditClient = async (clientData: ClientFormData) => {
    if (!editingClient || !editingClient.id) return;
    setIsSubmitting(true);
    try {
      await clientService.updateClient(editingClient.id, clientData);
      await loadClients();
      setIsModalOpen(false);
      setEditingClient(null);
      showToast("Cliente editado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao editar cliente:", error);
      showToast("Erro ao editar cliente. Tente novamente.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="clients-page">
      <div className="clients-header">
        <h2>Clientes</h2>
        <Button
          variant="primary"
          onClick={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
        >
          Novo Cliente
        </Button>
      </div>

      <div className="clients-filters-section">
        <div className="filters-header">
          <h3>Filtrar por status</h3>
          <span className="filters-count">
            {filteredClientes.length} de {clients.length} clientes
          </span>
        </div>

        <div className="filters-buttons">
          {statusOptions.map((status) => (
            <button
              key={status}
              className={`filter-btn ${
                selectedFilter === status ? "active" : ""
              }`}
              onClick={() => setSelectedFilter(status)}
            >
              <span className="filter-label">{status}</span>
              <span className="filter-count">({getClientCount(status)})</span>
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Carregando clientes...</div>
      ) : clients.length === 0 ? (
        <div className="empty-state">Nenhum cliente encontrado</div>
      ) : filteredClientes.length === 0 ? (
        <div className="empty-filter-state">
          <div className="empty-filter-icon">🔍</div>
          <h3>Nenhum cliente encontrado</h3>
          <p>Não há clientes com o status "{selectedFilter}"</p>
          <button
            className="reset-filter-btn"
            onClick={() => setSelectedFilter("Todos")}
          >
            Ver todos os clientes
          </button>
        </div>
      ) : (
        <>
          <div className="clients-list">
            {filteredClientes.map((client) => (
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
                    <div
                      className="client-status-badge"
                      data-status={client.status}
                    >
                      <div className="client-status-indicator"></div>
                      {client.status}
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
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      setEditingClient(client);
                      setIsModalOpen(true);
                    }}
                  >
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
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? "Editar Cliente" : "Novo Cliente"}
      >
        <ClientForm
          onSubmit={editingClient ? handleEditClient : handleAddClient}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
          client={editingClient}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={confirmDeleteClient}
        title="Remover Cliente"
        message="Tem certeza que deseja remover este cliente? Esta ação não pode ser desfeita."
        confirmText="Sim, remover"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
