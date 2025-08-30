'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/axios';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [gmbStatus, setGmbStatus] = useState({ loading: true });

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        toast.error('Session expired');
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  // Check GMB connection status
  useEffect(() => {
    const checkGmb = async () => {
      try {
        const res = await API.get('/gmb/status');
        setGmbStatus({ ...res.data, loading: false });
      } catch (err) {
        setGmbStatus({ connected: false, loading: false });
      }
    };
    checkGmb();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
      toast.success('Logged out');
      router.push('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  // Connect GMB handler — point to your Express backend
  const handleConnectGMB = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/gmb/oauth`;
    // Example: http://localhost:5000/api/gmb/oauth
  };

  return (
    <main className="container py-4">
      <h2>Dashboard</h2>

      {user ? (
        <>
          <p>Welcome, <strong>{user.name}</strong>!</p>
          <button onClick={handleLogout} className="btn btn-outline-danger mb-3">
            Logout
          </button>

          <hr />

          {/* GMB Section */}
          {gmbStatus.loading ? (
            <p>Checking Google Business Profile status...</p>
          ) : gmbStatus.connected ? (
            <div className="alert alert-success">
              <p><strong>GMB Connected:</strong> {gmbStatus.gmbEmail}</p>
              {gmbStatus.gmbLocation?.name && (
                <p><strong>Location:</strong> {gmbStatus.gmbLocation.name}</p>
              )}
            </div>
          ) : (
            <div className="alert alert-warning">
              <p>No Google Business Profile connected.</p>
              <button onClick={handleConnectGMB} className="btn btn-primary">
                Connect Google Business Profile
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
