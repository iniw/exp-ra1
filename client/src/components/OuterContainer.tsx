import { ReactNode } from "react";

interface OuterContainerProps {
  children?: ReactNode;
}

export default function OuterContainer({ children }: OuterContainerProps) {
  return (
    <div className="gap-5 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
