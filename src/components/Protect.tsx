import { useQuery } from "@tanstack/react-query";
import { FC, PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BackdropLoader } from "./BackdropLoader";

const Protect: FC<PropsWithChildren> = ({ children }) => {
  const {
    data: user,
    isPending: loadingAuthStatus,
    isError,
  } = useQuery({
    queryKey: ["auth"],
  });

  const navigate = useNavigate();

  useEffect(() => {
    if ((!loadingAuthStatus && !user) || isError) {
      toast.error("You need to be logged in to access this page", {
        richColors: true,
      });
      navigate("/");
    }
  }, [navigate, user, loadingAuthStatus, isError]);

  if (loadingAuthStatus)
    return <BackdropLoader isLoading={loadingAuthStatus} />;

  return <>{children}</>;
};

export default Protect;
