import { translator } from "@/lib/common/translation";
import { translationsFn } from "~/common/translation/fn/translationsFn";

export const withTranslator = async (locale: string) => {
	return translator({
		translations: await translationsFn({
			data: {
				locale,
			},
		}),
	});
};
