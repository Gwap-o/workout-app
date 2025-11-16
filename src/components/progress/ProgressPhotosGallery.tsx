// Progress Photos Gallery Component

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProgressPhotos } from '@/lib/hooks/useProgressPhotos';
import { Camera, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const ProgressPhotosGallery = () => {
  const { photos, loading, uploading, uploadPhoto, deletePhoto } = useProgressPhotos();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    phase: '',
    notes: '',
    imageType: '' as 'front' | 'side' | 'back' | '',
  });
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG or PNG)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5 MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      await uploadPhoto(selectedFile, {
        date: uploadMetadata.date,
        weight: uploadMetadata.weight ? parseFloat(uploadMetadata.weight) : undefined,
        phase: uploadMetadata.phase ? parseInt(uploadMetadata.phase) : undefined,
        notes: uploadMetadata.notes || undefined,
        imageType: uploadMetadata.imageType || undefined,
      });

      // Reset form
      setShowUploadForm(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadMetadata({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        phase: '',
        notes: '',
        imageType: '',
      });
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleDelete = async (photoId: string, storagePath: string) => {
    if (!confirm('Are you sure you want to delete this photo? This cannot be undone.')) {
      return;
    }

    try {
      await deletePhoto(photoId, storagePath);
    } catch (err) {
      // Error handled in hook
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Progress Photos
              </CardTitle>
              <CardDescription>Track your visual progress with photos</CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setShowUploadForm(!showUploadForm)}
              variant={showUploadForm ? 'outline' : 'default'}
            >
              {showUploadForm ? (
                'Cancel'
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-1" /> Upload Photo
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showUploadForm && (
            <form onSubmit={handleUpload} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="space-y-4">
                {/* File Input */}
                <div>
                  <Label htmlFor="photo-file">Select Photo</Label>
                  <Input
                    id="photo-file"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileSelect}
                    required
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    JPEG or PNG, max 5 MB
                  </p>
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="flex justify-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-xs max-h-64 rounded border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <Label htmlFor="photo-date">Date</Label>
                    <Input
                      id="photo-date"
                      type="date"
                      value={uploadMetadata.date}
                      onChange={(e) =>
                        setUploadMetadata((prev) => ({ ...prev, date: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <Label htmlFor="photo-weight">Weight (lbs, optional)</Label>
                    <Input
                      id="photo-weight"
                      type="number"
                      step="0.1"
                      placeholder="180.0"
                      value={uploadMetadata.weight}
                      onChange={(e) =>
                        setUploadMetadata((prev) => ({ ...prev, weight: e.target.value }))
                      }
                    />
                  </div>

                  {/* Phase */}
                  <div>
                    <Label htmlFor="photo-phase">Phase (optional)</Label>
                    <Select
                      value={uploadMetadata.phase}
                      onValueChange={(value) =>
                        setUploadMetadata((prev) => ({ ...prev, phase: value }))
                      }
                    >
                      <SelectTrigger id="photo-phase">
                        <SelectValue placeholder="Select phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Phase 1</SelectItem>
                        <SelectItem value="2">Phase 2</SelectItem>
                        <SelectItem value="3">Phase 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Image Type */}
                  <div>
                    <Label htmlFor="photo-type">Type (optional)</Label>
                    <Select
                      value={uploadMetadata.imageType}
                      onValueChange={(value) =>
                        setUploadMetadata((prev) => ({
                          ...prev,
                          imageType: value as 'front' | 'side' | 'back',
                        }))
                      }
                    >
                      <SelectTrigger id="photo-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="front">Front</SelectItem>
                        <SelectItem value="side">Side</SelectItem>
                        <SelectItem value="back">Back</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="photo-notes">Notes (optional)</Label>
                  <Input
                    id="photo-notes"
                    placeholder="Add any notes about this photo..."
                    value={uploadMetadata.notes}
                    onChange={(e) =>
                      setUploadMetadata((prev) => ({ ...prev, notes: e.target.value }))
                    }
                  />
                </div>

                <Button type="submit" disabled={!selectedFile || uploading} className="w-full">
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Photo'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Photos Grid */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={photo.imageUrl}
                    alt={`Progress photo from ${photo.date}`}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setFullscreenImage(photo.imageUrl)}
                  />
                  <div className="p-2 bg-white dark:bg-gray-800">
                    <p className="text-xs font-semibold">
                      {format(parseISO(photo.date), 'MMM d, yyyy')}
                    </p>
                    {photo.weight && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {photo.weight} lbs
                      </p>
                    )}
                    {photo.image_type && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {photo.image_type}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(photo.id, photo.storage_path)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label="Delete photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mb-3 opacity-50" />
              <p>No progress photos yet</p>
              <p className="text-sm mt-1">Upload your first photo to track visual progress</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
            onClick={() => setFullscreenImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenImage}
            alt="Progress photo fullscreen"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
};
