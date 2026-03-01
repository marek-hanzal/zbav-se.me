import { VisibilityProvider } from "@use-pico/client/context";
import type { createVisibilityStore } from "@use-pico/client/store";
import type { tListingQuery } from "@zbav-se.me/sdk/api/seller-user";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller-user/listing";
import type { FC } from "react";
import { Content } from "../Content";
import { Empty } from "./Empty";
import { FilterEmpty } from "./FilterEmpty";

export namespace Data {
	export interface Props {
		query: tListingQuery;
		visibility: createVisibilityStore.Hook;
	}
}

export const Data: FC<Data.Props> = ({ query, visibility }) => {
	const listingCollectionQuery = withListingQuery.useCollectionQuery(query);
	const { data: listingCount } = withListingQuery.useCountQuery(query);

	if (listingCount.isEmpty) {
		return <Empty />;
	}

	if (listingCount.isFilterEmpty) {
		return <FilterEmpty />;
	}

	return (
		<VisibilityProvider store={visibility}>
			<Content
				_suspense={"I know"}
				listingIds={listingCollectionQuery.data}
			/>
		</VisibilityProvider>
	);
};
