import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PetProfileManagement from './pages/pet-profile-management';
import OwnerLoginRegistration from './pages/owner-login-registration';
import NFCPetProfileLanding from './pages/nfc-pet-profile-landing';
import PetOwnerDashboard from './pages/pet-owner-dashboard';
import ScanHistoryAnalytics from './pages/scan-history-analytics';
import ProductLandingPage from './pages/product-landing-page';
import NFCTestScan from './pages/nfc-test-scan';
import MedicalRecordsCenter from './pages/medical-records-center';
import Settings from './pages/settings';
import ReportLostPet from './pages/report-lost-pet';
import SubscriptionPlans from './pages/subscription-plans';
import PaymentSuccess from './pages/payment-success';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ProductLandingPage />} />
        <Route path="/product-landing-page" element={<ProductLandingPage />} />
        <Route path="/pet-profile-management" element={<PetProfileManagement />} />
        <Route path="/pet-profile-management/:petId" element={<PetProfileManagement />} />
        <Route path="/owner-login-registration" element={<OwnerLoginRegistration />} />
        
        {/* NFC Routes - Both patterns supported */}
        <Route path="/nfc/:tagId" element={<NFCPetProfileLanding />} />
        <Route path="/nfc-pet-profile-landing" element={<NFCPetProfileLanding />} />
        <Route path="/nfc-pet-profile-landing/:tagId" element={<NFCPetProfileLanding />} />
        
        <Route path="/pet-owner-dashboard" element={<PetOwnerDashboard />} />
        <Route path="/scan-history-analytics" element={<ScanHistoryAnalytics />} />
        <Route path="/nfc-test-scan" element={<NFCTestScan />} />
        <Route path="/medical-records-center" element={<MedicalRecordsCenter />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/report-lost-pet" element={<ReportLostPet />} />
        
        {/* Subscription Routes */}
        <Route path="/subscription-plans" element={<SubscriptionPlans />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;