import Navigation from "@/components/site/Navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <Navigation />
      <main className="h-full">{children}</main>
    </ClerkProvider>
  );
};

export default layout;
