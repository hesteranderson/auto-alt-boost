"use client";

import { useState } from "react";

// Define the structure of our SEO data for TypeScript
interface SEOData {
  alt_text: string;
  description: string;
  keywords: string;
}

interface ImageItem {
  id: string;
  file: File;
  preview: string;
  status: 'Uploading' | 'Processing' | 'Ready' | 'Error';
  data: SEOData | null;
}

export default function HeroHome() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsBulkLoading(true);

    // 1. Create the placeholder items in the list immediately
    const newUploads: ImageItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      status: 'Processing',
      data: null,
    }));

    setItems((prev) => [...prev, ...newUploads]);

    // 2. Loop through and process each image one by one
    for (const item of newUploads) {
      try {
        const response = await fetch("https://auto-alt-boost.hester-anderson1981.workers.dev", {
          method: "POST",
          body: item.file,
        });

        if (!response.ok) throw new Error("Worker Error");

        const result: SEOData = await response.json();

        // Update the state for this specific item
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: 'Ready', data: result } : i
          )
        );
      } catch (error) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: 'Error' } : i
          )
        );
      }
    }
    setIsBulkLoading(false);
  };

  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header Text */}
        <div className="text-center pb-12 md:pb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">
            AutoAlt<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Boost</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload your product photos and let AI generate competitor-grade SEO metadata.
          </p>

          {/* Upload Button Area */}
          <div className="flex justify-center">
            <label className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              {isBulkLoading ? "Processing Bulk..." : "Upload Images (Bulk)"}
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleUpload} 
                disabled={isBulkLoading}
              />
            </label>
          </div>
        </div>

        {/* The Results Table (The View you asked for) */}
        {items.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO Details</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    {/* Image Preview */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-24 h-24">
                        <img src={item.preview} alt="Preview" className="w-full h-full object-cover rounded-lg border shadow-sm" />
                        {item.status === 'Processing' && (
                          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Meta Data View */}
