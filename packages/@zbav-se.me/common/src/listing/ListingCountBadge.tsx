import { Icon, SpinnerIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Typo } from "@use-pico/client/ui/typo";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCountQuery } from "@zbav-se.me/sdk/query/user";
import { ListingIcon } from "@zbav-se.me/ui/icon";
import { type FC, Suspense } from "react";

// biome-ignore lint/correctness/noUnusedVariables: Private
namespace Count {
	export interface Props {
		locale: string;
		query: tListingQuery;
	}
}

const Count: FC<Count.Props> = ({ locale, query }) => {
	const listingCountQuery = withListingCountQuery.useSuspenseQuery(query);

	return (
		<Typo
			label={toLocaleNumber({
				locale,
				number: listingCountQuery.data.filter,
			})}
			font={"bold"}
		/>
	);
};

export namespace ListingCountBadge {
	export interface Props extends Badge.Props {
		locale: string;
		query: tListingQuery;
	}
}

export const ListingCountBadge: FC<ListingCountBadge.Props> = ({ locale, query, ...props }) => {
	return (
		<Badge
			size={"md"}
			round={"default"}
			tone={"secondary"}
			theme={"light"}
			tweak={{
				slot: {
					root: {
						class: [
							"flex-shrink-0",
							"border-none",
							"flex-row",
							"items-center",
							"gap-1",
						],
					},
				},
			}}
			{...props}
		>
			<Icon
				icon={ListingIcon}
				size={"xs"}
			/>

			<Typo
				label={
					<Suspense
						fallback={
							<Icon
								icon={SpinnerIcon}
								size={"xs"}
							/>
						}
					>
						<Count
							locale={locale}
							query={query}
						/>
					</Suspense>
				}
				font={"bold"}
			/>
		</Badge>
	);
};
