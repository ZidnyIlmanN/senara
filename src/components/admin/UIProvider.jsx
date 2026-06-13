"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext();

export function useUI() {
  return useContext(UIContext);
}

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({ isOpen: false, message: '', onConfirm: null, onCancel: null });

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info')
  };

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        message,
        onConfirm: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <UIContext.Provider value={{ toast, confirm }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[250px] transform transition-all duration-300 translate-x-0 opacity-100 ${
            t.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            t.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
            'bg-green-50 text-green-800 border border-green-200'
          }`}>
            <span className="material-symbols-outlined text-[20px]">
              {t.type === 'error' ? 'error' : t.type === 'info' ? 'info' : 'check_circle'}
            </span>
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 transition-opacity">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 transform transition-all">
            <h3 className="text-lg font-semibold text-[#18281a] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">warning</span>
              Confirmation
            </h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">{confirmState.message}</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={confirmState.onCancel}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmState.onConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition-colors"
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </UIContext.Provider>
  );
}
