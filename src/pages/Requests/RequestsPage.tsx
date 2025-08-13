import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, DollarSign, Check, X } from "lucide-react";
import { useEventRequests } from "@/hooks/useEventRequests";
import type { EventRequest } from "@/types";
import AlertConfirmation from "@/components/AlertConfirmation";
import Toast from "@/components/Toast";

const RequestsPage = () => {
  const { 
    pendingRequests, 
    approvedRequests, 
    rejectedRequests, 
    approveRequest, 
    rejectRequest,
    isLoading, 
    message, 
    messageType, 
    clearMessage 
  } = useEventRequests();

  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject';
    requestId: string;
    requestTitle: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const getEventTypeBadge = (type: string) => {
    const typeConfig = {
      wedding: { label: 'Casamento', color: 'bg-pink-100 text-pink-800' },
      corporate: { label: 'Corporativo', color: 'bg-blue-100 text-blue-800' },
      birthday: { label: 'Aniversário', color: 'bg-yellow-100 text-yellow-800' },
      graduation: { label: 'Formatura', color: 'bg-purple-100 text-purple-800' },
      anniversary: { label: 'Aniversário', color: 'bg-orange-100 text-orange-800' },
      other: { label: 'Outro', color: 'bg-gray-100 text-gray-800' },
    };
    
    return typeConfig[type as keyof typeof typeConfig] || typeConfig.other;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800' },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const handleAction = (type: 'approve' | 'reject', requestId: string, clientName: string) => {
    const actionMap = {
      approve: `Aprovar solicitação de ${clientName}`,
      reject: `Rejeitar solicitação de ${clientName}`
    };

    setConfirmAction({
      type,
      requestId,
      requestTitle: actionMap[type]
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const { type, requestId } = confirmAction;
    let success = false;

    if (type === 'approve') {
      success = await approveRequest(requestId);
    } else {
      success = await rejectRequest(requestId);
    }

    if (success) {
      setConfirmAction(null);
    }
  };

  const handleCancelAction = () => {
    setConfirmAction(null);
  };

  const RequestCard = ({ request, showActions = false }: { request: EventRequest; showActions?: boolean }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{request.clientName}</h3>
          {request.clientEmail && (
            <p className="text-sm text-gray-600">{request.clientEmail}</p>
          )}
          <p className="text-sm text-gray-700 mt-2">{request.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={getEventTypeBadge(request.eventType).color}>
            {getEventTypeBadge(request.eventType).label}
          </Badge>
          <Badge className={getStatusBadge(request.status).color}>
            {getStatusBadge(request.status).label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(request.eventDate).toLocaleDateString('pt-BR')}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{request.eventTime}</span>
        </div>

        {request.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{request.location}</span>
          </div>
        )}

        {request.guestCount && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{request.guestCount} convidados</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
          <DollarSign className="w-5 h-5" />
          <span>R$ {request.budget.toLocaleString('pt-BR')}</span>
        </div>

        {showActions && request.status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleAction('approve', request.id, request.clientName)}
              disabled={isLoading}
            >
              <Check className="w-4 h-4 mr-1" />
              Aprovar
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAction('reject', request.id, request.clientName)}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-1" />
              Rejeitar
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const getCurrentRequests = () => {
    switch (activeTab) {
      case 'pending': return pendingRequests;
      case 'approved': return approvedRequests;
      case 'rejected': return rejectedRequests;
      default: return pendingRequests;
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {message && messageType && (
        <Toast
          message={message}
          type={messageType}
          onClose={clearMessage}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Solicitações de Eventos</h1>
          <p className="text-gray-600">Gerencie todas as solicitações de eventos dos clientes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pendentes</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Aprovadas</p>
                <p className="text-2xl font-bold">{approvedRequests.length}</p>
              </div>
              <Check className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Rejeitadas</p>
                <p className="text-2xl font-bold">{rejectedRequests.length}</p>
              </div>
              <X className="w-8 h-8 text-red-200" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'pending' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pendentes ({pendingRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'approved' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Aprovadas ({approvedRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'rejected' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Rejeitadas ({rejectedRequests.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {isLoading && getCurrentRequests().length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando solicitações...</p>
              </div>
            ) : getCurrentRequests().length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma solicitação {activeTab === 'pending' ? 'pendente' : activeTab === 'approved' ? 'aprovada' : 'rejeitada'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'pending' 
                    ? 'Todas as solicitações foram processadas.' 
                    : `Solicitações ${activeTab === 'approved' ? 'aprovadas' : 'rejeitadas'} aparecerão aqui.`
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {getCurrentRequests().map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    showActions={activeTab === 'pending'} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Dialog */}
        {confirmAction && (
          <AlertConfirmation
            title={confirmAction.requestTitle}
            message={
              confirmAction.type === 'approve' 
                ? "Você tem certeza que deseja aprovar esta solicitação? O cliente será notificado."
                : "Você tem certeza que deseja rejeitar esta solicitação? O cliente será notificado."
            }
            onConfirm={handleConfirmAction}
            onCancel={handleCancelAction}
            open={true}
          />
        )}
      </div>
    </>
  );
};

export default RequestsPage;
