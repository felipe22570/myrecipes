import { signIn } from "next-auth/react";
import Image from "next/future/image";
import { FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";

const Login = () => {
  const [emailLogin, setEmailLogin] = useState<string>("");

  const [passwordLogin, setPasswordLogin] = useState<string>("");
  const [loginError, setLoginError] = useState<boolean>(false);

  const user = trpc.userRouter.findUser.useQuery(
    {
      email: emailLogin,
      password: passwordLogin,
    },
    { enabled: false }
  );

  async function handleSubmitLogin(e: FormEvent) {
    e.preventDefault();

    const data = await user.refetch();

    if (!data.data) {
      setLoginError(true);
      return;
    }

    setLoginError(false);

    try {
      await signIn("credentials", {
        email: data?.data?.email,
        password: data?.data?.password,
        redirect: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center py-12">
      <h1 className="text-2xl font-bold">Login</h1>
      <form
        onSubmit={handleSubmitLogin}
        className=" mt-5 flex w-full flex-col items-center gap-2"
      >
        <input
          type="email"
          name=""
          id=""
          placeholder="Email"
          onChange={(e) => setEmailLogin(e.target.value)}
          className="w-2/3 border border-black px-4 py-2 "
        />
        <input
          type="password"
          name=""
          id=""
          placeholder="Password"
          onChange={(e) => setPasswordLogin(e.target.value)}
          className="w-2/3 border border-black px-4 py-2 "
        />
        {loginError && <p className="text-red-600">Invalid data</p>}
        <div className="flex w-2/4 flex-col gap-2">
          <button type="submit" className="rounded bg-sky-600 py-2 text-white">
            Login
          </button>
          <button
            className="flex items-center justify-center gap-3 rounded border py-2"
            onClick={() => signIn("google")}
          >
            <Image
              src="https://res.cloudinary.com/dcane9asx/image/upload/v1646412788/5847f9cbcef1014c0b5e48c8_ahn6z7.png"
              alt=""
              width={20}
              height={20}
            />
            Sign in with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
