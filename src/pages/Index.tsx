import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import FuelBackground from "@/components/FuelBackground";
import FuelHeader from "@/components/FuelHeader";
import FuelHeroContent from "@/components/FuelHeroContent";
import FuelPulsingCircle from "@/components/FuelPulsingCircle";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is logged in and the auth state is no longer loading,
    // redirect them to the dashboard.
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // While checking auth state, we can show a loader or nothing
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <FuelBackground>
      <FuelHeader />
      <FuelHeroContent />
      <FuelPulsingCircle />
    </FuelBackground>
  );
};

export default Index;