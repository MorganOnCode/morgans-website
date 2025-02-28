import { Metadata } from "next";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Profile Settings | Morgan Schofield",
  description: "Manage your profile settings and update your profile picture.",
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
      <Navigation />
      
      <div className="mt-12">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Update your profile picture. This will be displayed on your homepage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileImageUpload />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 