'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '@/utils/axios';

export default function SelectGMBPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [locations, setLocations] = useState([]);

  // Load locations from query param
  useEffect(() => {
    const locParam = searchParams.get('locations');
    if (locParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(locParam));
        setLocations(parsed);
      } catch {
        toast.error('Invalid location data');
      }
    }
  }, [searchParams]);

  const handleSelect = async (location) => {
    try {
      await API.post('/gmb/select-location', {
        location_id: location.name,
        location_name: location.title || location.locationName || location.name
      });
      toast.success('GMB location selected!');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Failed to save location');
    }
  };

  return (
    <main className="container py-4">
      <h3>Select Your Google Business Profile Location</h3>
      {locations.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <div className="row">
          {locations.map((loc, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{loc.title || loc.locationName || loc.name}</h5>
                  <p className="card-text">
                    {loc.address?.regionCode}, {loc.address?.locality}
                  </p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSelect(loc)}
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
