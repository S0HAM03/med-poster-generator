import { useRef, useState } from 'react';
import { processImage } from '../../utils/canvasScalers';

export default function CameraCapture({ onImageProcessed }) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      alert("Could not access the camera. Please upload an image instead.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const captureImage = async () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        const base64 = await processImage(file);
        stopCamera();
        onImageProcessed(base64);
      }
    }, 'image/jpeg', 1.0);
  };

  if (!isCameraActive) {
    return (
      <button 
        onClick={startCamera}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-md transition-colors flex items-center justify-center space-x-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Open Camera</span>
      </button>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-black w-full max-w-md mx-auto">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-auto"
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-6">
        <button 
          onClick={stopCamera}
          className="bg-gray-800 text-white font-bold py-3 px-6 rounded-full border-2 border-white/50"
        >
          Cancel
        </button>
        <button 
          onClick={captureImage}
          className="bg-white text-indigo-950 font-bold py-3 px-8 rounded-full shadow-lg"
        >
          Capture
        </button>
      </div>
    </div>
  );
}
