import type { TranslationSchema } from "@/lib/common/schema";
import { translator as coolTranslator } from "@/lib/common/translation";
import { useMemo } from "react";
import { useLocale } from "../locale/useLocale";
import type { withQuery } from "../query/withQuery";
import type { MarkSuspense } from "../type/MarkSuspense";

export namespace useTranslator {
	export interface Props extends MarkSuspense.Props {
		query: withQuery.Api<
			{
				locale: string;
			},
			TranslationSchema.Type[],
			any
		>;
	}
}

export const useTranslator = ({ _suspense, query }: useTranslator.Props) => {
	const locale = useLocale();
	const { data: translations } = query.useSuspenseQuery({
		locale,
	});

	const translator = useMemo(() => {
		return coolTranslator({
			translations,
		});
	}, [
		translations,
	]);

	return translator;
};
