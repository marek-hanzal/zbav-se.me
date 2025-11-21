import { Icon, SpinnerIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCountQuery } from "@zbav-se.me/sdk/query/user";
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
				label={
					<Suspense
						fallback={
							<Icon
								icon={SpinnerIcon}
								size={"sm"}
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
