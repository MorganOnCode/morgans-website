import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

export async function POST(request: Request) {
  try {
    console.log("API: Received profile image update request");
    
    const body = await request.json();
    const { imageUrl } = body;
    
    console.log("API: Image URL received:", imageUrl);
    
    if (!imageUrl) {
      console.error("API: No image URL provided");
      return NextResponse.json(
        { success: false, message: "Image URL is required" },
        { status: 400 }
      );
    }

    // Determine file extension from content type or URL
    let fileExtension = "svg"; // Default to SVG
    if (imageUrl.toLowerCase().endsWith(".jpg") || imageUrl.toLowerCase().endsWith(".jpeg")) {
      fileExtension = "jpg";
    } else if (imageUrl.toLowerCase().endsWith(".png")) {
      fileExtension = "png";
    }
    
    // Download the image from Supabase
    const protocol = imageUrl.startsWith("https") ? https : http;
    const imagePath = path.join(process.cwd(), "public", `morgan-profile.${fileExtension}`);
    
    console.log("API: Downloading image to path:", imagePath);
    
    // Ensure the directory exists
    const directory = path.dirname(imagePath);
    if (!fs.existsSync(directory)) {
      console.log("API: Creating directory:", directory);
      fs.mkdirSync(directory, { recursive: true });
    }
    
    // Create a write stream to save the image
    const file = fs.createWriteStream(imagePath);
    
    await new Promise<void>((resolve, reject) => {
      const request = protocol.get(imageUrl, (response) => {
        // Check if the response is successful
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: HTTP status ${response.statusCode}`));
          return;
        }
        
        console.log("API: Image download started, status:", response.statusCode);
        
        // Check content type and update file extension if needed
        const contentType = response.headers['content-type'];
        if (contentType) {
          console.log("API: Content-Type:", contentType);
          if (contentType.includes('image/jpeg')) {
            fileExtension = 'jpg';
          } else if (contentType.includes('image/png')) {
            fileExtension = 'png';
          } else if (contentType.includes('image/svg+xml')) {
            fileExtension = 'svg';
          }
        }
        
        response.pipe(file);
        
        file.on("finish", () => {
          console.log("API: Image download completed");
          file.close();
          resolve();
        });
        
        file.on("error", (err) => {
          console.error("API: File write error:", err);
          fs.unlink(imagePath, () => {});
          reject(err);
        });
      });
      
      request.on("error", (err) => {
        console.error("API: HTTP request error:", err);
        fs.unlink(imagePath, () => {});
        reject(err);
      });
      
      // Set a timeout for the request
      request.setTimeout(30000, () => {
        request.destroy();
        console.error("API: Request timeout");
        reject(new Error("Request timeout"));
      });
    });

    console.log("API: Profile image updated successfully");
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Profile image updated successfully",
        imageUrl: `/morgan-profile.${fileExtension}`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API: Error updating profile image:", error);
    
    // Return a more detailed error message
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update profile image", 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 