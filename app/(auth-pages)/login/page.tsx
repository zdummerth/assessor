import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import stlSeal from "@/public/stl-city-seal.png";

export default function Login({ searchParams }: { searchParams: Message }) {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 w-full">
      <Image src={stlSeal} alt="St. Louis City Seal" width={100} height={100} />
      <h1 className="text-3xl font-bold my-4 text-center">Assessor's Office</h1>
      <form className="flex flex-col min-w-64">
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" className="p-2 border-foreground" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            {/* <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link> */}
          </div>
          <Input
            type="password"
            name="password"
            className="p-2 border-foreground"
            required
          />
          <SubmitButton pendingText="Logging In..." formAction={signInAction}>
            Login
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
