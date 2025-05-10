import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Result } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (result: Result) => void;
  onError?: (error: Error) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        readerRef.current = new BrowserMultiFormatReader();
        
        if (videoRef.current) {
          await readerRef.current.decodeFromVideoDevice(
            undefined,
            videoRef.current,
            (result, error) => {
              if (result) {
                onScan(result);
              }
              if (error && onError) {
                onError(error);
              }
            }
          );
        }
      } catch (error) {
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    };

    startScanner();

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, [onScan, onError]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full rounded-lg"
        style={{ maxWidth: '100%' }}
      />
      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border-2 border-white rounded opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;