import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "María González",
      location: "Madrid, España",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      petName: "Luna",
      petPhoto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop",
      story: "Gracias a PetFinder NFC encontré a Luna en menos de 2 horas. Una persona la encontró en el parque y me contactó inmediatamente.",
      rating: 5,
      timeAgo: "Hace 2 semanas"
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      location: "Barcelona, España",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      petName: "Max",
      petPhoto: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop",
      story: "La tecnología NFC es increíble. Max se escapó durante los fuegos artificiales y lo recuperé el mismo día gracias a la placa.",
      rating: 5,
      timeAgo: "Hace 1 mes"
    },
    {
      id: 3,
      name: "Ana Martín",
      location: "Valencia, España",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      petName: "Coco",
      petPhoto: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop",
      story: "Como veterinaria, recomiendo PetFinder a todos mis clientes. Es la forma más rápida y segura de proteger a nuestras mascotas.",
      rating: 5,
      timeAgo: "Hace 3 días"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials?.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials?.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials?.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials?.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary rounded-full" />
        <div className="absolute top-32 right-16 w-16 h-16 bg-secondary/20 rounded-full" />
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-warning/20 rounded-full" />
        <div className="absolute bottom-40 right-10 w-24 h-24 border-2 border-success rounded-full" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Historias de Éxito
          </h3>
          <p className="text-muted-foreground">
            Miles de mascotas reunidas con sus familias
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-smooth shadow-soft"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-smooth shadow-soft"
          >
            <Icon name="ChevronRight" size={16} />
          </button>

          {/* Testimonial Card */}
          <div className="bg-card rounded-xl p-6 shadow-elevated border border-border">
            <div className="flex items-start space-x-4 mb-4">
              <Image
                src={testimonials?.[currentIndex]?.avatar}
                alt={testimonials?.[currentIndex]?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-foreground">
                    {testimonials?.[currentIndex]?.name}
                  </h4>
                  <div className="flex">
                    {[...Array(testimonials?.[currentIndex]?.rating)]?.map((_, i) => (
                      <Icon key={i} name="Star" size={14} className="text-warning fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {testimonials?.[currentIndex]?.location} • {testimonials?.[currentIndex]?.timeAgo}
                </p>
              </div>
            </div>

            <blockquote className="text-foreground mb-4 leading-relaxed">
              "{testimonials?.[currentIndex]?.story}"
            </blockquote>

            <div className="flex items-center space-x-3 pt-4 border-t border-border">
              <Image
                src={testimonials?.[currentIndex]?.petPhoto}
                alt={testimonials?.[currentIndex]?.petName}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {testimonials?.[currentIndex]?.petName}
                </p>
                <p className="text-xs text-muted-foreground">Mascota reunida</p>
              </div>
              <div className="ml-auto">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                  <Icon name="Heart" size={16} className="text-success" />
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials?.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-smooth ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">15K+</div>
            <div className="text-xs text-muted-foreground">Mascotas Protegidas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">98%</div>
            <div className="text-xs text-muted-foreground">Tasa de Éxito</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">&lt;2h</div>
            <div className="text-xs text-muted-foreground">Tiempo Promedio</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;