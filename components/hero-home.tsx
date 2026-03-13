"use client";

import { useState } from "react";

export default function HeroHome() {
  const [items, setItems] = useState([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsBulkLoading(true);

    // 1. Map files to state for instant UI feedback
    const newUploads = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      status: 'Processing',
      data: null,
      errorMsg: null
    }));

    setItems((prev) => [...prev, ...newUploads]);

    // 2. Process each image sequentially
    for (const item of newUploads) {
      try {
        const response = await fetch("https://auto-alt-boost.hester-anderson1981.workers.dev", {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          body: item.file,
        });

        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }

        const result = await response.json();

        // Update item with data from Gemini
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: 'Ready', data: result } : i
          )
        );
      } catch (error) {
        console.error("Upload error:", error);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: 'Error', errorMsg: error.message } : i
          )
        );
      }
    }
    setIsBulkLoading(false);
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    const cleanText = Array.isArray(text) ? text.join(", ") : text;
    navigator.clipboard.writeText(cleanText);
    alert("Copied to clipboard!");
  };

  const clearAll = () => {
    setItems([]);
    setIsBulkLoading(false);
  };

  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header & Main Actions */}
        <div className="text-center pb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-900">
            AutoAlt<span className="text-blue-600">Boost</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            The AI-powered SEO engine for e-commerce. Identify, Search, and Optimize in bulk.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <label className="cursor-pointer inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 shadow-xl">
              {isBulkLoading ? "AI is Analyzing..." : "Upload Images (Bulk)"}
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleUpload} 
                disabled={isBulkLoading}
              />
            </label>
            
            {items.length > 0 && (
              <button 
                onClick={clearAll}
                className="px-10 py-4 font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm"
              >
                Clear Results
              </button>
            )}
          </div>
        </div>

        {/* Results Dashboard */}
        {items.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Product</th>
                  <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">SEO Metadata</th>
                  <th className="px-8 py-5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                    
                    {/* Thumbnail */}
                    <td className="px-8 py-8 align-top">
                      <div className="relative w-40 h-40 flex-shrink-0">
                        <img 
                          src={item.preview} 
                          alt="Product" 
                          className="w-full h-full object-cover rounded-2xl shadow-md border border-slate-200" 
                        />
                      </div>
                    </td>

                    {/* Metadata Content */}
                    <td className="px-8 py-8">
                      {item.status === 'Ready' && item.data ? (
                        <div className="space-y-6 max-w-xl">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alt Text</span>
                              <button onClick={() => copyToClipboard(item.data.alt_text || item.data.altText)} className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase">Copy</button>
                            </div>
                            <p className="text-sm text-slate-900 font-bold leading-snug">
                              {item.data.alt_text || item.data.altText || "Metadata generated..."}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meta Description</span>
                              <button onClick={() => copyToClipboard(item.data.description || item.data.desc)} className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase">Copy</button>
                            </div>
                            <p className="text-sm text-slate-600 italic leading-relaxed">
                              {item.data.description || item.data.desc || "Optimizing description..."}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEO Keywords</span>
                              <button onClick={() => copyToClipboard(item.data.keywords)} className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase">Copy All</button>
                            </div>
                            <div className="text-xs text-blue-800 bg-blue-50/50 p-4 rounded-xl border border-blue-100 font-medium leading-loose">
                              {Array.isArray(item.data.keywords) 
                                ? item.data.keywords.join(', ') 
                                : (item.data.keywords || "Extracting keywords...")}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12">
                          {item.status === 'Error' ? (
                            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                              <p className="text-xs text-red-600 font-bold uppercase mb-1">Analysis Failed</p>
                              <p className="text-xs text-red-500">{item.errorMsg}</p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm font-medium text-slate-400 italic">Gemini AI is analyzing product details...</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-8 py-8 align-top text-center">
                      <span className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all ${
                        item.status === 'Ready' 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                        : 'bg-slate-100 text-slate-400'
                      }`}>
                        {item.status === 'Ready' ? 'VERIFIED' : 'WAITING'}
                      </span>
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
