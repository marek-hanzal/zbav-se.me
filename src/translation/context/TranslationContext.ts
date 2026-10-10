import { createContext } from "react";
import type { TranslationSchema } from "~/translation/schema/TranslationSchema";

export const TranslationContext = createContext<TranslationSchema.Type[]>([]);
