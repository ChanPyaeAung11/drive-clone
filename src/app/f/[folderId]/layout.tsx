import { Toaster } from "~/components/ui/toaster";

export default function HomePage(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0D0D0D] p-4 text-white">
      <main className="flex-1">{props.children}</main>
      <footer className="text-md text-neutral-500">
        © {new Date().getFullYear()} CG Drive. All rights reserved.
      </footer>
      <Toaster />
    </div>
  );
}
