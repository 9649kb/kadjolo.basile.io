
import { PaymentMethodConfig, Transaction, Sale } from '../types';
import { globalPaymentMethods, financialService } from './mockData';

/**
 * PAYMENT GATEWAY MANAGER
 * 
 * Ce service centralise la gestion des modules de paiement.
 * Il permet d'ajouter, modifier, activer/désactiver des passerelles sans toucher au code.
 */

// Simulation of a database for payment methods
let activeMethods: PaymentMethodConfig[] = [...globalPaymentMethods];

export const PaymentGatewayManager = {
  
  // --- CONFIGURATION MANAGEMENT ---

  getAllMethods: (): PaymentMethodConfig[] => {
    return activeMethods;
  },

  getActiveMethods: (): PaymentMethodConfig[] => {
    return activeMethods.filter(m => m.isActive);
  },

  addMethod: (method: PaymentMethodConfig) => {
    activeMethods.push(method);
    console.log(`[PAYMENT MANAGER] Added method: ${method.name}`);
    return activeMethods;
  },

  updateMethod: (id: string, updates: Partial<PaymentMethodConfig>) => {
    activeMethods = activeMethods.map(m => 
      m.id === id ? { ...m, ...updates } : m
    );
    console.log(`[PAYMENT MANAGER] Updated method: ${id}`);
    return activeMethods;
  },

  deleteMethod: (id: string) => {
    activeMethods = activeMethods.filter(m => m.id !== id);
    console.log(`[PAYMENT MANAGER] Deleted method: ${id}`);
    return activeMethods;
  },

  toggleMethod: (id: string) => {
    activeMethods = activeMethods.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    );
    return activeMethods;
  },

  // --- TRANSACTION PROCESSING ---

  /**
   * Initie une transaction. 
   * Selon le mode (API, Redirect, Manuel), l'action de retour change.
   */
  initiateTransaction: async (
    methodId: string, 
    amount: number, 
    productName: string, 
    vendorId: string,
    customerInfo?: { name: string, email: string }
  ): Promise<{ 
    success: boolean, 
    action: 'redirect' | 'display_instructions' | 'completed', 
    redirectUrl?: string,
    message?: string,
    transactionId?: string
  }> => {
    
    const method = activeMethods.find(m => m.id === methodId);
    if (!method) throw new Error("Méthode de paiement introuvable");

    console.log(`[PAYMENT MANAGER] Initiating ${amount} via ${method.name} (${method.integrationMode})`);

    // 1. MODE: REDIRECT LINK (e.g. Chariow, Paystack Page)
    if (method.integrationMode === 'redirect_link' && method.redirectUrl) {
      // Dans un vrai cas, on ajouterait des paramètres à l'URL (amount, orderID...)
      // Ici on simule une redirection
      return {
        success: true,
        action: 'redirect',
        redirectUrl: method.redirectUrl,
        message: "Redirection vers la passerelle de paiement..."
      };
    }

    // 2. MODE: API SIMULATED (e.g. Stripe JS, PayPal Button)
    if (method.integrationMode === 'api_simulated') {
      // Simulation d'un délai réseau API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enregistrement automatique de la vente
      const txId = `api_${Date.now()}`;
      financialService.processSale(productName, amount, vendorId, method.name, txId);
      
      return {
        success: true,
        action: 'completed',
        transactionId: txId,
        message: "Paiement confirmé par l'API."
      };
    }

    // 3. MODE: MANUAL (e.g. TMoney, Flooz, Virement)
    if (method.integrationMode === 'manual') {
      // On n'enregistre pas encore la vente, on attend la preuve.
      // Le composant UI affichera les instructions.
      return {
        success: true,
        action: 'display_instructions',
        message: "Veuillez suivre les instructions."
      };
    }

    return { success: false, action: 'display_instructions', message: "Configuration invalide" };
  },

  /**
   * Confirme un paiement manuel (après envoi de preuve)
   */
  confirmManualPayment: (
    methodId: string,
    amount: number,
    productName: string,
    vendorId: string,
    proofId: string
  ) => {
     const method = activeMethods.find(m => m.id === methodId);
     const name = method ? method.name : 'Manuel';
     
     // Enregistrement avec statut "Vérification" (Simulé ici comme complété pour la démo)
     financialService.processSale(productName, amount, vendorId, name, proofId);
     return { success: true };
  }
};
