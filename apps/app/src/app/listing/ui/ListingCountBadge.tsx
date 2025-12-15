import { Icon, SpinnerIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Typo } from "@use-pico/client/ui/typo";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCountQuery } from "@zbav-se.me/sdk/query/user";
import { ListingIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace ListingCountBadge {
	export interface Props extends Badge.Props {
		locale: string;
		count?: number;
		query: tListingQuery;
	}
}

export const ListingCountBadge: FC<ListingCountBadge.Props> = ({
	locale,
	count,
	query,
	ui,
	className,
	...props
}) => {
	return (
		<Badge
			ui={{
				tone: "secondary",
				theme: "light",
				flow: "horizontal",
				items: "center",
				justify: "center",
				size: "md",
				round: "default",
				gap: "default",
				inner: "default",
				...ui,
			}}
			{...props}
		>
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

			<Icon
				icon={ListingIcon}
				ui={{
					text: "xl",
				}}
			/>
		</Badge>
	);
};
