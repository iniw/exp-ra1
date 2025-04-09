import { z } from "zod";

const URL = "http://localhost:3000";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  favorites: z
    .array(
      z.object({
        artist: z.string().min(1),
        album: z.string().min(1),
      }),
    )
    .min(1),
});

export type UserData = z.infer<typeof UserSchema>;

export async function fetchUsers() {
  const response = await fetch(`${URL}/api/read`);
  const jsonData: unknown = await response.json();
  return z.array(UserSchema).parse(jsonData);
}

export async function fetchUserById(id: number) {
  const response = await fetch(`${URL}/api/read/${id}`);
  const jsonData: unknown = await response.json();
  return UserSchema.parse(jsonData);
}

export async function createUser(data: UserData) {
  await fetch(`${URL}/api/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateUser(data: UserData) {
  await fetch(`${URL}/api/update/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number) {
  await fetch(`${URL}/api/delete/${id}`, {
    method: "DELETE",
  });
}
