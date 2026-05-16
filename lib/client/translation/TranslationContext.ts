import { createContext } from "react";
import type { TranslationSchema } from "@/lib/common/schema";

export const TranslationContext = createContext<TranslationSchema.Type[]>([]);
