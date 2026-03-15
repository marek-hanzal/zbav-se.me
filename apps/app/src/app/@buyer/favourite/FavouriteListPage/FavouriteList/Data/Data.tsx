import { VisibilityProvider } from "@use-pico/client/context";
import type { createVisibilityStore } from "@use-pico/client/store";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { type FC, useMemo } from "react";
import { Content } from "../Content";
import { Empty } from "./Empty";

export namespace Data {
	export interface Props {
		visibility: createVisibilityStore.Hook;
	}
}

export const Data: FC<Data.Props> = ({ visibility }) => {
	const { data: listingCollection } = withListingQuery.useCollectionQuery({
		where: {
			isFavourite: true,
			withIgnored: false,
		},
		sort: [
			{
				field: "createdAt",
				order: "desc",
			},
		],
	});

	const check = useMemo(() => {
		return [
			{
				check() {
					return !!listingCollection.length;
				},
				render() {
					return <Empty />;
				},
			},
		] satisfies EmptyState.Check[];
	}, [
		listingCollection,
	]);

	return (
		<EmptyState check={check}>
			<VisibilityProvider store={visibility}>
				<Content
					_suspense={"I know"}
					listingIds={listingCollection}
				/>
			</VisibilityProvider>
		</EmptyState>
	);
};
