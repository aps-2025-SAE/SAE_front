
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { useEventRequests } from '@/hooks/useEventRequests';
import { useState } from 'react';
import AlertConfirmation from './AlertConfirmation';
import Toast from './Toast';

const Dashboard = () => {
  const { 
    pendingRequests, 
    approvedRequests, 
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

  // Dados dinâmicos baseados nos pedidos reais
  const dashboardStats = {
    totalEvents: pendingRequests.length + approvedRequests.length,
    pendingRequests: pendingRequests.length,
    upcomingEvents: approvedRequests.filter(req => new Date(req.eventDate) > new Date()).length,
    monthlyRevenue: approvedRequests.reduce((total, req) => total + req.budget, 0),
    eventsThisMonth: approvedRequests.filter(req => {
      const eventDate = new Date(req.eventDate);
      const now = new Date();
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    }).length,
    clientsCount: new Set([...pendingRequests, ...approvedRequests].map(req => req.clientEmail)).size
  };

  // Usar eventos reais aprovados como próximos eventos
  const upcomingEvents = approvedRequests
    .filter(req => new Date(req.eventDate) > new Date()) // Apenas eventos futuros
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()) // Ordenar por data
    .slice(0, 5) // Mostrar apenas os próximos 5
    .map(req => ({
      id: req.id,
      title: `${req.description} - ${req.clientName}`,
      clientName: req.clientName,
      date: req.eventDate,
      time: req.eventTime,
      location: req.location,
      type: req.eventType,
      budget: req.budget
    }));

  const handleApprove = (requestId: string, clientName: string) => {
    setConfirmAction({
      type: 'approve',
      requestId,
      requestTitle: `Aprovar solicitação de ${clientName}`
    });
  };

  const handleReject = (requestId: string, clientName: string) => {
    setConfirmAction({
      type: 'reject',
      requestId,
      requestTitle: `Rejeitar solicitação de ${clientName}`
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

  const getEventTypeBadge = (type: string) => {
    const typeConfig = {
      wedding: { label: 'Casamento', color: 'bg-pink-100 text-pink-800' },
      casamento: { label: 'Casamento', color: 'bg-pink-100 text-pink-800' },
      corporate: { label: 'Corporativo', color: 'bg-blue-100 text-blue-800' },
      corporativo: { label: 'Corporativo', color: 'bg-blue-100 text-blue-800' },
      birthday: { label: 'Aniversário', color: 'bg-yellow-100 text-yellow-800' },
      aniversário: { label: 'Aniversário', color: 'bg-yellow-100 text-yellow-800' },
      'festa de aniversário': { label: 'Aniversário', color: 'bg-yellow-100 text-yellow-800' },
      anniversary: { label: 'Aniversário', color: 'bg-purple-100 text-purple-800' },
      graduation: { label: 'Formatura', color: 'bg-green-100 text-green-800' },
      formatura: { label: 'Formatura', color: 'bg-green-100 text-green-800' },
      'festa de formatura': { label: 'Formatura', color: 'bg-green-100 text-green-800' },
      conference: { label: 'Conferência', color: 'bg-indigo-100 text-indigo-800' },
      conferência: { label: 'Conferência', color: 'bg-indigo-100 text-indigo-800' },
      other: { label: 'Outro', color: 'bg-gray-100 text-gray-800' },
      outro: { label: 'Outro', color: 'bg-gray-100 text-gray-800' },
    };
    
    const normalizedType = type.toLowerCase();
    return typeConfig[normalizedType as keyof typeof typeConfig] || typeConfig.other;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gestão</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Eventos</p>
              <p className="text-2xl font-bold">{dashboardStats.totalEvents}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Solicitações</p>
              <p className="text-2xl font-bold">{dashboardStats.pendingRequests}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Próximos Eventos</p>
              <p className="text-2xl font-bold">{dashboardStats.upcomingEvents}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Receita Mensal</p>
              <p className="text-2xl font-bold">
                R$ {dashboardStats.monthlyRevenue.toLocaleString('pt-BR')}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Eventos/Mês</p>
              <p className="text-2xl font-bold">{dashboardStats.eventsThisMonth}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-teal-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white border-0 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm">Total Clientes</p>
              <p className="text-2xl font-bold">{dashboardStats.clientsCount}</p>
            </div>
            <Users className="w-8 h-8 text-rose-200" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Próximos Eventos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximos Eventos
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{event.clientName}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                          <span>{event.time}</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getEventTypeBadge(event.type).color}`}>
                          {getEventTypeBadge(event.type).label}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          R$ {event.budget.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  {approvedRequests.length === 0 
                    ? "Nenhum evento aprovado ainda" 
                    : "Nenhum evento próximo agendado"
                  }
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Solicitações Pendentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Solicitações Pendentes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{request.clientName}</h4>
                        <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{new Date(request.eventDate).toLocaleDateString('pt-BR')}</span>
                          <span>{request.eventTime}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getEventTypeBadge(request.eventType).color}`}>
                          {getEventTypeBadge(request.eventType).label}
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          R$ {request.budget.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(request.id, request.clientName)}
                        disabled={isLoading}
                      >
                        Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReject(request.id, request.clientName)}
                        disabled={isLoading}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma solicitação pendente
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {message && messageType && (
        <Toast
          message={message}
          type={messageType}
          onClose={clearMessage}
        />
      )}

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
  );
};

export default Dashboard;
