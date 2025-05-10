import React from 'react';
import { X } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';
import { Result } from '@zxing/library';

interface ScannerModalProps {
  onClose: () => void;
  onScan: (result: Result) => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ onClose, onScan }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Scan Code</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <BarcodeScanner
          onScan={(result) => {
            onScan(result);
            onClose();
          }}
          onError={(error) => console.error('Scanning error:', error)}
        />
        <p className="text-sm text-gray-600 mt-4">
          Position the barcode or QR code within the scanning area
        </p>
      </div>
    </div>
  );
};

export default ScannerModal;