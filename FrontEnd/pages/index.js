import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login'); // Redireciona para a página de login
  }, [router]);

  return (
    <div>
      <h1>Welcome to the News App</h1>
      <p>Redirecting to login...</p>
    </div>
  );
}
