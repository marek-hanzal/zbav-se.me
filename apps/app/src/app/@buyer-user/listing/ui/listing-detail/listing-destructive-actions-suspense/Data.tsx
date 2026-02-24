import type { MarkSuspense } from "@use-pico/client/type";
import { Group } from "@use-pico/client/ui/group";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC } from "react";
import { FlagButtonSuspense } from "~/app/@buyer-user/listing/ui/button/FlagButtonSuspense";
import { IgnoreButtonSuspense } from "~/app/@buyer-user/listing/ui/button/IgnoreButtonSuspense";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, listingId }) => {
	const { data: listing } = withListingFetchQuery.useSuspenseQuery({
		where: {
			id: listingId,
		},
	});

	if (listing.isFavourite) {
		return null;
	}

	return (
		<Group>
			<IgnoreButtonSuspense
				listingId={listing.id}
				ui={{
					round: undefined,
					border: false,
					shadow: false,
					width: "full",
				}}
			/>

			<FlagButtonSuspense
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
