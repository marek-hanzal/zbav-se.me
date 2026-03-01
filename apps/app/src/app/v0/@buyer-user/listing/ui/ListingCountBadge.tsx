import { Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Typo } from "@use-pico/client/ui/typo";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { ListingIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { ListingCountBadgeValueSuspense } from "./ListingCountBadgeValueSuspense";

export namespace ListingCountBadge {
	export interface Props extends Badge.Props {
		query: tListingQuery;
	}
}

export const ListingCountBadge: FC<ListingCountBadge.Props> = ({ query, ui, ...props }) => {
	return (
		<Badge
			ui={{
				tone: "secondary",
				theme: "light",
				flow: "horizontal",
				items: "center",
				justify: "space-between",
				size: "md",
				round: "default",
				gap: "default",
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<Icon
				icon={ListingIcon}
				ui={{
					text: "xl",
				}}
			/>

			<Typo
				label={<ListingCountBadgeValueSuspense query={query} />}
				ui={{
					font: "bold",
				}}
			/>
		</Badge>
	);
};
