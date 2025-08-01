import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-container flex items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white/80 mb-8">Movie Not Found</h2>
        <p className="text-white/60 mb-8">
          The movie you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/movies" className="btn-primary">
          Back to Movies
        </Link>
      </div>
    </div>
  );
} 