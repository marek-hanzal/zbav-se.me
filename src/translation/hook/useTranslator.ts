import { useMemo } from "react";
import { translatorFn as coolTranslatorFn } from "~/translation/fn/translatorFn";
import { useTranslationContext } from "~/translation/hook/useTranslationContext";

export const useTranslator = () => {
	const translations = useTranslationContext();

	const translator = useMemo(() => {
		return coolTranslatorFn({
			translations,
		});
	}, [
		translations,
	]);

	return translator;
};
