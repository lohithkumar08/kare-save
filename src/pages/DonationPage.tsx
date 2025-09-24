import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Leaf, Users, Building, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const DonationPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationPurpose, setDonationPurpose] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    foodAmount: '',
    isEdible: 'Yes',
  });
  const [donations, setDonations] = useState<Donation[]>([]);

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000, 25000];

  const donationCauses = [
    { id: 'vermicompost', name: 'Vermicompost Production', icon: Leaf, description: 'Support organic farming initiatives' },
    { id: 'biogas', name: 'Biogas Plant Setup', icon: Building, description: 'Clean energy solutions for communities' },
    { id: 'education', name: 'Environmental Education', icon: Users, description: 'Awareness programs and workshops' },
    { id: 'community', name: 'Community Development', icon: Heart, description: 'General community welfare programs' }
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount.toString());
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount('');
  };

  const getDonationAmount = () => {
    return customAmount ? parseInt(customAmount) : selectedAmount ? parseInt(selectedAmount) : 0;
  };

  const handleDonorInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDonorInfo(prev => ({ ...prev, [name]: value }));
  };

  // Fetch existing donations
  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching donations:', error);
      return;
    }
    setDonations(data as unknown as Donation[]);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleDonate = async () => {
    setIsLoading(true);
    try {
      const amount = getDonationAmount();

      if ((!amount && !donorInfo.foodAmount) || !donorInfo.name || !donorInfo.email) {
        toast({
          title: "Incomplete Donation",
          description: "Please provide donor name, email and donation or food amount.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const { error } = await (supabase.from('donations') as any)
  .insert([{
    name: donorInfo.name,
    email: donorInfo.email,
    phone: donorInfo.phone,
    pan: donorInfo.pan,
    donation_amount: amount || null,
    donation_cause: donationPurpose || 'Food Donation',
    food_amount: donorInfo.foodAmount || null,
    is_edible: donorInfo.isEdible,
  }]);



      if (error) throw error;

      toast({
        title: "Donation Successful! 💖",
        description: "Thank you for your generosity. Our team will contact you shortly."
      });

      // Reset form
      setSelectedAmount('');
      setCustomAmount('');
      setDonationPurpose('');
      setDonorInfo({
        name: '',
        email: '',
        phone: '',
        pan: '',
        foodAmount: '',
        isEdible: 'Yes',
      });

      fetchDonations();

    } catch (err) {
      console.error('Donation error:', err);
      toast({
        title: "Donation Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/20">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Make a Donation</h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-300">
            Your contribution helps us create a more sustainable and caring world
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <div className="space-y-6">
            {/* Causes */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle>Choose a Cause</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {donationCauses.map(cause => {
                    const Icon = cause.icon;
                    return (
                      <div
                        key={cause.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          donationPurpose === cause.id ? 'border-primary bg-primary/20' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setDonationPurpose(cause.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium text-white">{cause.name}</h4>
                            <p className="text-sm text-gray-300">{cause.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Amount */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle>Select Donation Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {predefinedAmounts.map(amount => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount.toString() ? "default" : "outline"}
                      onClick={() => handleAmountSelect(amount)}
                      className="h-12"
                    >
                      ₹{amount.toLocaleString()}
                    </Button>
                  ))}
                </div>

                <div>
                  <Label htmlFor="customAmount">Custom Amount</Label>
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    min="100"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Donor Info */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle>Donor & Food Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={donorInfo.name}
                      onChange={handleDonorInfoChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={donorInfo.email}
                      onChange={handleDonorInfoChange}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={donorInfo.phone}
                      onChange={handleDonorInfoChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pan">PAN Number (80G)</Label>
                    <Input
                      id="pan"
                      name="pan"
                      value={donorInfo.pan}
                      onChange={handleDonorInfoChange}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="foodAmount">Food Donation Quantity</Label>
                    <Input
                      id="foodAmount"
                      name="foodAmount"
                      value={donorInfo.foodAmount}
                      onChange={handleDonorInfoChange}
                      placeholder="e.g., 5 kg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="isEdible">Is the food edible?</Label>
                    <Select
                      value={donorInfo.isEdible}
                      onValueChange={(val) => setDonorInfo(prev => ({ ...prev, isEdible: val }))}
                    >
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleDonate}
              disabled={isLoading || (!getDonationAmount() && !donorInfo.foodAmount) || !donorInfo.name || !donorInfo.email}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Processing...' : 'Donate Now'}
            </Button>
          </div>

          {/* Donation Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24 bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle>Donation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Cause:</span>
                    <span className="font-medium">{donationPurpose || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">₹{getDonationAmount().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food Donation:</span>
                    <span>{donorInfo.foodAmount || 'N/A'} ({donorInfo.isEdible})</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Estimated 80G Tax Benefit:</span>
                    <span>₹{Math.round(getDonationAmount() * 0.5).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Recent Donations</h2>
          <div className="space-y-4">
            {donations.map(d => (
              <Card key={d.id} className="bg-gray-900 text-white">
                <CardContent>
                  <p><strong>Name:</strong> {d.name}</p>
                  <p><strong>Email:</strong> {d.email} | <strong>Phone:</strong> {d.phone}</p>
                  <p><strong>Cause:</strong> {d.donation_cause}</p>
                  <p><strong>Amount:</strong> ₹{d.donation_amount?.toLocaleString() || '0'}</p>
                  <p><strong>Food Donation:</strong> {d.food_amount || 'N/A'} ({d.is_edible})</p>
                  <p className="text-xs text-gray-400">{new Date(d.created_at).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DonationPage;
