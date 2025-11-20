import { useParams } from "@tanstack/react-router";
import { Badge } from "@use-pico/client/ui/badge";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCountQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace ListingCountBadge {
	export interface Props extends Badge.Props {
		query: tListingQuery;
	}
}

export const ListingCountBadge: FC<ListingCountBadge.Props> = ({ query, ...props }) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const listingCountQuery = withListingCountQuery.useSuspenseQuery(query);

	return (
		<Badge
			tone={"secondary"}
			theme={"light"}
			size={"sm"}
			round={"default"}
			tweak={{
				slot: {
					root: {
						class: [
							"flex-shrink-0",
						],
					},
				},
			}}
			{...props}
		>
			<Tx label={"Number of listings (label)"} />
			<Typo
				label={toLocaleNumber({
					locale,
					number: listingCountQuery.data.filter,
				})}
				font={"bold"}
			/>
		</Badge>
	);
};
