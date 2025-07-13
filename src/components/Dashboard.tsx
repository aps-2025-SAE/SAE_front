
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Clock, TrendingUp, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  // Dados mockados estáticos para exemplo
  const dashboardStats = {
    totalEvents: 45,
    pendingRequests: 12,
    upcomingEvents: 8,
    monthlyRevenue: 125000,
    eventsThisMonth: 15,
    clientsCount: 78
  };

  const upcomingEvents = [
    {
      id: 1,
      title: "Casamento Silva & Santos",
      clientName: "Maria Silva",
      date: "2025-08-15",
      time: "18:00",
      location: "Salão Cristal",
      type: "wedding",
      budget: 25000
    },
    {
      id: 2,
      title: "Evento Corporativo Tech",
      clientName: "Empresa TechCorp",
      date: "2025-07-25",
      time: "14:00",
      location: "Hotel Plaza",
      type: "corporate",
      budget: 15000
    }
  ];

  const pendingRequests = [
    {
      id: 1,
      clientName: "João Oliveira",
      description: "Festa de aniversário de 50 anos",
      eventDate: "2025-09-10",
      eventTime: "19:00",
      eventType: "birthday",
      budget: 8000
    },
    {
      id: 2,
      clientName: "Ana Costa",
      description: "Evento de formatura",
      eventDate: "2025-08-30",
      eventTime: "20:00",
      eventType: "other",
      budget: 12000
    }
  ];

  const getEventTypeBadge = (type: string) => {
    const typeConfig = {
      wedding: { label: 'Casamento', color: 'bg-pink-100 text-pink-800' },
      corporate: { label: 'Corporativo', color: 'bg-blue-100 text-blue-800' },
      birthday: { label: 'Aniversário', color: 'bg-yellow-100 text-yellow-800' },
      anniversary: { label: 'Aniversário', color: 'bg-purple-100 text-purple-800' },
      other: { label: 'Outro', color: 'bg-gray-100 text-gray-800' },
    };
    
    return typeConfig[type as keyof typeof typeConfig] || typeConfig.other;
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
                  Nenhum evento próximo
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
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Aprovar
                      </Button>
                      <Button size="sm" variant="outline">
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
    </div>
  );
};

export default Dashboard;
