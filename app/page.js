import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold tracking-tighter text-red-600">
        SCARLET
      </h1>
      <p className="mt-4 text-gray-500 text-lg italic">
        Stop romanticizing. Start analyzing.
      </p>
    </main>
  );
}