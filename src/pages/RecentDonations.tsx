import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Donation {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  donation_amount: number | null;
  donation_cause: string;
  food_amount: string | null;
  is_edible: string;
  created_at: string;
}

const causeColors: Record<string, string> = {
  'Vermicompost Production': 'bg-green-600',
  'Biogas Plant Setup': 'bg-yellow-600',
  'Environmental Education': 'bg-blue-600',
  'Community Development': 'bg-pink-600',
};

const RecentDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
    } else {
      setDonations(data as Donation[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="min-h-screen py-8 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">Recent Donations</h1>

        {loading ? (
          <p className="text-white text-center">Loading donations...</p>
        ) : donations.length === 0 ? (
          <p className="text-white text-center">No donations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map(d => (
              <Card
                key={d.id}
                className="bg-gray-800 text-white hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">{d.name}</CardTitle>
                  <span
                    className={`px-2 py-1 text-xs rounded ${causeColors[d.donation_cause] || 'bg-gray-500'}`}
                  >
                    {d.donation_cause}
                  </span>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>
                    <strong>Email:</strong> {d.email} | <strong>Phone:</strong> {d.phone}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{d.donation_amount?.toLocaleString() || 0}
                  </p>
                  <p>
                    <strong>Food Donation:</strong> {d.food_amount || 'N/A'} ({d.is_edible})
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(d.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentDonations;
