import { useMemo } from "react";
import { translator as coolTranslator } from "@/lib/common/translation";
import { useTranslationContext } from "./useTranslationContext";

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
