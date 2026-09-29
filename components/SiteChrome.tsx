"use client";

import { MobileMenuProvider } from "@/components/MobileMenuContext";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <MobileMenuProvider>
      <Header />
      {children}
      <WhatsAppButton />
    </MobileMenuProvider>
  );
}
