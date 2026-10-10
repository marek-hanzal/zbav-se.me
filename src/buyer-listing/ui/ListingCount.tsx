import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import type { ListingQuerySchema } from "~/buyer-listing/schema/ListingQuerySchema";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumberFn } from "~/number/fn/toLocaleNumberFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import { SpinnerIcon } from "~/ui/constant/SpinnerIcon";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Icon } from "~/ui/ui/Icon";

export namespace ListingCount {
	export interface Props extends MarkSuspense.Props {
		query: ListingQuerySchema.Type;
		textEmpty?: string;
	}
}

export const ListingCount = withFallbackFn(
	({ _suspense, textEmpty, query }: ListingCount.Props) => {
		const locale = useLocale();
		const translator = useTranslator();
		const { data: count } = withListingQuery.useCountQuery(query);

		return count > 0
			? toLocaleNumberFn({
					locale,
					number: count,
				})
			: (textEmpty ?? translator.textFn("Listing count - empty (label)"));
	},
	function ListingCountFallback(props: Icon.PropsEx) {
		return (
			<Icon
				icon={SpinnerIcon}
				{...props}
			/>
		);
	},
);
