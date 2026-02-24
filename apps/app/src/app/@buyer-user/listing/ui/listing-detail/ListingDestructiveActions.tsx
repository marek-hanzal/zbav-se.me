import { Group } from "@use-pico/client/ui/group";
import type { MarkSuspense } from "@use-pico/client/type";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import { type FC, Suspense } from "react";
import { FlagButton } from "~/app/@buyer-user/listing/ui/button/FlagButton";
import { FlagButtonPending } from "~/app/@buyer-user/listing/ui/button/FlagButtonPending";
import { IgnoreButton } from "~/app/@buyer-user/listing/ui/button/IgnoreButton";
import { IgnoreButtonPending } from "~/app/@buyer-user/listing/ui/button/IgnoreButtonPending";

export namespace ListingDestructiveActions {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingDestructiveActions: FC<ListingDestructiveActions.Props> = ({
	_suspense,
	listingId,
}) => {
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
			<Suspense fallback={<IgnoreButtonPending />}>
				<IgnoreButton
					_suspense={"I know"}
					listingId={listing.id}
					ui={{
						round: undefined,
						border: false,
						shadow: false,
						width: "full",
					}}
				/>
			</Suspense>

			<Suspense fallback={<FlagButtonPending />}>
				<FlagButton
					_suspense={"I know"}
					listingId={listing.id}
					ui={{
						round: undefined,
						border: false,
						shadow: false,
						width: "full",
					}}
				/>
			</Suspense>
		</Group>
	);
};
