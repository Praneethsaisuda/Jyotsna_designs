import { useState, useEffect } from 'react';
import { Product, FilterOptions, Category } from '../types';
import { supabase } from '../lib/supabase';

export const useProducts = (filters?: FilterOptions) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformProduct = (dbProduct: any): Product => {
    const primaryImage = dbProduct.images?.find((img: any) => img.is_primary) || dbProduct.images?.[0];
    
    return {
      ...dbProduct,
      image: dbProduct.img_url || primaryImage?.url || 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
      reviewCount: dbProduct.total_reviews || 0,
      inStock: dbProduct.availability && (dbProduct.stock_quantity || dbProduct.stock || 0) > 0,
      currency: dbProduct.currency || 'INR',
      brand: dbProduct.brand || 'Jyotsna Designs',
      color: dbProduct.color || [],
      size: dbProduct.size || [],
      tags: dbProduct.tags || [],
      price: parseFloat(dbProduct.price) || 0,
      discounted_price: dbProduct.discounted_price ? parseFloat(dbProduct.discounted_price) : undefined,
      rating: parseFloat(dbProduct.rating) || 4.5,
      stock_quantity: dbProduct.stock_quantity || dbProduct.stock || 0,
      images: dbProduct.images || []
    };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .order('created_at', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      let transformedProducts = (data || []).map(transformProduct);

      // Apply filters after fetching data
      if (filters?.category) {
        transformedProducts = transformedProducts.filter(product => 
          product.category?.slug === filters.category
        );
      }

      if (filters?.brand) {
        transformedProducts = transformedProducts.filter(product => 
          product.brand === filters.brand
        );
      }

      if (filters?.priceRange) {
        transformedProducts = transformedProducts.filter(product => {
          const price = product.discounted_price || product.price;
          return price >= filters.priceRange![0] && price <= filters.priceRange![1];
        });
      }

      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'price-asc':
            transformedProducts.sort((a, b) => {
              const priceA = a.discounted_price || a.price;
              const priceB = b.discounted_price || b.price;
              return priceA - priceB;
            });
            break;
          case 'price-desc':
            transformedProducts.sort((a, b) => {
              const priceA = a.discounted_price || a.price;
              const priceB = b.discounted_price || b.price;
              return priceB - priceA;
            });
            break;
          case 'newest':
            transformedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
          case 'popularity':
            transformedProducts.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
            break;
        }
      }

      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (fetchError) {
        throw fetchError;
      }

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug);
  };

  const searchProducts = (query: string): Product[] => {
    const searchTerm = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.description?.toLowerCase().includes(searchTerm) ||
      p.category?.name.toLowerCase().includes(searchTerm) ||
      p.brand?.toLowerCase().includes(searchTerm) ||
      p.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  };

  const getFeaturedProducts = (): Product[] => {
    return products.filter(p => p.is_featured);
  };

  const getProductsByCategory = (categorySlug: string): Product[] => {
    return products.filter(p => p.category?.slug === categorySlug);
  };

  return {
    products,
    categories,
    loading,
    error,
    getProductById,
    getProductBySlug,
    searchProducts,
    getFeaturedProducts,
    getProductsByCategory,
    refetch: fetchProducts
  };
};