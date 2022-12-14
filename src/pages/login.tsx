import { getSession, GetSessionParams } from "next-auth/react";
import Login from "../components/Login";
import Register from "../components/Register";

const LoginRoute = () => {
  return (
    <div className="m-auto mt-12 flex w-full max-w-6xl flex-col justify-center gap-5 border md:mt-52 md:flex-row">
      <Login />
      <Register />
    </div>
  );
};

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      currentSession: session,
    },
  };
}

export default LoginRoute;
