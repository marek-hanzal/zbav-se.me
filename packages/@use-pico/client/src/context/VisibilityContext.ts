import { createContext } from "react";
import type { useElementVisibility } from "../hook/useElementVisibility";

export const VisibilityContext = createContext<useElementVisibility.Result | null>(null);
