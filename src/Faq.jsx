import { useState } from 'react';
import Footer from './Footer';

const PostUtmeAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Mypostutme?",
      answer: "Mypostutme is an online educational platform designed to help students prepare effectively for Post-UTME exams conducted by Nigerian universities, polytechnics, and colleges. The platform provides past questions, practice tests, study materials, and other valuable resources to boost exam success."
    },
    {
      question: "Who can use Mypostutme?",
      answer: "Any student who has written the JAMB exam and is preparing for Post-UTME or Direct Entry screening exams in Nigeria can use Mypostutme. It is ideal for candidates targeting universities, polytechnics, and colleges of education."
    },
    {
      question: "What services does Mypostutme offer?",
      answer: (
        <>
          Mypostutme offers:
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li className="text-gray-700">Past Post-UTME Questions and Answers</li>
            <li className="text-gray-700">Online Practice Exams (CBT format)</li>
            <li className="text-gray-700">Study Tips and Exam Guides</li>
            <li className="text-gray-700">Resources to help you prepare for your chosen school's screening test</li>
          </ul>
        </>
      )
    },
    {
      question: "Is Mypostutme free to use?",
      answer: "No it's not, while others like premium past questions, full-length practice tests, or personalized study plans might require payment or subscription."
    },
    {
      question: "How do I access past Post-UTME questions on Mypostutme?",
      answer: "You can access past questions by visiting mypostutme, creating a free account, and selecting practice for mock examination test. From there, you can browse or download relevant Post-UTME past questions and practice them online."
    },
    {
      question: "Can I practice real Post-UTME mock exams on Mypostutme?",
      answer: "Yes! Mypostutme offers computer-based mock exams that simulate the actual Post-UTME environment. This helps you build speed, accuracy, and confidence before the real exam."
    },
    {
      question: "Does Mypostutme cover all Nigerian universities and polytechnics?",
      answer: "Mypostutme provides study materials and past questions for many major universities, polytechnics, and colleges in Nigeria. You can search the platform to find resources past question for your specific school of choice."
    },
    {
      question: "How reliable are the past questions on Mypostutme?",
      answer: "The past questions on Mypostutme are carefully compiled from previous years' exams and verified by educational experts to ensure accuracy and relevance to current Post-UTME formats."
    },
    {
      question: "Can Mypostutme guarantee my admission?",
      answer: "While Mypostutme equips you with valuable tools and resources to boost your exam performance, admission decisions ultimately depend on your Post-UTME score, JAMB result, and the school's admission policies. Consistent study and practice with Mypostutme will significantly improve your chances."
    },
    {
      question: "How can I contact Mypostutme for support?",
      answer: "You can reach out to the Mypostutme support team through the Contact Us page on the website or via email and social media channels listed on the site. The team is always ready to assist with any questions or technical issues."
    },
    {
      question: "Is the Mock Examination on Mypostutme subscription based?",
      answer: "The Mock Examination on Mypostutme is subscription-based and costs just ₦1,000 per month. This affordable monthly payment gives you unlimited access to computer-based mock exams designed to help you practice, track your progress, and improve your performance ahead of your Post-UTME."
    },
    {
      question: "Do I need to create an account to purchase Post-UTME questions?",
      answer: "No, you don't need to create an account to purchase  Post-UTME past questions on Mypostutme." }
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-10">
          <div className="mb-6 mt-10">
           
            <h1 className=" text-2xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              Your Ultimate <span className="text-blue-600">Post-UTME</span> Preparation Guide
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto my-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              At Mypostutme, we understand that preparing for the Post-UTME - the crucial step after JAMB - can feel overwhelming.
              Let us guide you through it.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-10">
            <div className="flex-1 border-t border-gray-200"></div>
            <h2 className="mx-4 text-xl sm:text-2xl font-semibold text-gray-800 text-center relative">
  <span className="px-2 sm:px-4 bg-white relative inline-block">
    Frequently Asked Questions
    <span className="text-blue-600 font-bold ml-1 relative inline-flex items-center">
      about Mypostutme
      <span className="absolute -top-1 -right-3 sm:-top-1 sm:-right-4 h-2 w-2 sm:h-3 sm:w-3 bg-blue-500 rounded-full animate-pulse"></span>
    </span>
  </span>
</h2>

            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-sm"
              >
                <button
                  className={`w-full px-6 py-5 text-left flex justify-between items-center transition-all duration-300 ${
                    activeIndex === index 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white hover:bg-gray-50 text-gray-800'
                  }`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span className={`text-lg font-medium ${
                    activeIndex === index ? 'font-semibold' : ''
                  }`}>
                    {index + 1}. {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                      activeIndex === index 
                        ? 'rotate-180 text-white' 
                        : 'text-blue-600'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    activeIndex === index 
                      ? 'max-h-[500px] opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`px-6 pb-5 ${
                    activeIndex === index 
                      ? 'bg-gray-50 border-t border-gray-100' 
                      : 'bg-white'
                  }`}>
                    <div className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-50 rounded-xl p-8 mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Need More Assistance?</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Our support team is ready to help you with any questions about Post-UTME preparation.
          </p>
          <a href='mailto:support@mypostutme.com'>
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Contact Support Team
              <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </button>
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PostUtmeAccordion;