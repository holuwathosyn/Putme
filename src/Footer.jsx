import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const SocialShare = ({ url, title, description }) => {
  // Default values
  const shareUrl = url || typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = title || (typeof document !== "undefined" ? document.title : "");
  const shareText = `${shareTitle} ${shareUrl}`;

  const openShareWindow = (url, name) => {
    window.open(
      url,
      `${name}-share-dialog`,
      "width=800,height=600,top=100,left=100"
    );
  };

  const shareTo = {
    facebook: () => openShareWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "facebook"
    ),
    twitter: () => openShareWindow(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      "twitter"
    ),
    linkedin: () => openShareWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "linkedin"
    ),
    whatsapp: () => openShareWindow(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "whatsapp"
    ),
  };

  return (
    <div className="space-y-3">
      {/* Sharing buttons */}
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {/* Facebook */}
        <button
          onClick={shareTo.facebook}
          className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          aria-label="Share on Facebook"
        >
          <FaFacebook className="text-xl md:text-2xl" />
        </button>

        {/* Twitter */}
        <button
          onClick={shareTo.twitter}
          className="p-3 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          aria-label="Share on Twitter"
        >
          <FaTwitter className="text-xl md:text-2xl" />
        </button>

        {/* LinkedIn */}
        <button
          onClick={shareTo.linkedin}
          className="p-3 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50"
          aria-label="Share on LinkedIn"
        >
          <FaLinkedin className="text-xl md:text-2xl" />
        </button>

        {/* WhatsApp */}
        <button
          onClick={shareTo.whatsapp}
          className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp className="text-xl md:text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: "https://www.facebook.com/profile.php?id=61577785904580&mibextid=LQQJ4d",
      label: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      href: "https://twitter.com",
      label: "Twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      href: "https://www.instagram.com/mypostutme?igsh=bjdmZHlqYzViOHE1",
      label: "Instagram",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      href: "https://linkedin.com",
      label: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
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
            {/* Added SocialShare component here */}
            <div className="mt-6">
              <SocialShare />
            </div>
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
                <a href="mailto:support@mypostutme.com" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  support@mypostutme.com
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
              {socialLinks.map(({ href, icon, label }) => (
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