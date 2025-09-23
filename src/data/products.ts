import vermicompostImg from '@/assets/vermicompost.jpg';
import biogasImg from '@/assets/biogas-unit.jpg';
import ecoPotsImg from '@/assets/eco-pots.jpg';
import clayBottleImg from '@/assets/clay-bottle.jpg';
import neemBrushImg from '@/assets/neem-brushes.jpg';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  brand: string;
  category: string;
  image: string;
  stock: number;
  isEcoFriendly: boolean;
  sustainability: string;
  features: string[];
  specifications?: Record<string, string>;
}

export const products: Product[] = [
  // Happy Raithu Products
  {
    id: 'hr-001',
    name: 'Premium Vermicompost',
    description: 'Organic vermicompost made from kitchen waste. Rich in nutrients, perfect for all plants.',
    price: 60,
    originalPrice: 399,
    brand: 'Happy Raithu',
    category: 'Fertilizer',
    image: vermicompostImg,
    stock: 25,
    isEcoFriendly: true,
    sustainability: 'High',
    features: ['100% Organic', 'Rich in NPK', 'Improves Soil Health', 'Chemical-free'],
    specifications: {
      'Weight': '5 KG',
      'pH Level': '6.5-7.5',
      'Moisture': '<20%',
      'Organic Carbon': '>12%'
    }
  },
  
  
  // Gracious Gas Products
  {
    id: 'gg-001',
    name: 'Home Biogas Unit 2.0',
    description: 'Compact biogas unit for homes. Convert kitchen waste to cooking gas and liquid fertilizer.',
    price: 100,
    originalPrice: 12999,
    brand: 'Gracious Gas',
    category: 'Energy',
    image: biogasImg,
    stock: 8,
    isEcoFriendly: true,
    sustainability: 'Very High',
    features: ['Portable Design', 'Easy Installation', 'Dual Output', '1-2 Hours Cooking Gas/Day'],
    specifications: {
      'Capacity': '20L/Day waste',
      'Gas Output': '1-2 Hours',
      'Size': '60cm x 40cm x 35cm',
      'Weight': '15 KG'
    }
  },
  
  // SBL Pots Products
  {
    id: 'sbl-001',
    name: 'Eco Planter Set (3 sizes)',
    description: 'Set of 3 biodegradable pots made from coconut coir and natural fibers.',
    price: 120,
    originalPrice: 599,
    brand: 'SBL Pots',
    category: 'Gardening',
    image: ecoPotsImg,
    stock: 32,
    isEcoFriendly: true,
    sustainability: 'High',
    features: ['Biodegradable', 'Excellent Drainage', 'Root-friendly', 'Set of 3'],
    specifications: {
      'Material': 'Coconut Coir + Natural Fiber',
      'Sizes': 'Small (6"), Medium (8"), Large (10")',
      'Degradation': '6-12 months in soil',
      'Weight': '500g (set)'
    }
  },
  

  // Clayer Products
  {
    id: 'cl-001',
    name: 'Natural Clay Water Bottle',
    description: 'Handcrafted clay water bottle that keeps water naturally cool and adds minerals.',
    price: 260,
    originalPrice: 549,
    brand: 'Clayer',
    category: 'Drinkware',
    image: clayBottleImg,
    stock: 22,
    isEcoFriendly: true,
    sustainability: 'High',
    features: ['Natural Cooling', 'Mineral Enhancement', 'Eco-friendly', 'Handcrafted'],
    specifications: {
      'Capacity': '750 ML',
      'Material': '100% Natural Clay',
      'Cooling': 'Natural evaporation',
      'Care': 'Hand wash only'
    }
  },
  

  // Neem Brush Products
  
  {
    id: 'nb-002',
    name: 'neemsh',
    description: 'Colorful neem wood toothbrushes designed specifically for children.',
    price: 23,
    brand: 'Neem Brush',
    category: 'Personal Care',
    image: neemBrushImg,
    stock: 28,
    isEcoFriendly: true,
    sustainability: 'Very High',
    features: ['Child-safe', 'Colorful Design', 'Soft Bristles', 'Fun Learning'],
    specifications: {
      'Age Group': '3-12 years',
      'Handle Length': '15cm',
      'Colors': 'Red, Blue, Green, Yellow',
      'Pack Size': '2 pieces'
    }
  }
];

export const getBrandProducts = (brand: string): Product[] => {
  return products.filter(product => product.brand === brand);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.originalPrice && product.originalPrice > product.price);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductsByBrand = (brandName: string) => {
  const brandMap: { [key: string]: string } = {
    'happy-raithu': 'Happy Raithu',
    'gracious-gas': 'Gracious Gas',
    'sbl-pots': 'SBL Pots',
    'clayer': 'Clayer',
    'neem-brush': 'Neem Brush'
  };
  
  const brand = brandMap[brandName];
  return brand ? products.filter(product => product.brand === brand) : [];
};