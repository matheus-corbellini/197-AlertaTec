import Card from "../../../components/Card/Card";
import Button from "../../../components/Button/Button";
import { HiUser, HiMail, HiPhone } from "react-icons/hi";
import "./Clients.css";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const mockClients: Client[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "(11) 88888-8888",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@email.com",
    phone: "(11) 77777-7777",
  },
];

export default function Clients() {
  return (
    <div className="clients-page">
      <div className="clients-header">
        <h2>Clientes</h2>
        <Button variant="primary">Novo Cliente</Button>
      </div>
      <div className="clients-list">
        {mockClients.map((client) => (
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
              </div>
            </div>
            <div className="client-actions">
              <Button variant="secondary" size="small">
                Editar
              </Button>
              <Button variant="danger" size="small">
                Remover
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
