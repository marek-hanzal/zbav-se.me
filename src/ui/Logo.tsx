import type { FC } from "react";
import { cn } from "~/toolbox/cn";

export const Logo: FC = () => {
  return (
    <div
      className={cn([
        "flex flex-row items-center text-8xl font-extrabold tracking-tight",
        "shadow-red-500 drop-shadow-md",
      ])}
    >
      <span className={"text-orange-100"}>zbav-se</span>
      <span className={"text-6xl text-orange-200 opacity-75"}>.me</span>
    </div>
  );
};
