import AlertConfirmation from "@/components/AlertConfirmation";
import EventCard from "@/components/EventCard";
import EventForm from "@/components/EventForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEventos } from "@/hooks/useEventos";
import type { Event } from "@/types";
import { Calendar, Plus, CheckCircle, AlertCircle, X } from "lucide-react";
import { useState } from "react";

function EventoPage() {
  const { events, isLoading, message, messageType, addEvent, updateEvent, deleteEvent, clearMessage } = useEventos();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
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
    setDeletingEvent(event);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    let success = false;
    
    if (editingEvent) {
      success = await updateEvent(editingEvent.id, data);
    } else {
      success = await addEvent(data);
    }
    
    if (success) {
      setIsFormOpen(false);
      setEditingEvent(null);
    }
    setIsSubmitting(false);
  };

  const onCancel = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteConfirm = async () => {
    if (deletingEvent) {
      await deleteEvent(deletingEvent.id);
      setDeletingEvent(null);
    }
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Message Alert */}
        {message && (
          <Alert className={`${messageType === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {messageType === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={messageType === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {message}
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessage}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )}

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
          <Button onClick={onCreateEvent} className="gap-2" disabled={isLoading}>
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading && events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum evento encontrado
            </h3>
            <Button onClick={onCreateEvent} className="gap-2">
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

      <AlertConfirmation
        title="Excluir Evento"
        message="Você tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingEvent(null)}
        open={!!deletingEvent}
      />
    </div>
  );
}

export default EventoPage;
