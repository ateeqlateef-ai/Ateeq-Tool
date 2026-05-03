import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileText, Check, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExcelUploadProps {
  onSuccess: () => void;
}

export default function ExcelUpload({ onSuccess }: ExcelUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccessCount(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          throw new Error('The excel sheet is empty');
        }

        // Normalize column names
        const newLeads = jsonData.map((l: any) => {
          const findKey = (possibleKeys: string[]) => {
            const key = Object.keys(l).find(k => 
              possibleKeys.some(pk => k.toLowerCase().trim() === pk.toLowerCase())
            );
            return key ? l[key] : "";
          };

          return {
            companyName: findKey(['Company Name', 'Company', 'Firm', 'Business']),
            email: findKey(['Email', 'E-mail', 'Contact Email']),
            phone: findKey(['Phone', 'Mobile', 'WhatsApp', 'Contact Number', 'Phone Number']),
            city: findKey(['City', 'Location', 'Region']),
            website: findKey(['Website', 'URL', 'Link']),
            specialization: findKey(['Specialization', 'Niche', 'Industry', 'Category', 'Service'])
          };
        });

        const response = await fetch('/api/leads/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLeads),
        });

        if (!response.ok) throw new Error('Failed to upload leads to server');
        
        const result = await response.json();
        setSuccessCount(result.count);
        onSuccess();

        // Clear input
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error processing Excel file');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls, .csv"
        className="hidden"
      />
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {loading ? 'Processing...' : 'Upload Excel'}
      </motion.button>

      <AnimatePresence>
        {successCount !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full right-0 mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-400 text-xs whitespace-nowrap z-10"
          >
            <Check size={14} />
            Successfully imported {successCount} leads
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full right-0 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs whitespace-nowrap z-10"
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
