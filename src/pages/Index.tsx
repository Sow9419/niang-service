import FuelBackground from "@/components/FuelBackground";
import FuelHeader from "@/components/FuelHeader";
import FuelHeroContent from "@/components/FuelHeroContent";

const Index = () => {
  return (
    <FuelBackground>
      <FuelHeader />
      <FuelHeroContent />
      
      {/* Floating action element */}
      <div className="absolute bottom-8 right-8 z-30">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Animated fuel indicator */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
          <div className="absolute inset-2 rounded-full bg-primary/30 animate-pulse delay-300"></div>
          <div className="absolute inset-4 rounded-full bg-primary/50 animate-pulse delay-700"></div>
          <div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">⛽</span>
          </div>
        </div>
      </div>
    </FuelBackground>
  );
};

export default Index;