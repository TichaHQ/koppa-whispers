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
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Koppa<span className="text-yellow-300">Whisper</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium">
              Anonymous chat platform for NYSC corps members
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-scale-in">
            <Card className="bg-gradient-card p-6 border-0 shadow-medium">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Anonymous Rooms</h3>
              <p className="text-muted-foreground text-sm">Create and join anonymous chat rooms for any topic</p>
            </Card>
            
            <Card className="bg-gradient-card p-6 border-0 shadow-medium">
              <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Corps Community</h3>
              <p className="text-muted-foreground text-sm">Connect with fellow corps members across Nigeria</p>
            </Card>
            
            <Card className="bg-gradient-card p-6 border-0 shadow-medium">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Safe & Secure</h3>
              <p className="text-muted-foreground text-sm">Your identity is protected while you share and connect</p>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-4"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button 
              variant="social" 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-4"
              onClick={handleJoinRoom}
            >
              Join a Room
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-white">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-white/80 text-sm">Active Corps Members</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-white/80 text-sm">Chat Rooms</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-white/80 text-sm">Anonymous Chat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};