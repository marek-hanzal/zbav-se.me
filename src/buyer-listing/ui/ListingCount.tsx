import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import type { ListingQuerySchema } from "~/buyer-listing/schema/ListingQuerySchema";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumber } from "~/number/fn/toLocaleNumber";
import { useTranslator } from "~/translation/hook/useTranslator";
import { SpinnerIcon } from "~/ui/constant/SpinnerIcon";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Icon } from "~/ui/ui/Icon";

export namespace ListingCount {
	export interface Props extends MarkSuspense.Props {
		query: ListingQuerySchema.Type;
		textEmpty?: string;
	}
}

export const ListingCount = withFallback(
	({ _suspense, textEmpty, query }: ListingCount.Props) => {
		const locale = useLocale();
		const translator = useTranslator();
		const { data: count } = withListingQuery.useCountQuery(query);

		return count > 0
			? toLocaleNumber({
					locale,
					number: count,
				})
			: (textEmpty ?? translator.text("Listing count - empty (label)"));
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
