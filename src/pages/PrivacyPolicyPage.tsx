/**
 * Privacy Policy Page
 * Displays the privacy policy for Devnzo services
 */

import { Calendar, Shield, Database, Share2, Users, Clock, Lock, UserX, HelpCircle, KeyRound } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const PrivacyPolicyPage = () => {
  const thirdPartyServices = [
    { name: 'Google Analytics & Tag Manager' },
    { name: 'Amazon Web Services (AWS)' },
    { name: 'Sentry' },
    { name: 'Crisp Chat' },
    { name: 'Google OAuth / Social Login' },
    { name: 'Postmark / Resend (Email)' },
  ];

  return (
    <>
      <SEOHead
        title="Privacy Policy | Devnzo"
        description="Read the Privacy Policy for Devnzo. Learn how we collect, use, and protect your personal information."
        keywords="privacy policy, data protection, personal information, GDPR, Devnzo"
      />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-white/90 max-w-3xl mx-auto mb-6">
              Thank you for choosing to be part of our community at Devnzo Inc., doing business as 
              Devnzo ("Devnzo", "we", "us", "our"). We are committed to protecting your personal 
              information and your right to privacy. If you have any questions or concerns about this 
              privacy notice, or our practices with regards to your personal information, please 
              contact us at <a href="mailto:contact@devnzo.com" className="text-white underline hover:text-white/80">contact@devnzo.com</a>.
            </p>
            <p className="text-white/80 max-w-3xl mx-auto mb-4">
              When you visit our website https://devnzo.com (the "Website"), and more generally, use 
              any of our services (the "Services", which include the Website), we appreciate that you 
              are trusting us with your personal information. We take your privacy very seriously. In 
              this privacy notice, we seek to explain to you in the clearest way possible what 
              information we collect, how we use it and what rights you have in relation to it. We hope 
              you take some time to read through it carefully, as it is important. If there are any terms 
              in this privacy notice that you do not agree with, please discontinue use of our Services 
              immediately.
            </p>
            <p className="text-white/80 max-w-3xl mx-auto mb-4">
              This privacy notice applies to all information collected through our Services (which, as 
              described above, includes our Website), as well as any related services, sales, 
              marketing or events.
            </p>
            <p className="text-white/90 font-medium max-w-3xl mx-auto mb-6">
              Please read this privacy notice carefully as it will help you understand what we do with 
              the information that we collect.
            </p>
            <div className="flex items-center gap-2 text-white/70 justify-center">
              <Calendar className="w-5 h-5" />
              <span>Last updated: January 19, 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Section 1: What Information Do We Collect */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">1. What Information Do We Collect?</h2>
            </div>
            
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Personal information you disclose to us</h3>
                <p className="text-sm italic mb-4">In Short: We collect personal information that you provide to us.</p>
                <p className="mb-4">
                  We collect personal information that you voluntarily provide to us when you register on the 
                  Website, express an interest in obtaining information about us or our products and Services, 
                  when you participate in activities on the Website (such as by posting messages in our online 
                  forums or entering competitions, contests or giveaways) or otherwise when you contact us.
                </p>
                <p className="mb-4">
                  The personal information that we collect depends on the context of your interactions with us 
                  and the Website, the choices you make and the products and features you use. The personal 
                  information we collect may include the following:
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Personal Information Provided by You.</strong> We collect names; email addresses; 
                  phone numbers; job titles; company names; and other similar information.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Social Media Login Data.</strong> We may provide you with the option to register 
                  using your social media account details, like your Google, GitHub, or other social media accounts. 
                  If you choose to register in this way, we will collect the information described in the section 
                  called "HOW DO WE HANDLE YOUR SOCIAL LOGINS" below.
                </p>
                <p>
                  All personal information that you provide to us must be true, complete and accurate, and you 
                  must notify us of any changes to such information.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Information automatically collected</h3>
                <p className="text-sm italic mb-4">
                  In Short: Some information — such as your Internet Protocol (IP) address and/or browser and 
                  device characteristics — is collected automatically when you visit our Website.
                </p>
                <p className="mb-4">
                  We automatically collect certain information when you visit, use or navigate the Website. This 
                  information does not reveal your specific identity (like your name or contact information) but 
                  may include device and usage information, such as your IP address, browser and device 
                  characteristics, operating system, language preferences, referring URLs, device name, country, 
                  location, information about how and when you use our Website and other technical information.
                </p>
                <p className="mb-4">The information we collect includes:</p>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Log and Usage Data.</strong> Log and usage data is service-related, 
                    diagnostic, usage and performance information our servers automatically collect when you 
                    access or use our Website and which we record in log files.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Device Data.</strong> We collect device data such as information about 
                    your computer, phone, tablet or other device you use to access the Website.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Location Data.</strong> We collect location data such as information 
                    about your device's location, which can be either precise or imprecise (e.g., based on your IP 
                    address). You can opt out by disabling location settings on your device.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Will Your Information Be Shared */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">3. Will Your Information Be Shared With Anyone?</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm italic">
                In Short: We only share information with your consent, to comply with laws, to provide you with 
                services, to protect your rights, or to fulfill business obligations.
              </p>
              <p>
                We may process or share your data based on the following legal basis: Consent, Legitimate 
                Interests, Performance of a Contract, Legal Obligations, and Vital Interests.
              </p>
              <p>More specifically, we may need to process your data or share your personal information in the following situations:</p>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Business Transfers.</strong> During mergers, acquisitions, or sale of assets.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Vendors, Consultants and Other Third-Party Service Providers.</strong> We share 
                  data with trusted partners (e.g., cloud hosting, analytics, email delivery, customer support) who 
                  are contractually obligated to protect your data and not use it for their own purposes.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Other Users.</strong> When you post publicly (e.g., in forums), that content is visible to others.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4: Who Will Your Information Be Shared With */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">4. Who Will Your Information Be Shared With?</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm italic">In Short: We only share information with the following third parties.</p>
              <p>We share and disclose your information with:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {thirdPartyServices.map((service, index) => (
                  <div 
                    key={index}
                    className="bg-muted/50 rounded-lg px-4 py-3 text-sm text-foreground"
                  >
                    {service.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Social Logins */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">5. How Do We Handle Your Social Logins?</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm italic">
                In Short: If you choose to register or log in using a social media account, we may have access 
                to certain information about you.
              </p>
              <p>
                We offer login via Google, GitHub, and other providers. We only receive name, email, and 
                profile picture (as allowed by your settings). We are not responsible for how those providers 
                handle your data — please review their privacy policies.
              </p>
            </div>
          </div>

          {/* Section 6: How Long Do We Keep */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">6. How Long Do We Keep Your Information?</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm italic">
                In Short: We keep your information for as long as necessary to fulfill the purposes outlined in 
                this privacy notice unless otherwise required by law.
              </p>
              <p>
                We retain personal data only while you have an active account or as required for legal, tax, or 
                regulatory reasons. When no longer needed, we delete or anonymize it.
              </p>
            </div>
          </div>

          {/* Section 7: How Do We Keep Information Safe */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">7. How Do We Keep Your Information Safe?</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm italic">
                In Short: We aim to protect your personal information through organizational and technical 
                security measures.
              </p>
              <p>
                We use encryption, access controls, monitoring, and regular security audits. However, no 
                transmission over the internet is 100% secure. You use our Services at your own risk.
              </p>
            </div>
          </div>

          {/* Section 8: Minors */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserX className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">8. Do We Collect Information From Minors?</h2>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm italic">
                In Short: We do not knowingly collect data from or market to children under 18 years of age.
              </p>
              <p>
                If we learn we have collected data from a minor, we will delete it immediately. Please contact 
                us at <a href="mailto:contact@devnzo.com" className="text-primary hover:underline">contact@devnzo.com</a> if you believe otherwise.
              </p>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 text-center mb-16">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Questions or Concerns?</h2>
            <p className="text-muted-foreground mb-4">We're happy to help with any privacy-related matter.</p>
            <a 
              href="mailto:contact@devnzo.com" 
              className="text-primary font-semibold text-lg hover:underline"
            >
              contact@devnzo.com
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              Devnzo Inc. • 34 N Franklin Ave Ste 687, Pinedale, WY, 82941
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;

