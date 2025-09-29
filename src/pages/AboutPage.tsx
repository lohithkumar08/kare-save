import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Leaf, Recycle, Heart, Users, Target, Award, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

// --- ADVANCED DATA STRUCTURES ---

// Slideshow images (no change)
const slideshowImages = [
  "/images/about/1.jpg",
  "/images/about/2.jpg",
  "/images/about/3.jpg",
  "/images/about/4.jpg",
  "/images/about/5.jpg",
  "/images/about/6.jpg",
  "/images/about/7.jpg",
  "/images/about/8.jpg",
  "/images/about/9.jpg",
  "/images/about/10.jpg",
  "/images/about/11.jpg",
  "/images/about/12.jpg",
  "/images/about/13.jpg",
];

// Core values (no change)
const values = [
  {
    icon: Leaf,
    title: "Sustainability First",
    description:
      "Every product we create helps reduce environmental impact and promotes circular economy principles.",
  },
  {
    icon: Recycle,
    title: "Waste to Wealth",
    description:
      "We transform everyday waste into valuable resources, creating a positive impact cycle.",
  },
  {
    icon: Heart,
    title: "Community Care",
    description:
      "Building stronger communities through sustainable practices and eco-friendly solutions.",
  },
  {
    icon: Users,
    title: "Inclusive Innovation",
    description:
      "Creating accessible sustainable solutions that work for everyone, regardless of background.",
  },
];

// Team Members (UPDATED WITH NEW INFO)
const teamMembers = [
  {
    name: "Asma Mam",
    role: "Mentor",
    bio: "I oversee the day-to-day operations of our sustainable farming practices, ensuring that every stage of cultivation follows eco-friendly and regenerative methods. My role involves monitoring soil health, water management, and the use of organic inputs to reduce environmental impact. I also coordinate with the team to implement crop rotation, integrated pest management, and natural fertilization techniques that promote biodiversity and long-term soil fertility. At the same time, I focus on yield and quality by applying modern agricultural innovations in harmony with traditional, nature-friendly practices. This balance allows us to produce healthy, high-quality crops while protecting natural resources and contributing to a more sustainable food system and moving together as one.",
    image: "/images/team/asma.jpg", // Placeholder image path for Asma
    tag: "Eco-Farming",
  },
  {
    name: "Siva Kotesh",
    role: "Founder & Visionary",
    bio: "Siva Kotesh is the visionary behind Kare 💖 Save. Inspired by his parents and family to serve the nation and help others, he began conceptualizing the idea in 2022 and officially started working on it in 2023. With immense family support, he laid the foundation for a sustainable ecosystem that addresses hunger, food waste, clean energy, and eco-products. Under his leadership, the initiative has achieved major milestones including Becon 2025 Special Recognition, E-Gignasa Special Appreciation, Draper House Invitation, and funding support worth over ₹18 lakhs along with recognition from IIT professors and central government opportunities. His persistence continues to transform Kare 💖 Save into a movement for people, planet, and prosperity.",
    image: "/images/team/siva.jpg", // Placeholder image path for Siva
    tag: "Visionary Leader",
  },
  
  {
    name: "Bellana Lohith Kumar",
    role: "Operations Manager",
    bio: "Lohith Kumar joined the founding team in 2024 and is responsible for operational excellence and technological integration across the ecosystem. He manages logistics, cluster execution, and innovations such as IoT-enabled Clayer bottles and decentralized waste-to-energy systems. Lohith’s ability to align technology with ground-level needs ensures that every cluster runs efficiently and replicably. His role has been critical in winning hackathons, gaining recognition, and scaling Kare 💖 Save into a practical, impactful model.",
    image: "/images/team/lohith.jpg", // Placeholder image path for Bhavana
    tag: "Community Strategy",
  },
  {
    name: "Goriparthi Bhavana",
    role: "Advisor & Strategy",
    bio: "Bhavana joined the team in 2024 and has been pivotal in driving sustainability strategies and community engagement for Kare 💖 Save. She focuses on awareness campaigns, incentive models, and building strong community partnerships to ensure the initiative’s long-term success. Bhavana’s guidance has shaped the project into not just a technical solution but a people-powered movement, earning institutional recognition and support that strengthen its impact and credibility.",
    image: "/images/team/Bhavana.jpg", // Placeholder image path for Bhavana
    tag: "Community Strategy",
  },
];

// Milestones (no change)
const milestones = [
  { year: "2022", event: "Founded with a vision to create sustainable solutions" },
  { year: "2023", event: "Introduced *Helping Hands*, *Gracious Gas*, and *Happy Raithu*" },
  { year: "2024", event: "Introduced *SBL Pots* and *Clayer* product lines" },
  { year: "2025", event: "Launched *Neem Brush* and achieved **33+ satisfied customers**" },
];

// Flow Steps (no change)
const flowSteps = [
  { image: "/images/foodwaste.jpg", title: "Collect Waste", description: "Kitchen scraps and organic matter" },
  { image: "/images/energy.jpg", title: "Convert to Energy", description: "Biogas for clean cooking and heating" },
  { image: "/images/Happy-Raithu.png", title: "Create Compost", description: "Nutrient-rich fertilizer for farms" },
  { image: "/images/SBL-Pots.png", title: "Upcycle Materials", description: "Eco-friendly everyday household items" },
  { image: "/images/clayer.png", title: "Reclaim Water", description: "Clean, mineral-rich irrigation and drinking water" },
];


const AboutPage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % slideshowImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background text-foreground">
      {/* 1. Hero Slideshow (Refined Button Style) */}
      <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
        {slideshowImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transform: index === currentImage ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 5s ease-in-out, opacity 1s',
            }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Text */}
        <div className="relative z-10 px-4">
          <Badge variant="secondary" className="mb-4 text-lg font-semibold bg-pink-400/20 text-pink-300 border-pink-400/50 hover:bg-pink-400/30">
            Caring for Tomorrow 🌍
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight">
            Kare <span className="text-pink-400">💖</span> Save
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-white/90 font-light leading-relaxed">
            We're on a mission to transform waste into wealth and create a sustainable future for
            generations to come. **Every scrap is a second chance.**
          </p>
          <div className="mt-8">
            <Link to="/contact">
              <Button size="xl" className="text-lg px-8 py-6 bg-pink-500 text-white hover:bg-pink-600 shadow-xl shadow-pink-500/30 transition-all duration-300">
                Get Started Today <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- Section Separators --- */}
      <section className="py-24 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ... The Circular Economy Model (Flow Diagram) content remains here ... */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Circular Economy Model</h2>
            <p className="text-xl text-muted-foreground">How we transform waste into sustainable solutions</p>
          </div>

          <div className="relative">
            {/* Desktop Flow */}
            <div className="hidden md:flex items-start justify-between">
              {flowSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative group w-1/5">
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-primary/20 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-105 group-hover:border-primary">
                    <img src={step.image} alt={step.title} className="w-14 h-14 object-contain rounded-full" />
                  </div>

                  <h3 className="font-bold text-xl mb-2 text-primary">{index + 1}. {step.title}</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-40">{step.description}</p>
                  
                  {/* Connector Arrow */}
                  {index < flowSteps.length - 1 && (
                    <div className="absolute top-1/4 -right-1/4 transform -translate-y-1/2 w-1/2 h-1 flex items-center justify-center">
                        <ArrowRight className="h-8 w-8 text-primary/70 animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Flow */}
            <div className="md:hidden space-y-8">
              {flowSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/50">
                    <img src={step.image} alt={step.title} className="w-10 h-10 object-contain rounded-full" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 text-primary">{index + 1}. {step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <Separator className="max-w-7xl mx-auto" />

      {/* 2. Introducing the Team (UPDATED SECTION) */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              Meet the Core Team <Sparkles className="h-8 w-8 text-yellow-500" />
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Behind every successful eco-initiative is a dedicated team. Meet the people driving Kare💖Save's mission.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              // Enhanced Card Structure for Team Members
              <Card key={index} className="overflow-hidden shadow-2xl hover:shadow-primary/30 transition-shadow duration-500 border-2 border-primary/20">
                <CardContent className="p-0">
                  {/* Image Area */}
                  <div className="relative h-72 w-full">
                    <img
                      // NOTE: Please ensure these image paths are valid in your project!
                      src={member.image} 
                      alt={member.name}
                      // Use object-cover to make sure the image fills the space nicely
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                    />
                    <Badge className="absolute bottom-4 left-4 bg-pink-500 text-white font-semibold text-base py-1 px-3">
                        {member.tag}
                    </Badge>
                  </div>
                  
                  {/* Text Area */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-lg font-semibold text-primary mb-4">{member.role}</p>
                    
                    {/* Bio with better readability */}
                    <p className="text-sm text-muted-foreground leading-relaxed text-justify italic">
                      {member.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* 3. Core Values (Advanced Card Styling) */}
      <section className="py-24 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center group hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors transform group-hover:-translate-y-1">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-normal text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Journey & Milestones (Advanced Timeline Styling) */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          {/* Mission/Vision Block */}
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Journey & Philosophy</h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Started in 2022 with a simple vision: create sustainable solutions that make environmental responsibility accessible to everyone. Today, we're proud to have helped thousands of customers reduce their environmental footprint.
            </p>
            <div className="space-y-8">
              <Card className="p-6 border-l-4 border-primary bg-primary/10">
                <div className="flex items-center space-x-4">
                  <Target className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl">Our Mission</h3>
                    <p className="text-muted-foreground">Transform waste into wealth through innovative, community-focused sustainable solutions.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 border-l-4 border-pink-400 bg-pink-400/10">
                <div className="flex items-center space-x-4">
                  <Award className="h-8 w-8 text-pink-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-xl">Our Vision</h3>
                    <p className="text-muted-foreground">A world where every household contributes to a circular, regenerative economy.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Milestones Timeline */}
          <div className="relative pl-6">
            <h3 className="text-2xl font-bold mb-8">Key Milestones</h3>
            {/* Vertical timeline line */}
            <div className="absolute left-0 top-0 h-full w-0.5 bg-primary/20" /> 
            
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start mb-10 relative">
                {/* Timeline Dot */}
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-primary ring-8 ring-background" /> 
                
                <div className="flex-grow pl-6">
                  <Badge variant="outline" className="text-primary border-primary bg-primary/10 font-bold mb-2 text-md">
                    {milestone.year}
                  </Badge>
                  <p className="text-lg font-semibold">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Impact Stats (Enhanced Visuals) */}
      <section className="py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Our Impact So Far</h2>
          <p className="text-xl text-muted-foreground mb-12">Together, we're making a real difference</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-6xl font-extrabold text-primary mb-2 flex items-center justify-center">
                33<span className="text-3xl">+</span>
              </div>
              <p className="text-lg font-medium text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-extrabold text-primary mb-2 flex items-center justify-center">
                66<span className="text-3xl">kg</span>
              </div>
              <p className="text-lg font-medium text-muted-foreground">Waste Recycled</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-extrabold text-primary mb-2 flex items-center justify-center">
                100<span className="text-3xl">kg</span>
              </div>
              <p className="text-lg font-medium text-muted-foreground">CO₂ Emissions Saved</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-extrabold text-primary mb-2 flex items-center justify-center">
                98<span className="text-3xl">%</span>
              </div>
              <p className="text-lg font-medium text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA (No change) */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
            <CardContent className="p-10 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Caring Cycle Today</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Start your sustainable journey with our eco-friendly products. Every purchase makes a difference for our planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button size="lg" variant="default" className="text-md">
                    Shop Sustainable Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="text-md">
                    Partner With Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;