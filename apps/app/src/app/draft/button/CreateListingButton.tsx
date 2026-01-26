import { Button } from "@use-pico/client/ui/button";
import { zListingCreate } from "@zbav-se.me/sdk/api/session";
import type { tDraft, tListing } from "@zbav-se.me/sdk/api/user";
import { withListingCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { ListingIcon } from "@zbav-se.me/ui/icon";
import { uiSaveButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace CreateListingButton {
	export interface Props {
		draft: tDraft;
		onListing(listing: tListing): Promise<any>;
	}
}

export const CreateListingButton: FC<CreateListingButton.Props> = ({ draft, onListing }) => {
	const listingCreateMutation = withListingCreateMutation.useMutation({
		onSuccess: onListing,
	});

	const listing = zListingCreate.safeParse({
		...draft,
		uploadIds: draft.gallery.items.map((item) => item.uploadId),
		draftId: draft.id,
	});

	return (
		<Button
			iconEnabled={ListingIcon}
			iconProps={{
				ui: {
					text: "2xl",
				},
			}}
			label={"Submit listing (button)"}
			disabled={!listing.success || listingCreateMutation.isPending}
			loading={listingCreateMutation.isPending}
			onClick={() => {
				if (listing.success) {
					listingCreateMutation.mutate(listing.data);
				}
			}}
			{...uiSaveButton({
				ui: {
					justify: "start",
				},
				className: [],
			})}
		/>
	);
};
