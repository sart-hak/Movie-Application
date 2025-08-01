'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import LoginForm from '@/components/LoginForm';

export default function LoginClient() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/movies');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2BD17E] border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <LoginForm />;
} 