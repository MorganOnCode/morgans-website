"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SafeButton } from "@/components/ui/safe-button";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function ProfileImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const { toast } = useToast();
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    
    // Create a preview URL for the selected image
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    setUploading(true);
    setDebugInfo("Starting upload process...");

    try {
      // Try direct API upload first (more reliable)
      const formData = new FormData();
      formData.append('file', file);
      
      setDebugInfo(prev => prev + "\nUploading directly to API...");
      
      const apiResponse = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
      });
      
      if (apiResponse.ok) {
        const result = await apiResponse.json();
        setImageUrl(result.imageUrl);
        setDebugInfo(prev => prev + "\nAPI upload successful!");
        
        toast({
          title: "Success!",
          description: "Profile image updated successfully.",
        });
        
        setUploading(false);
        return;
      } else {
        setDebugInfo(prev => prev + "\nAPI upload failed, falling back to Supabase...");
      }
      
      // Fall back to Supabase upload
      setDebugInfo(prev => prev + "\nGenerating file name...");
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      setDebugInfo(prev => prev + "\nChecking for 'profile-images' bucket...");
      
      // Check if the storage bucket exists, if not create it
      try {
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          setDebugInfo(prev => prev + "\nError listing buckets: " + JSON.stringify(bucketsError));
          throw bucketsError;
        }
        
        setDebugInfo(prev => prev + "\nAvailable buckets: " + JSON.stringify(buckets?.map(b => b.name)));
        
        const profileBucket = buckets?.find(bucket => bucket.name === 'profile-images');
        
        if (!profileBucket) {
          setDebugInfo(prev => prev + "\nCreating 'profile-images' bucket...");
          const { error: createBucketError } = await supabase.storage.createBucket('profile-images', {
            public: true,
            fileSizeLimit: 1024 * 1024 * 2, // 2MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml']
          });
          
          if (createBucketError) {
            setDebugInfo(prev => prev + "\nError creating bucket: " + JSON.stringify(createBucketError));
            throw createBucketError;
          }
          
          setDebugInfo(prev => prev + "\nBucket created successfully");
        } else {
          setDebugInfo(prev => prev + "\nBucket 'profile-images' already exists");
        }
      } catch (bucketError: any) {
        setDebugInfo(prev => prev + "\nBucket operation failed: " + JSON.stringify(bucketError));
        throw new Error(`Bucket operation failed: ${bucketError.message || JSON.stringify(bucketError)}`);
      }

      setDebugInfo(prev => prev + "\nUploading file to 'profile-images' bucket...");
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) {
        setDebugInfo(prev => prev + "\nUpload error: " + JSON.stringify(uploadError));
        throw uploadError;
      }

      setDebugInfo(prev => prev + "\nFile uploaded successfully, getting public URL...");
      
      // Get the public URL
      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      setDebugInfo(prev => prev + "\nPublic URL: " + data.publicUrl);
      setImageUrl(data.publicUrl);

      setDebugInfo(prev => prev + "\nUpdating profile image via API...");
      
      // Update the profile image in the public directory
      const response = await fetch('/api/update-profile-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: data.publicUrl }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setDebugInfo(prev => prev + "\nAPI response error: " + errorText);
        throw new Error(`Failed to update profile image: ${errorText}`);
      }

      const result = await response.json();
      setDebugInfo(prev => prev + "\nAPI response: " + JSON.stringify(result));

      toast({
        title: "Success!",
        description: "Profile image updated successfully.",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setDebugInfo(prev => prev + "\nError: " + (error.message || JSON.stringify(error)));
      toast({
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {(imageUrl || previewUrl) && (
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={imageUrl || previewUrl || "/morgan-profile.svg"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
      )}
      <SafeButton
        variant="outline"
        onClick={() => document.getElementById('profile-upload')?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Profile Image'}
      </SafeButton>
      <input
        type="file"
        id="profile-upload"
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
      />
      <p className="text-sm text-muted-foreground">
        Recommended: Square image, max 2MB
      </p>
      {debugInfo && (
        <div className="mt-4 p-2 bg-muted rounded-md w-full max-h-40 overflow-auto">
          <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}
    </div>
  );
} 