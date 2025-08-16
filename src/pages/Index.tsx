import { Hero } from "@/components/landing/Hero";
import { AuthForms } from "@/components/auth/AuthForms";
import { RoomCreation } from "@/components/rooms/RoomCreation";
import { useState } from "react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'hero' | 'auth' | 'rooms'>('hero');

  // This is a demo to show different sections - in real app, routing would handle this
  const renderView = () => {
    switch (currentView) {
      case 'auth':
        return <AuthForms />;
      case 'rooms':
        return <RoomCreation />;
      default:
        return <Hero />;
    }
  };

  return (
    <div>
      {renderView()}
      
      {/* Demo Navigation - Remove when implementing proper routing */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <button 
          onClick={() => setCurrentView('hero')}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-xs"
        >
          Hero
        </button>
        <button 
          onClick={() => setCurrentView('auth')}
          className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-xs"
        >
          Auth
        </button>
        <button 
          onClick={() => setCurrentView('rooms')}
          className="px-3 py-2 bg-accent text-accent-foreground rounded-md text-xs"
        >
          Rooms
        </button>
      </div>
    </div>
  );
};

export default Index;
