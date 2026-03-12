"use client";

import { useState } from "react";

export default function HeroHome() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult("AutoAltBoost is analyzing your image...");

    try {
      const response = await fetch("https://auto-alt-boost.hester-anderson1981.workers.dev", {
        method: "POST",
        body: file,
      });
      const data = await response.json();
      setResult(data.description);
    } catch (error) {
      setResult("Error connecting to AI. Check your Worker URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="text-center pb-12 md:pb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">
              Boost your SEO with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">AutoAltBoost</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The only 1-click tool to automate Alt Text and Image Metadata.
            </p>
            
            {/* --- YOUR AI UPLOAD BOX --- */}
            <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div className="relative inline-flex flex-col items-center p-6 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50">
                <input 
                  type="file" 
                  onChange={handleUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-blue-600 font-bold mb-2">
                  {loading ? "⚡ Processing..." : "📁 Drop Product Image Here"}
                </div>
                <p className="text-sm text-gray-500">Try it for free (JPG, PNG)</p>
              </div>
            </div>

            {/* --- AI RESULT DISPLAY --- */}
            {result && (
              <div className="mt-8 p-4 bg-white shadow-lg rounded-lg max-w-lg mx-auto border-t-4 border-blue-500">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 text-left">SEO Description:</h3>
                <p className="text-gray-800 text-left">{result}</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </section>
  );
}
