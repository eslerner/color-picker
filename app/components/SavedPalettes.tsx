// app/components/SavedPalettes.tsx
'use client';

interface Palette {
  id: number;
  colors: string[];
  created: number;
}

interface SavedPalettesProps {
  palettes: Palette[];
  onDelete: (id: number) => void;
}

export default function SavedPalettes({ palettes, onDelete }: SavedPalettesProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Your Saved Palettes</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Colors</th>
              <th className="p-3">Saved At</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {palettes.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3 flex gap-1">
                  {p.colors.map((c, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {new Date(p.created).toLocaleTimeString()}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onDelete(p.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
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
