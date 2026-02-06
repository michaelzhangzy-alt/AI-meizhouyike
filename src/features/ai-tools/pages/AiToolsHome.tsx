import { Hero } from "@/features/ai-tools/components/Hero";
import { MarketSection } from "@/features/ai-tools/components/MarketSection";

export default function AiToolsHome() {
  return (
    <div className="min-h-screen bg-white">
       <Hero />
       <MarketSection />
    </div>
  );
}
