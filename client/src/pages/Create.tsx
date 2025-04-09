import UserForm from "@/components/UserForm";

export default function Create() {
  return (
    <UserForm
      mode={{
        kind: "create",
      }}
    />
  );
}
