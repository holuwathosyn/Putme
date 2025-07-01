import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function SuccessStories() {
    const stories = [
        {
          id: 1,
          name: "Ogundeyi Samuel",
          image: "MeNtWO.jpeg",
          institution: "Olabisi Onabanjo University",
          story: "I used this quiz app daily for just a few weeks. I was so confident walking into my Post-UTME. I passed and gained admission into OOU!"
        },
        {
          id: 2,
          name: "Emeka Okafor",
          image: "mENTwo.jpg",
          institution: "University of Lagos (UNILAG)",
          story: "I struggled with time management before. This platform helped me practice under pressure and I aced my exams!"
        },
        {
          id: 3,
          name: "Blessing Adeoye",
          image: "bcd631b2cc1b82ff5b809be19aa1e61a.jpg",
          institution: "Obafemi Awolowo University (OAU)",
          story: "I couldn't afford extra coaching. This platform gave me everything I needed. I'm now in OAU studying Law!"
        },
        {
          id: 4,
          name: "Samuel Olatunji",
          image: "maleOne.jpeg",
          institution: "Federal University of Technology, Akure (FUTA)",
          story: "The quizzes were spot on — just like the real test! I got into FUTA on my first try."
        },
        {
          id: 5,
          name: "Ngozi Eze",
          image: "FemaleOne.jpg",
          institution: "University of Ibadan (UI)",
          story: "I passed both JAMB and Post-UTME thanks to this app. The explanations after each question helped me understand better."
        },
        {
          id: 6,
          name: "Tunde Wunmi",
          image: "FemaleTwo.jpg",
          institution: "Lagos State University (LASU)",
          story: "Practicing daily made me faster and more accurate. I recommend it to every serious student."
        }
      ];
    

  const [activeStoryId, setActiveStoryId] = useState(null); // Renamed for clarity
  const containerRef = useRef(null);
  const animationFrameId = useRef(null); // Ref for requestAnimationFrame ID
  const [isPaused, setIsPaused] = useState(false); // New state to control auto-scroll pause
  const [isDragging, setIsDragging] = useState(false); // Track if user is currently dragging
  const startX = useRef(0);
  const scrollLeftValue = useRef(0); // Renamed to avoid conflict with scrollLeft property

  // **INCREASE THIS VALUE TO MAKE THE SCROLL FASTER**
  const animationSpeed = 2; // Example: Changed from 0.5 to 2 for faster scroll

  // Function to handle the automatic infinite scroll
  const animateScroll = useCallback(() => {
    if (containerRef.current && !isPaused && !isDragging) {
      containerRef.current.scrollLeft += animationSpeed;

      // When scroll position reaches the end of the first set of stories,
      // instantly jump back to the beginning of the duplicated set
      const scrollThreshold = containerRef.current.scrollWidth / 2;
      if (containerRef.current.scrollLeft >= scrollThreshold) {
        containerRef.current.scrollLeft = 0;
      }
    }
    animationFrameId.current = requestAnimationFrame(animateScroll);
  }, [isPaused, isDragging, animationSpeed]); // Dependencies for useCallback

  // Effect to start and stop the animation frame loop
  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [animateScroll]);

  // --- Drag-to-scroll functionality ---
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setIsPaused(true); // Pause auto-scroll when user starts dragging
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftValue.current = containerRef.current.scrollLeft;
    containerRef.current.style.cursor = 'grabbing';
    containerRef.current.style.userSelect = 'none'; // Prevent text selection
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent default browser drag behavior (e.g., text selection)
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Adjust scroll speed when dragging
    containerRef.current.scrollLeft = scrollLeftValue.current - walk;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPaused(false); // Resume auto-scroll when drag ends
    if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
        containerRef.current.style.userSelect = 'auto'; // Re-enable text selection
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) { // If mouse leaves while dragging, treat as mouse up
      setIsDragging(false);
      setIsPaused(false); // Resume auto-scroll
      if (containerRef.current) {
          containerRef.current.style.cursor = 'grab';
          containerRef.current.style.userSelect = 'auto';
      }
    }
    // Only pause if user is hovering but not dragging
    if (!isDragging) {
      setIsPaused(false);
    }
  }, [isDragging]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true); // Pause auto-scroll on hover
  }, []);

  // --- Click and Navigation ---
  const handleStoryClick = (id) => {
    setActiveStoryId(activeStoryId === id ? null : id); // Toggle active state
  };

  const scrollWithButton = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 300; // Pixels to scroll per click
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setIsPaused(true); // Temporarily pause auto-scroll
      setTimeout(() => setIsPaused(false), 2000); // Resume after 2 seconds
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center font-sans">
      <div className="container mx-auto px-4 w-full">
        <div className="text-center mb-12">
        <h2 style={{fontFamily:"first"}} className=" text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight relative inline-block">
          Hear From Our Achievers 
          <span className="absolute -right-8 top-1 h-3 w-3 rounded-full bg-blue-500 opacity-75 animate-ping"></span>
        </h2>
          <p style={{fontFamily:"sans-serif"}}  className="text-lg font-light text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover how students like you achieved their academic dreams with the help of our platform. Their success could be yours!
          </p>
        </div>

        <div
          className="relative group w-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={containerRef}
            className="flex overflow-x-scroll py-8 scroll-smooth no-scrollbar cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave} // Essential for handling mouse up outside the element
          >
            {/* Duplicate stories to create the infinite scroll effect */}
            {[...stories, ...stories].map((story, index) => (
              <div
                key={`${story.id}-${index}`} // Unique key for duplicated items
                onClick={() => handleStoryClick(story.id)}
                className={`flex-shrink-0 w-80 mx-4 p-8 rounded-2xl shadow-lg transition-all duration-300 transform
                           ${activeStoryId === story.id
                               ? "bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 scale-[1.02] shadow-xl ring-4 ring-blue-300 ring-offset-2"
                               : "bg-white hover:shadow-xl hover:border-blue-300 border border-gray-200"
                           } cursor-pointer flex flex-col items-center justify-between`}
              >
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 mb-6 shadow-md"
                />

                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2 leading-tight">{story.name}</h3>
                <p className="text-blue-700 text-md font-semibold mb-6 text-center">{story.institution}</p>

                {activeStoryId === story.id && (
                  <div className="mt-4 animate-fade-in text-gray-700 text-lg text-center leading-relaxed">
                    <p className="italic font-light">"{story.story}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop/Tablet Navigation Arrows (visible on hover) */}
          <button
            onClick={() => scrollWithButton('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-50 text-blue-500 hover:text-blue-700 z-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 hidden md:block"
          >
            <FiChevronLeft size={28} />
          </button>
          <button
            onClick={() => scrollWithButton('right')}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-50 text-blue-500 hover:text-blue-700 z-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 hidden md:block"
          >
            <FiChevronRight size={28} />
          </button>
        </div>

        {/* Mobile Navigation Buttons (always visible) */}
        <div className="flex justify-center mt-8 space-x-6 md:hidden">
          <button
            onClick={() => scrollWithButton('left')}
            aria-label="Scroll left"
            className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={() => scrollWithButton('right')}
            aria-label="Scroll right"
            className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            <FiChevronRight size={24} />
          </button>
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-500 text-base">
            Click on a student's picture or name to read their full success story.
          </p>
        </div>
      </div>
    </section>
  );
}