import Footer from "@/ui/Footer";
import Header from "@/ui/Header";
import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";

const AppLayout: React.FC<PropsWithChildren> = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
