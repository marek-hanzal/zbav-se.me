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
	...props
}) => {
	return (
		<Badge
			size={"md"}
			round={"default"}
			tone={"secondary"}
			theme={"light"}
			className="shrink-0 border-none flex-row items-center gap-1"
			{...props}
		>
			<Icon
				icon={ListingIcon}
				size={"xs"}
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
							fallback={
								<Icon
									icon={SpinnerIcon}
									size={"xs"}
								/>
							}
						>
							{({ data }) => {
								return (
									<Typo
										label={toLocaleNumber({
											locale,
											number: data.filter,
										})}
										font={"bold"}
									/>
								);
							}}
						</withListingCountQuery.Suspense>
					)
				}
				font={"bold"}
			/>
		</Badge>
	);
};
