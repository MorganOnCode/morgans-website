import React from "react";
import { Navigation } from "../../components/Navigation";
import EmotionWheel from "../../components/EmotionWheel";

export const metadata = {
  title: "Emotions | Morgan Schofield",
  description: "Explore the emotion wheel to understand and identify different emotions",
};

export default function EmotionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Emotion Wheel</h1>
          <p className="text-muted-foreground mb-8">
            Explore the emotion wheel to better understand and identify your feelings. 
            Click on different sections to learn more about each emotion.
          </p>
          
          <div className="flex justify-center mb-8">
            <EmotionWheel />
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2>Understanding Emotions</h2>
            <p>
              The emotion wheel is a tool that helps us identify and articulate our feelings with greater precision. 
              By breaking emotions down into primary, secondary, and tertiary categories, we can develop a more 
              nuanced emotional vocabulary and better understand our emotional experiences.
            </p>
            
            <h2>How to Use the Wheel</h2>
            <p>
              Start at the center of the wheel and work your way outward:
            </p>
            <ol>
              <li>Identify the primary emotion you're feeling (inner circle)</li>
              <li>Move to the middle circle to find more specific secondary emotions</li>
              <li>Explore the outer circle for the most precise tertiary emotions</li>
            </ol>
            
            <p>
              Regular practice with the emotion wheel can help improve emotional intelligence and 
              self-awareness, leading to better communication and relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 