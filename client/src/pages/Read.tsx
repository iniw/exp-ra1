import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import { motion } from "motion/react";
import { UserData, deleteUser, fetchUsers } from "@/lib/api";
import { Link } from "react-router";
import OuterContainer from "@/components/OuterContainer";
import InnerContainer from "@/components/InnerContainer";

export default function Read() {
  const [data, setData] = useState<UserData[] | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const fetchData = async () => {
    setData(await fetchUsers());
  };

  useEffect(() => {
    fetchData().catch((error: unknown) => {
      console.error(error);
    });
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Avoid rendering until we have fetched the data
  if (!data) return null;

  const maxVisibleItems = 10;
  const itemHeight = 60;
  const listHeight = Math.max(data.length, maxVisibleItems) * itemHeight;

  return (
    <OuterContainer>
      <InnerContainer style={{ height: listHeight + 12, width: 600 }}>
        {data.map((item) => (
          <div
            key={item.id}
            className="border-b border-gray-200 last:border-none"
          >
            <div
              className="flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
              style={{ height: itemHeight }}
              onClick={() => {
                toggleExpand(item.id);
              }}
            >
              <span className="font-medium text-gray-900 flex items-center gap-2">
                <span className="text-gray-500 opacity-80">{item.id}</span>
                <span>{item.name}</span>
              </span>
              <span className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={async (event) => {
                    event.stopPropagation();
                    await deleteUser(item.id);
                    await fetchData();
                  }}
                >
                  <Trash />
                </Button>
                <Link to={`/update/${item.id}`}>
                  <Button
                    variant="outline"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <Pencil />
                  </Button>
                </Link>
              </span>
            </div>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: expanded.has(item.id) ? "auto" : 0,
                opacity: expanded.has(item.id) ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white">
                {item.favorites.map((data, index) => (
                  // eslint-disable-next-line react-x/no-array-index-key
                  <p key={`${item.id}-${index}`} className="text-gray-700">
                    {data.artist} - {data.album}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </InnerContainer>

      <Link to="/create">
        <Button
          className="border border-gray-300 rounded-lg shadow-md"
          variant="outline"
        >
          <Plus />
        </Button>
      </Link>
    </OuterContainer>
  );
}
