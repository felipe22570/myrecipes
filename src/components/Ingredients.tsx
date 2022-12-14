import React, { FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";

interface Props {
  recipeId: string;
}

const Ingredients = ({ recipeId }: Props) => {
  const ingredients = trpc.ingredientsRouter.findIngredients.useQuery({
    recipeId,
  });

  const createIngredient = trpc.ingredientsRouter.create.useMutation({
    async onSuccess() {
      console.log("Created");
      ingredients.refetch();
    },
  });

  const deleteIngredient = trpc.ingredientsRouter.delete.useMutation({
    async onSuccess() {
      console.log("Deleted!!");
      ingredients.refetch();
    },
  });

  const [addIngredient, setAddIngredient] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await createIngredient.mutate({
      name,
      recipeId,
    });

    setAddIngredient(false);
  };

  const deleteIng = async (id: string) => {
    await deleteIngredient.mutate({ id });
  };

  return (
    <div className="relative flex flex-col items-center border-2 p-5">
      <h2 className="mb-5 text-lg font-bold">List of ingredients</h2>
      {ingredients.isLoading ? (
        <span>Loading...</span>
      ) : (
        <div className="flex w-full flex-col items-center px-3">
          {ingredients.data?.length === 0 ? (
            <span>There are not ingredients yet</span>
          ) : (
            <div className="w-full px-5">
              <ul className="list-disc">
                {ingredients.data?.map((ing) => (
                  <li key={ing.id} className="flex">
                    <h3 className="flex-1">- {ing.name}</h3>
                    <div className="flex gap-3">
                      <button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                      <button onClick={() => deleteIng(ing.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {addIngredient ? (
            <form onSubmit={handleSubmit} className="mt-5 flex w-full gap-3">
              <input
                type="text"
                placeholder="Type your new ingredient"
                className="flex-1 border border-black py-1 px-2"
                onChange={(e) => setName(e.target.value)}
              />
              <button
                type="submit"
                className="rounded bg-blue-600 px-2 text-white"
              >
                Add
              </button>
              <button onClick={() => setAddIngredient(false)}>X</button>
            </form>
          ) : (
            <button
              className="mt-5 flex gap-2 rounded border border-black px-3 py-1"
              onClick={() => setAddIngredient(!addIngredient)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>

              <span>Add new ingredient</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Ingredients;
