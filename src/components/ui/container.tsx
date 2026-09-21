import type { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{ className?: string }>;

export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`container ${className}`.trim()}>{children}</div>;
}
