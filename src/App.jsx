import { useState, useRef } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dropzone from './components/upload/Dropzone';
import CameraCapture from './components/upload/CameraCapture';
import VerificationForm from './components/editor/VerificationForm';
import PosterCanvas from './components/poster/PosterCanvas';
import { useVisionApi } from './hooks/useVisionApi';
import { usePosterExport } from './hooks/usePosterExport';

function App() {
  const [appState, setAppState] = useState('UPLOAD'); // UPLOAD, VERIFY, POSTER
  const [imageSrc, setImageSrc] = useState(null);
  const [lang, setLang] = useState('en');
  const posterRef = useRef(null);
  
  const { analyzeImage, isLoading, error, data, setData } = useVisionApi();
  const { exportPoster } = usePosterExport();

  const handleImageProcessed = async (base64) => {
    setImageSrc(base64);
    const result = await analyzeImage(base64);
    if (result) {
      setAppState('VERIFY');
    }
  };

  const handleRetry = () => {
    if (imageSrc) {
      handleImageProcessed(imageSrc);
    }
  };

  const handleGenerate = () => {
    setAppState('POSTER');
  };

  const handleDownload = () => {
    // Slight delay to ensure any font rendering or layout repaints finish before capturing
    setTimeout(() => {
      exportPoster(posterRef, 'medication-schedule.pdf');
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow py-8 px-4 sm:px-8">
        {/* Banner Ad Placement Block A */}
        <div className="max-w-4xl mx-auto mb-8 bg-gray-200 border-2 border-dashed border-gray-300 h-24 flex items-center justify-center text-gray-500 rounded-lg ad-container">
          Advertisement (Banner A)
        </div>

        {appState === 'UPLOAD' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Turn Messy Prescriptions into Clear Daily Schedules</h2>
              <p className="text-xl text-gray-600">Upload a photo of your doctor's prescription or pill strip, and we'll automatically create a beautiful, easy-to-read printable poster.</p>
            </div>
            
            {error && error.type === 'rate_limit' ? (
              <div className="bg-red-50 border-2 border-red-400 text-red-900 p-6 rounded-xl mb-6 text-center shadow-sm">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-2xl font-black mb-2">System Busy</h3>
                <p className="text-xl font-medium mb-6">{error.message}</p>
                <button 
                  onClick={handleRetry} 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-md"
                >
                  Retry Analysis
                </button>
              </div>
            ) : error ? (
              <div className="bg-rose-50 border border-rose-400 text-rose-700 p-4 rounded-lg mb-6 text-lg font-bold text-center">
                {error.message || error}
              </div>
            ) : null}

            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-2xl font-bold text-gray-700">Analyzing Prescription...</p>
                <p className="text-lg text-gray-500">Extracting medication names and schedules</p>
              </div>
            ) : (
              !error || error.type !== 'rate_limit' ? (
                <div className="space-y-6">
                  <Dropzone onImageProcessed={handleImageProcessed} />
                  <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 font-bold">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                  <CameraCapture onImageProcessed={handleImageProcessed} />
                </div>
              ) : null
            )}
          </div>
        )}

        {appState === 'VERIFY' && data && (
          <div className="space-y-8">
            <VerificationForm 
              data={data} 
              setData={setData} 
              imageSrc={imageSrc} 
              onGenerate={handleGenerate} 
            />
            {/* In-Feed Ad Placement Block B */}
            <div className="max-w-4xl mx-auto bg-gray-200 border-2 border-dashed border-gray-300 h-64 flex items-center justify-center text-gray-500 rounded-lg ad-container">
              Advertisement (In-Feed Block B)
            </div>
          </div>
        )}

        {appState === 'POSTER' && data && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Your Poster is Ready!</h2>
                <p className="text-xl text-gray-600 mt-1">Select language, download and print on an A4 sheet.</p>
              </div>
              <div className="flex gap-4 mt-4 sm:mt-0 flex-wrap items-center">
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value)}
                  className="px-4 py-4 border-2 border-gray-300 rounded-lg text-xl font-bold text-gray-900 bg-white"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                </select>
                <button 
                  onClick={() => setAppState('VERIFY')}
                  className="px-6 py-4 border-2 border-gray-300 rounded-lg text-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Back to Editor
                </button>
                <button 
                  onClick={handleDownload}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-xl font-bold hover:bg-indigo-700 shadow-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Poster</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto shadow-inner bg-gray-200 p-8 rounded-xl border border-gray-300 relative">
              <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
                <PosterCanvas data={data} lang={lang} ref={posterRef} />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
