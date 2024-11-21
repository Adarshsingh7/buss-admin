import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "./authMethods";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type User = ReturnType<typeof auth.isAuthenticated>;

interface Error {
  response: {
    data: {
      message: string;
    };
  };
}

// Hook for checking if the user is authenticated
const useIsAuthenticated = () => {
  const { data, refetch, isPending, isError } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => auth.isAuthenticated(),
    retry: false,
  });

  return { user: data, refetch, isPending: isPending, isError };
};

// Hook for logging in
const useHandleLogin = () => {
  const queryClient = useQueryClient();
  const { refetch } = useIsAuthenticated();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { email: string; password: string }) => {
      toast.loading("Logging in...", { id: "login" });
      return auth.login(data);
    },
    onSuccess: () => {
      toast.dismiss("login");
      toast.success("Logged in successfully");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Refresh the authentication query
    },
    onError: (error: Error) => {
      toast.dismiss("login");
      toast.error(error.response?.data.message);
    },
  });

  return { login: mutate, isPending, isError };
};

// Hook for logging out
const useHandleLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => auth.logout(),
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.removeQueries({ queryKey: ["user"] });
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error.response?.data.message);
    },
  });

  return { logout: mutate, isPending, isError };
};

export { useHandleLogin, useIsAuthenticated, useHandleLogout };
