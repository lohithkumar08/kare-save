import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Seeker {
  id: string;
  org_name: string;
  contact_person: string;
  email: string;
  phone: string;
  org_type: string;
  food_required: string;
  quantity: string;
  is_edible: string;
  additional_notes: string;
  timestamp: string;
}

const SeekerRequests = () => {
  const [seekers, setSeekers] = useState<Seeker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSeekers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from<Seeker>('seekers').select('*');
    if (error) console.error(error);
    else setSeekers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSeekers();
  }, []);

  if (loading) return <p>Loading requests...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Seeker Requests</h1>
      {seekers.length === 0 && <p>No requests yet.</p>}
      <ul className="space-y-2">
        {seekers.map((s) => (
          <li key={s.id} className="border p-3 rounded shadow">
            <p><strong>Organization:</strong> {s.org_name}</p>
            <p><strong>Contact:</strong> {s.contact_person} | {s.phone} | {s.email}</p>
            <p><strong>Food Required:</strong> {s.food_required}</p>
            <p><strong>Quantity:</strong> {s.quantity}</p>
            <p><strong>Edible:</strong> {s.is_edible}</p>
            <p><strong>Notes:</strong> {s.additional_notes}</p>
            <p className="text-xs text-gray-500">Requested at: {new Date(s.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeekerRequests;
