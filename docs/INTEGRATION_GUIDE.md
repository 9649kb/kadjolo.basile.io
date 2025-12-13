
# Guide d'Intégration & Configuration

Ce document explique comment configurer les paiements, les commissions et les webhooks pour la plateforme KADJOLO BASILE.

## 1. Configuration des Moyens de Paiement (Admin)

L'administrateur peut ajouter ou modifier des moyens de paiement via le **Creator Studio > Admin > Paiements**.

### Types de méthodes supportées :
1.  **Manuelle (Mobile Money / Virement)** :
    *   Affichage d'instructions (ex: "Envoyez X au 9090...").
    *   L'utilisateur doit soumettre une preuve (ID Transaction).
    *   Validation manuelle requise par l'admin.
2.  **API Simulée / Native (Stripe / PayPal)** :
    *   Nécessite `Public Key` et `Secret Key`.
    *   Le paiement est validé automatiquement via Webhook.
3.  **Redirection (Lien Externe)** :
    *   Redirige l'utilisateur vers une page de paiement tierce (ex: Paystack Payment Page).

### Sécurité des Clés API
Les clés secrètes (`Secret Key`) sont stockées en base de données mais **jamais renvoyées au frontend**. L'API `/api/admin/payments` renvoie `***MASKED***` pour ces champs.

---

## 2. Configuration des Webhooks

Pour que les paiements automatiques (Stripe, PayPal) mettent à jour le statut des commandes, vous devez configurer les webhooks chez le fournisseur.

### URLs des Endpoints
*   **Stripe** : `https://votre-site.com/webhook/stripe`
    *   Events à écouter : `checkout.session.completed`
*   **PayPal** : `https://votre-site.com/webhook/paypal`
    *   Events à écouter : `PAYMENT.CAPTURE.COMPLETED`
*   **Mobile Money (API)** : `https://votre-site.com/webhook/mobile-money`

### Exemple de payload Mobile Money
```json
{
  "tx_ref": "TX-123456",
  "status": "successful",
  "amount": 5000,
  "currency": "XOF"
}
```

---

## 3. Gestion des Commissions

### Mode A : Collecte Centrale (Par défaut)
1.  Le client paie 100% du montant à la plateforme (Admin).
2.  Le système crédite virtuellement le `walletBalance` du vendeur (Prix - Commission).
3.  Le vendeur demande un retrait.
4.  L'admin valide et effectue le virement manuellement ou via API de masse.

### Mode B : Split Automatique (Stripe Connect)
Si vous utilisez Stripe Connect, le split se fait à la source.
*   Dans `backend/server.js`, lors de la création de la session Stripe, ajoutez :
    ```javascript
    application_fee_amount: 1000, // Part Admin
    transfer_data: {
      destination: vendor_stripe_account_id,
    },
    ```
*   Cela nécessite que le vendeur connecte son compte Stripe (non implémenté dans cette version de base).

---

## 4. Hébergement des Vidéos

Le formulaire de création de produit permet deux modes :
1.  **Lien Externe** : YouTube (Non listé), Vimeo, Google Drive. Idéal pour réduire les coûts de bande passante.
2.  **Upload Direct** : Les fichiers sont envoyés au serveur (`/api/vendor/products` avec `multer`). 
    *   *Recommandation Prod* : Ne stockez pas les fichiers sur le serveur Node. Utilisez AWS S3 ou Cloudinary. Modifiez la logique d'upload dans `server.js` pour envoyer le stream vers S3.
