import { Group } from "@use-pico/client/ui/group";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC } from "react";
import { FlagButton } from "~/app/@buyer-user/listing/ui/button/FlagButton";
import { IgnoreButton } from "~/app/@buyer-user/listing/ui/button/IgnoreButton";

export namespace ListingDestructiveActions {
	export interface Props {
		listingId: string;
	}
}

export const ListingDestructiveActions: FC<ListingDestructiveActions.Props> = ({ listingId }) => {
	return (
		<withListingFetchQuery.Suspense
			data={{
				where: {
					id: listingId,
				},
			}}
			fallback={null}
		>
			{({ data: listing }) => {
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
			}}
		</withListingFetchQuery.Suspense>
	);
};
