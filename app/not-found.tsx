import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h2 className="text-8xl font-bold mb-4 tracking-tighter">404</h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-full hover:scale-105 transition-transform"
      >
        Return Home
      </Link>
    </div>
  );
}
