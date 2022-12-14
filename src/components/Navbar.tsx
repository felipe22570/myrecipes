import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex h-20 w-full justify-end bg-cyan-800 p-5">
      {session ? (
        <div className="mr-10 flex items-center gap-5">
          <Link href="/">
            <a className="font-bold text-white">All recipes</a>
          </Link>
          <button
            className="rounded bg-white px-5 py-2"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          className="mr-10 rounded bg-white px-5"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
