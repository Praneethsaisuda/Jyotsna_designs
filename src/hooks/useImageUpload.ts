import { useState } from 'react';
import { supabase, STORAGE_BUCKETS, createServiceClient } from '../lib/supabase';

interface UploadOptions {
  bucket: keyof typeof STORAGE_BUCKETS;
  folder?: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

interface UploadResult {
  url: string | null;
  error: string | null;
  loading: boolean;
}

export const useImageUpload = () => {
  const [uploadState, setUploadState] = useState<UploadResult>({
    url: null,
    error: null,
    loading: false
  });

  const uploadImage = async (
    file: File,
    options: UploadOptions
  ): Promise<{ url: string | null; error: string | null }> => {
    setUploadState({ url: null, error: null, loading: true });

    try {
      console.log('Starting image upload:', file.name, 'Size:', file.size, 'Type:', file.type);

      // Validate file size (default 2MB)
      const maxSize = options.maxSize || 2;
      if (file.size > maxSize * 1024 * 1024) {
        const error = `File size must be less than ${maxSize}MB`;
        console.error('File size validation failed:', error);
        setUploadState({ url: null, error, loading: false });
        return { url: null, error };
      }

      // Validate file type
      const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        const error = 'Invalid file type. Please upload JPEG, PNG, or WebP images.';
        console.error('File type validation failed:', error);
        setUploadState({ url: null, error, loading: false });
        return { url: null, error };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = options.folder ? `${options.folder}/${fileName}` : fileName;

      console.log('Uploading to path:', filePath, 'Bucket:', STORAGE_BUCKETS[options.bucket]);
      
      // Try with service role client first (bypasses RLS)
      const serviceClient = createServiceClient();
      let data, uploadError;
      
      if (serviceClient) {
        console.log('Attempting upload with service role client...');
        const result = await serviceClient.storage
          .from(STORAGE_BUCKETS[options.bucket])
          .upload(filePath, file);
        data = result.data;
        uploadError = result.error;
      } else {
        console.log('Service client not available, using regular client...');
        const result = await supabase.storage
          .from(STORAGE_BUCKETS[options.bucket])
          .upload(filePath, file);
        data = result.data;
        uploadError = result.error;
      }

      if (uploadError) {
        console.error('Supabase storage upload failed:', uploadError);
        setUploadState({ url: null, error: uploadError.message, loading: false });
        return { url: null, error: uploadError.message };
      }

      console.log('Upload successful, data:', data);
      
      // Get public URL using the same client that succeeded
      const clientToUse = serviceClient || supabase;
      const { data: { publicUrl } } = clientToUse.storage
        .from(STORAGE_BUCKETS[options.bucket])
        .getPublicUrl(data.path);

      console.log('Generated public URL:', publicUrl);
      setUploadState({ url: publicUrl, error: null, loading: false });
      return { url: publicUrl, error: null };

    } catch (error) {
      console.error('Image upload exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState({ url: null, error: errorMessage, loading: false });
      return { url: null, error: errorMessage };
    }
  };

  const uploadLogo = (file: File) => uploadImage(file, { bucket: 'LOGOS' });
  
  const uploadProductImage = (file: File) => 
    uploadImage(file, { 
      bucket: 'PRODUCTS'
    });
  
  const uploadBanner = (file: File, type: 'hero' | 'promo' | 'testimonial') => 
    uploadImage(file, { 
      bucket: 'BANNERS', 
      folder: type 
    });

  return {
    uploadImage,
    uploadLogo,
    uploadProductImage,
    uploadBanner,
    ...uploadState
  };
};