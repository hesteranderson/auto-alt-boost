"use client";

import { useState } from "react";

// Define the data structure for TypeScript
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

    const newUploads: ImageItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      status: 'Processing',
      data: null,
    }));

    setItems((prev) => [...prev, ...newUploads]);

    for (const item of newUploads) {
      try {
        const response = await fetch("https://auto-alt-boost.hester-anderson1981.workers.dev", {
          method: "POST",
          body: item.file,
        });

        if (!response.ok) throw new Error("Worker Error");

        const result: SEOData = await response.json();

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Branding & Upload Section */}
        <div className="text-center pb-12 md:pb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">
            AutoAlt<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Boost</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The AI-powered SEO engine for e-commerce. Identify, Search, and Optimize in bulk.
          </p>

          <div className="flex justify-center">
            <label className="cursor-pointer bg-blue-600 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95">
              {isBulkLoading ? "Processing Queue..." : "Upload Images (Bulk)"}
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

        {/* Dashboard Table */}
        {items.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">SEO Metadata</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    
                    {/* Thumbnail Column */}
                    <td className="px-6 py-6 whitespace-nowrap align-top">
                      <div className="relative w-32 h-32">
                        <img src={item.preview} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-md border border-white" />
                        {item.status === 'Processing' && (
                          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* SEO Content Column */}
                    <td className="px-6 py-6">
                      {item.status === 'Ready' && item.data ? (
                        <div className="space-y-5 max-w-2xl">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alt Text</span>
                              <button onClick={() => copyToClipboard(item.data!.alt_text)} className="text-[10px] text-blue-500 hover:underline">Copy</button>
                            </div>
                            <p className="text-sm text-gray-800 font-medium leading-relaxed">{item.data.alt_text}</p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meta Description</span>
                              <button onClick={() => copyToClipboard(item.data!.description)} className="text-[10px] text-blue-500 hover:underline">Copy</button>
                            </div>
                            <p className="text-sm text-gray-500 italic leading-relaxed">{item.data.description}</p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SEO Keywords</span>
                              <button onClick={() => copyToClipboard(item.data!.keywords)} className="text-[10px] text-blue-500 hover:underline">Copy All</button>
                            </div>
                            <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg whitespace-pre-line leading-loose border border-blue-100">
                              {item.data.keywords}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                           <span className={`text-sm font-medium ${item.status === 'Error' ? 'text-red-500' : 'text-gray-400'}`}>
                             {item.status === 'Processing' ? 'AI is analyzing product & competitors...' : item.status}
                           </span>
                        </div>
                      )}
                    </td>

                    {/* Action Column */}
                    <td className="px-6 py-6 whitespace-nowrap text-center align-top">
                      <button 
                        disabled={item.status !== 'Ready'}
                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                          item.status === 'Ready' 
                          ? 'bg-green-500 text-white shadow-md hover:bg-green-600 hover:-translate-y-0.5' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {item.status === 'Ready' ? 'Verify' : 'Waiting'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </section>
  );
}
