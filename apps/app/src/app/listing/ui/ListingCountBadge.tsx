import { useLocale } from "@use-pico/client/hook";
import { Icon, SpinnerIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Typo } from "@use-pico/client/ui/typo";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer-session";
import { withListingCountQuery } from "@zbav-se.me/sdk/query/buyer-session/listing";
import { ListingIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace ListingCountBadge {
	export interface Props extends Badge.Props {
		count?: number;
		query: tListingQuery;
	}
}

export const ListingCountBadge: FC<ListingCountBadge.Props> = ({ count, query, ui, ...props }) => {
	const locale = useLocale();
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
				label={
					count ? (
						toLocaleNumber({
							locale,
							number: count,
						})
					) : (
						<withListingCountQuery.Suspense
							data={query}
							fallback={<Icon icon={SpinnerIcon} />}
						>
							{({ data }) => {
								return `${toLocaleNumber({
									locale,
									number: data.filter,
								})}`;
							}}
						</withListingCountQuery.Suspense>
					)
				}
				ui={{
					font: "bold",
				}}
			/>
		</Badge>
	);
};
