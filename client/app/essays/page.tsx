import React from "react";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

export const metadata = {
  title: "Essays | Morgan Schofield",
  description: "Collection of essays and thoughts on various topics",
};

export default function EssaysPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Essays</h1>
          
          <div className="space-y-6">
            {/* Essay Card 1 */}
            <Card className="p-6 hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">The Future of AI Development</h3>
                <span className="text-sm text-muted-foreground">Jan 2024</span>
              </div>
              <p className="text-muted-foreground mb-4">Exploring the implications of AI on software development and society...</p>
              <Link href="#" className="text-primary hover:underline">Read more</Link>
            </Card>
            
            {/* Essay Card 2 */}
            <Card className="p-6 hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">Building Sustainable Tech Companies</h3>
                <span className="text-sm text-muted-foreground">Dec 2023</span>
              </div>
              <p className="text-muted-foreground mb-4">Lessons learned from creating long-lasting technology businesses...</p>
              <Link href="#" className="text-primary hover:underline">Read more</Link>
            </Card>
            
            {/* Essay Card 3 */}
            <Card className="p-6 hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">The Art of Product Design</h3>
                <span className="text-sm text-muted-foreground">Nov 2023</span>
              </div>
              <p className="text-muted-foreground mb-4">Understanding user needs and creating meaningful solutions...</p>
              <Link href="#" className="text-primary hover:underline">Read more</Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 