
import React from 'react';
import { Shield, FileText, Scale, RotateCcw } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'legal' | 'refund';
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const renderContent = () => {
    switch (type) {
      case 'privacy':
        return (
          <>
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3"><Shield className="text-brand-blue" /> Politique de Confidentialité</h1>
            <p><strong>Dernière mise à jour : Octobre 2023</strong></p>
            
            <h3>1. Collecte de l'information</h3>
            <p>Nous recueillons des informations lorsque vous vous inscrivez sur notre site, vous connectez à votre compte, faites un achat. Les informations recueillies incluent votre nom, votre adresse e-mail et votre numéro de téléphone.</p>
            
            <h3>2. Utilisation des informations</h3>
            <p>Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :</p>
            <ul>
              <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
              <li>Améliorer notre site Web</li>
              <li>Améliorer le service client et vos besoins de prise en charge</li>
              <li>Vous contacter par e-mail</li>
              <li>Administrer un concours, une promotion ou une enquête</li>
            </ul>

            <h3>3. Confidentialité du commerce en ligne</h3>
            <p>Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société pour n'importe quelle raison, sans votre consentement.</p>

            <h3>4. Divulgation à des tiers</h3>
            <p>Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles identifiables à des tiers. Cela ne comprend pas les tierce parties de confiance qui nous aident à exploiter notre site Web, tant que ces parties conviennent de garder ces informations confidentielles.</p>
          </>
        );
      case 'terms':
        return (
          <>
             <h1 className="text-3xl font-bold mb-6 flex items-center gap-3"><FileText className="text-brand-blue" /> Conditions Générales de Vente (CGV)</h1>
             <p>Les présentes conditions générales de vente s'appliquent à toutes les ventes conclues sur le site Internet KADJOLO BASILE.</p>

             <h3>Article 1 - Principes</h3>
             <p>Les présentes conditions générales expriment l'intégralité des obligations des parties. L'acheteur est réputé les accepter sans réserve.</p>

             <h3>Article 2 - Prix</h3>
             <p>Les prix de nos produits sont indiqués en Francs CFA (XOF), Euros (€) ou Dollars ($) toutes taxes comprises (TTC). Les frais de traitement sont inclus.</p>

             <h3>Article 3 - Commandes</h3>
             <p>Les commandes se font exclusivement sur Internet. Le paiement est exigible immédiatement à la commande.</p>

             <h3>Article 4 - Livraison</h3>
             <p>Les produits numériques (formations, ebooks) sont livrés immédiatement après validation du paiement via un accès à l'espace membre ou un lien de téléchargement envoyé par email.</p>
          </>
        );
      case 'legal':
        return (
          <>
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3"><Scale className="text-brand-blue" /> Mentions Légales</h1>
            
            <h3>Éditeur du Site</h3>
            <p>Le site est édité par l'entreprise <strong>KADJOLO BASILE ENTERPRISE</strong>.</p>
            <p>Siège social : Kara, Togo</p>
            <p>Directeur de la publication : Kadjolo Basile</p>
            <p>Email : contact@kadjolo.com</p>
            <p>Téléphone : +228 96495419</p>

            <h3>Hébergement</h3>
            <p>Le site est hébergé par Vercel Inc. (USA) et utilise les infrastructures de Google Cloud Platform.</p>

            <h3>Propriété Intellectuelle</h3>
            <p>Tout le contenu du présent site, incluant, de façon non limitative, les graphismes, images, textes, vidéos, animations, sons, logos, gifs et icônes ainsi que leur mise en forme sont la propriété exclusive de la société.</p>
          </>
        );
      case 'refund':
        return (
          <>
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3"><RotateCcw className="text-brand-blue" /> Politique de Remboursement</h1>
            
            <h3>Garantie Satisfait ou Remboursé</h3>
            <p>Nous proposons une garantie "Satisfait ou Remboursé" de 30 jours sur certaines de nos formations (indiqué sur la page produit).</p>

            <h3>Conditions de remboursement</h3>
            <p>Pour être éligible à un remboursement, vous devez :</p>
            <ul>
              <li>Faire la demande dans les 30 jours suivant l'achat.</li>
              <li>Avoir visionné moins de 20% du contenu de la formation.</li>
              <li>Justifier que la formation ne correspond pas à la promesse de vente.</li>
            </ul>

            <h3>Procédure</h3>
            <p>Envoyez votre demande par email à refund@kadjolo.com avec votre preuve d'achat. Le remboursement sera effectué sur le moyen de paiement utilisé lors de la commande sous 10 jours ouvrés.</p>
          </>
        );
      default:
        return <p>Page non trouvée</p>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-lg prose-blue max-w-none">
        {renderContent()}
      </div>
    </div>
  );
};

export default LegalPage;