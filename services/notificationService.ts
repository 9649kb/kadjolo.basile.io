
// Mock Notification Service

export const sendEmailNotification = async (subject: string, recipients: string[], body?: string) => {
  console.log(`[EMAIL SERVICE] Sending email to ${ recipients.length } recipients.`);
  console.log(`[EMAIL SERVICE] Subject: ${ subject }`);
  if (body) console.log(`[EMAIL SERVICE] Body: ${ body }`);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, count: recipients.length });
    }, 1500);
  });
};

export const notifyCommunity = async (authorName: string, postPreview: string) => {
  // Simulate logic that would run on backend to notify followers
  console.log(`[NOTIF] Notifying followers of ${ authorName }`);
  return sendEmailNotification(
    `Nouveau post de ${ authorName }`,
    ['all_subscribers@kadjolo.com'],
    `Un nouveau contenu a été publié : "${ postPreview }..." Connectez-vous pour voir la suite.`
  );
};

export const notifyNewProduct = async (productName: string) => {
  return sendEmailNotification(
    `Nouveau contenu disponible : ${ productName }`,
    ['all_students@kadjolo.com'],
    `Une nouvelle formation/ressource est disponible sur la marketplace.`
  );
};

export const notifyAdminTestimonial = async (userName: string, testimonial: string) => {
  return sendEmailNotification(
    `Nouveau témoignage de ${ userName }`,
    ['admin@kadjolo.com'],
    `Témoignage reçu : "${ testimonial }"`
  );
};

export const notifyCommentReply = async (originalCommenterName: string, replierName: string, postTitle: string) => {
  // This simulates finding the user's email in the DB and sending the notification
  return sendEmailNotification(
    `Nouvelle réponse de ${ replierName }`,
    [`user_${ originalCommenterName.toLowerCase().replace(' ', '_') }@gmail.com`], // Simulated recipient
    `Bonjour ${ originalCommenterName }, ${ replierName } a répondu à votre commentaire sur le post "${ postTitle }".`
  );
};

export const notifyAdminPayoutRequest = async (vendorName: string, amount: number, method: string) => {
  return sendEmailNotification(
    `💰 Demande de retrait : ${ vendorName }`,
    ['admin@kadjolo.com', 'finance@kadjolo.com'], // Emails du fondateur/admin
    `ALERTE FINANCE :\n\nLe vendeur ${ vendorName } a demandé un retrait de ${ amount.toLocaleString() } FCFA.\nMoyen de paiement souhaité : ${ method }.\n\nConnectez-vous au tableau de bord Admin > Finance pour valider ou refuser.`
  );
};

// NEW: Reward Claim Notification
export const notifyRewardClaim = async (vendorName: string, rewardTitle: string, rewardValue: string | number) => {
  return sendEmailNotification(
    `🎁 RÉCLAMATION CADEAU : ${ vendorName }`,
    ['admin@kadjolo.com'],
    `ACTION REQUISE :\n\nLe vendeur "${ vendorName }" a débloqué le palier "${ rewardTitle }".\nIl réclame son gain : ${ rewardValue }.\n\nVeuillez vérifier son éligibilité dans le Dashboard Admin > Récompenses et procéder à l'envoi.`
  );
};

/**
 * Added missing notification for user support reply.
 * Fixes error: Module '"../services/notificationService"' has no exported member 'notifyUserSupportReply'.
 */
export const notifyUserSupportReply = async (userEmail: string, subject: string, reply: string) => {
  return sendEmailNotification(
    `Réponse à votre message : ${ subject }`,
    [userEmail],
    `Bonjour,\n\nUne réponse a été apportée à votre message concernant "${ subject }" :\n\n"${ reply }"\n\nL'équipe KADJOLO BASILE`
  );
};

// NEW: Newsletter Subscription
export const subscribeToNewsletter = async (email: string) => {
  console.log(`[NEWSLETTER] New subscriber: ${ email }`);
  // In a real app, this would perform a POST request to Mailchimp/ConvertKit/Systeme.io
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate success
      resolve({ success: true, message: "Inscription confirmée" });
    }, 1200);
  });
};
