import { NextPage } from "next";
import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { uploadFile } from "../utils/uploadFile";
import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const AddRecipe: NextPage = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [recipeImage, setRecipeImage] = useState<File | string>("");

  const notify = () =>
    toast.success("New recipe created correctly!!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const createRecipe = trpc.recipeRouter.create.useMutation({
    async onSuccess() {
      console.log("Created!");
    },
  });

  const router = useRouter();
  const { data: session } = useSession();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: FileList | null = e.target.files;

    if (file) {
      setRecipeImage(file[0] || "");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const image = (await uploadFile(recipeImage)) ?? "";

    if (!name) {
      alert("You must enter a name");
      return;
    }

    try {
      const newRecipe = await createRecipe.mutateAsync({
        name,
        description,
        image,
        userEmail: session?.user?.email || "",
      });

      //setRecipe(INITIAL_VALUES);

      notify();

      setTimeout(() => {
        router.push(`/recipe/${newRecipe?.id}`);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="mx-auto my-10 flex flex-col items-center gap-12 md:w-2/4">
        <h1 className="text-3xl">Add Recipe</h1>
        <form onSubmit={handleSubmit} className="flex w-2/3 flex-col">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="h-10 border-2 p-3"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <label>Description</label>
          <textarea
            className="border-2 p-3"
            name=""
            id=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            cols={20}
            rows={7}
          ></textarea>
          <label className="mt-5">Image</label>
          <input type="file" name="" id="" onChange={handleFile} />
          <button
            type="submit"
            className="my-8 w-1/3 bg-violet-800 py-2 text-white"
          >
            Create
          </button>
        </form>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Layout>
  );
};

export default AddRecipe;
