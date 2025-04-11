
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LoginCredentials {
  username: string;
  password: string;
}

// Mock credentials - in a real app this would be validated against a backend
const VALID_CREDENTIALS: LoginCredentials[] = [
  { username: "student", password: "password123" },
  { username: "admin", password: "admin123" }
];

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const isValid = VALID_CREDENTIALS.some(
        cred => cred.username === username && cred.password === password
      );

      if (isValid) {
        // Call the login function from AuthContext
        login(username);
        
        toast.success("Login successful!");
        navigate("/planner");
      } else {
        toast.error("Invalid username or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-studyhub-100 text-studyhub-700">
              <BookOpen size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-studyhub-900">StudyHub</h1>
          <p className="text-muted-foreground mt-2">Your study companion for better productivity</p>
        </div>
        
        <Card className="border-studyhub-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your study dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full h-11 bg-studyhub-600 hover:bg-studyhub-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Demo credentials: username "student" / password "password123"</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
