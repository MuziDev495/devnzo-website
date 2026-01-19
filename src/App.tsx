import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PartnersPage from "./pages/PartnersPage";
import ResourcesPage from "./pages/ResourcesPage";
import FreeToolsPage from "./pages/FreeToolsPage";
import NotFound from "./pages/NotFound";

// Admin imports
import { AuthProvider } from "./contexts/AuthContext";
import { CMSProvider } from "./contexts/CMSContext";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BlogList from "./pages/admin/BlogList";
import BlogEditor from "./pages/admin/BlogEditor";
import ContentManager from "./pages/admin/ContentManager";
import SEOSettings from "./pages/admin/SEOSettings";
import PageList from "./pages/admin/PageList";
import PageEditor from "./pages/admin/PageEditor";
import NavigationManager from "./pages/admin/NavigationManager";
import DocumentationManager from "./pages/admin/DocumentationManager";
import DocumentationEditor from "./pages/admin/DocumentationEditor";

// Documentation imports
import DocumentationLayout from "./pages/docs/DocumentationLayout";
import DocArticlePage from "./pages/docs/DocArticlePage";
import DocLandingPage from "./pages/docs/DocLandingPage";

// Blog imports
import BlogPostPage from "./pages/blog/BlogPostPage";

// Resources imports
import AllBlogPage from "./pages/resources/AllBlogPage";

// Legal pages
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

// Support pages
import SupportPage from "./pages/SupportPage";
import FAQPage from "./pages/FAQPage";
import HelpCenterPage from "./pages/HelpCenterPage";

// Tool imports
import RoiCalculatorPage from "./components/Tools/RoiCalculatorPage";
import BusinessLoanCalculatorPage from "./components/Tools/BusinessLoanCalculatorPage";
import ShopifyFeeCalculatorPage from "./components/Tools/ShopifyFeeCalculatorPage";
import ProfitMarginCalculatorPage from "./components/Tools/ProfitMarginCalculatorPage";

// Analytics
import { initGA, trackPageView, trackPageViewToFirestore } from "./lib/analytics";

const queryClient = new QueryClient();

// Analytics tracker component
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    // Track to Google Analytics
    trackPageView(location.pathname);
    // Track to Firestore for dashboard
    trackPageViewToFirestore(location.pathname, document.title);
  }, [location]);

  return null;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CMSProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnalyticsTracker />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="partners" element={<PartnersPage />} />
                  <Route path="resources" element={<ResourcesPage />} />
                  <Route path="resources/all-blog" element={<AllBlogPage />} />
                  <Route path="resources/*" element={<ResourcesPage />} />
                  <Route path="blog" element={<AllBlogPage />} />
                  <Route path="blog/:slug" element={<BlogPostPage />} />
                  <Route path="terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="support" element={<SupportPage />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="help-center" element={<HelpCenterPage />} />
                  <Route path="free-tools" element={<FreeToolsPage />} />

                  {/* Tool Routes */}
                  <Route path="tools/roi-calculator" element={<RoiCalculatorPage />} />
                  <Route path="tools/loan-calculator" element={<BusinessLoanCalculatorPage />} />
                  <Route path="tools/shopify-fee-calculator" element={<ShopifyFeeCalculatorPage />} />
                  <Route path="tools/profit-margin-calculator" element={<ProfitMarginCalculatorPage />} />

                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* GitBook-style Documentation */}
                <Route path="/docs" element={<DocumentationLayout />}>
                  <Route index element={<DocLandingPage />} />
                  <Route path=":slug" element={<DocArticlePage />} />
                </Route>

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="pages" element={<PageList />} />
                  <Route path="pages/edit/:pageId" element={<PageEditor />} />
                  <Route path="blog" element={<BlogList />} />
                  <Route path="blog/new" element={<BlogEditor />} />
                  <Route path="blog/edit/:id" element={<BlogEditor />} />
                  <Route path="navigation" element={<NavigationManager />} />
                  <Route path="documentation" element={<DocumentationManager />} />
                  <Route path="documentation/new" element={<DocumentationEditor />} />
                  <Route path="documentation/edit/:id" element={<DocumentationEditor />} />
                  <Route path="content" element={<ContentManager />} />
                  <Route path="seo" element={<SEOSettings />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CMSProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
