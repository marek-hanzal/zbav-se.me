import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { withListingCountQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC } from "react";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		query: tListingQuery;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, query }) => {
	const locale = useLocale();
	const { data } = withListingCountQuery.useSuspenseQuery(query);

	return `${toLocaleNumber({
		locale,
		number: data.filter,
	})}`;
};
