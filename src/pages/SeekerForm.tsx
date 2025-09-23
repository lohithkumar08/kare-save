import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const orgTypes = ['Orphanage', 'Old Age Home', 'NGO', 'Community Center', 'Other'];

  // handle input fields only
  const handleSeekerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeekerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
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

    const summary = `
Organization: ${seekerInfo.orgName}
Contact Person: ${seekerInfo.contactPerson}
Email: ${seekerInfo.email}
Phone: ${seekerInfo.phone}
Type: ${seekerInfo.orgType}
Food Required: ${seekerInfo.foodRequired}
Quantity: ${seekerInfo.quantity}
Edible: ${seekerInfo.isEdible}
Notes: ${seekerInfo.additionalNotes}
    `;

    toast({
      title: 'Request Submitted! ✅',
      description: 'Your request has been recorded. Here is the summary:\n' + summary,
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

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input
                  id="orgName"
                  name="orgName"
                  value={seekerInfo.orgName}
                  onChange={handleSeekerInfoChange}
                  placeholder="e.g., Sunshine Orphanage"
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={seekerInfo.contactPerson}
                  onChange={handleSeekerInfoChange}
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={seekerInfo.email}
                  onChange={handleSeekerInfoChange}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={seekerInfo.phone}
                  onChange={handleSeekerInfoChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orgType">Organization Type</Label>
                <Select
                  value={seekerInfo.orgType}
                  onValueChange={(val) => setSeekerInfo(prev => ({ ...prev, orgType: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="foodRequired">Food / Aid Required *</Label>
                <Input
                  id="foodRequired"
                  name="foodRequired"
                  value={seekerInfo.foodRequired}
                  onChange={handleSeekerInfoChange}
                  placeholder="e.g., Rice, Vegetables, Meals"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  value={seekerInfo.quantity}
                  onChange={handleSeekerInfoChange}
                  placeholder="e.g., 5 kg, 20 meals"
                />
              </div>
              <div>
                <Label htmlFor="isEdible">Is the food edible?</Label>
                <Select
                  value={seekerInfo.isEdible}
                  onValueChange={(val) => setSeekerInfo(prev => ({ ...prev, isEdible: val }))}
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

            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Input
                id="additionalNotes"
                name="additionalNotes"
                value={seekerInfo.additionalNotes}
                onChange={handleSeekerInfoChange}
                placeholder="Any other requirements or notes"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !seekerInfo.orgName || !seekerInfo.contactPerson || !seekerInfo.email || !seekerInfo.phone || !seekerInfo.foodRequired}
              className="w-full mt-4"
              size="lg"
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerForm;
