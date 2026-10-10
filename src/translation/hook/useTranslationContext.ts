import { useContext } from "react";
import { TranslationContext } from "~/translation/context/TranslationContext";

export const useTranslationContext = () => {
	return useContext(TranslationContext);
};
