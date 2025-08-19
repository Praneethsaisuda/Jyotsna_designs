import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Banner, Logo, Category, Product, ProductImage } from '../types';

export const useSupabaseData = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [logos, setLogos] = useState<Logo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBannersCallback = useCallback(async (type?: 'hero' | 'promo' | 'testimonial') => {
    try {
      let query = supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('uploaded_at', { ascending: false });
      
      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setBanners(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch banners');
    }
  }, []);

  // Fetch banners
  const fetchBanners = fetchBannersCallback;

  // Fetch logos
  const fetchLogos = async () => {
    try {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      setLogos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logos');
    }
  };

  // Fetch categories with images
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    }
  };

  // Fetch product with all images
  const fetchProductWithImages = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch product' };
    }
  };

  // Insert new banner
  const insertBanner = async (banner: Omit<Banner, 'id' | 'uploaded_at'>) => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert([banner])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to insert banner' };
    }
  };

  // Insert new logo
  const insertLogo = async (logo: Omit<Logo, 'id' | 'uploaded_at'>) => {
    try {
      const { data, error } = await supabase
        .from('logos')
        .insert([logo])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to insert logo' };
    }
  };

  // Insert product image
  const insertProductImage = async (productImage: Omit<ProductImage, 'id' | 'uploaded_at'>) => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .insert([productImage])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to insert product image' };
    }
  };

  // Update product image as primary
  const setPrimaryProductImage = async (productId: string, imageId: string) => {
    try {
      // First, set all images for this product as non-primary
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);

      // Then set the selected image as primary
      const { data, error } = await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', imageId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to set primary image' };
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchBanners(),
        fetchLogos(),
        fetchCategories()
      ]);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  return {
    banners,
    logos,
    categories,
    loading,
    error,
    fetchBanners,
    fetchLogos,
    fetchCategories,
    fetchProductWithImages,
    insertBanner,
    insertLogo,
    insertProductImage,
    setPrimaryProductImage
  };
};