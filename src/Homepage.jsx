import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SuccessStories from './SucessStories';
import Footer from './Footer';
import {
  FaUserCheck,
  FaClock,
  FaBrain,
  FaMobileAlt,
  FaCheckCircle,
  FaUserPlus,
  FaBookOpen,
  FaClipboardCheck,
  FaChartLine
} from "react-icons/fa";
import { Link } from 'react-router-dom';
import ChannelAlert from './ChannelAlert';
// Data
const ChooseUs = [
  {
    id: 1,
    icon: FaUserCheck,
    heading: "Tailored for Post-UTME Success",
    description: "Our quizzes follow the exact format of top Post-UTME exams across Nigeria, ensuring you're fully prepared for the real test.",
    color: "bg-indigo-100",
    hoverColor: "hover:bg-indigo-600"
  },
  {
    id: 2,
    icon: FaClock,
    heading: "Simulate the Real Exam Environment",
    description: "Practice with real-time CBT (Computer-Based Testing) to build confidence, speed, and accuracy.",
    color: "bg-blue-100",
    hoverColor: "hover:bg-blue-600"
  },
  {
    id: 3,
    icon: FaBrain,
    heading: "Access Thousands of Curated Questions",
    description: "Get instant access to a wide range of subject-specific questions with detailed explanations.",
    color: "bg-emerald-100",
    hoverColor: "hover:bg-emerald-600"
  },
  {
    id: 4,
    icon: FaMobileAlt,
    heading: "Practice Anytime, Anywhere",
    description: "Study on your phone, tablet, or laptop — our platform is 100% responsive and easy to use.",
    color: "bg-amber-100",
    hoverColor: "hover:bg-amber-600"
  },
];

const Howitworks = [
  {
    id: 1,
    First: "Sign Up",
    Second: "Create your free account in seconds.",
  },
  {
    id: 2,
    First: "Pick a Subject",
    Second: "Choose the subject or exam type you want to practice.",
  },
  {
    id: 3,
    First: "Take a Quiz",
    Second: "Answer timed questions just like the real exam.",
  },
  {
    id: 4,
    First: "Check Your Results",
    Second: "See your score instantly and learn from explanations."
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
    y: direction === 'center' ? 50 : 0,
  }),
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const howItWorksContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const howItWorksItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const textReveal = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Modern reveal animations for Why Choose Us
const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
    rotate: -2
  },
  onscreen: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

// Helper component for animated counting
const CountUp = ({ end, duration }) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}</span>;
};

const HomePage = () => {
  const whyChooseUsRef = useRef(null);
  const isWhyChooseUsInView = useInView(whyChooseUsRef, { once: true, amount: 0.1 });

  return (
    <>
      {/* Hero Section */}
      <ChannelAlert/>
      <div className="min-h-screen bg-gray-50 font-sans">
        <section className="px-6 md:px-16 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="space-y-6 mt-11">
            <h1 style={{ fontFamily: "first" }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your Gateway to <span className="text-blue-600">University</span> Success Starts Here. <span className="text-blue-600">Learning</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Get the edge you need to stand out in your Post-UTME screening.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium">
                Start Learning Now
              </button>
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-bold text-gray-900">50+</p>
                  <p className="text-gray-500">Career Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">1M+</p>
                  <p className="text-gray-500">Students Empowered</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-blue-100 rounded-2xl -z-10 transform rotate-2"></div>
            <img
              src="Student-studying.webp"
              alt="Student learning"
              className="w-full rounded-xl shadow-xl border-8 border-white"
            />
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-6 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-8 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-2 h-7 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Progress</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modern Why Choose Us Section */}
      <section 
        ref={whyChooseUsRef}
        className="px-6 md:px-16 py-20 bg-white relative overflow-hidden"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"></div>
        </div>
        
        <motion.div
          initial="hidden"
          animate={isWhyChooseUsInView ? "show" : "hidden"}
          variants={staggerContainer}
          className="max-w-7xl mx-auto relative"
        >
          {/* Section header with modern underline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Students <span className="relative whitespace-nowrap">
                <span className="relative z-10">Choose Us</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute left-0 top-3/4 h-[0.6em] w-full fill-blue-400/60"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The smarter way to prepare for university entrance exams
            </p>
          </motion.div>

          {/* Cards grid with modern reveal */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ChooseUs.map((item, index) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className="relative group"
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              >
                <div className={`absolute -inset-0.5 ${item.color}/50 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500`}></div>
                <div className="relative bg-white rounded-xl p-6 h-full border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className={`w-14 h-14 ${item.color} rounded-lg flex items-center justify-center mb-6 transition-colors duration-300 group-hover:${item.hoverColor}`}>
                    <item.icon className={`text-2xl ${item.color.replace('bg-', 'text-').replace('-100', '-600')} group-hover:text-white transition-colors duration-300`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.heading}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats counter that animates in */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                <CountUp end={50} duration={2} />+
              </div>
              <div className="text-gray-600">Career Courses</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-2 lg:text-4xl">
                <CountUp end={1000000} duration={2} />+
              </div>
              <div className="text-gray-600">Students Empowered</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <CountUp end={95} duration={2} />%
              </div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <CountUp end={24} duration={2} />/7
              </div>
              <div className="text-gray-600">Accessibility</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Modern How It Works Section */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={howItWorksContainer}
          className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Image with modern frame */}
          <motion.div 
            variants={howItWorksItem}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 -z-10"></div>
            <img 
              src='Gemini_Generated_Image_vt166yvt166yvt16.png' 
              alt='Student learning' 
              className="w-full h-auto object-cover rounded-3xl transition-all duration-700 hover:scale-[1.02]"
            />
          </motion.div>

          {/* Steps with animated curved arrows */}
          <div className="space-y-12">
            <motion.div variants={textReveal}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{fontFamily: "second"}}>
                How It Works
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full mb-8"></div>
            </motion.div>

            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-300/50 to-indigo-300/50"></div>

              <div className="space-y-10">
                {Howitworks.map((step, index) => (
                  <motion.div 
                    key={index}
                    variants={howItWorksItem}
                    className="flex gap-6 items-start group relative"
                  >
                    {/* Animated number badge */}
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-500/30"
                    >
                      {step.id}
                      {/* Circular pulse effect */}
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: index * 0.3
                        }}
                        className="absolute inset-0 border-2 border-blue-400/50 rounded-2xl -z-10"
                      />
                    </motion.div>

                    {/* Content with text animations */}
                    <div className="pt-2 flex-1">
                      <motion.h3 
                        variants={textReveal}
                        className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500"
                        style={{fontFamily: "first"}}
                      >
                        {step.First}
                      </motion.h3>
                      <motion.p 
                        variants={textReveal}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 font-light leading-relaxed text-lg"
                      >
                        {step.Second}
                      </motion.p>
                    </div>

                    {/* Curved arrow connector */}
                    {index < Howitworks.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, scaleY: 0.5 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ delay: 0.3 + (index * 0.15) }}
                        className="absolute left-8 -bottom-10 h-10 w-10 text-blue-300 group-hover:text-indigo-400 transition-colors duration-500"
                      >
                        <svg 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <motion.path 
                            d="M4 12C4 12 8 4 12 4C16 4 20 12 20 12C20 12 16 20 12 20C8 20 4 12 4 12Z" 
                            stroke="currentColor" 
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                              duration: 1,
                              delay: 0.5 + (index * 0.2),
                              ease: "easeInOut"
                            }}
                            fill="none"
                          />
                          <motion.path 
                            d="M12 16L16 12L12 8" 
                            stroke="currentColor" 
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              delay: 1.2 + (index * 0.2),
                              duration: 0.3
                            }}
                          />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="bg-white py-16 px-6 md:px-16">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Select the Plan That Fits You Best
        <span className="ml-2 w-3 h-3 inline-block bg-blue-600 rounded-full animate-ping"></span>
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Start with our free plan or unlock full potential with premium features
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Free Plan */}
      <div className="relative border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
          No credit card needed
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Start for Free</h3>
        <p className="text-gray-600 mb-6">Perfect for trying out the platform</p>
        
        <div className="mb-8">
          <span className="text-4xl font-bold text-gray-900">₦0</span>
          <span className="text-gray-500">/month</span>
        </div>
        
        <ul className="space-y-4 mb-8">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>No payment required</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Explore limited questions</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Test the experience</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Instant access</span>
          </li>
        </ul>
        <Link to="/Testmode">
        <button className="w-full py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
          Get Started
        </button>
        </Link>
      </div>

      {/* Premium Plan */}
      <div className="relative border-2 border-blue-500 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
          Most Popular
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Access</h3>
        <p className="text-gray-600 mb-6">Full features for optimal preparation</p>
        
        <div className="mb-8">
          <span className="text-4xl font-bold text-gray-900">₦1000</span>
          <span className="text-gray-500">/month</span>
        </div>
        
        <ul className="space-y-4 mb-8">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Full access to all subjects and quizzes</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Detailed explanations and results</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Practice anytime, anywhere</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Faster, smarter preparation</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Student-friendly pricing</span>
          </li>
        </ul>
        <Link to="/ExamMode">
        <button className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors duration-200 shadow-md hover:shadow-lg">
        Try Exam Mode
        </button>
        </Link>
      </div>
    </div>

   
  </div>
</section>

<SuccessStories/>
<Footer/>
    </>
  );
};

export default HomePage;