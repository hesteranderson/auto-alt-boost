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
      errorMsg: null
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

        if (!response.ok) throw new Error(`Worker Error: ${response.status}`);

        const result = await response.json();

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: 'Ready', data: result } : i
          )
        );
      } catch (error) {
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
    alert("Copied!");
  };

  return (
    <section className="relative pt-32 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center pb-12">
          <h1 className="text-6xl font-black mb-4 text-slate-900">
            AutoAlt<span className="text-blue-600">Boost</span>
          </h1>
          <div className="flex justify-center gap-4 mt-8">
            <label className="cursor-pointer px-10 py-4 font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-xl transition-all">
              {isBulkLoading ? "AI is Analyzing..." : "Upload Images (Bulk)"}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={isBulkLoading} />
            </label>
            {items.length > 0 && (
              <button onClick={() => setItems([])} className="px-10 py-4 font-bold text-slate-600 bg-white border rounded-full hover:bg-slate-50">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dashboard */}
        {items.length > 0 && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">SEO Metadata</th>
                  <th className="px-8 py-5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-8 py-8 align-top">
                      <img src={item.preview} className="w-44 h-44 object-cover rounded-3xl border shadow-sm" alt="Thumbnail" />
                    </td>
                    
                    <td className="px-8 py-8">
                      {item.status === 'Ready' && item.data ? (
                        <div className="space-y-6 max-w-lg">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Alt Text</span>
                              <button onClick={() => copyToClipboard(item.data.alt_text || item.data.altText)} className="text-[10px] font-bold text-blue-500 uppercase">Copy</button>
                            </div>
                            {/* Forced Dark Text */}
                            <p className="text-sm text-slate-900 font-bold">
                              {item.data.alt_text || item.data.altText || "No data received"}
                            </p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Description</span>
                              <button onClick={() => copyToClipboard(item.data.description || item.data.desc)} className="text-[10px] font-bold text-blue-500 uppercase">Copy</button>
                            </div>
                            <p className="text-sm text-slate-600 italic leading-relaxed">
                              {item.data.description || item.data.desc || "No data received"}
                            </p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Keywords</span>
                              <button onClick={() => copyToClipboard(item.data.keywords)} className="text-[10px] font-bold text-blue-500 uppercase">Copy All</button>
                            </div>
                            {/* Blue Background for Keywords */}
                            <div className="text-xs text-blue-900 bg-blue-50 p-4 rounded-xl border border-blue-100 font-medium">
                              {Array.isArray(item.data.keywords) ? item.data.keywords.join(', ') : (item.data.keywords || "No data")}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12">
                          <p className="text-sm text-slate-400 italic animate-pulse">
                            {item.status === 'Error' ? `Error: ${item.errorMsg}` : "Gemini is writing SEO metadata..."}
                          </p>
                        </div>
                      )}
                    </td>

                    <td className="px-8 py-8 align-top text-center">
                      <span className={`px-8 py-2 rounded-full text-[10px] font-black tracking-widest ${
                        item.status === 'Ready' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
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
