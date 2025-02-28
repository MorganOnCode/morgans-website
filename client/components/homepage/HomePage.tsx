"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SafeButton } from "@/components/ui/safe-button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Twitter, Linkedin, Github, Mail } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/subscribe";
import { useToast } from "@/components/ui/use-toast";

export default function HomePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubscribe(formData: FormData) {
    setIsSubmitting(true);
    try {
      const result = await subscribeToNewsletter(formData);
      
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        // Clear the form
        const form = document.getElementById("subscribe-form") as HTMLFormElement;
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[90%] md:max-w-[80%] lg:max-w-[70%]" data-testid="personal-homepage">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column - Profile Section */}
        <div className="w-full lg:w-2/5 lg:sticky lg:top-24 lg:self-start">
          {/* Profile Image */}
          <div className="mb-6">
            <div className="bg-muted rounded-md aspect-square flex items-center justify-center overflow-hidden">
              <Image 
                src="/morgan-profile.svg" 
                alt="Morgan Schofield" 
                width={400} 
                height={400}
                className="rounded-md object-cover w-full h-full"
                priority
              />
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-1">Morgan Schofield</h1>
            <p className="text-muted-foreground mb-4">X entrepreneurs visited this page</p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-4">
              <Link href="https://twitter.com" aria-label="Twitter" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://github.com" aria-label="GitHub" className="hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="mailto:email@example.com" aria-label="Email" className="hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Location */}
            <div className="flex items-center mb-8">
              <MapPin className="h-4 w-4 mr-2" />
              <span>London</span>
            </div>
          </div>
          
          {/* Stay Updated */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Stay Updated</h2>
            <form id="subscribe-form" action={handleSubscribe} className="flex flex-col gap-2">
              <Input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                className="w-full"
                data-testid="email-input"
                required
              />
              <SafeButton 
                type="submit" 
                data-testid="subscribe-button"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </SafeButton>
            </form>
          </div>
        </div>
        
        {/* Right Column - Content Sections */}
        <div className="w-full lg:w-3/5">
          {/* Values Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">My Values</h2>
            <p className="text-muted-foreground">Your values description goes here...</p>
          </section>
          
          {/* Essays Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Essays</h2>
            
            <div className="space-y-6">
              {/* Essay Card 1 */}
              <Card className="p-6 hover:border-primary transition-colors">
                <Link href="/essays" className="block">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">The Future of AI Development</h3>
                    <span className="text-sm text-muted-foreground">Jan 2024</span>
                  </div>
                  <p className="text-muted-foreground">Exploring the implications of AI on software development and society...</p>
                </Link>
              </Card>
              
              {/* Essay Card 2 */}
              <Card className="p-6 hover:border-primary transition-colors">
                <Link href="/essays" className="block">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">Building Sustainable Tech Companies</h3>
                    <span className="text-sm text-muted-foreground">Dec 2023</span>
                  </div>
                  <p className="text-muted-foreground">Lessons learned from creating long-lasting technology businesses...</p>
                </Link>
              </Card>
              
              {/* Essay Card 3 */}
              <Card className="p-6 hover:border-primary transition-colors">
                <Link href="/essays" className="block">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">The Art of Product Design</h3>
                    <span className="text-sm text-muted-foreground">Nov 2023</span>
                  </div>
                  <p className="text-muted-foreground">Understanding user needs and creating meaningful solutions...</p>
                </Link>
              </Card>
            </div>
          </section>
          
          {/* Recent Work Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Work</h2>
            
            <Card className="p-6 hover:border-primary transition-colors">
              <Link href="#" className="block">
                <h3 className="text-xl font-semibold mb-2">Project Name</h3>
                <p className="text-muted-foreground">Project description...</p>
              </Link>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
