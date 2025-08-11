import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HelpSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const helpItems = [
    {
      question: "¿Cómo funciona PetFinder NFC?",
      answer: "Nuestras placas NFC permiten que cualquier persona con un smartphone pueda escanear la placa de tu mascota y contactarte inmediatamente si se pierde."
    },
    {
      question: "¿Es seguro compartir mi información?",
      answer: "Sí, solo compartimos la información necesaria para reunirte con tu mascota. Tu información personal está protegida y encriptada."
    },
    {
      question: "¿Qué hago si olvido mi contraseña?",
      answer: "Usa el enlace \'Olvidaste tu contraseña\' en el formulario de inicio de sesión para recibir instrucciones de recuperación por email."
    },
    {
      question: "¿Puedo gestionar múltiples mascotas?",
      answer: "¡Por supuesto! Puedes agregar y gestionar tantas mascotas como desees desde tu panel de control."
    }
  ];

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
          <Icon name="HelpCircle" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">¿Necesitas ayuda?</span>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="space-y-3">
            {helpItems?.map((item, index) => (
              <details key={index} className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                  {item?.question}
                  <Icon name="Plus" size={14} className="group-open:rotate-45 transition-transform" />
                </summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed pl-4">
                  {item?.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              iconName="MessageCircle"
              iconPosition="left"
              className="flex-1"
            >
              Chat en Vivo
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Mail"
              iconPosition="left"
              className="flex-1"
            >
              Enviar Email
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Soporte disponible 24/7 • Tiempo de respuesta: &lt; 2 horas
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSection;