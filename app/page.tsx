'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return <div className="p-6 text-center text-sm text-gray-500">Redirigiendo...</div>;
}
