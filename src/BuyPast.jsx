import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFilePdf, FaSearch, FaShoppingCart, FaSpinner, 
  FaCheckCircle, FaTimes, FaInfoCircle, FaDownload
} from 'react-icons/fa';
import Footer from './Footer';

const PdfStore = () => {
  const [pdfList, setPdfList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedPdfs, setSelectedPdfs] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPdfDetail, setSelectedPdfDetail] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const modalRef = useRef(null);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format file size nicely
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
  };

  // Fetch PDFs from API
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/pdf`);
        let data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setPdfList(data.map(pdf => ({ 
          ...pdf, 
          price: Number(pdf.price) || 0
        })));
      } catch (err) {
        console.error("Fetch PDFs failed:", err);
        setStatusMessage({ 
          type: 'error', 
          text: "Failed to load documents. Please try again later." 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPdfs();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('pdfCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setSelectedPdfs(parsedCart.map(item => ({
          ...item,
          price: Number(item.price) || 0
        })));
      } catch {
        localStorage.removeItem('pdfCart');
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (selectedPdfs.length > 0) {
      localStorage.setItem('pdfCart', JSON.stringify(selectedPdfs));
    } else {
      localStorage.removeItem('pdfCart');
    }
  }, [selectedPdfs]);

  // Handle outside clicks for modal
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setSelectedPdfDetail(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const togglePdfSelection = (pdf) => {
    if (isMobile) {
      setSelectedPdfDetail(pdf);
    } else {
      setSelectedPdfs(prev =>
        prev.some(p => p.id === pdf.id)
          ? prev.filter(p => p.id !== pdf.id)
          : [...prev, pdf]
      );
    }
  };

  const removePdf = (id) => {
    setSelectedPdfs(prev => prev.filter(pdf => pdf.id !== id));
  };

  const addToCartFromModal = (pdf) => {
    setSelectedPdfs(prev =>
      prev.some(p => p.id === pdf.id)
        ? prev
        : [...prev, pdf]
    );
    setSelectedPdfDetail(null);
  };

  const handleBuyPdfs = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatusMessage({ type: 'error', text: "Please enter a valid email address." });
      return;
    }
    if (selectedPdfs.length === 0) {
      setStatusMessage({ type: 'error', text: "Your cart is empty. Please add documents to proceed." });
      return;
    }
  
    setIsCheckingOut(true);
    setLoading(true);
  
    try {
      const items = selectedPdfs.map(pdf => ({ pdf_id: pdf.id }));
  
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/pdf`,
        {
          callback_url: `${window.location.origin}/BuyPdf`,
          email,
          items
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );
  
      const data = res.data.data || res.data;
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
        return;
      }
  
      setStatusMessage({
        type: 'success',
        text: "Payment initialized successfully. Please check your email for details."
      });
      setSelectedPdfs([]);
      setEmail('');
    } catch (err) {
      console.error("Payment processing error:", err);
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message ||
          "Payment processing failed. Please try again or contact support."
      });
    } finally {
      setLoading(false);
      setIsCheckingOut(false);
    }
  };

  const filteredPdfs = pdfList.filter(pdf =>
    pdf.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = selectedPdfs.length;
  const totalPrice = selectedPdfs.reduce((sum, pdf) => sum + (Number(pdf.price) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mt-10 md:mt-20 mb-8 md:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
          >
            PUTME Past Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Premium exam preparation materials for your success
          </motion.p>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {statusMessage.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`p-4 mb-6 rounded-lg shadow-sm ${
                statusMessage.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <div className="flex items-center">
                {statusMessage.type === 'success' ? (
                  <FaCheckCircle className="mr-3 text-green-500 flex-shrink-0" />
                ) : (
                  <FaTimes className="mr-3 text-red-500 flex-shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* PDF List Section */}
          <div className={`${isMobile && selectedPdfDetail ? 'hidden' : 'flex-1'}`}>
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative mb-6"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search past questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </motion.div>

            {/* Loading State */}
            {loading && !pdfList.length ? (
              <div className="flex justify-center items-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <FaSpinner className="text-blue-600 h-12 w-12" />
                </motion.div>
              </div>
            ) : null}

            {/* PDF Grid */}
            {!loading && (
              <div className="block gap-4 md:gap-6">
                {filteredPdfs.length > 0 ? (
                  filteredPdfs.map((pdf, index) => {
                    const selected = selectedPdfs.some(p => p.id === pdf.id);
                    return (
                      <motion.div
                        key={pdf.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => togglePdfSelection(pdf)}
                        className={`p-4 md:p-5 bg-white rounded-xl cursor-pointer border-2 transition-all duration-200 hover:shadow-lg ${
                          selected 
                            ? 'border-blue-600 shadow-md' 
                            : 'border-gray-200 hover:border-blue-400'
                        }`}
                        whileHover={{ y: isMobile ? 0 : -5 }}
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex items-start mb-3 md:mb-4">
                            <div className={`p-2 md:p-3 rounded-lg mr-3 md:mr-4 flex-shrink-0 ${
                              selected 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <FaFilePdf className="h-4 w-4 md:h-5 md:w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base md:text-lg font-semibold truncate">{pdf.name}</h3>
                              <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2">
                                {pdf.description || 'No description available'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
                              <FaDownload className="text-blue-500" />
                              <span>{pdf.size ? formatFileSize(pdf.size) : 'Size N/A'}</span>
                            </div>
                            <span className="text-base md:text-lg font-bold text-blue-600">
                              ₦{(Number(pdf.price) || 0).toFixed(2)}
                            </span>
                          </div>
                          {selected && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1"
                            >
                              <FaCheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-3 py-12 text-center"
                  >
                    <FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">No documents found</h3>
                    <p className="text-gray-500 mt-1">
                      {searchTerm 
                        ? 'Try a different search term' 
                        : 'No documents available at the moment'}
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Shopping Cart Section - Hidden on mobile when viewing PDF detail */}
          {(!isMobile || !selectedPdfDetail) && (
            <div className="lg:w-96 w-full">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="sticky top-6"
              >
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center">
                    <FaShoppingCart className="mr-2 text-blue-600" />
                    <span>Your Cart</span>
                    {totalItems > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs md:text-sm font-medium"
                      >
                        {totalItems} item{totalItems !== 1 ? 's' : ''}
                      </motion.span>
                    )}
                  </h3>
                  
                  {selectedPdfs.length > 0 ? (
                    <>
                      <div className="space-y-3 md:space-y-4 max-h-64 md:max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence>
                          {selectedPdfs.map(pdf => (
                            <motion.div 
                              key={pdf.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200 overflow-hidden"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm md:text-base font-medium text-gray-800 truncate">{pdf.name}</h4>
                                  <div className="flex items-center mt-1 text-xs md:text-sm text-gray-500">
                                    <span>{pdf.size ? formatFileSize(pdf.size) : 'Size N/A'}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3 md:space-x-4 ml-2 md:ml-4">
                                  <span className="text-sm md:text-base font-medium text-blue-600 whitespace-nowrap">
                                    ₦{(Number(pdf.price) || 0).toFixed(2)}
                                  </span>
                                  <button 
                                    onClick={() => removePdf(pdf.id)} 
                                    className="text-gray-400 hover:text-red-500 transition-colors text-xs md:text-sm"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 md:mt-6 border-t pt-3 md:pt-4"
                      >
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                          <span className="text-sm md:text-base text-gray-600">Total</span>
                          <span className="text-base md:text-lg font-bold text-blue-600">
                            ₦{(Number(totalPrice) || 0).toFixed(2)}
                          </span>
                        </div>

                        <div className="mb-3 md:mb-4">
                          <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                            Email for receipt
                          </label>
                          <input
                            type="email"
                            id="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs md:text-sm"
                            required
                          />
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={handleBuyPdfs}
                          disabled={loading || isCheckingOut}
                          className={`w-full py-2 md:py-3 rounded-md text-white font-medium flex justify-center items-center transition-all text-sm md:text-base ${
                            loading || isCheckingOut
                              ? 'bg-blue-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                          }`}
                        >
                          {loading || isCheckingOut ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            `Pay ₦${(Number(totalPrice) || 0).toFixed(2)}`
                          )}
                        </motion.button>

                        <div className="mt-2 md:mt-3 flex items-center text-xs text-gray-500">
                          <FaInfoCircle className="mr-1 flex-shrink-0" />
                          <span>Secure payment processing</span>
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6 md:py-8"
                    >
                      <FaShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-3 md:mb-4" />
                      <p className="text-sm md:text-base text-gray-500">Your cart is empty</p>
                      <p className="text-xs md:text-sm text-gray-400 mt-1">
                        Select documents to add to your cart
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile PDF Detail Modal */}
        <AnimatePresence>
          {selectedPdfDetail && isMobile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div 
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-white p-5 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{selectedPdfDetail.name}</h3>
                  <button 
                    onClick={() => setSelectedPdfDetail(null)} 
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <div className="flex items-center mr-3">
                    <FaDownload className="mr-1 text-blue-500" />
                    <span>{selectedPdfDetail.size ? formatFileSize(selectedPdfDetail.size) : 'Size N/A'}</span>
                  </div>
                  <span className="font-bold text-blue-600">
                    ₦{(Number(selectedPdfDetail.price) || 0).toFixed(2)}
                  </span>
                </div>

                <div className="mb-5">
                  <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">
                    {selectedPdfDetail.description || 'No description available for this document.'}
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCartFromModal(selectedPdfDetail)}
                  className={`w-full py-3 rounded-md text-white font-medium text-sm ${
                    selectedPdfs.some(p => p.id === selectedPdfDetail.id)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors shadow-md`}
                >
                  {selectedPdfs.some(p => p.id === selectedPdfDetail.id)
                    ? 'Added to Cart'
                    : 'Add to Cart'}
                </motion.button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main> 
      <Footer/>
    </div>
  );
};

export default PdfStore;