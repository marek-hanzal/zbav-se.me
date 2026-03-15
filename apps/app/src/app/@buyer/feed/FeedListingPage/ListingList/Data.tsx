import { VisibilityProvider } from "@use-pico/client/context";
import type { useElementVisibility } from "@use-pico/client/hook";
import { SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { type FC, type ReactNode, useCallback, useMemo } from "react";
import { Empty } from "./Empty";
import { FilterEmpty } from "./FilterEmpty";
import { Item } from "./Item/Item";

export namespace Data {
	export interface Props {
		query: tListingQuery;
		appendix?: ReactNode;
		feedId: string;
		withScore: boolean;
		visibility: ReturnType<typeof useElementVisibility>;
	}
}

export const Data: FC<Data.Props> = ({ query, appendix, feedId, withScore, visibility }) => {
	const { data: listingCollection } = withListingQuery.useCollectionQuery(query);
	const { data: listingCount } = withListingQuery.useCountQuery(query);
	const check = useMemo(() => {
		return [
			{
				check() {
					return listingCount.isEmpty;
				},
				render() {
					return <Empty />;
				},
			},
			{
				check() {
					return listingCount.isFilterEmpty;
				},
				render() {
					return <FilterEmpty />;
				},
			},
		] satisfies EmptyState.Check[];
	}, [
		listingCount,
	]);

	const placeholder = useCallback(() => {
		return <SpinnerContainer />;
	}, []);

	return (
		<EmptyState check={check}>
			<VisibilityProvider store={visibility}>
				{listingCollection.map((listingId) => (
					<VisibleContainer
						key={listingId}
						id={listingId}
						data-id={listingId}
						placeholder={placeholder}
						ui={{
							height: "full",
							width: "full",
						}}
					>
						<Item
							listingId={listingId}
							feedId={feedId}
							withScore={withScore}
						/>
					</VisibleContainer>
				))}

				{appendix}
			</VisibilityProvider>
		</EmptyState>
	);
};
