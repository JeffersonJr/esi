import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean;
  message?: string;
}

export function useUnsavedChanges({ 
  hasUnsavedChanges, 
  message = 'Você tem alterações não salvas. Tem certeza que deseja sair?' 
}: UseUnsavedChangesOptions) {
  const [showModal, setShowModal] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle browser navigation (back/forward buttons, refresh)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, message]);

  // Intercept navigation attempts
  const confirmNavigation = useCallback((to: string) => {
    if (hasUnsavedChanges) {
      setNextLocation(to);
      setShowModal(true);
      return false;
    }
    return true;
  }, [hasUnsavedChanges]);

  // Handle modal confirmation
  const handleConfirm = useCallback(() => {
    setShowModal(false);
    if (nextLocation) {
      navigate(nextLocation);
      setNextLocation(null);
    }
  }, [nextLocation, navigate]);

  // Handle modal cancellation - allow closing without saving
  const handleCancel = useCallback(() => {
    setShowModal(false);
    setNextLocation(null);
  }, []);

  // Handle close without saving
  const handleCloseWithoutSaving = useCallback(() => {
    setShowModal(false);
    setNextLocation(null);
  }, []);

  return {
    showModal,
    showUnsavedChangesModal: () => setShowModal(true),
    hideUnsavedChangesModal: () => setShowModal(false),
    confirmNavigation,
    handleConfirm,
    handleCancel,
    handleCloseWithoutSaving
  };
}
