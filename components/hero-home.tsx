"use client";

import { useState } from "react";

export default function HeroHome() {
  const [items, setItems] = useState([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsBulkLoading(true);

    // 1. Map the files into a local state immediately for the UI
    const newUploads = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      status: 'Processing',
      data: null,
      errorMsg: null
    }));

    setItems((prev) => [...prev, ...newUploads]);

    // 2. Process each image sequentially to avoid overloading the Worker
    for (const item of newUploads) {
      try {
       // Inside your for loop in hero-home.js
const response = await fetch("https://auto-alt-boost.hester-anderson1981.workers.dev", {
  method: "POST",
  headers: {
    "Content-Type": "application/octet-stream", // Tells the worker: "This is raw data"
  },
  body: item.file, // Ensure this is the actual File object
});

        // Detailed error checking
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Worker Error: ${response.status} - ${errorBody}`);
        }

        const result = await response.json();

        // Update the item state with the successful result
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: 'Ready', data: result } : i
          )
        );
      } catch (error) {
        console.error("Upload failed for item:", item.id, error);
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
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const clearAll = () => {
    setItems([]);
    setIsBulkLoading(false);
  };

  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header & Controls */}
        <div className="text-center pb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-900">
            AutoAlt<span className="text-blue-600">Boost</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Universal AI Vision. Upload any product to generate SEO-ready alt text and descriptions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <label className="cursor-pointer inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 shadow-lg">
              {isBulkLoading ? "AI is Analyzing..." : "Upload Photos (Bulk)"}
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
                className="px-8 py-3 font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all"
              >
                Clear Results
              </button>
            )}
          </div>
        </div>

        {/* Results Table */}
        {items.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Image</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">SEO Generation</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                    
                    {/* Preview Thumbnail */}
                    <td className="px-6 py-6 align-top">
                      <div className="relative w-28 h-28 flex-shrink-0">
                        <img src={item.preview} alt="Thumbnail" className="w-full h-full object-cover rounded-xl shadow-sm border border-slate-200" />
                        {item.status === 'Processing' && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* SEO Content Output */}
                    <td className="px-6 py-6">
                      {item.status === 'Ready' && item.data ? (
                        <div className="space-y-6 max-w-xl">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Alt Text</span>
                              <button onClick={() => copyToClipboard(item.data.alt_text)} className="text-[10px] font-bold text-blue-500 uppercase hover:underline">Copy</button>
                            </div>
                            <p className="text-sm text-slate-800 font-medium">{item.data.alt_text}</p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Meta Description</span>
                              <button onClick={() => copyToClipboard(item.data.description)} className="text-[10px] font-bold text-blue-500 uppercase hover:underline">Copy</button>
                            </div>
                            <p className="text-sm text-slate-600 italic">{item.data.description}</p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Keywords (SEO)</span>
                              <button onClick={() => copyToClipboard(item.data.keywords)} className="text-[10px] font-bold text-blue-500 uppercase hover:underline">Copy All</button>
                            </div>
                            <div className="text-xs text-blue-700 bg-blue-50 p-4 rounded-xl whitespace-pre-line leading-loose border border-blue-100 font-medium">
                              {item.data.keywords}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8">
                          {item.status === 'Error' ? (
                            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                              <p className="text-xs text-red-600 font-bold uppercase mb-1">Analysis Failed</p>
                              <p className="text-xs text-red-500 leading-normal">{item.errorMsg}</p>
                            </div>
                          ) : (
                            <span className="text-sm font-medium text-slate-400 animate-pulse italic">
                              Identifying product details...
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Action Column */}
                    <td className="px-6 py-6 align-top text-center">
                      <button 
                        disabled={item.status !== 'Ready'}
                        className={`px-6 py-2 rounded-full text-[11px] font-bold transition-all shadow-sm ${
                          item.status === 'Ready' 
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        {item.status === 'Ready' ? 'VERIFIED' : 'WAITING'}
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
