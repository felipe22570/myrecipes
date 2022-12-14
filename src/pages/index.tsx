import React from "react";
import Layout from "../components/Layout";
import { getSession, GetSessionParams, useSession } from "next-auth/react";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { prisma } from "../server/db/client";
import { appRouter } from "../server/trpc/router/_app";
import superjson from "superjson";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { Recipe } from "@prisma/client";
import Head from "next/head";

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const recipes: Recipe[] = props.recipes;

  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>RecipePortal - All your recipes here!</title>
      </Head>
      <Layout>
        <main className="mx-auto my-5 w-3/4">
          {status === "loading" ? (
            <span>Loading...</span>
          ) : (
            <div>
              {session ? (
                <div className="">
                  <h1>Welcome! {session.user?.name}</h1>
                  <span>There are {recipes.length} recipes</span>
                  <div className="mt-5 grid w-full gap-5 sm:grid-cols-2 md:grid-cols-3">
                    {recipes.map((recipe) => (
                      <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                        <a className="rounded-md border p-10 shadow-lg transition-all hover:scale-110">
                          {recipe.name}
                        </a>
                      </Link>
                    ))}
                    <Link href={"/add-recipe"}>
                      <a className="flex gap-3 rounded-md border p-10 shadow-lg transition-all hover:scale-110">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-7 w-7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Add new recipe
                      </a>
                    </Link>
                  </div>
                </div>
              ) : (
                <span>You are not authenticated, please log in </span>
              )}
            </div>
          )}
        </main>
      </Layout>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);

  if (session) {
    const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: { session, prisma },
      transformer: superjson,
    });

    const userEmail = session.user?.email || "";

    const recipes = await ssg.recipeRouter.getAllRecipesByUser.fetch({
      userEmail,
    });

    return {
      props: {
        trpcState: ssg.dehydrate(),
        recipes: JSON.parse(JSON.stringify(recipes)),
        revalidate: 1,
      },
    };
  }

  return {
    props: {
      currentSession: session,
    },
  };
}
