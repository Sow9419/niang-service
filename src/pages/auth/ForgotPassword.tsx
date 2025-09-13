import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEmailSent(true);
    }

    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md glass-effect border-primary/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold gradient-text">
              Email envoyé !
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
            </p>
            
            <div className="space-y-2">
              <Button
                onClick={() => navigate("/")}
                variant="fuel"
                className="w-full"
              >
                Retour à l'accueil
              </Button>
              
              <Button
                onClick={() => setEmailSent(false)}
                variant="ghost"
                className="w-full"
              >
                Renvoyer l'email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-md glass-effect border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold gradient-text">
            Mot de passe oublié
          </CardTitle>
          <p className="text-muted-foreground">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>

            <Button
              type="submit"
              variant="fuel"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Envoi...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Envoyer le lien</span>
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-primary hover:text-primary/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}