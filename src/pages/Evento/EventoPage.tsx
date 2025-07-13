import EventCard from "@/components/EventCard";
import EventForm from "@/components/EventForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMockData } from "@/hooks/useMockData";
import type { Event } from "@/types";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";

function EventoPage() {
  const { events, updateEvent, addEvent } = useMockData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCreateEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const onEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const onDeleteEvent = (event: Event) => {
    // Implement delete logic here
    console.log("Delete event:", event);
  };

  const onSubmit = (data: any) => {
    setIsSubmitting(true);
    if (editingEvent) {
      // Update existing event
      console.log("Update event:", { ...editingEvent, ...data });
      updateEvent(editingEvent.id, data);
    } else {
      addEvent(data);
    }
    setIsSubmitting(false);
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const onCancel = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };
  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestão de Eventos
            </h1>
            <p className="text-gray-600">
              Crie, edite e gerencie todos os eventos
            </p>
          </div>
          <Button onClick={onCreateEvent} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum evento encontrado
            </h3>
            <Button onClick={() => {}} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeiro Evento
            </Button>
          </div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={() => onEditEvent(event)}
              onDelete={() => onDeleteEvent(event)}
            />
          ))
        )}
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Editar Evento" : "Novo Evento"}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={editingEvent || undefined}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventoPage;
