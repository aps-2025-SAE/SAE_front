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

    useEffect(() => {
        getEvents();
    }, [])

    const getEvents = async () => {
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
        }
    }


    const addEvent = async (event: Event) => {

        const existingEvent = events.find(e => e.title === event.title);

        if (existingEvent) {
            alert("Evento já cadastrado.");
            return;
        }

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
            await getEvents(); // Refresh the list after adding
        } catch (error) {
            alert("Erro ao adicionar evento. Verifique os dados e tente novamente.");
            console.error("Error adding event:", error);
        }
    }

    const updateEvent = async (id: string, event: Event) => {
        const existingEvent = events.find(e => e.title === event.title && e.id !== id);

        if (existingEvent) {
            alert("Evento já cadastrado.");
            return;
        }

        try {
            const response = await axios.put<Event>(`https://saeback-production.up.railway.app/api/eventos/${id}`, {
                tipo: event.title,
                valor: event.budget,
                descricao: event.description,
                data_inicio: format(event.dateInit, "yyyy-MM-dd"),
                data_fim: format(event.dateEnd, "yyyy-MM-dd"),
                numOfertasDiarias: event.diaryOffers,
            });
            console.log("Event added:", response.data);
            await getEvents(); // Refresh the list after adding
        } catch (error) {
            alert("Erro ao atualizar evento. Verifique os dados e tente novamente.");
            console.error("Error adding event:", error);
        }
    }

    const deleteEvent = async (id: string) => {
        try {
            await axios.delete(`https://saeback-production.up.railway.app/api/eventos/${id}`);
            console.log("Event deleted:", id);
            await getEvents(); // Refresh the list after deleting
        }
        catch (error) {
            alert("Erro ao excluir evento. Tente novamente.");
            console.error("Error deleting event:", error);
        }
    }

    return {
        events,
        getEvents,
        addEvent,
        updateEvent,
        deleteEvent
    }
}