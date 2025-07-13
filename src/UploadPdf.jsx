import { useState } from 'react';
import axios from 'axios';

const PdfUploader = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !price || !file) {
      setErrorMessage('All fields are required');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/questions/pdf-upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      setSuccessMessage('PDF uploaded successfully!');
      setName('');
      setPrice('');
      setFile(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to upload PDF');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="ffff w-full   max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Card-like header with floating effect */}
        <div className="relative mt-16 bg-white pt-8 px-6">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 p-3 rounded-xl shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-center pt-4">
            <h2 className="text-2xl font-bold text-gray-800">Upload PDF</h2>
            <p className="text-gray-500 mt-1">Fill in the details below</p>
          </div>
        </div>

        {/* Form section with subtle border */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 border-t border-gray-100">
          {/* Status messages with better visibility */}
          {successMessage && (
            <div className="p-3 bg-green-50/80 text-green-700 rounded-xl border border-green-200 flex items-center backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50/80 text-red-700 rounded-xl border border-red-200 flex items-center backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Form fields with modern styling */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Document Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder-gray-400"
                  placeholder="English Past Question"
                />
                <div className="absolute inset-0 border border-transparent group-hover:border-gray-200 rounded-xl pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</div>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all pl-10 placeholder-gray-400"
                  placeholder="1700"
                />
                <div className="absolute inset-0 border border-transparent group-hover:border-gray-200 rounded-xl pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                PDF File
              </label>
              <div 
                className={`mt-1 rounded-xl border-2 border-dashed overflow-hidden transition-all ${file ? 'border-blue-300 bg-blue-50/30' : 'border-gray-300 bg-gray-50 hover:border-blue-400'}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-blue-400', 'bg-blue-50/50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  if (!file) e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/50');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile.type === 'application/pdf') {
                    setFile(droppedFile);
                  } else {
                    setErrorMessage('Please upload a PDF file only');
                  }
                  e.currentTarget.classList.remove('border-blue-400');
                  if (!file) e.currentTarget.classList.remove('bg-blue-50/50');
                }}
              >
                {file ? (
                  <div className="p-6 flex flex-col items-center">
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                        <div className="bg-blue-500 rounded-full p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-900 text-center truncate max-w-xs">{file.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="mt-4 flex text-sm text-gray-600 justify-center space-x-1">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Click to upload</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".pdf"
                          className="sr-only"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </label>
                      <p>or drag and drop</p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">PDF files up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit button with depth */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center justify-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Document
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PdfUploader;