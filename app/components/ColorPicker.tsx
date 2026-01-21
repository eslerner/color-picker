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

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s /= 100; l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;
  const t2r = hk + 1/3;
  const t2g = hk;
  const t2b = hk - 1/3;

  const conv = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1/6) return p + (q - p) * 6 * tt;
    if (tt < 1/2) return q;
    if (tt < 2/3) return p + (q - p) * (2/3 - tt) * 6;
    return p;
  };

  return {
    r: Math.round(conv(t2r) * 255),
    g: Math.round(conv(t2g) * 255),
    b: Math.round(conv(t2b) * 255),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hslToHex(h: number, s: number, l: number) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export default function ColorPicker() {
  const [color, setColor] = useState("#4f46e5");
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const suggested = (() => {
    const h = hsl.h;
    const s = hsl.s;
    const l = hsl.l;
    return [
      { label: 'Primary', color },
      { label: 'Complementary', color: hslToHex(h + 180, s, l) },
      { label: 'Analogous', color: hslToHex(h + 30, s, l) },
      { label: 'Analogous', color: hslToHex(h - 30, s, l) },
      { label: 'Triadic', color: hslToHex(h + 120, s, l) },
      { label: 'Triadic', color: hslToHex(h - 120, s, l) },
      { label: 'Tint', color: hslToHex(h, Math.max(10, s - 10), Math.min(95, l + 18)) },
      { label: 'Shade', color: hslToHex(h, s, Math.max(6, l - 18)) },
    ];
  })();

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
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">Suggested colors</div>
        <div className="flex flex-wrap items-center gap-3">
          {suggested.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                title={`${s.label}: ${s.color}`}
                onClick={() => { setColor(s.color); copy(s.color); }}
                className="group flex cursor-pointer items-center gap-2"
              >
                <div
                  className="h-10 w-10 rounded border border-gray-200 shadow-sm dark:border-zinc-700"
                  style={{ background: s.color }}
                />
                <div className="hidden w-24 text-left text-xs text-zinc-700 dark:text-zinc-300 sm:block">
                  <div className="font-medium">{s.label}</div>
                  <div className="text-[11px]">{s.color}</div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
