import Navbar from "@/components/Navbar";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-4 pb-20 md:pt-20 md:pb-8 min-h-screen">
        {children}
      </main>
    </>
  );
}
