import HomePage from "@/components/homepage/HomePage";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HomePage />
    </div>
  );
}
