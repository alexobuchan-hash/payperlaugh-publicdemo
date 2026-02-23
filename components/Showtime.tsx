
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LaughStats } from '../types';
import { LAUGH_THRESHOLD, COOLDOWN_PERIOD } from '../constants';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

interface ShowtimeProps {
  onLaughDetected: () => void;
  onFinish: () => void;
  stats: LaughStats;
}

const Showtime: React.FC<ShowtimeProps> = ({ onLaughDetected, onFinish, stats }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [landmarker, setLandmarker] = useState<FaceLandmarker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  
  const lastLaughTime = useRef<number>(0);
  const requestRef = useRef<number>(0);

  // Initialize MediaPipe
  useEffect(() => {
    const initFaceLandmarker = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const fl = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });
        setLandmarker(fl);
      } catch (err) {
        console.error("Failed to init FaceLandmarker:", err);
        setError("AI initialization failed. Please check your internet connection or try a different browser.");
      }
    };

    initFaceLandmarker();
  }, []);

  // Start Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480, frameRate: { ideal: 30 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsReady(true);
          };
        }
      } catch (err) {
        setError("Camera permission denied. We need to see you laugh!");
      }
    };

    if (landmarker) {
      startCamera();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [landmarker]);

  // Detection Loop
  const detect = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !landmarker) return;

    const startTimeMs = performance.now();
    const results = landmarker.detectForVideo(videoRef.current, startTimeMs);
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        let minX = 1, minY = 1, maxX = 0, maxY = 0;
        landmarks.forEach((point: any) => {
          if (point.x < minX) minX = point.x;
          if (point.x > maxX) maxX = point.x;
          if (point.y < minY) minY = point.y;
          if (point.y > maxY) maxY = point.y;
        });

        let currentSmiling = false;

        // Smile Blendshape Check
        if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
          const blendShapes = results.faceBlendshapes[0].categories;
          const smileLeft = blendShapes.find((c: any) => c.categoryName === 'mouthSmileLeft')?.score || 0;
          const smileRight = blendShapes.find((c: any) => c.categoryName === 'mouthSmileRight')?.score || 0;
          const averageSmile = (smileLeft + smileRight) / 2;

          currentSmiling = averageSmile > LAUGH_THRESHOLD;
          
          if (currentSmiling !== isSmiling) {
            setIsSmiling(currentSmiling);
          }

          const now = Date.now();
          if (currentSmiling && (now - lastLaughTime.current > COOLDOWN_PERIOD)) {
            lastLaughTime.current = now;
            onLaughDetected();
            triggerNotification();
          }
        }

        // Draw Bounding Box
        ctx.strokeStyle = currentSmiling ? '#ec4899' : '#ffffff';
        ctx.lineWidth = 2;
        const w = (maxX - minX) * canvasRef.current.width;
        const h = (maxY - minY) * canvasRef.current.height;
        ctx.strokeRect(minX * canvasRef.current.width, minY * canvasRef.current.height, w, h);
      } else {
        if (isSmiling) setIsSmiling(false);
      }
    }

    requestRef.current = requestAnimationFrame(detect);
  }, [landmarker, onLaughDetected, isSmiling]);

  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 1000);
  };

  useEffect(() => {
    if (isReady && landmarker) {
      requestRef.current = requestAnimationFrame(detect);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isReady, landmarker, detect]);

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
      <div className="relative group overflow-hidden rounded-3xl border-4 border-white/5 bg-neutral-900 shadow-2xl shadow-purple-500/10 mb-8 max-w-2xl w-full aspect-video">
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
          muted
          playsInline
        />
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={480}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        
        {/* Detection Status Overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isSmiling ? 'bg-pink-500 shadow-[0_0_8px_#ec4899]' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`} />
            <span className="text-[10px] uppercase font-bold tracking-wider">
              {isSmiling ? 'Laughing Detected' : 'Monitoring Face'}
            </span>
          </div>
        </div>

        {/* Laugh Alert */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${showNotification ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="bg-pink-500 text-white px-8 py-3 rounded-2xl font-black uppercase text-4xl shadow-2xl rotate-2">
            €0.30!
          </div>
        </div>

        {/* Loading Overlay */}
        {!isReady && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-neutral-500">Waking up the AI...</p>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-30 p-8 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-lg font-bold mb-2">{error}</p>
            <button onClick={() => window.location.reload()} className="underline text-neutral-400">Retry</button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Session Limit</p>
            <p className="text-xl font-bold">€{stats.maxCharge.toFixed(2)}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Laugh Price</p>
            <p className="text-xl font-bold">€{stats.pricePerLaugh.toFixed(2)}</p>
          </div>
        </div>

        <button 
          onClick={onFinish}
          className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold uppercase tracking-widest rounded-2xl transition-colors border border-white/5"
        >
          Finish & Pay
        </button>
      </div>
    </div>
  );
};

export default Showtime;
