import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

const SeekerForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [seekerInfo, setSeekerInfo] = useState({
    orgName: '',
    contactPerson: '',
    email: '',
    phone: '',
    orgType: '',
    foodRequired: '',
    quantity: '',
    isEdible: 'Yes',
    additionalNotes: ''
  });
  const [seekers, setSeekers] = useState<Seeker[]>([]);

  const orgTypes = ['Orphanage', 'Old Age Home', 'NGO', 'Community Center', 'Other'];

  // Fetch existing seekers from Supabase
  const fetchSeekers = async () => {
    const { data, error } = await supabase.from('seekers').select('*').order('timestamp', { ascending: false });
    if (error) {
      console.error('Error fetching seekers:', error);
      return;
    }
    setSeekers(data as Seeker[]);
  };

  useEffect(() => {
    fetchSeekers();
  }, []);

  const handleSeekerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeekerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!seekerInfo.orgName || !seekerInfo.contactPerson || !seekerInfo.email || !seekerInfo.phone || !seekerInfo.foodRequired) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill all required fields.',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.from('seekers').insert([{
      org_name: seekerInfo.orgName,
      contact_person: seekerInfo.contactPerson,
      email: seekerInfo.email,
      phone: seekerInfo.phone,
      org_type: seekerInfo.orgType,
      food_required: seekerInfo.foodRequired,
      quantity: seekerInfo.quantity,
      is_edible: seekerInfo.isEdible,
      additional_notes: seekerInfo.additionalNotes,
    }]);

    if (error) {
      toast({
        title: 'Submission Failed',
        description: error.message,
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: 'Request Submitted! ✅',
      description: 'Your request has been recorded.'
    });

    setSeekerInfo({
      orgName: '',
      contactPerson: '',
      email: '',
      phone: '',
      orgType: '',
      foodRequired: '',
      quantity: '',
      isEdible: 'Yes',
      additionalNotes: ''
    });

    // Refresh list
    fetchSeekers();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen py-8 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/20">
              <Building className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Seeker Request Form</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Organizations can request food or aid here. Please provide accurate details.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 mb-8">
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Form inputs (same as before) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input id="orgName" name="orgName" value={seekerInfo.orgName} onChange={handleSeekerInfoChange} placeholder="e.g., Sunshine Orphanage" />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input id="contactPerson" name="contactPerson" value={seekerInfo.contactPerson} onChange={handleSeekerInfoChange} placeholder="Full Name" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" value={seekerInfo.email} onChange={handleSeekerInfoChange} placeholder="email@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" value={seekerInfo.phone} onChange={handleSeekerInfoChange} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orgType">Organization Type</Label>
                <Select value={seekerInfo.orgType} onValueChange={val => setSeekerInfo(prev => ({ ...prev, orgType: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="foodRequired">Food / Aid Required *</Label>
                <Input id="foodRequired" name="foodRequired" value={seekerInfo.foodRequired} onChange={handleSeekerInfoChange} placeholder="e.g., Rice, Vegetables, Meals" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" value={seekerInfo.quantity} onChange={handleSeekerInfoChange} placeholder="e.g., 5 kg, 20 meals" />
              </div>
              <div>
                <Label htmlFor="isEdible">Is the food edible?</Label>
                <Select value={seekerInfo.isEdible} onValueChange={val => setSeekerInfo(prev => ({ ...prev, isEdible: val }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Input id="additionalNotes" name="additionalNotes" value={seekerInfo.additionalNotes} onChange={handleSeekerInfoChange} placeholder="Any other requirements or notes" />
            </div>

            <Button onClick={handleSubmit} disabled={isLoading} className="w-full mt-4" size="lg">
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </CardContent>
        </Card>

        {/* Display existing seekers */}
        {/* <h2 className="text-2xl font-bold mb-4 text-white">Existing Requests</h2>
        <div className="space-y-4">
          {seekers.map(seeker => (
            <Card key={seeker.id} className="bg-gray-900 text-white">
              <CardContent className="space-y-1">
                <p><strong>Organization:</strong> {seeker.org_name}</p>
                <p><strong>Contact:</strong> {seeker.contact_person} | {seeker.phone} | {seeker.email}</p>
                <p><strong>Type:</strong> {seeker.org_type}</p>
                <p><strong>Food Required:</strong> {seeker.food_required}</p>
                <p><strong>Quantity:</strong> {seeker.quantity}</p>
                <p><strong>Edible:</strong> {seeker.is_edible}</p>
                {seeker.additional_notes && <p><strong>Notes:</strong> {seeker.additional_notes}</p>}
                <p className="text-xs text-gray-400">{new Date(seeker.timestamp).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default SeekerForm;
