import { SignInButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export default function SignInPage() {
  return (
    <>
      <Button
        size="lg"
        className="border border-neutral-700 bg-neutral-800 text-white transition-colors hover:bg-neutral-700"
      >
        <SignInButton forceRedirectUrl={"/drive"} />
      </Button>
    </>
  );
}
