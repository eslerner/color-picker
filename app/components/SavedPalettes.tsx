'use client';

import { useState } from 'react';

interface Palette {
  id: number;
  colors: string[];
  created: number;
}

interface SavedPalettesProps {
  palettes: Palette[];
  onDelete: (id: number) => void;
}

function ColorSquare({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);

      setTimeout(() => setCopied(false), 1500); // 1.5 s
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="group relative cursor-pointer" onClick={handleCopy}>
      <div
        className="h-6 w-6 rounded border border-black/5 shadow-sm transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: hex }}
      />

      <span
        className={`pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 
        whitespace-nowrap rounded px-2 py-1 text-[10px] text-white transition-all
        ${copied ? 'bg-green-600 opacity-100' : 'bg-black opacity-0 group-hover:opacity-100'}`}
      >
        {copied ? 'Copied!' : hex.toUpperCase()}

        <div
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent 
          ${copied ? 'border-t-green-600' : 'border-t-black'}`}
        />
      </span>
    </div>
  );
}

export default function SavedPalettes({ palettes, onDelete }: SavedPalettesProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Your Saved Palettes</h2>
      <div className="overflow-x-auto border rounded-lg dark:border-zinc-800">
        <table className="w-full border-collapse text-left">
          <thead className="border-b bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="p-3">Colors (Click to copy)</th>
              <th className="p-3">Saved At</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {palettes.map(p => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
              >
                <td className="flex gap-1 p-3">
                  {p.colors.map((c, i) => (
                    <ColorSquare key={`${p.id}-${i}`} hex={c} />
                  ))}
                </td>
                <td className="p-3 text-sm text-gray-500 dark:text-zinc-400">
                  {new Date(p.created).toLocaleTimeString()}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onDelete(p.id)}
                    className="text-sm font-medium text-red-500 transition-colors hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {palettes.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">
                  No saved palettes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
