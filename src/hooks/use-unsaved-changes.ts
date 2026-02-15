import { useState, useCallback } from 'react';

interface UseUnsavedChangesOptions {
  onContinueEditing?: () => void;
  onExitWithoutSaving?: () => void;
}

export function useUnsavedChanges(options: UseUnsavedChangesOptions = {}) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const markAsDirty = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markAsClean = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const handleExitAttempt = useCallback((action: () => void) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => action);
      setShowUnsavedChangesDialog(true);
    } else {
      action();
    }
  }, [hasUnsavedChanges]);

  const handleContinueEditing = useCallback(() => {
    setShowUnsavedChangesDialog(false);
    setPendingAction(null);
    options.onContinueEditing?.();
  }, [options]);

  const handleExitWithoutSaving = useCallback(() => {
    setShowUnsavedChangesDialog(false);
    setHasUnsavedChanges(false);
    
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    
    options.onExitWithoutSaving?.();
  }, [pendingAction, options]);

  return {
    hasUnsavedChanges,
    showUnsavedChangesDialog,
    markAsDirty,
    markAsClean,
    handleExitAttempt,
    handleContinueEditing,
    handleExitWithoutSaving
  };
}
