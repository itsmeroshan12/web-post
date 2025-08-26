'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get('/auth/me'); // You’ll build this route next
        setUser(res.data.user);
      } catch (err) {
        toast.error('Session expired');
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout'); // You’ll build this route too
      toast.success('Logged out');
      router.push('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <main>
      <h2>Dashboard</h2>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
