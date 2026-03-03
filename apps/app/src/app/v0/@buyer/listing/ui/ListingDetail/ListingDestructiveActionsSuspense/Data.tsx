import type { MarkSuspense } from "@use-pico/client/type";
import { Group } from "@use-pico/client/ui/group";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import type { FC } from "react";
import { FlagButton } from "~/app/@buyer/feed/FeedListingPage/FlagButton/FlagButton";
import { IgnoreButton } from "~/app/@buyer/feed/FeedListingPage/IgnoreButton/IgnoreButton";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, listingId }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);

	if (listing.isFavourite) {
		return null;
	}

	return (
		<Group>
			<IgnoreButton
				listingId={listing.id}
				ui={{
					round: undefined,
					border: false,
					shadow: false,
					width: "full",
				}}
			/>

			<FlagButton
				listingId={listing.id}
				ui={{
					round: undefined,
					border: false,
					shadow: false,
					width: "full",
				}}
			/>
		</Group>
	);
};
