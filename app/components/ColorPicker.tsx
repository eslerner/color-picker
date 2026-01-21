"use client";

import React, { useState } from "react";

function normalizeHex(hex: string) {
  let h = hex.replace(/[^0-9a-fA-F]/g, "");
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("");
  }
  if (h.length !== 6) return "000000";
  return `#${h.toLowerCase()}`;
}

function hexToRgb(hex: string) {
  const h = normalizeHex(hex).replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return { r, g, b };
}

export default function ColorPicker() {
  const [color, setColor] = useState("#4f46e5");
  const rgb = hexToRgb(color);

  const onColorChange = (value: string) => setColor(normalizeHex(value));

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };

  return (
    <section className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <input
            aria-label="Pick color"
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-12 w-12 rounded-md border-none p-0"
          />
          <div className="flex flex-col">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">HEX</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                className="w-36 rounded border border-gray-200 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
              />
              <button
                onClick={() => copy(color)}
                className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-1 items-center justify-between gap-4 sm:mt-0">
          <div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">RGB</div>
            <div className="mt-1 flex items-center gap-2">
              <input
                readOnly
                className="w-48 rounded border border-gray-200 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
                value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
              />
              <button
                onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Preview</div>
            <div
              className="mt-1 h-12 w-24 rounded border border-gray-200 shadow-sm dark:border-zinc-700"
              style={{ background: color }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
