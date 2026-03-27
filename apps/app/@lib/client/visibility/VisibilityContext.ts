import { createContext } from "react";
import type { createVisibilityStore } from "./createVisibilityStore";

export const VisibilityContext = createContext<createVisibilityStore.Hook | null>(null);
