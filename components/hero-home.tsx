"use client";

import { useState } from "react";

export default function HeroHome() {
  const [items, setItems] = useState([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsBulkLoading(true);

    const newUploads = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      status: 'Processing',
      data: null,
    }));

    setItems((prev) => [...prev, ...newUploads]);

    for (const item of newUploads) {
      try {
        const fileBuffer = await item.file.arrayBuffer();

        const response = await fetch("https://auto-alt-boost.hester-anderson1981.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/octet-stream" },
          body: fileBuffer,
        });

        const result = await response.json();

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

  const copyToClipboard = (text) => {
    if (!text) return;
    // Fixes the "undefined" error: joins array keywords into a string
    const cleanText = Array.isArray(text) ? text.join(", ") : text;
    navigator.clipboard.writeText(cleanText);
    alert("Copied to clipboard!");
  };

  return (
    <section className="relative pt-32 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center pb-16">
          <h1 className="text-6xl font-black mb-4 text-slate-900 tracking-tight">
            AutoAlt<span className="text-blue-600">Boost</span>
          </h1>
          <p className="text-slate-500 mb-10 max-w-lg mx-auto italic">Identify, Search, and Optimize your product catalog in bulk.</p>
          
          <label className="cursor-pointer inline-flex items-center px-12 py-4 font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-2xl transition-all hover:scale-105">
            {isBulkLoading ? "AI is Analyzing..." : "Upload Images (Bulk)"}
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={isBulkLoading} />
          </label>
        </div>

        {/* Results Table */}
        {items.length > 0 && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Product</th>
                  <th className="px-8 py-6 text-left text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">SEO Metadata</th>
                  <th className="px-8 py-6 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/5 transition-colors">
                    <td className="px-8 py-10 align-top">
                      <img src={item.preview} className="w-40 h-40 object-cover rounded-3xl border border-slate-200 shadow-sm" alt="Preview" />
                    </td>
                    
                    <td className="px-8 py-10">
                      {item.status === 'Ready' && item.data ? (
                        <div className="space-y-8 max-w-xl">
                          {/* Alt Text Display */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alt Text</span>
                              <button onClick={() => copyToClipboard(item.data.alt_text || item.data.altText)} className="text-[10px] font-bold text-blue-500 uppercase hover:underline">Copy</button>
                            </div>
                            <p className="text-sm text-slate-900 font-bold leading-snug">
                              {item.data.alt_text || item.data.altText || "Metadata generated"}
                            </p>
                          </div>

                          {/* Meta Description Display */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meta Description</span>
                              <button onClick={() => copyToClipboard(item.data.description || item.data.desc)} className="text-[10px] font-bold text-blue-500 uppercase hover:underline">Copy</button>
                            </div>
                            <p className="text-sm text-slate-600 italic leading-relaxed">
                              {item.data.description || item.data.desc || "Optimized description available"}
                            </p>
                          </div>

                          {/* Keywords Display */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEO Keywords</span>
                              <button onClick={() => copyToClipboard(item.data.keywords)} className="text-[10px] font-bold text-blue-500 uppercase hover:underline">Copy All</button>
                            </div>
                            <div className="text-xs text-blue-800 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 font-medium leading-relaxed">
                              {Array.isArray(item.data.keywords) 
                                ? item.data.keywords.join(', ') 
                                : (item.data.keywords || "Extracting relevant terms...")}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-16 flex items-center gap-4">
                          {item.status === 'Error' ? (
                            <p className="text-sm text-red-500 font-bold">Analysis Failed. Please retry.</p>
                          ) : (
                            <>
                              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-sm text-slate-400 italic">Gemini AI is identifying product features...</p>
                            </>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-8 py-10 align-top text-center">
                      <span className={`px-8 py-2.5 rounded-full text-[10px] font-black tracking-widest shadow-sm transition-all ${
                        item.status === 'Ready' ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg' : 'bg-slate-100 text-slate-400'
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
