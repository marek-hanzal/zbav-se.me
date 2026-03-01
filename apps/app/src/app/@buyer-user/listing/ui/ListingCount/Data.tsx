import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { translator } from "@use-pico/common/translator";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC } from "react";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		query: tListingQuery;
		textEmpty?: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, textEmpty, query }) => {
	const locale = useLocale();
	const { data } = withListingQuery.useCountQuery(query);

	return data.filter > 0
		? toLocaleNumber({
				locale,
				number: data.filter,
			})
		: (textEmpty ?? translator.text("No listings (label)"));
};
