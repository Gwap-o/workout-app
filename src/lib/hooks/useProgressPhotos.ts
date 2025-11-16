// Custom Hook for Progress Photos

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import type { ProgressPhoto } from '@/types';

interface ProgressPhotoWithUrl extends ProgressPhoto {
  imageUrl: string;
}

export const useProgressPhotos = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<ProgressPhotoWithUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all photos
  const fetchPhotos = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Get photo metadata
      const { data: photoData, error: photoError } = await supabase
        .from('progress_photos')
        .select('*')
        .order('date', { ascending: false });

      if (photoError) throw photoError;

      // Get signed URLs for each photo
      const photosWithUrls = await Promise.all(
        (photoData || []).map(async (photo) => {
          try {
            const { data: urlData } = await supabase.storage
              .from('progress-photos')
              .createSignedUrl(photo.storage_path, 3600); // 1 hour expiry

            return {
              ...(photo as ProgressPhoto),
              imageUrl: urlData?.signedUrl || '',
            };
          } catch (err) {
            console.error('Error getting signed URL for photo:', err);
            return {
              ...(photo as ProgressPhoto),
              imageUrl: '',
            };
          }
        })
      );

      setPhotos(photosWithUrls.filter((p) => p.imageUrl));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError(err instanceof Error ? err.message : 'Failed to load photos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [user]);

  // Upload new photo
  const uploadPhoto = async (
    file: File,
    metadata: {
      date: string;
      weight?: number;
      phase?: number;
      notes?: string;
      imageType?: 'front' | 'side' | 'back';
    }
  ): Promise<void> => {
    if (!user) throw new Error('Not authenticated');

    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image (JPEG or PNG)');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5 MB');
    }

    setUploading(true);
    setError(null);

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('progress-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase.from('progress_photos').insert({
        user_id: user.id,
        storage_path: filePath,
        ...metadata,
      });

      if (dbError) {
        // If DB insert fails, clean up the uploaded file
        await supabase.storage.from('progress-photos').remove([filePath]);
        throw dbError;
      }

      // Refresh photos list
      await fetchPhotos();
      setUploading(false);
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
      setUploading(false);
      throw err;
    }
  };

  // Delete photo
  const deletePhoto = async (photoId: string, storagePath: string): Promise<void> => {
    if (!user) throw new Error('Not authenticated');

    setError(null);

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('progress-photos')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('progress_photos')
        .delete()
        .eq('id', photoId);

      if (dbError) throw dbError;

      // Update local state
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete photo');
      throw err;
    }
  };

  return {
    photos,
    loading,
    uploading,
    error,
    uploadPhoto,
    deletePhoto,
    refreshPhotos: fetchPhotos,
  };
};
