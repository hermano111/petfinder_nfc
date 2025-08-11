import React from 'react';
import Icon from '../../../components/AppIcon';

const RewardInfoSection = ({ rewardInfo = null }) => {
  if (!rewardInfo || !rewardInfo?.isOffered) {
    return null;
  }

  const {
    amount = null,
    currency = "EUR",
    description = "Recompensa por encontrar a esta mascota",
    conditions = [],
    contactInfo = null
  } = rewardInfo;

  return (
    <div className="bg-gradient-to-r from-accent/10 to-warning/10 border border-accent/30 rounded-lg p-6">
      <div className="text-center space-y-4">
        {/* Reward Icon and Title */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
            <Icon name="Gift" size={32} className="text-accent" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-accent mb-2">¡Recompensa Ofrecida!</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Reward Amount */}
        {amount && (
          <div className="bg-card border border-accent/20 rounded-lg p-4 inline-block">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Euro" size={24} className="text-accent" />
              <span className="text-3xl font-bold text-accent">{amount}</span>
              <span className="text-lg text-accent">{currency}</span>
            </div>
          </div>
        )}

        {/* Conditions */}
        {conditions?.length > 0 && (
          <div className="bg-card/50 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Icon name="CheckCircle" size={20} className="text-success mr-2" />
              Condiciones para la Recompensa
            </h3>
            <ul className="space-y-2">
              {conditions?.map((condition, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Special Contact Info for Reward */}
        {contactInfo && (
          <div className="bg-card/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2 flex items-center">
              <Icon name="MessageSquare" size={20} className="text-primary mr-2" />
              Contacto para Recompensa
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{contactInfo?.message}</p>
            {contactInfo?.phone && (
              <a
                href={`tel:${contactInfo?.phone}`}
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-smooth"
              >
                <Icon name="Phone" size={16} />
                <span className="font-medium">{contactInfo?.phone}</span>
              </a>
            )}
          </div>
        )}

        {/* Important Notice */}
        <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div className="text-left text-sm">
              <p className="font-medium text-warning mb-1">Importante</p>
              <p className="text-warning/80">
                La recompensa se otorga únicamente por la devolución segura de la mascota a su propietario. 
                Por favor, contacta primero al propietario usando el botón de WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground italic">
            "Cada mascota perdida merece volver a casa. ¡Gracias por ayudar!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardInfoSection;