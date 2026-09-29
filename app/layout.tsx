import { AnalyticsGate } from "@/components/AnalyticsGate";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AnalyticsGate />
    </>
  );
}
