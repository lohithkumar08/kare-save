import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, MapPin, NotebookPen } from "lucide-react"; // Added NotebookPen for the form icon
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

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
    orgName: "",
    contactPerson: "",
    email: "",
    phone: "",
    orgType: "",
    foodRequired: "",
    quantity: "",
    isEdible: "Yes",
    additionalNotes: "",
  });
  const [seekers, setSeekers] = useState<Seeker[]>([]);

  const orgTypes = [
    "Orphanage",
    "Old Age Home",
    "NGO",
    "Community Center",
    "Other",
  ];

  // Fetch seekers
  const fetchSeekers = async () => {
    const { data, error } = await supabase
      .from("seekers")
      .select("*")
      .order("timestamp", { ascending: false });
    if (error) {
      console.error("Error fetching seekers:", error);
      return;
    }
    setSeekers(data as Seeker[]);
  };

  useEffect(() => {
    fetchSeekers();
  }, []);

  const handleSeekerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeekerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (
      !seekerInfo.orgName ||
      !seekerInfo.contactPerson ||
      !seekerInfo.email ||
      !seekerInfo.phone ||
      !seekerInfo.foodRequired
    ) {
      toast({
        title: "Incomplete Form",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from("seekers").insert([
      {
        org_name: seekerInfo.orgName,
        contact_person: seekerInfo.contactPerson,
        email: seekerInfo.email,
        phone: seekerInfo.phone,
        org_type: seekerInfo.orgType,
        food_required: seekerInfo.foodRequired,
        quantity: seekerInfo.quantity,
        is_edible: seekerInfo.isEdible,
        additional_notes: seekerInfo.additionalNotes,
      },
    ]);

    if (error) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Request Submitted! ✅",
      description: "Your request has been recorded.",
    });

    setSeekerInfo({
      orgName: "",
      contactPerson: "",
      email: "",
      phone: "",
      orgType: "",
      foodRequired: "",
      quantity: "",
      isEdible: "Yes",
      additionalNotes: "",
    });

    fetchSeekers();
    setIsLoading(false);
  };

  return (
    // Updated container for better spacing and responsiveness
    <div className="min-h-screen bg-black p-4 md:p-8"> 
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Main Column - Seeker Form (2/3 width on large screens) */}
        <div className="lg:col-span-2">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {/* Changed icon to NotebookPen for "Form" and adjusted sizing for clarity */}
              <div className="p-4 rounded-full bg-primary/20">
                <NotebookPen className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold mb-2 text-white">
              Seeker Request Form
            </h1>
            <p className="text-lg max-w-2xl mx-auto text-gray-300">
              Organizations can request food or aid here. Please provide
              accurate details.
            </p>
          </div>

          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Organization and Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section 1: Organization & Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input
                    id="orgName"
                    name="orgName"
                    value={seekerInfo.orgName}
                    onChange={handleSeekerInfoChange}
                    className="mt-1" // Added margin top for spacing
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    value={seekerInfo.contactPerson}
                    onChange={handleSeekerInfoChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={seekerInfo.email}
                    onChange={handleSeekerInfoChange}
                    className="mt-1"
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
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Added a divider for visual separation */}
              <hr className="border-primary/30" /> 
              
              {/* Section 2: Request Details */}
              <CardTitle className="text-xl font-semibold pt-2">Request Details</CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Select
                    value={seekerInfo.orgType}
                    onValueChange={(val) =>
                      setSeekerInfo((prev) => ({ ...prev, orgType: val }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {orgTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
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
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    value={seekerInfo.quantity}
                    onChange={handleSeekerInfoChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="isEdible">Is the food edible?</Label>
                  <Select
                    value={seekerInfo.isEdible}
                    onValueChange={(val) =>
                      setSeekerInfo((prev) => ({ ...prev, isEdible: val }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Section 3: Notes (Full Width) */}
              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                {/* Consider changing this to a textarea for multi-line input */}
                <Input 
                  id="additionalNotes"
                  name="additionalNotes"
                  value={seekerInfo.additionalNotes}
                  onChange={handleSeekerInfoChange}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-6 transition-all duration-300 hover:scale-[1.01]" // Added hover effect
                size="lg"
              >
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Aggregator Addresses (1/3 width on large screens) */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-900 text-white shadow-2xl border-2 border-green-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-bold text-green-400">
                <MapPin className="h-6 w-6" />
                Nearest Refrigerator Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Address 1 */}
              <div className="border-b border-gray-700 pb-4">
                <h3 className="font-extrabold text-xl text-green-300">Kandlakoya Oxygen Park</h3>
                <p className="text-base text-gray-300 mt-1">
                  Kandlakoya, Rangareddy, 501401
                </p>
                <p className="text-sm text-gray-400 mt-2 italic">
                  Landmarks: Near CMR Bus Stop, Near Medchal Outer Ring Road
                  Junction, Opposite CMR College
                </p>
              </div>
              
              {/* Address 2 */}
              <div className="pb-2">
                <h3 className="font-extrabold text-xl text-green-300">Kandlakoi Gram Panchayat</h3>
                <p className="text-base text-gray-300 mt-1">
                  Kandlakoi, Kandlakoya-501401
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeekerForm;