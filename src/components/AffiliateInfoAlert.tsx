
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AffiliateInfoAlert = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>About affiliate exceptions</AlertTitle>
      <AlertDescription>
        Admins can allow specific affiliate players to bypass country blocking and time restrictions. 
        Players are identified by the affiliate ID in the query parameter during registration. 
        If assigned to an approved affiliate, they can log in even when restrictions apply.
      </AlertDescription>
    </Alert>
  );
};

export default AffiliateInfoAlert;
