/**
 * Footer Component
 * Site-wide footer with company information, links, and social media
 */

import { Link } from "react-router-dom";
import { Globe, MessageSquare, Award } from "lucide-react";
import { FOOTER_LINKS } from "@/types/routes";

// Social Media Icons Component
const SocialIcon = ({ iconType, className }: { iconType: string; className?: string }) => {
  const iconClass = className || "w-5 h-5";

  switch (iconType) {
    case "twitter":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M12.017 0C8.396 0 7.929.01 7.102.048 6.273.088 5.718.222 5.238.42a5.893 5.893 0 00-2.134 1.384A5.868 5.868 0 00.42 5.238C.222 5.718.087 6.273.048 7.102.01 7.929 0 8.396 0 12.017c0 3.624.01 4.09.048 4.918.039.827.174 1.382.372 1.861a5.89 5.89 0 001.384 2.132 5.863 5.863 0 002.134 1.383c.48.198 1.035.333 1.864.372.827.04 1.294.05 4.915.05s4.09-.01 4.918-.05c.827-.039 1.382-.174 1.861-.372a5.89 5.89 0 002.132-1.383 5.863 5.863 0 001.383-2.134c.198-.48.333-1.035.372-1.861.04-.827.05-1.294.05-4.915s-.01-4.09-.05-4.918c-.039-.827-.174-1.382-.372-1.861a5.89 5.89 0 00-1.383-2.134A5.863 5.863 0 0018.464.42C17.984.222 17.429.087 16.6.048 15.773.01 15.307 0 11.683 0h.334zm-.334 2.162c3.579 0 4.004.014 5.418.078.762.035 1.175.166 1.45.276.364.142.624.312.896.584.272.272.442.532.584.896.11.275.24.688.276 1.45.064 1.414.078 1.839.078 5.418s-.014 4.004-.078 5.418c-.035.762-.166 1.175-.276 1.45a2.68 2.68 0 01-.584.896 2.68 2.68 0 01-.896.584c-.275.11-.688.24-1.45.276-1.414.064-1.839.078-5.418.078s-4.004-.014-5.418-.078c-.762-.035-1.175-.166-1.45-.276a2.68 2.68 0 01-.896-.584 2.68 2.68 0 01-.584-.896c-.11-.275-.24-.688-.276-1.45-.064-1.414-.078-1.839-.078-5.418s.014-4.004.078-5.418c.035-.762.166-1.175.276-1.45.142-.364.312-.624.584-.896a2.68 2.68 0 01.896-.584c.275-.11.688-.24 1.45-.276 1.414-.064 1.839-.078 5.418-.078z"
            clipRule="evenodd"
          />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="18.406" cy="5.594" r="1.44" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return <Globe className={iconClass} />;
  }
};

const Footer = () => {
  const companyLinks = FOOTER_LINKS.filter((link) => link.section === "Company");
  const resourceLinks = FOOTER_LINKS.filter((link) => link.section === "Resources");
  const connectLinks = FOOTER_LINKS.filter((link) => link.section === "Connect");

  return (
    <footer className="bg-[hsl(222,47%,11%)] text-[hsl(220,14%,76%)] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold gradient-text-hero">Devnzo</span>
            </div>
            <p className="text-[hsl(220,9%,60%)] mb-6 leading-relaxed">
              Empowering businesses with innovative solutions for sustainable growth and success.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-[hsl(220,20%,18%)] rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-[hsl(220,20%,18%)] rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-[hsl(220,20%,18%)] rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-primary-foreground font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-primary-foreground font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="col-span-3 md:col-span-1">
            <h3 className="text-primary-foreground font-semibold mb-6">Connect</h3>
            <div className="flex gap-3 flex-wrap">
              {connectLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[hsl(220,20%,18%)] rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300 group"
                  aria-label={`Follow us on ${link.title}`}
                >
                  <SocialIcon
                    iconType={link.icon || ""}
                    className="w-5 h-5 text-[hsl(220,14%,76%)] group-hover:text-primary-foreground transition-colors duration-300"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[hsl(220,20%,18%)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[hsl(220,9%,60%)] text-sm">© 2026 Devnzo. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-[hsl(220,9%,60%)] hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-[hsl(220,9%,60%)] hover:text-primary text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
