
import { YouTubeVideo } from '../types';

// Configuration de la chaîne officielle KADJOLO Basile
const CHANNEL_NAME = 'KADJOLO Basile';

/**
 * Liste synchronisée des vidéos réelles fournies par l'utilisateur.
 * Utilisation de hqdefault.jpg pour assurer l'affichage sur tous les navigateurs.
 */
const KADJOLO_VIDEOS: YouTubeVideo[] = [
  {
    id: '21m45cKIcuA',
    title: 'Comment développer un Mindset de Leader Gagnant',
    thumbnail: 'https://img.youtube.com/vi/21m45cKIcuA/hqdefault.jpg',
    views: '1.5k',
    publishedAt: 'Récemment',
    url: 'https://www.youtube.com/watch?v=21m45cKIcuA'
  },
  {
    id: 'a5rJWlTtoiQ',
    title: 'La Stratégie Ultime pour multiplier tes revenus',
    thumbnail: 'https://img.youtube.com/vi/a5rJWlTtoiQ/hqdefault.jpg',
    views: '980',
    publishedAt: 'Il y a 1 semaine',
    url: 'https://www.youtube.com/watch?v=a5rJWlTtoiQ'
  },
  {
    id: 'CP83s4yNPh4',
    title: 'Intelligence Financière : Ce que l\'école cache',
    thumbnail: 'https://img.youtube.com/vi/CP83s4yNPh4/hqdefault.jpg',
    views: '2.8k',
    publishedAt: 'Il y a 2 semaines',
    url: 'https://www.youtube.com/watch?v=CP83s4yNPh4'
  },
  {
    id: 'tJp_YH70F3w',
    title: 'La Discipline des 1% : Mindset & Habitudes',
    thumbnail: 'https://img.youtube.com/vi/tJp_YH70F3w/hqdefault.jpg',
    views: '4.7k',
    publishedAt: 'Il y a 1 mois',
    url: 'https://www.youtube.com/watch?v=tJp_YH70F3w'
  },
  {
    id: 'iMj9zB16DTQ',
    title: 'Secrets de Négociation pour Entrepreneurs',
    thumbnail: 'https://img.youtube.com/vi/iMj9zB16DTQ/hqdefault.jpg',
    views: '1.9k',
    publishedAt: 'Il y a 1 mois',
    url: 'https://www.youtube.com/watch?v=iMj9zB16DTQ'
  },
  {
    id: 'TSMpf26Jmds',
    title: 'Productivité Massive : Gérer son temps',
    thumbnail: 'https://img.youtube.com/vi/TSMpf26Jmds/hqdefault.jpg',
    views: '3.1k',
    publishedAt: 'Il y a 2 mois',
    url: 'https://www.youtube.com/watch?v=TSMpf26Jmds'
  },
  {
    id: '_Qkf-qPaxDs',
    title: 'L\'Art de l\'Excellence : Guide Pratique',
    thumbnail: 'https://img.youtube.com/vi/_Qkf-qPaxDs/hqdefault.jpg',
    views: '5.5k',
    publishedAt: 'Il y a 2 mois',
    url: 'https://www.youtube.com/watch?v=_Qkf-qPaxDs'
  },
  {
    id: 'qbEY1fpBpXs',
    title: 'Vision 2025 : Préparez votre Succès',
    thumbnail: 'https://img.youtube.com/vi/qbEY1fpBpXs/hqdefault.jpg',
    views: '12k',
    publishedAt: 'Il y a 3 mois',
    url: 'https://www.youtube.com/watch?v=qbEY1fpBpXs'
  }
];

export const fetchLatestVideos = async (): Promise<YouTubeVideo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(KADJOLO_VIDEOS);
    }, 1000);
  });
};
