export default function HomePage(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-neutral-800 p-4 text-white">
      <main className="text-center">{props.children}</main>
      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} T3 Drive. All rights reserved.
      </footer>
    </div>
  );
}
