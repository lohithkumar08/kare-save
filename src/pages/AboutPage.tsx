import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Leaf, Recycle, Heart, Users, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Slideshow images
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

// Core values
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

// Milestones
const milestones = [
  { year: "2022", event: "Founded with a vision to create sustainable solutions" },
  { year: "2023", event: "Introduced helping hands, gracious gas, happy rythu" },
  { year: "2024", event: "Introduced SBL pots, clayer" },
  { year: "2025", event: "Working in progress and also introduced neem brush and 33+ customer satisfied" },
];

// Caring cycle steps (Energy step uses an image)
const flowSteps = [
  { icon: "🥬", title: "Food Waste", description: "Kitchen scraps and organic matter" },
  { image: "/images/biogas.jpg", title: "Energy", description: "Biogas for cooking and heating" }, // only this uses image
  { icon: "🌱", title: "Compost", description: "Nutrient-rich fertilizer for plants" },
  { icon: "🏺", title: "Products", description: "Eco-friendly everyday items" },
  { icon: "💧", title: "Water", description: "Clean, mineral-rich drinking water" },
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
      {/* Hero Slideshow */}
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
            }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text */}
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            About Kare <span className="text-pink-400">💖</span> Save
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/90 leading-relaxed">
            We're on a mission to transform waste into wealth and create a sustainable future for
            generations to come.
          </p>
          <div className="mt-6">
            <Link to="/contact">
              <Button size="lg" variant="default" className="bg-white text-black hover:bg-gray-200">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* The Caring Cycle */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Caring Cycle</h2>
            <p className="text-xl text-muted-foreground">How we transform waste into sustainable solutions</p>
          </div>

          <div className="relative">
            {/* Desktop Flow */}
            <div className="hidden md:flex items-center justify-between">
              {flowSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300">
                    {step.image ? (
                      <img src={step.image} alt={step.title} className="w-12 h-12 object-contain" />
                    ) : (
                      <span className="text-3xl">{step.icon}</span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-32">{step.description}</p>
                  {index < flowSteps.length - 1 && (
                    <ArrowRight className="absolute top-10 -right-8 h-6 w-6 text-primary" />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Flow */}
            <div className="md:hidden space-y-6">
              {flowSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {step.image ? (
                      <img src={step.image} alt={step.title} className="w-10 h-10 object-contain" />
                    ) : (
                      <span className="text-2xl">{step.icon}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 ">
            {values.map((value, index) => (
              <Card key={index} className="text-center group hover:shadow-soft transition-all duration-300 border-0 bg-gradient-to-br from-primary/10 to-secondary/10">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey & Milestones */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Journey</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Started in 2020 with a simple vision: create sustainable solutions that make environmental responsibility accessible to everyone. Today, we're proud to have helped thousands of customers reduce their environmental footprint.
            </p>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Our Mission</h3>
                  <p className="text-muted-foreground">Transform waste into wealth through innovative, sustainable solutions</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Our Vision</h3>
                  <p className="text-muted-foreground">A world where every household contributes to a circular, sustainable economy</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/contact">
                <Button size="lg" variant="default">
                  Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">Key Milestones</h3>
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">{milestone.year}</span>
                </div>
                <div className="pt-3">
                  <p className="text-foreground leading-relaxed">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact So Far</h2>
          <p className="text-xl text-muted-foreground mb-12">Together, we're making a real difference</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">33+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">66</div>
              <p className="text-muted-foreground">Kg Waste Recycled</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100</div>
              <p className="text-muted-foreground">kg CO₂ Saved</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Caring Cycle Today</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Start your sustainable journey with our eco-friendly products. Every purchase makes a difference for our planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button size="lg" variant="default">
                    Shop Sustainable Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
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
