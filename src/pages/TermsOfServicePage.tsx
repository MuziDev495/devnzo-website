/**
 * Terms of Service Page
 * Displays the terms and conditions for using Devnzo services
 */

import { Calendar, Shield, FileText, Users, BarChart3, AlertTriangle, Cookie, Globe, RefreshCw } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const TermsOfServicePage = () => {
  return (
    <>
      <SEOHead
        title="Terms of Service | Devnzo"
        description="Read the Terms of Service for Devnzo. Understand your rights and responsibilities when using our platform and services."
        keywords="terms of service, terms and conditions, legal, user agreement, Devnzo"
      />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-white/90">
              Please read this Agreement carefully before using the Services.
            </p>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-muted-foreground mb-8">
            <Calendar className="w-5 h-5" />
            <span>Last updated: January 19, 2026</span>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12 text-muted-foreground">
            <p>
              By using the website operated by Devnzo (the "Site"), along with its applications, features, and other 
              content (collectively, the "Services"), you acknowledge and agree to be bound by the terms and 
              conditions of this Agreement. If you do not agree to all the terms and conditions, you are not authorized 
              to use the Services. The Services, owned and operated by Devnzo, may collect user and usage data to 
              help website and application owners send messages or notifications efficiently based on user behavior. 
              This Agreement applies to all users of the Services. Your use of the Services constitutes your 
              acknowledgment that you understand and agree to be bound by this Agreement, any applicable fees, 
              additional guidelines, Devnzo's Privacy Policy and Anti-Spam Policy, and any future updates or 
              modifications to this Agreement. The Services are provided to you ("User" or "You") under the following 
              terms and conditions:
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Access to the Services */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Access to the Services</h2>
              </div>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Subject to the terms and conditions of this Agreement, Devnzo may provide the Services, selected by you, solely for your personal or business use and not for the use or benefit of any third party. The Services include, but are not limited to, any materials, tools, or features offered on the Site, including text, data, software, graphics, photographs, images, illustrations, audio clips, video clips, and other content (collectively, the "Content"). Devnzo may change, suspend, or discontinue the Services at any time, for any reason, including the availability of any feature or Content.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Devnzo may also restrict your access to parts or all of the Services without prior notice or liability. Devnzo may modify this Agreement at any time by posting a notice on the Services or sending a notification via email or postal mail. You are responsible for reviewing any such modifications, and your continued use of the Services following such notice constitutes your acceptance of the modified terms.</span>
                </li>
              </ul>
            </div>

            {/* Content */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Content</h2>
              </div>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You shall not store any substantial portion of the Content in any form. Copying, storing, or using any Content for purposes other than personal or internal business use is strictly prohibited without prior written permission from Devnzo or the copyright holder identified in the Content's copyright notice. All trademarks, service marks, and trade names appearing on the Services are proprietary to Devnzo or third parties. You agree to respect all copyright notices and restrictions associated with any Content accessed through the Services.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>The Services are protected by copyright and other intellectual property laws as a collective work and/or compilation. Subject to the terms of this Agreement, Devnzo grants you a limited, nonexclusive, nontransferable license (without the right to sublicense) to access and use the Services solely for your internal business purposes.</span>
                </li>
              </ul>
            </div>

            {/* Customer Data */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Customer Data</h2>
              </div>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>By providing data regarding your end users, customers, or campaigns to Devnzo in connection with your use of the Services ("Customer Data"), you grant Devnzo a non-exclusive, worldwide, royalty-free, transferable right to use, modify, reproduce, and display such Customer Data to: Provide the Services, and Improve the Services' functionality, analytics, and delivery.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You further represent, warrant, and agree that you will not submit Customer Data that: Infringes or violates any copyright, trademark, trade secret, or other intellectual property right; Violates the privacy or publicity rights of any third party; Is libelous, defamatory, obscene, pornographic, harassing, hateful, offensive, or otherwise unlawful.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>If your Customer Data includes personally identifiable information ("PII") of end users of your site or application ("Customer Site"), you represent and warrant that: You comply with all applicable laws regarding the collection, use, and disclosure of such PII.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Devnzo reserves the right to remove any Customer Data from the Site or Services at any time, for any reason, or for no reason at all. Devnzo may monitor Customer Data and remove or restrict any content or use of the Services.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>All information transmitted through the Services is the sole responsibility of the party providing it. Devnzo assumes no liability for Customer Data, and you remain responsible for all Customer Data submitted under your account.</span>
                </li>
              </ul>
            </div>

            {/* Results */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Results</h2>
              </div>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Unless otherwise agreed, and subject to Devnzo's rights outlined in this section, you retain all rights, title, and interest (including all intellectual property and proprietary rights) in and to any data or work developed using your Customer Data during the provision of the Services and delivered to you by Devnzo ("Results").</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You grant Devnzo a limited, non-exclusive right to: Disclose your Results to Devnzo's employees, contractors, or agents solely as necessary to provide you with the Services; Disclose your Results to comply with court orders, legal requirements, or directions from governmental or regulatory authorities.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Devnzo may aggregate and analyze Results from you and other customers to generate reports or other work products. Devnzo retains exclusive ownership and the right to use such aggregated or compiled Results for any purpose, including marketing, advertising, and improving the Services.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Devnzo is not obligated to store any Results after delivery to you. Devnzo reserves the right to withhold, remove, or discard Results without notice in the event of any breach of this Agreement by you.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Restrictions Section */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Restrictions</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              You are solely responsible for all activity conducted through your use of the Services. You may not post, 
              transmit, or cause to be posted or transmitted any communication designed to obtain passwords, account information, or 
              other private data from any Devnzo user.
            </p>
            <ul className="space-y-3 text-muted-foreground mb-6">
              <li className="flex gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>Violate the security of any computer network;</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>Crack passwords or encryption codes;</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>Transfer, store, or distribute material that is threatening, obscene, or unlawful;</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>Engage in illegal activities of any kind;</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>Operate mailing lists, Listservs, auto-responders, or send unsolicited bulk messages ("spam").</span>
              </li>
            </ul>
            <p className="text-muted-foreground">
              You agree to use the Services in compliance with all applicable laws, including but not limited to laws 
              and regulations relating to spam, privacy, intellectual property, consumer protection, child protection, 
              obscenity, and defamation. You represent, warrant, and covenant that your use of the Services will at all 
              times comply with Devnzo's Anti-Spam Policy.
            </p>
          </div>

          {/* Cookies and Tracking */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Cookies and Tracking</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Devnzo uses cookies and similar tracking technologies to enhance your experience on our platform. 
              These technologies help us:
            </p>
            <ul className="space-y-3 text-muted-foreground mb-6">
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Remember your preferences and settings</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Analyze how our platform is used and improve functionality</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Provide personalized content and recommendations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Ensure security and prevent fraud</span>
              </li>
            </ul>
            <p className="text-muted-foreground">
              You can control cookie settings through your browser preferences, though some features may not 
              function properly if cookies are disabled.
            </p>
          </div>

          {/* International Data Transfers */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">International Data Transfers</h2>
            </div>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your own. Devnzo ensures 
              that such transfers comply with applicable data protection laws and implements appropriate safeguards, 
              including standard contractual clauses or adequacy decisions, to protect your information.
            </p>
          </div>

          {/* Changes to This Policy */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Changes to This Policy</h2>
            </div>
            <p className="text-muted-foreground">
              Devnzo may update this Privacy Policy from time to time to reflect changes in practices, features, or 
              applicable laws. We will notify you of material changes by posting the updated policy on our website 
              and updating the "Last Updated" date. Your continued use of the Services after such changes constitutes 
              your acceptance of the updated Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicePage;
