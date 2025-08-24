"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    BarcodeDetector: any;
  }
}

export default function QRScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [qrData, setQrData] = useState<any>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
      }
    } catch (err) {
      setError("No se pudo acceder a la cámara");
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const processQRData = (rawData: string) => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(rawData);
      return {
        type: "JSON",
        data: parsed,
        displayText: `Datos: ${JSON.stringify(parsed, null, 2)}`,
      };
    } catch {
      // If is not JSON, it verifies the format ticket:owner:id
      if (rawData.includes("ticket:")) {
        const parts = rawData.split(":");
        if (parts.length === 3) {
          return {
            type: "TICKET",
            data: {
              type: parts[0],
              owner: parts[1],
              ticketId: parts[2],
            },
            displayText: `Ticket #${
              parts[2]
            } - Propietario: ${parts[1].substring(0, 6)}...${parts[1].substring(
              parts[1].length - 4
            )}`,
          };
        }
      }

      // Any other plane text
      return {
        type: "TEXT",
        data: rawData,
        displayText: rawData,
      };
    }
  };

  const scanQR = async () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    try {
      // Use BarcodeDetector API if it's available
      if ("BarcodeDetector" in window) {
        const barcodeDetector = new window.BarcodeDetector({
          formats: ["qr_code"],
        });

        const barcodes = await barcodeDetector.detect(canvas);

        if (barcodes.length > 0) {
          const rawQRCode = barcodes[0].rawValue;
          const processedData = processQRData(rawQRCode);

          setLastResult(processedData.displayText);
          setQrData(processedData);

          // To process the result, then continue
          setTimeout(() => {
            if (isScanning) {
              requestAnimationFrame(scanQR);
            }
          }, 2000);

          return;
        }
      }
    } catch (err) {
      console.error("Error scanning QR:", err);
    }

    // Keep scanning
    if (isScanning) {
      requestAnimationFrame(scanQR);
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (isScanning && videoRef.current) {
      const video = videoRef.current;
      video.addEventListener("loadedmetadata", () => {
        scanQR();
      });
    }
  }, [isScanning]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Escanear Código QR
        </h1>
        <p className="text-purple-100 text-sm md:text-base">
          Apunta la cámara hacia un código QR para escanearlo
        </p>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          {/* Video Container */}
          <div className="relative bg-black/20 rounded-2xl overflow-hidden backdrop-blur-sm border-2 border-white/20">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-80 h-80 md:w-96 md:h-96 object-cover"
            />

            {/* QR Scanner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Corner borders */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-green-400 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-green-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-green-400 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-green-400 rounded-br-lg"></div>

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl">📷</span>
                  </div>
                </div>

                {/* Scanning line animation */}
                {isScanning && (
                  <div className="absolute inset-x-4 top-1/2 h-0.5 bg-green-400 animate-pulse"></div>
                )}
              </div>
            </div>
          </div>

          {/* Hidden canvas for QR detection */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      {/* Result Section */}
      {lastResult && qrData && (
        <div className="mx-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-4">
              <p className="text-white/80 text-sm mb-2">
                Resultado del escaneo
              </p>
              <div className="flex items-center justify-center space-x-2 mb-3">
                <span className="text-green-400 text-xl">✅</span>
                <span className="text-white font-semibold text-sm break-all">
                  {lastResult}
                </span>
              </div>

              {/* Show results according to type */}
              {qrData.type === "TICKET" && (
                <div className="bg-white/5 rounded-lg p-3 mt-3">
                  <p className="text-white/60 text-xs mb-2">
                    Detalles del Ticket:
                  </p>
                  <div className="space-y-1">
                    <p className="text-white text-xs">
                      ID: {qrData.data.ticketId}
                    </p>
                    <p className="text-white text-xs">
                      Propietario: {qrData.data.owner}
                    </p>
                  </div>
                </div>
              )}

              {qrData.type === "JSON" && (
                <div className="bg-white/5 rounded-lg p-3 mt-3">
                  <p className="text-white/60 text-xs mb-2">Datos JSON:</p>
                  <pre className="text-white text-xs text-left overflow-x-auto">
                    {JSON.stringify(qrData.data, null, 2)}
                  </pre>
                </div>
              )}

              <p className="text-white/60 text-xs mt-2">Tipo: {qrData.type}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-6">
          <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-red-400/30">
            <p className="text-red-200 text-center text-sm">{error}</p>
            <button
              onClick={startCamera}
              className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="text-center pb-8 px-4">
        <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isScanning ? "bg-green-400 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-white text-sm">
              {isScanning ? "Escaneando..." : "Cámara inactiva"}
            </span>
          </div>

          <button
            onClick={isScanning ? stopCamera : startCamera}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isScanning
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isScanning ? "Detener" : "Iniciar"}
          </button>
        </div>
      </div>
    </div>
  );
}
