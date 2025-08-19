import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';


export const HomePage: React.FC = () => {
  const { products, categories, loading } = useProducts();
  const { banners, fetchBanners } = useSupabaseData();
  const navigate = useNavigate();
  
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);

  useEffect(() => {
    fetchBanners('hero');
  }, [fetchBanners]);

  const heroBanner = banners.find(banner => banner.type === 'hero');

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/shop?category=${categorySlug}`);
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative h-96 bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white"
        style={heroBanner ? {
          backgroundImage: `linear-gradient(rgba(238, 230, 233, 0.2), rgba(65, 112, 50, 0.7)), url(${heroBanner.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className="text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {heroBanner?.title || 'Jyotsna Designs'}
          </h1>
          <p className="text-xl mb-8">
            {heroBanner?.description || 'Exquisite Traditional Wear for the Modern Woman'}
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/shop')}
            icon={ChevronRight}
          >
            Shop Collection
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Featured Collection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked designs that celebrate the beauty of traditional Indian craftsmanship
            </p>
          </div>
          
          <ProductGrid
            products={featuredProducts}
            loading={loading}
          />
          
          <div className="text-center mt-12">
            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate('/shop')}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Shop by Category</h2>
            <p className="text-gray-600">Discover our curated collections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={category.img_url || 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description || `Beautiful ${category.name.toLowerCase()} for every occasion`}</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">What Our Customers Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                text: 'Absolutely stunning designs! The quality and craftsmanship are exceptional.',
                rating: 5
              },
              {
                name: 'Anita Patel',
                text: 'Beautiful traditional wear with a modern touch. Highly recommended!',
                rating: 5
              },
              {
                name: 'Meera Singh',
                text: 'Perfect fit and gorgeous colors. Will definitely shop again!',
                rating: 5
              }
            ].map((review) => (
              <div key={review.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{review.text}"</p>
                <p className="font-semibold text-black">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};