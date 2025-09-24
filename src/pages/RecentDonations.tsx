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

const RecentDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      return;
    }
    setDonations(data as Donation[]);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="min-h-screen py-8 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Recent Donations</h1>
        <div className="space-y-4">
          {donations.map(d => (
            <Card key={d.id} className="bg-gray-900 text-white">
              <CardContent>
                <p><strong>Name:</strong> {d.name}</p>
                <p><strong>Email:</strong> {d.email} | <strong>Phone:</strong> {d.phone}</p>
                <p><strong>Cause:</strong> {d.donation_cause}</p>
                <p><strong>Amount:</strong> ₹{d.donation_amount ?? 0}</p>
                <p><strong>Food Donation:</strong> {d.food_amount || 'N/A'} ({d.is_edible})</p>
                <p className="text-xs text-gray-400">{new Date(d.created_at).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentDonations;
