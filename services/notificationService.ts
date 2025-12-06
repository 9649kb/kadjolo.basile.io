
// Mock Notification Service

export const sendEmailNotification = async (subject: string, recipients: string[], body?: string) => {
  console.log(`[EMAIL SERVICE] Sending email to ${recipients.length} recipients.`);
  console.log(`[EMAIL SERVICE] Subject: ${subject}`);
  if(body) console.log(`[EMAIL SERVICE] Body: ${body}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, count: recipients.length });
    }, 1500);
  });
};

export const notifyCommunity = async (authorName: string, postPreview: string) => {
  // Simulate logic that would run on backend to notify followers
  console.log(`[NOTIF] Notifying followers of ${authorName}`);
  return sendEmailNotification(
    `Nouveau post de ${authorName}`, 
    ['all_subscribers@kadjolo.com'],
    `Un nouveau contenu a été publié : "${postPreview}..." Connectez-vous pour voir la suite.`
  );
};

export const notifyNewProduct = async (productName: string) => {
  return sendEmailNotification(
    `Nouveau contenu disponible : ${productName}`,
    ['all_students@kadjolo.com'],
    `Une nouvelle formation/ressource est disponible sur la marketplace.`
  );
};

export const notifyAdminTestimonial = async (userName: string, testimonial: string) => {
  return sendEmailNotification(
    `Nouveau témoignage de ${userName}`,
    ['admin@kadjolo.com'],
    `Témoignage reçu : "${testimonial}"`
  );
};

export const notifyCommentReply = async (originalCommenterName: string, replierName: string, postTitle: string) => {
  // This simulates finding the user's email in the DB and sending the notification
  return sendEmailNotification(
    `Nouvelle réponse de ${replierName}`,
    [`user_${originalCommenterName.toLowerCase().replace(' ', '_')}@gmail.com`], // Simulated recipient
    `Bonjour ${originalCommenterName}, ${replierName} a répondu à votre commentaire sur le post "${postTitle}".`
  );
};
