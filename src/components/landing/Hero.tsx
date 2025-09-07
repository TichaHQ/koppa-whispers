import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import heroBackground from "@/assets/hero-background.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleJoinRoom = () => {
    toast({
      title: "Anonymous Rooms coming soon",
      description: "This feature will be available soon. Stay tuned!",
    });
  };
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-primary opacity-80"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full mx-auto px-2 sm:px-4 py-10 sm:py-20 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-6 sm:mb-8 animate-fade-in px-2">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-3 sm:mb-4 break-words">
              Koppa<span className="text-yellow-300">Whisper</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium px-2">
              Anonymous chat platform for NYSC corps members
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 animate-scale-in px-2">
            <Card className="bg-gradient-card p-4 sm:p-6 border-0 shadow-medium">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Anonymous Rooms</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Create and join anonymous chat rooms for any topic</p>
            </Card>
            
            <Card className="bg-gradient-card p-4 sm:p-6 border-0 shadow-medium">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-secondary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Corps Community</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Connect with fellow corps members across Nigeria</p>
            </Card>
            
            <Card className="bg-gradient-card p-4 sm:p-6 border-0 shadow-medium sm:col-span-2 md:col-span-1">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Safe & Secure</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Your identity is protected while you share and connect</p>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 max-w-xs"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button 
              variant="social" 
              size="lg" 
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 max-w-xs"
              onClick={handleJoinRoom}
            >
              Join a Room
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-8 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 text-white px-4">
            <div className="animate-fade-in text-center">
              <div className="text-xl sm:text-3xl font-bold">1000+</div>
              <div className="text-white/80 text-xs sm:text-sm">Active Corps Members</div>
            </div>
            <div className="animate-fade-in text-center">
              <div className="text-xl sm:text-3xl font-bold">50+</div>
              <div className="text-white/80 text-xs sm:text-sm">Chat Rooms</div>
            </div>
            <div className="animate-fade-in text-center">
              <div className="text-xl sm:text-3xl font-bold">24/7</div>
              <div className="text-white/80 text-xs sm:text-sm">Anonymous Chat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};