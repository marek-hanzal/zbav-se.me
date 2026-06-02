import { withFallback } from "@/lib/client/fallback";
import { Icon, SpinnerIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";

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
