import UserForm from "@/components/UserForm";
import { fetchUserById, UserData } from "@/lib/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function Update() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!id) {
      void navigate("/");
      return;
    }

    fetchUserById(parseInt(id))
      .then((data) => {
        setUserData(data);
      })
      .catch(() => {
        void navigate("/");
      });
  }, [id, navigate]);

  // Avoid rendering until we have fetched the data
  if (!userData) return null;

  return (
    <UserForm
      mode={{
        kind: "update",
        userData,
      }}
    />
  );
}
