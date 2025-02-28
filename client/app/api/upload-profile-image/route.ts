import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    console.log("API: Direct upload started");
    
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      console.error("API: No file provided");
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }
    
    console.log("API: File received:", file.name, file.type, file.size);
    
    // Check file type
    if (!["image/jpeg", "image/png", "image/svg+xml"].includes(file.type)) {
      console.error("API: Invalid file type:", file.type);
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only JPEG, PNG, and SVG are allowed." },
        { status: 400 }
      );
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      console.error("API: File too large:", file.size);
      return NextResponse.json(
        { success: false, message: "File too large. Maximum size is 2MB." },
        { status: 400 }
      );
    }
    
    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Use the appropriate file extension based on the MIME type
    let fileExtension = "jpg";
    if (file.type === "image/png") {
      fileExtension = "png";
    } else if (file.type === "image/svg+xml") {
      fileExtension = "svg";
    }
    
    // Use a fixed filename for the profile picture with the correct extension
    const fileName = `morgan-profile.${fileExtension}`;
    const imagePath = join(process.cwd(), "public", fileName);
    
    console.log("API: Saving file to:", imagePath);
    
    // Write the file to the public directory
    await writeFile(imagePath, buffer);
    
    console.log("API: File saved successfully");
    
    // Generate the public URL
    const imageUrl = `/${fileName}`;
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Profile image uploaded successfully",
        imageUrl
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API: Error uploading profile image:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to upload profile image", 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 