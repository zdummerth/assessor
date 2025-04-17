import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // if (error || !data?.user) {
  //   redirect("/login");
  // }

  const user = data.user;

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <button
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      {user.email?.split("@")[0]}
      <form action={signOutAction}>
        <button type="submit">Logout</button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <button>
        <Link href="/login">Login</Link>
      </button>
    </div>
  );
}
