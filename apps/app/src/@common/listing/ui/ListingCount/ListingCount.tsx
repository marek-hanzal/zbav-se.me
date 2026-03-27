import { useLocale } from "@use-pico/client/hook";
import { Icon, SpinnerIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { withFallback } from "@use-pico/client/utils";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { translator } from "@use-pico/common/translator";
import { withListingQuery } from "~/@buyer/listing/query/withListingQuery";
import type { ListingQuerySchema } from "~/@buyer/listing/server/schema/ListingQuerySchema";

export namespace ListingCount {
	export interface Props extends MarkSuspense.Props {
		query: ListingQuerySchema.Type;
		textEmpty?: string;
		//
	}
}

export const ListingCount = withFallback(
	({ _suspense, textEmpty, query }: ListingCount.Props) => {
		const locale = useLocale();
		const { data } = withListingQuery.useCountQuery(query);

		return data.filter > 0
			? toLocaleNumber({
					locale,
					number: data.filter,
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
