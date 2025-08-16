import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Hero } from "@/components/landing/Hero";
import { AuthForms } from "@/components/auth/AuthForms";
import { RoomCreation } from "@/components/rooms/RoomCreation";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && user && location.pathname === "/auth") {
      navigate('/profile');
    }
  }, [user, loading, location.pathname, navigate]);
  
  if (location.pathname === "/auth") {
    return <AuthForms />;
  }
  
  if (location.pathname === "/rooms") {
    return <RoomCreation />;
  }
  
  return <Hero />;
};

export default Index;
