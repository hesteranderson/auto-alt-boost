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
        // Convert file to buffer for reliable transfer
        const fileBuffer = await item.file.arrayBuffer();

        const response = await fetch("https://auto-alt-boost.hester-anderson1981.workers.dev", {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          body: fileBuffer,
        });

        if (!response.ok) {
          throw new Error(`Worker Error: ${response.status}`);
        }

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
    alert("Copied to clipboard!");
  };

  return (
    <section className="relative pt-32 pb-12 bg-slate-50 min-h-screen">
      <div className="max
