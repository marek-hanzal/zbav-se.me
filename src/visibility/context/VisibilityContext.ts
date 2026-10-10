import { createContext } from "react";
import type { createVisibilityStore } from "~/visibility/fn/createVisibilityStore";

export const VisibilityContext = createContext<createVisibilityStore.Hook | null>(null);
