import React, { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback((message, type = 'info', timeout = 3500) => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, message, type }]);
    if (timeout > 0) setTimeout(() => remove(id), timeout);
    return id;
  }, [remove]);

  const api = {
    show,
    success: (msg, t) => show(msg, 'success', t),
    error: (msg, t) => show(msg, 'error', t),
    info: (msg, t) => show(msg, 'info', t),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[200px] max-w-sm px-4 py-2 rounded shadow-md text-sm flex items-center justify-between space-x-3
              ${toast.type === 'success' ? 'bg-green-50 text-green-800' : ''}
              ${toast.type === 'error' ? 'bg-red-50 text-red-800' : ''}
              ${toast.type === 'info' ? 'bg-gray-50 text-gray-800' : ''}`}
          >
            <div className="flex-1">{toast.message}</div>
            <button onClick={() => remove(toast.id)} className="ml-3 text-xs opacity-70 hover:opacity-100">Dismiss</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      show: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
    };
  }
  return ctx;
};

export default ToastContext;
