import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: "https://facebook.com",
      label: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991..." />
        </svg>
      ),
    },
    {
      href: "https://twitter.com",
      label: "Twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.184 5.92c-.672.3-1.39.5-2.146.59..." />
        </svg>
      ),
    },
    {
      href: "https://instagram.com",
      label: "Instagram",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.74 2 8.333 2.01 7.042..." />
        </svg>
      ),
    },
    {
      href: "https://linkedin.com",
      label: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14..." />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-gray-50 text-black pt-12 px-4 font-sans overflow-x-hidden">
      {/* Floating circles decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-100 opacity-20 animate-float1"></div>
        <div className="absolute -bottom-40 right-10 w-60 h-60 rounded-full bg-blue-200 opacity-10 animate-float2"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Main content grid with staggered animation */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand & About - Fade in from left */}
          <div className="transform transition-all duration-500 ease-out opacity-0 translate-x-8 animate-fade-in-left">
            <h3 className="text-2xl font-bold text-blue-600 mb-4 flex items-center">
              Mypostutme
              <span className="ml-2 h-2 w-2 rounded-full bg-blue-600 animate-ping opacity-75"></span>
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Your go-to platform for conquering Post-UTME. Practice, learn, and succeed with confidence.
            </p>
          </div>

          {/* Quick Links - Fade in with delay */}
          <div className="transform transition-all duration-500 ease-out opacity-0 translate-x-8 animate-fade-in-left animate-delay-100">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'Practice', 'Examination', 'Success Stories', 'FAQs'].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:pl-2 block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources - Fade in with more delay */}
          <div className="transform transition-all duration-500 ease-out opacity-0 translate-x-8 animate-fade-in-left animate-delay-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              {['Blog', 'Help Center', 'Privacy Policy', 'Terms of Service'].map((item, index) => (
                <li key={index}>
                  <Link 
                    to="#" 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 hover:pl-2 block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Fade in with most delay */}
          <div className="transform transition-all duration-500 ease-out opacity-0 translate-x-8 animate-fade-in-left animate-delay-300">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Lagos, Nigeria
              </li>
              <li>
                <a href="mailto:info@mypostutme.com" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  info@mypostutme.com
                </a>
              </li>
              <li>
                <a href="tel:+2348012345678" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  +234 801 234 5678
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with growing animation */}
        <div className="border-t border-gray-200 mt-10 pt-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-0 bg-blue-100 animate-grow-line origin-left"></div>
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs md:text-sm relative z-10">
            <p className="mb-4 md:mb-0 text-gray-600">&copy; {currentYear} Mypostutme. All rights reserved.</p>
            
            {/* Social icons with hover animation */}
            <div className="flex space-x-4">
              {socialLinks.map(({ href, icon, label }, index) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-500 hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float1 {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes float2 {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-5deg);
          }
        }
        @keyframes growLine {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out forwards;
        }
        .animate-delay-100 {
          animation-delay: 0.1s;
        }
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
        .animate-delay-300 {
          animation-delay: 0.3s;
        }
        .animate-float1 {
          animation: float1 8s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 10s ease-in-out infinite;
        }
        .animate-grow-line {
          animation: growLine 1s ease-out forwards;
        }
      `}</style>
    </footer>
  );
}