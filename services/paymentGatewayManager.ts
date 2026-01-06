
import { PaymentMethodConfig } from '../types';
import { globalPaymentMethods } from './mockData';

/**
 * Interface pour le résultat d'une transaction
 */
export interface PaymentResult {
  success: boolean;
  action: 'display_instructions' | 'completed' | 'redirect' | 'error';
  message?: string;
  instructions?: string;
  requiresProof?: boolean;
  transactionId?: string;
  redirectUrl?: string;
}

/**
 * PAYMENT GATEWAY MANAGER PRO
 * Gestionnaire centralisé contrôlé exclusivement par le fondateur.
 */

// Initialisation synchronisée avec mockData
let methods: PaymentMethodConfig[] = [...globalPaymentMethods];

export const PaymentGatewayManager = {
  
  getAllMethods: (): PaymentMethodConfig[] => {
    return methods;
  },

  /**
   * SEULES les méthodes avec isActive: true seront montrées aux acheteurs.
   */
  getActiveMethods: (): PaymentMethodConfig[] => {
    return methods.filter(m => m.isActive);
  },

  /**
   * L'Admin peut ajouter n'importe quelle méthode manuellement.
   */
  addMethod: (newMethod: PaymentMethodConfig) => {
    methods = [newMethod, ...methods];
    console.log(`[ADMIN] Nouvelle méthode ajoutée : ${newMethod.name}`);
    return methods;
  },

  /**
   * Désactiver une méthode (elle ne sera plus visible sur le formulaire de paiement).
   */
  toggleMethod: (id: string) => {
    methods = methods.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    );
    return methods;
  },

  updateMethod: (id: string, updates: Partial<PaymentMethodConfig>) => {
    methods = methods.map(m => 
      m.id === id ? { ...m, ...updates } : m
    );
    return methods;
  },

  deleteMethod: (id: string) => {
    methods = methods.filter(m => m.id !== id);
    return methods;
  },

  /**
   * INITIER TRANSACTION
   * Toute somme payée par un acheteur va directement au Fondateur.
   */
  initiateTransaction: async (
    methodId: string, 
    amount: number, 
    productName: string, 
    vendorId: string
  ): Promise<PaymentResult> => {
    const method = methods.find(m => m.id === methodId);
    
    if (!method || !method.isActive) {
      return {
        success: false,
        action: 'error',
        message: "Cette méthode de paiement est temporairement désactivée par l'administrateur."
      };
    }

    console.log(`[FINANCE CENTRALISEE] Transaction de ${amount} via ${method.name} vers le compte Admin.`);

    if (method.integrationMode === 'manual') {
      return {
        success: true,
        action: 'display_instructions',
        instructions: method.instructions,
        requiresProof: method.requiresProof
      };
    }

    return {
      success: true,
      action: 'completed',
      transactionId: `TX-${Date.now()}-${Math.floor(Math.random()*1000)}`
    };
  },

  confirmManualPayment: (methodId: string, amount: number, productName: string, vendorId: string, proofId: string) => {
    console.log(`[FINANCE] Confirmation de réception manuelle requise pour l'admin. Preuve: ${proofId}`);
    return true;
  }
};
