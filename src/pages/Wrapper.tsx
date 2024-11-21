import { useIsAuthenticated } from "@/features/authHooks";
import { FC, PropsWithChildren } from "react";

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  useIsAuthenticated();
  return <div className="wrapper">{children}</div>;
};

export default Wrapper;
