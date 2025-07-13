import { useState } from "react";
import type { Event } from "@/types";

// Mock data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Casamento Silva & Santos",
    description: "Cerimônia e recepção para 150 convidados",
    dateInit: "2024-12-15",
    dateEnd: "2025-12-15",
    diaryOffers: 3,
    budget: 15000,
  },
  {
    id: "2",
    title: "Evento Corporativo Tech Inc",
    description: "Apresentação de produtos e networking",
    dateInit: "2024-12-20",
    dateEnd: "2025-12-20",
    diaryOffers: 2,
    budget: 25000,
  },
  {
    id: "3",
    title: "Aniversário 50 anos",
    description: "Festa de aniversário temática anos 80",
    dateInit: "2024-11-30",
    dateEnd: "2025-11-30",
    budget: 8000,
    diaryOffers: 1,
  },
];

export const useMockData = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
