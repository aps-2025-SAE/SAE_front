import type { Event } from "@/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const addHourToDate = (date: any) => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 5); // Adiciona 3 horas
    return newDate;
}

export const useEventos = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        getEvents();
    }, [])

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage(text);
        setMessageType(type);
        // Auto clear message after 5 seconds
        setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 5000);
    };

    const clearMessage = () => {
        setMessage(null);
        setMessageType(null);
    };

    const getEvents = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<any[]>("https://saeback-production.up.railway.app/api/eventos");
            console.log("Fetched events:", response.data);
            setEvents(response.data.map(evento => ({
                id: evento.id,
                title: evento.tipo,
                budget: evento.valor,
                description: evento.descricao,
                dateInit: addHourToDate(evento.data_inicio),
                dateEnd: addHourToDate(evento.data_fim),
                diaryOffers: evento.numOfertasDiarias
            } as Event)));
        } catch (error) {
            console.error("Error fetching events:", error);
            showMessage("Erro ao carregar eventos. Tente novamente.", 'error');
        } finally {
            setIsLoading(false);
        }
    }

    const addEvent = async (event: Event): Promise<boolean> => {
        const existingEvent = events.find(e => e.title === event.title);

        if (existingEvent) {
            showMessage("Evento já cadastrado.", 'error');
            return false;
        }

        setIsLoading(true);
        try {
            const response = await axios.post<Event>("https://saeback-production.up.railway.app/api/eventos", {
                tipo: event.title,
                valor: event.budget,
                descricao: event.description,
                data_inicio: format(event.dateInit, "yyyy-MM-dd"),
                data_fim: format(event.dateEnd, "yyyy-MM-dd"),
                numOfertasDiarias: event.diaryOffers,
            });
            console.log("Event added:", response.data);
            await getEvents();
            showMessage("Evento criado com sucesso!", 'success');
            return true;
        } catch (error) {
            console.error("Error adding event:", error);
            showMessage("Erro ao adicionar evento. Verifique os dados e tente novamente.", 'error');
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    const updateEvent = async (id: string, event: Event): Promise<boolean> => {
        const existingEvent = events.find(e => e.title === event.title && e.id !== id);

        if (existingEvent) {
            showMessage("Evento já cadastrado.", 'error');
            return false;
        }

        setIsLoading(true);
        try {
            const response = await axios.put<Event>(`https://saeback-production.up.railway.app/api/eventos/${id}`, {
                tipo: event.title,
                valor: event.budget,
                descricao: event.description,
                data_inicio: format(event.dateInit, "yyyy-MM-dd"),
                data_fim: format(event.dateEnd, "yyyy-MM-dd"),
                numOfertasDiarias: event.diaryOffers,
            });
            console.log("Event updated:", response.data);
            await getEvents();
            showMessage("Evento atualizado com sucesso!", 'success');
            return true;
        } catch (error) {
            console.error("Error updating event:", error);
            showMessage("Erro ao atualizar evento. Verifique os dados e tente novamente.", 'error');
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    const deleteEvent = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            await axios.delete(`https://saeback-production.up.railway.app/api/eventos/${id}`);
            console.log("Event deleted:", id);
            await getEvents();
            showMessage("Evento excluído com sucesso!", 'success');
            return true;
        } catch (error) {
            console.error("Error deleting event:", error);
            showMessage("Erro ao excluir evento. Tente novamente.", 'error');
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        events,
        isLoading,
        message,
        messageType,
        getEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        clearMessage
    }
}