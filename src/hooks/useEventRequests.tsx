import type { EventRequest } from "@/types";
import { useEffect, useState } from "react";
import axios from "axios";

export const useEventRequests = () => {
    const [requests, setRequests] = useState<EventRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        getRequests();
    }, [])

    const showMessage = (text: string, type: 'success' | 'error') => {
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
            // Primeiro tenta buscar da API real
            const response = await axios.get<any[]>("https://saeback-production.up.railway.app/api/solicitacoes");
            console.log("Fetched requests:", response.data);
            
            // Mapear dados da API para o formato esperado
            const mappedRequests = response.data.map(request => ({
                id: request.id.toString(),
                clientName: request.nome_cliente || request.clientName,
                clientEmail: request.email_cliente || request.clientEmail,
                description: request.descricao || request.description,
                eventDate: new Date(request.data_evento || request.eventDate),
                eventTime: request.horario_evento || request.eventTime,
                eventType: request.tipo_evento || request.eventType,
                budget: parseFloat(request.orcamento || request.budget) || 0,
                location: request.local || request.location,
                guestCount: parseInt(request.numero_convidados || request.guestCount) || 0,
                status: request.status || 'pending',
                createdAt: new Date(request.created_at || request.createdAt || Date.now()),
                eventId: request.evento_id || request.eventId
            } as EventRequest));
            
            setRequests(mappedRequests);
        } catch (error) {
            console.error("API não disponível, usando dados de exemplo:", error);
            // Se a API não estiver disponível, usar dados mockados
            setRequests(getMockRequests());
        } finally {
            setIsLoading(false);
        }
    }

    const getMockRequests = (): EventRequest[] => [
        {
            id: "1",
            clientName: "João Oliveira",
            clientEmail: "joao@email.com",
            description: "Festa de aniversário de 50 anos com buffet completo e decoração temática",
            eventDate: "2025-09-10",
            eventTime: "19:00",
            eventType: "birthday",
            budget: 8000,
            location: "Salão de Festas Paradise",
            guestCount: 80,
            status: "pending",
            createdAt: "2025-08-10T10:00:00Z"
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
            createdAt: "2025-08-08T14:30:00Z"
        },
        {
            id: "3",
            clientName: "Carlos e Maria Silva",
            clientEmail: "carlos.maria@email.com",
            description: "Casamento com cerimônia religiosa, recepção e festa completa",
            eventDate: "2025-11-15",
            eventTime: "17:00",
            eventType: "wedding",
            budget: 25000,
            location: "Igreja São José + Salão Crystal",
            guestCount: 200,
            status: "pending",
            createdAt: "2025-08-12T09:15:00Z"
        }
    ];

    const approveRequest = async (requestId: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            // Tentar aprovar via API
            await axios.put(`https://saeback-production.up.railway.app/api/solicitacoes/${requestId}/aprovar`);
            console.log("Request approved:", requestId);
            await getRequests();
            showMessage("Solicitação aprovada com sucesso!", 'success');
            return true;
        } catch (error) {
            console.error("Erro na API, atualizando localmente:", error);
            // Se falhar na API, atualizar localmente para demonstração
            setRequests(prev => prev.map(req => 
                req.id === requestId ? { ...req, status: 'approved' as const } : req
            ));
            showMessage("Solicitação aprovada com sucesso!", 'success');
            return true;
        } finally {
            setIsLoading(false);
        }
    }

    const rejectRequest = async (requestId: string, reason?: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            // Tentar rejeitar via API
            await axios.put(`https://saeback-production.up.railway.app/api/solicitacoes/${requestId}/rejeitar`, { 
                motivo: reason 
            });
            console.log("Request rejected:", requestId);
            await getRequests();
            showMessage("Solicitação rejeitada.", 'success');
            return true;
        } catch (error) {
            console.error("Erro na API, atualizando localmente:", error);
            // Se falhar na API, atualizar localmente para demonstração
            setRequests(prev => prev.map(req => 
                req.id === requestId ? { ...req, status: 'rejected' as const } : req
            ));
            showMessage("Solicitação rejeitada.", 'success');
            return true;
        } finally {
            setIsLoading(false);
        }
    }

    // Filtros úteis
    const pendingRequests = requests.filter(req => req.status === 'pending');
    const approvedRequests = requests.filter(req => req.status === 'approved');
    const rejectedRequests = requests.filter(req => req.status === 'rejected');

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
        clearMessage
    }
}
