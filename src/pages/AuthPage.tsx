import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, EyeIcon, EyeOffIcon, House } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHandleLogin } from "@/features/authHooks";
import { useQuery } from "@tanstack/react-query";

type SigninFormValues = {
  email: string;
  password: string;
};

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function AuthPage() {
  const { register: signinRegister, handleSubmit: signinSubmitHandler } =
    useForm<SigninFormValues>();
  const { register: signupRegister, handleSubmit: signupSubmitHandler } =
    useForm<SignUpFormValues>();
  const { login } = useHandleLogin();
  // const { user, isPending: loadingAuthenticatedStatus } = useIsAuthenticated();
  const { data: user, isLoading: loadingAuthenticatedStatus } = useQuery({
    queryKey: ["auth"],
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const submitSigninForm: SubmitHandler<SigninFormValues> = async (data) => {
    login(data);
  };
  const submitSignupForm: SubmitHandler<SignUpFormValues> = async () => {
    alert("this is a dummy alert, replace with your logic");
  };

  useEffect(() => {
    if (!loadingAuthenticatedStatus) {
      if (user) {
        navigate("/dashboard/home");
      }
    }
  }, [navigate, user, loadingAuthenticatedStatus]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div
        className="absolute top-5 left-5 flex justify-between align-middle cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft />
        <span className="border-opacity-20 hover:underline">back</span>
      </div>
      <div
        className="absolute top-5 right-5 flex justify-between align-middle cursor-pointer"
        onClick={() => navigate("/")}
      >
        <House />
        {/* <span className="border-opacity-20 hover:underline">back</span> */}
      </div>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={signinSubmitHandler(submitSigninForm)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...signinRegister("email", {
                      required: {
                        value: true,
                        message: "Email is required",
                      },
                    })}
                    required
                  />
                  <span className="text-red-600">{}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      {...signinRegister("password", {
                        required: true,
                        minLength: 8,
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account to get started.
              </CardDescription>
            </CardHeader>
            <form onSubmit={signupSubmitHandler(submitSignupForm)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                    {...signupRegister("name")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    {...signupRegister("email")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      required
                      {...signupRegister("password", {
                        required: true,
                        minLength: 8,
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
