import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Leaf, Users, Building, DollarSign, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    return customAmount ? parseInt(customAmount) : parseInt(selectedAmount);
  };

  const handleDonorInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDonorInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleDonate = async () => {
    setIsLoading(true);
    try {
      const amount = getDonationAmount();
      if (!amount && !donorInfo.foodAmount) {
        toast({
          title: "Invalid Donation",
          description: "Please enter a donation amount or food donation",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Prepare message
      const message = `Donation Amount: ₹${amount || 0}\nPurpose: ${donationPurpose || 'Food Donation'}\nFood: ${donorInfo.foodAmount || 'N/A'}\nEdible: ${donorInfo.isEdible}\nPAN: ${donorInfo.pan}`;

      // Save donation information
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: donorInfo.name,
          email: donorInfo.email,
          phone: donorInfo.phone,
          subject: 'Donation Request',
          message
        });

      if (error) throw error;

      toast({
        title: "Donation Initiated! 💖",
        description: "Thank you for your generosity. Our team will contact you shortly.",
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

    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: "Donation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/20">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Make a Donation</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Your contribution helps us create a more sustainable and caring world
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="pt-4">
              <DollarSign className="h-6 w-6 text-primary mx-auto mb-1" />
              <h3 className="text-lg font-bold">₹50L+</h3>
              <p className="text-xs">Raised</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="pt-4">
              <Users className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <h3 className="text-lg font-bold">33+</h3>
              <p className="text-xs">Lives Impacted</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="pt-4">
              <Leaf className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <h3 className="text-lg font-bold">2T</h3>
              <p className="text-xs">CO₂ Saved</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="pt-4">
              <Building className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <h3 className="text-lg font-bold">8+</h3>
              <p className="text-xs">Projects</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <div className="space-y-6">
            {/* Donation Causes */}
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
                            <h4 className="font-medium">{cause.name}</h4>
                            <p className="text-sm">{cause.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Donation Amount */}
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

            {/* Donor & Food Info */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle>Donor Information</CardTitle>
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
                    <Label htmlFor="phone">Phone Number *</Label>
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
                    <Label htmlFor="pan">PAN Number (for 80G receipt)</Label>
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

                {/* Food Donation Fields */}
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
              </CardContent>
            </Card>
          </div>

          {/* Donation Summary & Action */}
          <div className="space-y-6">
            <Card className="sticky top-24 bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle>Donation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Cause:</span>
                    <span className="font-medium">{donationPurpose || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">₹{getDonationAmount()?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax Benefit (80G):</span>
                    <span>₹{Math.round((getDonationAmount() || 0) * 0.5).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food Donation:</span>
                    <span>{donorInfo.foodAmount || 'N/A'} ({donorInfo.isEdible})</span>
                  </div>
                </div>

                <Button 
                  onClick={handleDonate}
                  disabled={isLoading || (!getDonationAmount() && !donorInfo.foodAmount) || !donorInfo.name || !donorInfo.email}
                  className="w-full" 
                  size="lg"
                >
                  {isLoading ? 'Processing...' : 'Donate Now'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
