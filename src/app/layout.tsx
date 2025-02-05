import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { PostHogProvider } from "./_providers/posthog-provider";

export const metadata: Metadata = {
  title: "CD",
  description: "Drive Clone",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <PostHogProvider>
          <body style={{ overscrollBehavior: "none" }}>{children}</body>
        </PostHogProvider>
      </html>
    </ClerkProvider>
  );
}
