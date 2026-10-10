import { useMemo } from "react";
import { translator as coolTranslator } from "~/translation/fn/translator";
import { useTranslationContext } from "~/translation/hook/useTranslationContext";

export const useTranslator = () => {
	const translations = useTranslationContext();

	const translator = useMemo(() => {
		return coolTranslator({
			translations,
		});
	}, [
		translations,
	]);

	return translator;
};
