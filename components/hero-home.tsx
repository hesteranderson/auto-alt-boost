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
      data: null
    }));

    setItems((prev) => [...prev, ...newUploads]);

    for (const item of newUploads) {
      try {
        const response = await fetch("https://auto-alt-boost.hester-anderson1981.workers.dev", {
          method: "POST",
          body: await item.file.arrayBuffer(),
        });

        const result = await response.json();
        setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: 'Ready', data: result } : i));
      } catch (error) {
        setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: 'Error' } : i));
      }
    }
    setIsBulkLoading(false);
  };

  return (
    <section className="pt-32 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center pb-12">
          <h1 className="text-5xl font-extrabold mb-4">AutoAlt<span className="text-blue-600">Boost</span></h1>
          <label className="cursor-pointer px-10 py-4 font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-xl inline-block">
            {isBulkLoading ? "Analyzing..." : "Upload Images (Bulk)"}
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>

        {items.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <table className="min-w-full">
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-8 w-1/4">
                      <img src={item.preview} className="w-48 h-48 object-cover rounded-2xl border" />
                    </td>
                    <td className="p-8 w-2/4">
                      {item.status === 'Ready' && item.data ? (
                        <div className="space-y-4">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Alt Text</span>
                            <p className="text-sm text-slate-900 font-bold">{item.data.alt_text || item.data.altText || "No data"}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Description</span>
                            <p className="text-sm text-slate-600 italic">{item.data.description || item.data.desc || "No data"}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Keywords</span>
                            <div className="text-xs text-blue-700 bg-blue-50 p-3 rounded-xl border mt-1">
                              {Array.isArray(item.data.keywords) ? item.data.keywords.join(', ') : (item.data.keywords || "No data")}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="animate-pulse text-slate-400">Processing...</p>
                      )}
                    </td>
                    <td className="p-8 text-center">
                      <span className={`px-6 py-2 rounded-full text-[10px] font-bold ${item.status === 'Ready' ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>
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
