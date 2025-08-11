import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import ProductShowcase from './components/ProductShowcase';
import FeatureHighlights from './components/FeatureHighlights';
import HowItWorks from './components/HowItWorks';
import PricingSection from './components/PricingSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';

const ProductLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐾</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PetNFC</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Características</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">Cómo Funciona</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Precios</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonios</a>
              <Link 
                to="/owner-login-registration" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Empezar Ahora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Product Showcase */}
      <ProductShowcase />

      {/* Feature Highlights */}
      <FeatureHighlights />

      {/* How It Works */}
      <HowItWorks />

      {/* Pricing */}
      <PricingSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🐾</span>
                </div>
                <span className="text-xl font-bold">PetFinder NFC</span>
              </div>
              <p className="text-gray-400 text-sm">
                Tecnología NFC avanzada para mantener a tus mascotas seguras y conectadas contigo siempre.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white">Características</a></li>
                <li><a href="#pricing" className="hover:text-white">Precios</a></li>
                <li><a href="#how-it-works" className="hover:text-white">Cómo Funciona</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
                <li><a href="#" className="hover:text-white">Guías</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacidad</a></li>
                <li><a href="#" className="hover:text-white">Términos</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 PetNFC. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductLandingPage;