import { useContext } from "react";
import { TranslationContext } from "./TranslationContext";

export const useTranslationContext = () => {
	return useContext(TranslationContext);
};
