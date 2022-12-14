import React, { FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";

interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

const INITIAL_VALUES = {
  name: "",
  email: "",
  password: "",
};

const Register = () => {
  const [user, setUser] = useState<RegisterValues>(INITIAL_VALUES);

  const createdUser = trpc.userRouter.register.useMutation({
    async onSuccess() {
      console.log("Created!!");
    },
  });

  const handleSubmitRegister = async (e: FormEvent) => {
    e.preventDefault();

    await createdUser.mutateAsync(user);

    setUser(INITIAL_VALUES);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center border-l py-12">
      <h1 className="text-2xl font-bold">Register</h1>
      <form
        onSubmit={handleSubmitRegister}
        className=" mt-5 flex w-full flex-col items-center gap-2"
      >
        <input
          type="text"
          name="name"
          id=""
          placeholder="Name"
          onChange={handleInput}
          className="w-2/3 border border-black px-4 py-2 "
        />
        <input
          type="email"
          name="email"
          id=""
          placeholder="Email"
          onChange={handleInput}
          className="w-2/3 border border-black px-4 py-2 "
        />
        <input
          type="password"
          name="password"
          id=""
          placeholder="Password"
          onChange={handleInput}
          className="w-2/3 border border-black px-4 py-2 "
        />
        <button
          type="submit"
          className="rounded bg-sky-600 px-6 py-2 text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Register;
