'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RootRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const tryRedirect = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setLoading(false);
          router.replace('/dashboard');
          return true;
        }
      } catch (e) {
        
      }
      return false;
    };

    if (!tryRedirect()) {
      intervalId = setInterval(() => {
        if (tryRedirect()) {
          if (intervalId) clearInterval(intervalId);
          if (timeoutId) clearTimeout(timeoutId);
        }
      }, 300);

      timeoutId = setTimeout(() => {
        if (intervalId) clearInterval(intervalId);
        setLoading(false);
        router.replace('/login');
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-sm text-gray-600">Redirecionando…</div>
    </div>
  );

  return null;
}
