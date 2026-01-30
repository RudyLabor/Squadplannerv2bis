import { supabase } from '@/utils/supabase/client';

// Standard bucket name - must be created in Supabase Storage
const BUCKET_NAME = 'avatars';

// Helper to check if bucket exists and create it if needed
const ensureBucketExists = async (bucketName: string) => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === bucketName);

  if (!bucketExists) {
    // Try to create the bucket (requires admin rights)
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
    });

    if (error && !error.message.includes('already exists')) {
      console.error('Failed to create bucket:', error);
      // Don't throw - bucket might exist but user doesn't have list permission
    }
  }
};

export const uploadService = {
  // Upload avatar
  uploadAvatar: async (file: File, userId: string): Promise<string> => {
    if (!file || !userId) {
      throw new Error('File and userId are required');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      // Ensure bucket exists
      await ensureBucketExists(BUCKET_NAME);

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Erreur d'upload: ${error.message}`);
      }

      // Get public URL (for public buckets) or signed URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }

      // Fallback to signed URL if public URL fails
      const { data: urlData, error: urlError } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(filePath, 31536000); // 1 year

      if (urlError || !urlData) {
        throw new Error('Impossible de générer l\'URL de l\'image');
      }

      return urlData.signedUrl;
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      throw new Error(err.message || 'Échec du téléchargement de l\'avatar');
    }
  },

  // Upload squad banner
  uploadSquadBanner: async (file: File, squadId: string): Promise<string> => {
    if (!file || !squadId) {
      throw new Error('File and squadId are required');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `banners/${squadId}-${Date.now()}.${fileExt}`;

    try {
      await ensureBucketExists(BUCKET_NAME);

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Banner upload error:', error);
        throw new Error(`Erreur d'upload: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }

      const { data: urlData, error: urlError } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(fileName, 31536000);

      if (urlError || !urlData) {
        throw new Error('Impossible de générer l\'URL de l\'image');
      }

      return urlData.signedUrl;
    } catch (err: any) {
      console.error('Banner upload failed:', err);
      throw new Error(err.message || 'Échec du téléchargement de la bannière');
    }
  },

  // Delete file
  deleteFile: async (filePath: string): Promise<void> => {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete file error:', error);
      throw new Error(`Erreur de suppression: ${error.message}`);
    }
  },
};
