
import { User, Post, Course, VendorProfile, Testimonial } from '../types';

// CENTRALIZED CONFIGURATION
// Modifier ici pour changer les infos sur tout le site
export const siteConfig = {
  adminName: 'KADJOLO BASILE',
  email: 'basilekadjolo4@gmail.com',
  phone: '+228 96495419',
  location: 'Togo, Kara',
  // Remplacez cette URL par le lien de votre vraie photo de profil
  profilePicture: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 
  socials: {
    facebook: 'https://www.facebook.com/share/1FYheGA3BV/',
    youtube: 'https://youtube.com/@tech-astuces3?si=3fPsryc13SovikDe',
    instagram: 'https://www.instagram.com/basilekadjolo?igsh=MW9tbTdrbmJnMDNmeA==',
    tiktok: 'https://www.tiktok.com/@kadjolo.basile.officiel'
  } as const,
  heroText: {
    title: "Révélez votre Potentiel.",
    subtitle: "Dominez votre Marché.",
    description: "Bienvenue sur l'espace officiel de KADJOLO BASILE. Formations d'élite, communauté privée et ressources exclusives pour entrepreneurs ambitieux."
  }
};

export const currentUser: User = {
  id: 'u1',
  name: siteConfig.adminName, // Set as Admin for demo purposes to see the profile pic
  avatar: siteConfig.profilePicture,
  role: 'admin', // Changed to admin to show edit features
  email: siteConfig.email
};

export const vendorProfiles: VendorProfile[] = [
  {
    id: 'v1',
    userId: 'u1',
    shopName: 'KADJOLO Official Store',
    description: 'La boutique officielle. Retrouvez ici toutes mes méthodes exclusives pour réussir votre business et votre mindset.',
    logoUrl: siteConfig.profilePicture,
    isVerified: true,
    isTopSeller: true,
    joinedDate: 'Jan 2023'
  },
  {
    id: 'v2',
    userId: 'u2',
    shopName: 'Digital Success Academy',
    description: 'Expert en marketing digital et freelance. J\'aide les créateurs à vivre de leur passion.',
    logoUrl: 'https://picsum.photos/200/200?random=50',
    isVerified: true,
    isTopSeller: false,
    joinedDate: 'Mars 2023'
  },
  {
    id: 'v3',
    userId: 'u3',
    shopName: 'Marie Currie Shop',
    description: 'Livres et guides pratiques pour les femmes entrepreneures.',
    logoUrl: 'https://picsum.photos/200/200?random=51',
    isVerified: false,
    isTopSeller: false,
    joinedDate: 'Avril 2023'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Jean-Pierre K.',
    role: 'Entrepreneur E-commerce',
    content: "Grâce aux conseils de Basile, j'ai doublé mon chiffre d'affaires en 3 mois. Une pédagogie claire et directe.",
    avatar: 'https://picsum.photos/100/100?random=20',
    rating: 5
  },
  {
    id: 't2',
    name: 'Amina D.',
    role: 'Coach de Vie',
    content: "La formation sur le leadership a été un déclic. Je me sens enfin légitime et puissante dans mon activité.",
    avatar: 'https://picsum.photos/100/100?random=21',
    rating: 5
  },
  {
    id: 't3',
    name: 'Michel T.',
    role: 'Freelance',
    content: "La communauté est incroyable. On se tire tous vers le haut. C'est le meilleur investissement de mon année.",
    avatar: 'https://picsum.photos/100/100?random=22',
    rating: 4
  },
  {
    id: 't4',
    name: 'Sophie L.',
    role: 'Étudiante',
    content: "Je partais de zéro et aujourd'hui j'ai lancé ma première offre. Merci pour la bienveillance et l'exigence.",
    avatar: 'https://picsum.photos/100/100?random=23',
    rating: 5
  }
];

export const posts: Post[] = [
  {
    id: 'p1',
    author: { id: 'admin', name: siteConfig.adminName, avatar: siteConfig.profilePicture, role: 'admin', email: siteConfig.email },
    content: "L'échec n'est qu'une étape vers le succès. Écoutez ce message vocal pour la motivation du jour !",
    image: 'https://picsum.photos/800/400',
    audioUrl: 'mock-audio.mp3',
    attachmentType: 'audio',
    likes: 1240,
    comments: 45,
    timestamp: 'Il y a 2 heures',
    likedByMe: false
  },
  {
    id: 'p2',
    author: { id: 'u2', name: 'Sarah M.', avatar: 'https://picsum.photos/101/101', role: 'student', email: 'sarah@test.com' },
    content: "Merci pour la formation sur le leadership, ça a changé ma vision du management. Voici mon certificat !",
    attachmentUrl: 'certificat.pdf',
    attachmentType: 'file',
    likes: 89,
    comments: 12,
    timestamp: 'Il y a 5 heures',
    likedByMe: true
  }
];

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Leadership Absolu : Devenez Incontournable',
    instructor: siteConfig.adminName,
    instructorId: 'v1',
    price: 197,
    image: 'https://picsum.photos/400/250?random=1',
    category: 'Business',
    rating: 4.9,
    students: 1205,
    isPremium: true,
    type: 'course',
    description: 'Une formation vidéo complète de 12 modules pour maîtriser les aspects fondamentaux du leadership moderne.',
    reviews: [
      {
        id: 'r1',
        userId: 'u3',
        userName: 'Marc Dupont',
        userAvatar: 'https://picsum.photos/50/50?random=1',
        rating: 5,
        comment: "Excellente formation. J'ai appliqué les conseils dès la première semaine.",
        date: "12 Oct 2023",
        reply: "Merci Marc ! Ravi de voir tes progrès."
      },
      {
        id: 'r2',
        userId: 'u4',
        userName: 'Julie K.',
        userAvatar: 'https://picsum.photos/50/50?random=2',
        rating: 4,
        comment: "Très dense mais incroyablement riche. Je recommande.",
        date: "05 Nov 2023"
      }
    ]
  },
  {
    id: 'eb1',
    title: 'Les 10 Piliers de la Richesse (E-Book)',
    instructor: siteConfig.adminName,
    instructorId: 'v1',
    price: 27,
    image: 'https://picsum.photos/300/450?random=10', // Vertical image for book cover
    category: 'Finance',
    rating: 4.8,
    students: 3400,
    isPremium: false,
    type: 'ebook',
    description: 'Le guide ultime au format PDF. 250 pages de stratégies financières applicables immédiatement.',
    reviews: []
  },
  {
    id: 'c2',
    title: 'Marketing Digital pour Créateurs',
    instructor: 'Digital Success Academy',
    instructorId: 'v2',
    price: 49,
    image: 'https://picsum.photos/400/250?random=2',
    category: 'Marketing',
    rating: 4.5,
    students: 850,
    isPremium: false,
    type: 'course',
    description: 'Apprenez à vendre vos compétences en ligne avec ce cours pratique.',
    reviews: []
  },
  {
    id: 'eb2',
    title: 'Dominez votre Marché (Guide PDF)',
    instructor: 'Marie Currie',
    instructorId: 'v3', // No profile yet
    price: 19,
    image: 'https://picsum.photos/300/450?random=11',
    category: 'Business',
    rating: 4.7,
    students: 950,
    isPremium: false,
    type: 'ebook',
    description: 'Un plan d\'action étape par étape pour écraser la concurrence.',
    reviews: []
  },
  {
    id: 'c3',
    title: 'Parler en Public avec Charisme',
    instructor: siteConfig.adminName,
    instructorId: 'v1',
    price: 97,
    image: 'https://picsum.photos/400/250?random=3',
    category: 'Soft Skills',
    rating: 4.8,
    students: 2300,
    isPremium: true,
    type: 'course',
    description: 'Techniques d\'orateurs professionnels pour captiver n\'importe quel auditoire.',
    reviews: []
  }
];
