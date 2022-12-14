import { Recipe } from "@prisma/client";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";
//import { trpc } from "../../utils/trpc";
import { prisma } from "../../server/db/client";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "../../server/trpc/router/_app";
import superjson from "superjson";
import { getSession } from "next-auth/react";
import Ingredients from "../../components/Ingredients";
import Instructions from "../../components/Instructions";
import Layout from "../../components/Layout";
import Head from "next/head";
import Image from "next/future/image";

const RecipeInput = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const recipe: Recipe = props.recipe;

  useEffect(() => {
    console.log(recipe);
  }, [recipe]);

  return (
    <>
      <Head>
        <title>{recipe.name}</title>
      </Head>
      <Layout>
        <main className="mx-auto my-10 flex w-3/4 flex-col gap-16 md:flex-row">
          <section className="flex flex-col items-center gap-7 md:w-2/3">
            <h1 className="text-3xl font-bold">{recipe.name}</h1>
            {recipe.image && (
              <Image
                className=""
                src={recipe.image}
                alt="Recipe image"
                width={300}
                height={300}
              />
            )}
            <div className=" mt-7 self-start text-justify md:w-[90%] ">
              {recipe.description}
            </div>
          </section>
          <section className="flex flex-col gap-10 md:w-2/4">
            <Ingredients recipeId={recipe.id} />
            <Instructions recipeId={recipe.id} />
          </section>
        </main>
      </Layout>
    </>
  );
};

export default RecipeInput;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const recipeId = context.params?.id as string;

  const session = await getSession();

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { session, prisma },
    transformer: superjson,
  });

  const recipe = await ssg.recipeRouter.findRecipe.fetch({ recipeId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      recipe: JSON.parse(JSON.stringify(recipe)),
    },
  };
};
