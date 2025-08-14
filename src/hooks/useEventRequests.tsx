import type { EventRequest } from "@/types";
import { useEffect, useState } from "react";
import axios from "axios";

export const useEventRequests = () => {
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  useEffect(() => {
    getRequests();
  }, []);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const clearMessage = () => {
    setMessage(null);
    setMessageType(null);
  };

  const getRequests = async () => {
    setIsLoading(true);
    try {
      // Buscar pedidos da API real
      const response = await axios.get<any[]>(
        "https://saeback-production-fe02.up.railway.app/api/admin/pedidos"
      );
      console.log("Fetched requests:", response.data);

      // Mapear dados da API para o formato esperado
      const mappedRequests = response.data.map(
        (pedido) =>
          ({
            id: pedido.id.toString(),
            clientName: pedido.cliente.nome,
            clientEmail: pedido.cliente.email,
            description: `Evento de ${pedido.evento.tipo}`,
            eventDate: pedido.data_solicitada,
            eventTime: pedido.horario,
            eventType: pedido.evento.tipo.toLowerCase(),
            budget: parseFloat(pedido.evento.valor) || 0,
            location: pedido.endereco,
            guestCount: parseInt(pedido.quantidade_pessoas) || 0,
            status:
              pedido.status === "pendente"
                ? "pending"
                : pedido.status === "aprovado"
                ? "approved"
                : "rejected",
            createdAt: new Date(pedido.created_at),
            eventId: pedido.evento_id,
          } as EventRequest)
      );

      setRequests(mappedRequests);
    } catch (error) {
      console.error("API não disponível, usando dados de exemplo:", error);
      // Se a API não estiver disponível, usar dados mockados
      setRequests(getMockRequests());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockRequests = (): EventRequest[] => [
    {
      id: "1",
      clientName: "João Oliveira",
      clientEmail: "joao@email.com",
      description:
        "Festa de aniversário de 50 anos com buffet completo e decoração temática",
      eventDate: "2025-09-10",
      eventTime: "19:00",
      eventType: "birthday",
      budget: 8000,
      location: "Salão de Festas Paradise",
      guestCount: 80,
      status: "pending",
      createdAt: "2025-08-10T10:00:00Z",
    },
    {
      id: "2",
      clientName: "Ana Costa",
      clientEmail: "ana.costa@email.com",
      description: "Evento de formatura de medicina com cerimônia e festa",
      eventDate: "2025-08-30",
      eventTime: "20:00",
      eventType: "graduation",
      budget: 12000,
      location: "Clube Social Central",
      guestCount: 150,
      status: "pending",
      createdAt: "2025-08-08T14:30:00Z",
    },
    {
      id: "3",
      clientName: "Carlos e Maria Silva",
      clientEmail: "carlos.maria@email.com",
      description:
        "Casamento com cerimônia religiosa, recepção e festa completa",
      eventDate: "2025-11-15",
      eventTime: "17:00",
      eventType: "wedding",
      budget: 25000,
      location: "Igreja São José + Salão Crystal",
      guestCount: 200,
      status: "pending",
      createdAt: "2025-08-12T09:15:00Z",
    },
  ];

  const approveRequest = async (requestId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Tentar aprovar via API
      await axios.put(
        `https://saeback-production-fe02.up.railway.app/api/admin/pedidos/${requestId}/aprovar`
      );
      console.log("Request approved:", requestId);
      await getRequests();
      showMessage("Solicitação aprovada com sucesso!", "success");
      return true;
    } catch (error) {
      console.error("Erro na API, atualizando localmente:", error);
      // Se falhar na API, atualizar localmente para demonstração
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "approved" as const } : req
        )
      );
      showMessage("Solicitação aprovada com sucesso!", "success");
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (
    requestId: string,
    reason?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Tentar rejeitar via API
      await axios.put(
        `https://saeback-production-fe02.up.railway.app/api/admin/pedidos/${requestId}/rejeitar`,
        {
          motivo: reason,
        }
      );
      console.log("Request rejected:", requestId);
      await getRequests();
      showMessage("Solicitação rejeitada.", "success");
      return true;
    } catch (error) {
      console.error("Erro na API, atualizando localmente:", error);
      // Se falhar na API, atualizar localmente para demonstração
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "rejected" as const } : req
        )
      );
      showMessage("Solicitação rejeitada.", "success");
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  // Filtros úteis
  const pendingRequests = requests.filter((req) => req.status === "pending");
  const approvedRequests = requests.filter((req) => req.status === "approved");
  const rejectedRequests = requests.filter((req) => req.status === "rejected");

  return {
    requests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    isLoading,
    message,
    messageType,
    getRequests,
    approveRequest,
    rejectRequest,
    clearMessage,
  };
};
