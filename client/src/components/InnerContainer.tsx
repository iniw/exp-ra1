import { CSSProperties, ReactNode } from "react";

interface InnerContainerProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function InnerContainer({
  children,
  className,
  style,
}: InnerContainerProps) {
  return (
    <div
      className={
        "border border-gray-300 rounded-lg bg-white shadow-md overflow-y-auto no-scrollbar " +
        (className ?? "")
      }
      style={style}
    >
      {children}
    </div>
  );
}
