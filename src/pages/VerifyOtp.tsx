import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/useAuth";
import { Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const email = searchParams.get("email") || "";
  const type = (searchParams.get("type") as "recovery" | "signup") || "recovery";

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Code incomplet",
        description: "Veuillez entrer le code à 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await verifyOtp(email, otp, type);

    if (error) {
      toast({
        title: "Code invalide",
        description: error.message,
        variant: "destructive",
      });
    } else {
      if (type === "recovery") {
        navigate("/reset-password");
      } else {
        navigate("/home");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-md glass-effect border-primary/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">
            Vérification OTP
          </CardTitle>
          <p className="text-muted-foreground">
            Entrez le code à 6 chiffres envoyé à <strong>{email}</strong>
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-center block">Code de vérification</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  className="gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg border-primary/20 focus:border-primary" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg border-primary/20 focus:border-primary" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg border-primary/20 focus:border-primary" />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg border-primary/20 focus:border-primary" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg border-primary/20 focus:border-primary" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg border-primary/20 focus:border-primary" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button
              type="submit"
              variant="fuel"
              disabled={loading || otp.length !== 6}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Vérification...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Vérifier</span>
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas reçu le code ?
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
            >
              Renvoyer le code
            </Button>
            
            <div className="pt-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/forgot-password")}
                className="text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}