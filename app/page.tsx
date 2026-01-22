import Image from 'next/image';
import ColorPicker from './components/ColorPicker';

export default function Home() {
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
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Color Picker
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A handy little tool written with React and Next.js to help you pick colors and get their
            HEX and RGB values, as well as some complementary colors that may go good with your
            primary color.
          </p>
          <br></br>
        </div>

        <ColorPicker />
      </main>
    </div>
  );
}
