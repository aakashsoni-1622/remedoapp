import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <p className="text-center text-lg font-semibold text-blue-700 p-4 rounded-md bg-blue-50 shadow-md">
             Developed by Aakash Soni,
        </p>
        <p className="text-center text-lg font-semibold text-blue-700 p-4 rounded-md bg-blue-50 shadow-md">
             Full stack developer & Backend Lead
        </p>
        <p className="text-center text-lg font-semibold text-blue-700 p-4 rounded-md bg-blue-50 shadow-md">
             Contact - 8602688426
        </p>
        <Link
          href="/events"
          className="mt-4 inline-block bg-green-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
        >
          List Events
        </Link>
      </main>
    </div>
  );
}
