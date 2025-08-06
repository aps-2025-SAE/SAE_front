import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <div
        className={`pointer-events-auto transform transition-all duration-300 ease-in-out`}
      >
        <div
          className={`rounded-lg shadow-lg p-4 min-w-[300px] max-w-md border ${
            type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium text-sm">{message}</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={`
                h-6 w-6 p-0 hover:bg-transparent
                ${type === 'success' ? 'hover:text-green-900' : 'hover:text-red-900'}
              `}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
