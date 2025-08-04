import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  LogOut
} from "lucide-react"
import { useAuth } from "@/context/AuthContext";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Eventos",
      href: "/eventos"
    }
  ]

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col`}>
      {/* Header do Sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            <a href="/default">
              Gestão de Eventos
            </a>
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all group`}
            title={isCollapsed ? item.label : ''}
          >
            <span className="flex-shrink-0">
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="font-medium">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer do Sidebar */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.nome?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.nome || "Usuário"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || ""}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
