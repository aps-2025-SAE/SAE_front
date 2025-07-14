
import { Calendar} from "lucide-react";

function Default() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <Calendar className="h-20 w-20 text-blue-600 mx-auto mb-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Sistema de Gestão de Eventos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Organize, gerencie e acompanhe todos os seus eventos de forma simples e eficiente.
          </p>
      </div>
      </div>
    </div>
  );
}

export default Default;
