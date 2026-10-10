import { createContext } from "react";
import type { createVisibilityStoreFn } from "~/visibility/fn/createVisibilityStoreFn";

export const VisibilityContext = createContext<createVisibilityStoreFn.Hook | null>(null);
