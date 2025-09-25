import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

const predefinedAmounts = [500, 1000, 2500, 5000, 10000, 25000];

const DonationPage = () => {

  
  const { toast } = useToast();
  const [donationType, setDonationType] = useState<'food' | 'money' | null>(null);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    foodAmount: '',
    foodType: '',
    edibleTime: '',
    isEdible: 'Yes',
  });
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDonorInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDonorInfo(prev => ({ ...prev, [name]: value }));
  };

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

  const handleDonate = async () => {
    setIsLoading(true);
    try {
      if (donationType === 'food') {
        if (!donorInfo.name || !donorInfo.email || !donorInfo.foodAmount || !donorInfo.foodType || !donorInfo.edibleTime) {
          toast({
            title: 'Incomplete Food Donation',
            description: 'Please fill all required fields',
            variant: 'destructive'
          });
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.from('donations').insert([{
          type: 'food',
          name: donorInfo.name,
          email: donorInfo.email,
          phone: donorInfo.phone,
          pan: donorInfo.pan,
          food_amount: donorInfo.foodAmount,
          food_type: donorInfo.foodType,
          edible_time: donorInfo.edibleTime,
          is_edible: donorInfo.isEdible
        }]);

        if (error) throw error;

        toast({
          title: 'Thank You! 💖',
          description: 'Your food donation has been received.',
        });

      } else if (donationType === 'money') {
        const amount = getDonationAmount();
        if (!donorInfo.name || !donorInfo.email || !amount) {
          toast({
            title: 'Incomplete Money Donation',
            description: 'Please fill all required fields and select an amount',
            variant: 'destructive'
          });
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.from('donations').insert([{
          type: 'money',
          name: donorInfo.name,
          email: donorInfo.email,
          phone: donorInfo.phone,
          pan: donorInfo.pan,
          donation_amount: amount
        }]);

        if (error) throw error;

        toast({
          title: 'Thank You! 💖',
          description: `You donated ₹${amount.toLocaleString()}`,
        });
      }

      // Reset form
      setDonorInfo({
        name: '',
        email: '',
        phone: '',
        pan: '',
        foodAmount: '',
        foodType: '',
        edibleTime: '',
        isEdible: 'Yes',
      });
      setSelectedAmount('');
      setCustomAmount('');
      setDonationType(null);

    } catch (err: any) {
      toast({
        title: 'Donation Failed',
        description: err.message || 'Something went wrong',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black-50 to-black-100 p-6">
      <Card className="w-full max-w-xl shadow-xl border-2 border-green-200 rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-700">
            {donationType
              ? donationType === 'food'
                ? 'Food Donation'
                : 'Money Donation'
              : 'Make a Donation'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!donationType && (
            <div className="flex flex-col gap-4">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setDonationType('food')}
              >
                🍲 Donate Food
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
                onClick={() => setDonationType('money')}
              >
                💰 Donate Money
              </Button>
            </div>
          )}

          {/* Food Donation Form */}
          {donationType === 'food' && (
            <div className="space-y-6 mt-4">
              <Button
                variant="outline"
                onClick={() => setDonationType(null)}
                className="mb-4"
              >
                ← Back
              </Button>

              <h3 className="font-semibold text-lg">Donor & Food Info</h3>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={donorInfo.name}
                    onChange={handleDonorInfoChange}
                    placeholder="Enter your full name"
                    required
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
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
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Food Donation</h3>
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
                    <Label htmlFor="foodType">Food Type</Label>
                    <Input
                      id="foodType"
                      name="foodType"
                      value={donorInfo.foodType}
                      onChange={handleDonorInfoChange}
                      placeholder="e.g., rice, cooked meal, fruits"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edibleTime">Estimated Edible Time</Label>
                    <Input
                      id="edibleTime"
                      name="edibleTime"
                      value={donorInfo.edibleTime}
                      onChange={handleDonorInfoChange}
                      placeholder="e.g., 4 hours from now"
                    />
                  </div>
                  <div>
                    <Label htmlFor="isEdible">Is the food edible?</Label>
                    <Select
                      value={donorInfo.isEdible}
                      onValueChange={val => setDonorInfo(prev => ({ ...prev, isEdible: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDonate}
                disabled={!donorInfo.name || !donorInfo.email || !donorInfo.foodAmount || !donorInfo.foodType || !donorInfo.edibleTime || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {isLoading ? 'Processing...' : 'Donate Now'}
              </Button>
            </div>
          )}

          {/* Money Donation Form */}
          {donationType === 'money' && (
            <div className="space-y-6 mt-4">
              <Button
                variant="outline"
                onClick={() => setDonationType(null)}
                className="mb-4"
              >
                ← Back
              </Button>

              <h3 className="font-semibold text-lg">Select Donation Amount</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {predefinedAmounts.map(amount => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount.toString() ? 'default' : 'outline'}
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
                  min={100}
                />
              </div>

              <h3 className="font-semibold text-lg">Donor Info</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={donorInfo.name}
                    onChange={handleDonorInfoChange}
                    placeholder="Enter your full name"
                    required
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
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
                  />
                </div>
              </div>

              <Button
                onClick={handleDonate}
                disabled={!donorInfo.name || !donorInfo.email || (!selectedAmount && !customAmount) || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {isLoading ? 'Processing...' : 'Donate Now'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationPage;
