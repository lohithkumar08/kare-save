import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { getProductsByBrand } from '@/data/products';
import { Users, Leaf, TrendingUp, Award } from 'lucide-react';

// Centralize your brand data for better management
const brandData = {
  'happy-raithu': {
    name: 'Happy Raithu',
    tagline: 'Organic Fertilizers',
    description: 'Premium vermicompost and bio-fertilizers for healthy plants',
    longDescription:
      'Happy Raithu specializes in creating nutrient-rich organic fertilizers through sustainable vermicomposting processes. Our products help farmers and gardeners grow healthier plants while improving soil health naturally.',
    icon: '/assets/Happy-Raithu.png',
    gradient: 'from-green-500 to-lime-600',
    heroImage: '/assets/vermicompost.jpg',
    stats: [
      { icon: Users, label: 'Farmers Served', value: '10K+' },
      { icon: Leaf, label: 'Tons of Compost', value: '500+' },
      { icon: TrendingUp, label: 'Yield Increase', value: '30%' },
      { icon: Award, label: 'Average Rating', value: '4.8/5' },
    ],
    features: [
      'Rich in essential nutrients',
      '100% organic and chemical-free',
      'Improves soil structure',
      'Increases water retention',
      'Promotes beneficial microorganisms',
    ],
  },
  'gracious-gas': {
    name: 'Gracious Gas',
    tagline: 'Clean Energy Solutions',
    description: 'Convert waste to cooking gas with our biogas units',
    longDescription:
      'Gracious Gas develops innovative biogas technology that transforms organic waste into clean cooking gas. Our units help households and businesses reduce waste while generating renewable energy.',
    icon: '/assets/gracious-gas-logo.jpg',
    gradient: 'from-gray-700 to-gray-900',
    heroImage: '/assets/biogas-unit.jpg',
    stats: [
      { icon: Users, label: 'Units Installed', value: '250+' },
      { icon: Leaf, label: 'CO₂ Saved Monthly', value: '800kg' },
      { icon: TrendingUp, label: 'Cost Savings', value: '60%' },
      { icon: Award, label: 'Quality Standard', value: 'ISO 9001' },
    ],
    features: [
      'Converts organic waste to gas',
      'Reduces cooking fuel costs',
      'Environmentally friendly',
      'Easy installation and maintenance',
      'Suitable for homes and businesses',
    ],
  },
  'sbl-pots': {
    name: 'SBL Pots',
    tagline: 'Eco Planters',
    description: 'Biodegradable pots for sustainable gardening',
    longDescription:
      'SBL Pots creates innovative biodegradable planters made from sustainable materials. Our pots naturally decompose over time, enriching the soil while supporting healthy plant growth.',
    icon: '/assets/SBL-Pots.png',
    gradient: 'from-amber-500 to-orange-600',
    heroImage: '/assets/eco-pots.jpg',
    stats: [
      { icon: Users, label: 'Happy Gardeners', value: '5K+' },
      { icon: Leaf, label: 'Pots Sold', value: '20K+' },
      { icon: TrendingUp, label: 'Success Rate', value: '95%' },
      { icon: Award, label: 'Sustainability', value: 'Certified' },
    ],
    features: [
      'Fully biodegradable material',
      'Various sizes available',
      'Promotes root health',
      'Zero plastic waste',
      'Perfect for seedlings',
    ],
  },
  'clayer': {
    name: 'Clayer',
    tagline: 'Natural Clay Products',
    description: 'Traditional clay water bottles with modern IoT features',
    longDescription:
      'Clayer combines traditional clay craftsmanship with modern technology to create water bottles that naturally cool and purify water. Our IoT-enabled features help track hydration and water quality.',
    icon: '/assets/clayer.png',
    gradient: 'from-orange-500 to-red-600',
    heroImage: '/assets/clay-bottle.jpg',
    stats: [
      { icon: Users, label: 'Daily Users', value: '2K+' },
      { icon: Leaf, label: 'Natural Materials', value: '100%' },
      { icon: TrendingUp, label: 'Daily Hydration', value: 'Improved' },
      { icon: Award, label: 'Artisan Quality', value: 'Handcrafted' },
    ],
    features: [
      'Natural water cooling',
      'Alkaline pH balance',
      'IoT health tracking',
      'Handcrafted by artisans',
      'Plastic-free lifestyle',
    ],
  },
  'neem-brush': {
    name: 'Neem Brush',
    tagline: 'Zero Plastic Care',
    description: '100% biodegradable neem wood toothbrushes',
    longDescription:
      'Neem Brush creates sustainable oral care products using traditional neem wood. Our toothbrushes provide natural antibacterial properties while being completely biodegradable and plastic-free.',
    icon: '/assets/Neem-Brush.png',
    gradient: 'from-emerald-500 to-teal-600',
    heroImage: '/assets/neem-brushes.jpg',
    stats: [
      { icon: Users, label: 'Users Switched', value: '3K+' },
      { icon: Leaf, label: 'Plastic Content', value: '0%' },
      { icon: TrendingUp, label: 'Biodegrades In', value: '6 Months' },
      { icon: Award, label: 'Traditional Benefits', value: 'Ayurvedic' },
    ],
    features: [
      'Natural antibacterial properties',
      '100% biodegradable',
      'Soft on gums',
      'Plastic-free packaging',
      'Traditional Ayurvedic benefits',
    ],
  },
};

const BrandPage = () => {
  const { brandName } = useParams();
  const brand = brandName ? brandData[brandName as keyof typeof brandData] : null;
  const products = brandName ? getProductsByBrand(brandName) : [];

  // Handle the case where the brand is not found
  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Brand Not Found 😔</h1>
          <p className="text-gray-400 mb-6">The brand you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="outline" className="text-white border-white">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={brand.heroImage} alt={brand.name} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-br ${brand.gradient} opacity-90`} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center justify-center text-center">
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-white border-white/30 hover:bg-white/10">
              Back to Home
            </Button>
          </Link>
          <div className="mb-6 w-32 h-32 flex items-center justify-center rounded-full bg-white p-2">
            <img
              src={brand.icon}
              alt={`${brand.name} logo`}
              className="w-24 h-24 object-contain rounded-full"
            />
          </div>
          <Badge className="mb-6 bg-white/20 text-white border-white/30">{brand.tagline}</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">{brand.name}</h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">{brand.longDescription}</p>
          <Link to="/shop">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200"
            >
              Shop {brand.name} Products
            </Button>
          </Link>
        </div>
      </section>

      ---

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {brand.stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-400/10 text-pink-400 mx-auto mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      ---

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose {brand.name}?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover what makes our products special and how they contribute to a sustainable future.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {brand.features.map((feature, index) => (
              <Card key={index} className="text-center bg-gray-900 border-gray-700 hover:border-pink-500 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-pink-400/10 flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-6 w-6 text-pink-400" />
                  </div>
                  <p className="font-medium text-white">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      ---

      {/* Products Section */}
      {products.length > 0 && (
        <section className="py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h2>
              <p className="text-xl text-gray-400">
                Explore our range of {brand.name} products
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BrandPage;