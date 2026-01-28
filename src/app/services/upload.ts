import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

const BUCKET_NAME = 'make-e884809f-uploads';

export const uploadService = {
  // Upload avatar
  uploadAvatar: async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    // Obtenir l'URL signée
    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 31536000); // 1 an

    if (!urlData) throw new Error('Failed to get signed URL');

    return urlData.signedUrl;
  },

  // Upload squad banner
  uploadSquadBanner: async (file: File, squadId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${squadId}-${Date.now()}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 31536000);

    if (!urlData) throw new Error('Failed to get signed URL');

    return urlData.signedUrl;
  },

  // Delete file
  deleteFile: async (filePath: string): Promise<void> => {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
  },
};
