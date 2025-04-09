import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Undo2 } from "lucide-react";
import { createUser, updateUser, UserData, UserSchema } from "@/lib/api";
import { Link, useNavigate } from "react-router";
import OuterContainer from "./OuterContainer";
import InnerContainer from "./InnerContainer";

export interface CreateMode {
  kind: "create";
}

export interface UpdateMode {
  kind: "update";
  userData: UserData;
}

interface UserFormProps {
  mode: CreateMode | UpdateMode;
}

export default function UserForm({ mode }: UserFormProps) {
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState } = useForm<UserData>({
    resolver: zodResolver(UserSchema),
    defaultValues:
      mode.kind == "update"
        ? mode.userData
        : {
            id: 0,
            name: "",
            favorites: [{ artist: "", album: "" }],
          },
    mode: "onChange",
  });

  const favoritesField = useFieldArray({ control, name: "favorites" });

  const onSubmit = async (formData: UserData) => {
    try {
      switch (mode.kind) {
        case "create":
          await createUser(formData);
          break;
        case "update":
          await updateUser(formData);
          break;
      }

      await navigate("/");
    } catch (error) {
      console.error("Endpoint error: ", error);
    }
  };

  return (
    <OuterContainer>
      <InnerContainer className="p-3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <h1>{mode.kind === "create" ? "Registro" : "Atualização"}</h1>

          <div>
            <Input
              {...register("name")}
              placeholder="Nome"
              className="w-full"
            />
          </div>

          {favoritesField.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  {...register(`favorites.${index}.artist`)}
                  placeholder="Artista"
                />
              </div>
              <div className="flex-1">
                <Input
                  {...register(`favorites.${index}.album`)}
                  placeholder="Álbum"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (index === favoritesField.fields.length - 1) {
                    favoritesField.append({ artist: "", album: "" });
                  } else {
                    favoritesField.remove(index);
                  }
                }}
              >
                {index === favoritesField.fields.length - 1 ? (
                  <Plus />
                ) : (
                  <Trash />
                )}
              </Button>
            </div>
          ))}

          <Button
            type="submit"
            className="self-end"
            disabled={!formState.isValid}
          >
            Finalizar
          </Button>
        </form>
      </InnerContainer>

      <Link to="/">
        <Button
          className="border border-gray-300 rounded-lg shadow-md"
          type="button"
          variant="outline"
        >
          <Undo2 />
        </Button>
      </Link>
    </OuterContainer>
  );
}
