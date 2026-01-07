
/**
 * TRACKING SERVICE SIMPLIFIÉ - KADJOLO BASILE
 * Gère uniquement le stockage des IDs pour l'interface.
 */

export const TrackingService = {
  testConnection: async (platform: string, id: string): Promise<{ success: boolean; message: string }> => {
    // Simulation simple de test
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => resolve({ success: true, message: "Test simulé réussi" }), 500);
    });
  },
  track: (event: string, data: any = {}) => {
    // Désactivé pour revenir à l'état précédent
    console.log(`[TRACKING SILENCIEUX] ${event}`, data);
  }
};
