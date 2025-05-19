import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, AlertCircle, Download } from 'lucide-react';
import Papa from 'papaparse';
import { supabase, verifySession } from '../../lib/supabase';
import { calculateDiscountPercentage, calculateTotalCommercialSales, isProposedPriceLteMfc } from '../../utils/calculations';

interface ImportStatus {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  estimatedTimeRemaining: string;
  startTime?: number;
  processingSpeed?: number; // Items per second
  batchSize?: number;
}

const ImportData: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [totalRows, setTotalRows] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [cancelImport, setCancelImport] = useState(false);
  const importCancelledRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Reset cancel flag when component unmounts or when starting a new import
  useEffect(() => {
    return () => {
      importCancelledRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Count rows and determine optimal batch size when file is selected
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          // Count the number of rows in the CSV file
          const content = e.target.result as string;
          const lineCount = content.split('\n').length - 1; // Subtract 1 for header row
          
          // Parse a small sample to verify it's valid CSV and get actual row count
          Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            preview: 10, // Just check a few rows to validate format
            complete: (results) => {
              if (results.errors.length > 0) {
                setError(`CSV validation error: ${results.errors[0].message}`);
                return;
              }
              
              // Now count all rows
              Papa.parse(content, {
                header: true,
                skipEmptyLines: true,
                complete: (fullResults) => {
                  const rowCount = fullResults.data.length;
                  setTotalRows(rowCount);
                  
                  // Dynamically adjust batch size based on total rows
                  let batchSize = 50; // Default batch size
                  if (rowCount > 1000) batchSize = 100;
                  if (rowCount > 5000) batchSize = 200;
                  if (rowCount > 10000) batchSize = 500;
                  
                  console.log(`File contains ${rowCount} rows. Using batch size: ${batchSize}`);
                  
                  setStatus(prev => prev ? { ...prev, batchSize } : { 
                    total: rowCount,
                    processed: 0,
                    successful: 0,
                    failed: 0,
                    estimatedTimeRemaining: 'Calculating...',
                    batchSize
                  });
                }
              });
            }
          });
        }
      };
      reader.readAsText(file);
    } else {
      setTotalRows(0);
      setStatus(null);
    }
  }, [file]);

  const calculateTimeRemaining = (processed: number, total: number, startTime: number, processingSpeed?: number): string => {
    const elapsedTime = Date.now() - startTime;
    if (processed === 0) return 'Calculating...';
    
    // Calculate current processing speed if not provided
    const currentSpeed = processingSpeed || (processed / (elapsedTime / 1000));
    const remainingItems = total - processed;
    const estimatedRemainingSeconds = remainingItems / currentSpeed;

    if (estimatedRemainingSeconds < 1) return 'Less than a second';
    if (estimatedRemainingSeconds < 60) return `${Math.round(estimatedRemainingSeconds)} seconds`;
    if (estimatedRemainingSeconds < 3600) return `${Math.round(estimatedRemainingSeconds / 60)} minutes`;
    return `${Math.round(estimatedRemainingSeconds / 3600)} hours`;
  };

  const CSV_HEADERS = [
    'sin',
    'item_number',
    'description',
    'mfr_name',
    'mfr_number',
    'units_sold_qty',
    'total_comm_and_proposed_sales',
    'commercial_price_list',
    'mfc_price',
    'tc_price',
    'tc_total_sales',
    'proposed_price',
    'proposed_total_sales'
  ];

  const CSV_EXAMPLE = [
    'L39',
    'IT-001',
    'Sample Product Description',
    'Manufacturer Inc',
    'MFR-123',
    '100',
    '150000.00',
    '1500.00',
    '1200.00',
    '1100.00',
    '110000.00',
    '1000.00',
    '100000.00'
  ];

  const downloadTemplate = () => {
    const csvContent = [
      CSV_HEADERS.join(','),
      CSV_EXAMPLE.map(field => `"${field}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'price_analysis_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a CSV file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a CSV file');
    }
  };

  const validateRow = (row: any, rowIndex: number): boolean => {
    const requiredFields = [
      'sin',
      'item_number',
      'mfr_name',
      'mfr_number'
    ];

    const numericFields = [
      'units_sold_qty',
      'total_comm_and_proposed_sales',
      'total_commercial_sales',
      'commercial_price_list',
      'mfc_price',
      'tc_price',
      'tc_total_sales',
      'proposed_price',
      'proposed_total_sales'
    ];

    // Check required fields
    for (const field of requiredFields) {
      if (!row[field]) {
        throw new Error(`Row ${rowIndex + 1}: Missing required field: ${field}`);
      }
    }

    // Initialize numeric fields with default values if missing
    numericFields.forEach(field => {
      if (!row[field]) {
        row[field] = 0;
      }
    });

    // Validate and convert numeric fields
    for (const field of numericFields) {
      if (row[field]) {
        // Remove any currency symbols, commas and whitespace
        const cleanValue = row[field].toString().replace(/[$,\s]/g, '');
        const numValue = parseFloat(cleanValue);
        
        if (isNaN(numValue)) {
          throw new Error(`Row ${rowIndex + 1}: Invalid numeric value for ${field}: ${row[field]}`);
        }
        
        // Update the row with the cleaned numeric value
        row[field] = numValue;
      }
    }

    // Calculate discounts based on commercial price list if all required values are present
    if (row.commercial_price_list) {
      if (row.mfc_price) {
        row.mfc_discount = calculateDiscountPercentage(row.commercial_price_list, row.mfc_price);
      }

      if (row.tc_price) {
        row.tc_discount = calculateDiscountPercentage(row.commercial_price_list, row.tc_price);
      }

      if (row.proposed_price) {
        row.proposed_discount = calculateDiscountPercentage(row.commercial_price_list, row.proposed_price);
      }
    }

    // Calculate total commercial sales if both values are present
    if (row.total_comm_and_proposed_sales !== undefined && row.proposed_total_sales !== undefined) {
      row.total_commercial_sales = calculateTotalCommercialSales(row.total_comm_and_proposed_sales, row.proposed_total_sales);

      // Validate the calculated value
      if (row.total_commercial_sales < 0) {
        throw new Error(`Row ${rowIndex + 1}: Total commercial sales cannot be negative (${row.total_commercial_sales})`);
      }
    }

    // Determine if proposed price is less than or equal to MFC price
    if (row.proposed_price !== undefined && row.mfc_price !== undefined) {
      row.is_proposed_price_lte_mfc = isProposedPriceLteMfc(row.proposed_price, row.mfc_price);
    } else {
      row.is_proposed_price_lte_mfc = 'NO'; // Default value if either price is missing
    }

    return true;
  };

  const processImport = async (items: any[]) => {
    // Verify session is valid before starting import
    const isSessionValid = await verifySession();
    if (!isSessionValid) {
      throw new Error('Your session has expired. Please refresh the page to continue.');
    }

    // Get the current user's ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('You must be logged in to import data');
    }

    const batchId = new Date().getTime().toString();
    const startTime = Date.now();
    
    // Determine batch size based on total items
    let batchSize = 50; // Default for small imports
    if (items.length > 1000) batchSize = 100;
    if (items.length > 5000) batchSize = 200;
    if (items.length > 10000) batchSize = 500;

    const status: ImportStatus = {
      total: items.length,
      processed: 0,
      successful: 0,
      failed: 0,
      estimatedTimeRemaining: 'Calculating...',
      startTime,
      batchSize
    };

    // Reset cancel flag
    importCancelledRef.current = false;
    setCancelImport(false);
    
    // Create a new AbortController for this import
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      // Process items in batches for better performance
      for (let i = 0; i < items.length; i += batchSize) {
        // Check if import has been cancelled
        if (importCancelledRef.current || signal.aborted) {
          setError('Import cancelled by user');
          break;
        }

        // Verify session every few batches
        if (i % (batchSize * 5) === 0 && i > 0) {
          const isStillValid = await verifySession();
          if (!isStillValid) {
            throw new Error('Your session has expired. Please refresh the page to continue.');
          }
        }

        // Process current batch
        const batch = items.slice(i, Math.min(i + batchSize, items.length));
        const validBatch = [];
        
        // Validate each item in the batch
        for (let j = 0; j < batch.length; j++) {
          try {
            validateRow(batch[j], i + j);
            validBatch.push({
              ...batch[j],
              upload_batch_id: batchId,
              created_by: user.id
            });
          } catch (err) {
            console.error('Validation error:', err);
            status.failed++;
          }
        }

        // Insert valid items
        if (validBatch.length > 0) {
          const { error: insertError } = await supabase
            .from('price_analysis')
            .insert(validBatch);

          if (insertError) {
            if (insertError.message.includes('JWT')) {
              throw new Error('Your session has expired. Please refresh the page to continue.');
            }
            console.error('Insert error:', insertError);
            status.failed += validBatch.length;
          } else {
            status.successful += validBatch.length;
          }
        }
        
        status.processed += batch.length;
        
        // Update estimated time remaining
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        if (elapsedSeconds > 0) {
          status.processingSpeed = status.processed / elapsedSeconds;
          status.estimatedTimeRemaining = calculateTimeRemaining(
            status.processed, 
            status.total, 
            startTime, 
            status.processingSpeed
          );
        }
        
        setStatus({ ...status });

        // Add a small delay to allow UI updates and cancellation checks
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Import cancelled by user');
      } else {
        throw err;
      }
    }

    return status;
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);
    setStatus(null);
    setCancelImport(false);
    importCancelledRef.current = false;

    try {
      // Verify session is valid before starting import
      const isSessionValid = await verifySession();
      if (!isSessionValid) {
        throw new Error('Your session has expired. Please refresh the page to continue.');
      }

      // Parse CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          if (results.errors.length > 0) {
            setError(`CSV parsing error: ${results.errors[0].message}`);
            setImporting(false);
            return;
          }

          try {
            const finalStatus = await processImport(results.data);
            
            if (importCancelledRef.current) {
              // If import was cancelled, automatically refresh after a short delay
              setTimeout(() => {
                onComplete();
              }, 1500);
            } else if (finalStatus.successful > 0) {
              setTimeout(() => {
                onComplete();
              }, 1500);
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import data');
          } finally {
            setImporting(false);
            abortControllerRef.current = null;
          }
        },
        error: (error) => {
          setError(`Failed to parse CSV file: ${error.message}`);
          setImporting(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
      setImporting(false);
    }
  };

  const handleCancelImport = () => {
    importCancelledRef.current = true;
    setCancelImport(true);
    setError('Import cancellation requested. Finishing current batch...');
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Automatically refresh after a short delay
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Import Price Analysis Data</h2>
        <p className="text-sm text-gray-600">Upload a CSV file containing price analysis data</p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">Need a template?</h3>
            <p className="text-sm text-blue-600">
              Download our CSV template file to ensure your data is formatted correctly
            </p>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Download size={16} />
            Download Template
          </button>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".csv"
          className="hidden"
        />

        {file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <span>{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            
            {totalRows > 0 && (
              <div className="text-sm text-gray-600 font-medium bg-yellow-100 py-2 px-4 rounded-lg inline-block">
                File contains {totalRows.toLocaleString()} items
              </div>
            )}
            
            <button
              onClick={handleImport}
              disabled={importing}
              className={`px-4 py-2 rounded-lg text-white ${
                importing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {importing ? 'Importing...' : 'Start Import'}
            </button>
          </div>
        ) : (
          <div>
            <Upload size={32} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your CSV file here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 hover:text-blue-600"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500">
              Supported format: CSV
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {status && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-800">Import Progress</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {status.processed.toLocaleString()} of {status.total.toLocaleString()} items
              </span>
              <span className="text-sm text-blue-600">
                Est. time remaining: {status.estimatedTimeRemaining}
              </span>
            </div>
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(status.processed / status.total) * 100}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-green-600">
              <AlertCircle size={16} />
              <span className="text-sm">
                {status.successful.toLocaleString()} items imported successfully
              </span>
            </div>
            {status.failed > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">
                  {status.failed.toLocaleString()} items failed to import
                </span>
              </div>
            )}
          </div>

          {importing && !cancelImport && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleCancelImport}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cancel Import
              </button>
            </div>
          )}

          {cancelImport && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>Cancelling import... Please wait while current operations complete.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportData;