import { Toaster } from "~/components/ui/toaster";

export default function HomePage(props: { children: React.ReactNode }) {
  return (
    <div className="flex h-auto w-full flex-col items-center justify-center bg-[#0D0D0D] p-4 text-white">
      <main>{props.children}</main>
      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} CG Drive. All rights reserved.
      </footer>
      <Toaster />
    </div>
  );
}
