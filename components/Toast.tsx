
import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] flex flex-col items-center gap-2 p-4 pointer-events-none" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const getColorClass = () => {
    switch (toast.type) {
      case 'success': return 'border-success bg-success-bg text-success';
      case 'error': return 'border-error bg-error-bg text-error';
      case 'warning': return 'border-warning bg-warning-bg text-warning';
      case 'info': return 'border-primary/50 bg-primary-alpha-10 text-primary-light';
      default: return 'border-white/10 bg-white/5 text-text-tertiary';
    }
  };

  return (
    <div
      className={`toast pointer-events-auto ${getColorClass()} animate-slide-down flex items-center gap-4 max-w-md shadow-2xl glass border !bg-opacity-80`}
      onClick={() => onRemove(toast.id)}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
        <span className="material-symbols-outlined text-2xl">{getIcon()}</span>
      </div>
      <span className="text-sm font-black text-white flex-1 tracking-tight font-body">{toast.message}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(toast.id);
        }}
        className="size-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-all active:scale-90"
      >
        <span className="material-symbols-outlined text-lg opacity-60">close</span>
      </button>
    </div>
  );
};
