import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // ✅ change to production

const PdfStore = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch PDFs on mount
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/pdf`);
        setPdfs(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load PDFs');
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, []);

  // ✅ Buy PDF and redirect
  const buyPdf = async (pdfId) => {
    try {
      setPaymentLoading(true);
      setError(null);
      const res = await axios.post(`${API_BASE_URL}/pdf`, {
        callback_url: `${window.location.origin}/home`,
        pdf_id: pdfId,
        email: "Olaoluwavincent@gmail.com"
      });

      const authUrl = res.data?.data?.authorization_url;
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setError('Failed to initialize payment');
      }
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Buy Past Questions (PDF)
        </h1>

        {loading && <p className="text-gray-600 mb-4">Loading PDFs...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pdfs.map((pdf) => (
            <div key={pdf.id} className="bg-white rounded-lg shadow p-5 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{pdf.name}</h2>
              <p className="text-gray-600 mb-4">₦{pdf.price}</p>
              <button
                onClick={() => buyPdf(pdf.id)}
                disabled={paymentLoading}
                className={`px-4 py-2 rounded w-full text-white font-medium transition-colors ${
                  paymentLoading
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {paymentLoading ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PdfStore;
