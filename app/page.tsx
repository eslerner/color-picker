'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ColorPicker from './components/ColorPicker';
import SavedPalettes from './components/SavedPalettes';

interface Palette {
  id: number;
  colors: string[];
  created: number;
}

export default function Home() {
  const [palettes, setPalettes] = useState<Palette[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('savedPalettes');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Error loading palettes:', e);
      return [];
    }
  });

  const [activeColors, setActiveColors] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('savedPalettes', JSON.stringify(palettes));
  }, [palettes]);
  const handleSaveClick = () => {
    if (activeColors.length === 0) return;

    const newEntry: Palette = {
      id: Date.now(),
      colors: [...activeColors],
      created: Date.now(),
    };

    const updated = [newEntry, ...palettes];
    setPalettes(updated);
    localStorage.setItem('savedPalettes', JSON.stringify(updated));
  };

  const handleDeletePalette = (id: number) => {
    const updated = palettes.filter(p => p.id !== id);
    setPalettes(updated);
    localStorage.setItem('savedPalettes', JSON.stringify(updated));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/color-picker-logo.png"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mt-8">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Color Picker
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A handy little tool written with React and Next.js to help you pick colors and get their
            HEX and RGB values.
          </p>
        </div>

        <div className="w-full mt-8">
          <ColorPicker onChange={setActiveColors} />
        </div>

        <div
          onClick={handleSaveClick}
          className="mt-6 cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-zinc-600 hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <p>Save Palette</p>
        </div>

        <div className="w-full my-12">
          <SavedPalettes palettes={palettes} onDelete={handleDeletePalette} />
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <p>
            Made with ❤️ by{' '}
            <a
              className="font-medium underline underline-offset-4"
              href="https://github.com/Emily/color-picker"
            >
              Emily
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
