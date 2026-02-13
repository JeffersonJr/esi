import { useEffect, useState } from 'react';
import { DeletedLead } from '@/types/lead';

export function useDeletedLeadsCleanup(
  deletedLeads: DeletedLead[],
  onAutoDelete: (leadIds: string[]) => void
) {
  const [isCleanupEnabled, setIsCleanupEnabled] = useState(true);

  useEffect(() => {
    if (!isCleanupEnabled) return;

    const checkAndCleanup = () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      const expiredLeads = deletedLeads.filter(lead => {
        if (lead.restoredAt) return false; // Não limpar leads já restaurados
        
        const deletedDate = new Date(lead.deletedAt);
        return deletedDate < thirtyDaysAgo;
      });

      if (expiredLeads.length > 0) {
        const expiredIds = expiredLeads.map(lead => lead.id);
        onAutoDelete(expiredIds);
        
        // Log para auditoria
        console.log(`Auto-cleanup: ${expiredLeads.length} leads permanentemente excluídos após 30 dias:`, expiredIds);
      }
    };

    // Verificar a cada hora
    const interval = setInterval(checkAndCleanup, 60 * 60 * 1000);
    
    // Verificar imediatamente ao montar
    checkAndCleanup();

    return () => clearInterval(interval);
  }, [deletedLeads, isCleanupEnabled, onAutoDelete]);

  // Função para limpar manualmente
  const manualCleanup = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const expiredLeads = deletedLeads.filter(lead => {
      if (lead.restoredAt) return false;
      
      const deletedDate = new Date(lead.deletedAt);
      return deletedDate < thirtyDaysAgo;
    });

    if (expiredLeads.length > 0) {
      const expiredIds = expiredLeads.map(lead => lead.id);
      onAutoDelete(expiredIds);
      return expiredLeads.length;
    }

    return 0;
  };

  // Função para obter estatísticas
  const getCleanupStats = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    const expiringInSevenDays = deletedLeads.filter(lead => {
      if (lead.restoredAt) return false;
      const deletedDate = new Date(lead.deletedAt);
      const thirtyDaysFromDeletion = new Date(deletedDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      return thirtyDaysFromDeletion <= sevenDaysAgo && thirtyDaysFromDeletion > now;
    });

    const alreadyExpired = deletedLeads.filter(lead => {
      if (lead.restoredAt) return false;
      const deletedDate = new Date(lead.deletedAt);
      return deletedDate < thirtyDaysAgo;
    });

    return {
      totalInTrash: deletedLeads.filter(lead => !lead.restoredAt).length,
      expiringInSevenDays: expiringInSevenDays.length,
      alreadyExpired: alreadyExpired.length,
      restored: deletedLeads.filter(lead => lead.restoredAt).length
    };
  };

  return {
    isCleanupEnabled,
    setIsCleanupEnabled,
    manualCleanup,
    getCleanupStats
  };
}
