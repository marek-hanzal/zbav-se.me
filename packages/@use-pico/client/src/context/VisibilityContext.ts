import { createContext } from "react";
import type { createVisibilityStore } from "../store/createVisibilityStore";

export const VisibilityContext = createContext<createVisibilityStore.Hook | null>(null);
