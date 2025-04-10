
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface BackToHomeProps {
  className?: string;
}

const BackToHome = ({ className }: BackToHomeProps) => {
  const { isLoggedIn } = useAuth();
  const destination = isLoggedIn ? "/dashboard" : "/";
  
  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      asChild
    >
      <Link to={destination} aria-label="Back to home">
        <Home className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Home</span>
      </Link>
    </Button>
  );
};

export default BackToHome;
