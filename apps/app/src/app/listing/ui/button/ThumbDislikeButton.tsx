import { useQueryClient } from "@tanstack/react-query";
import { DislikeIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { tListing } from "@zbav-se.me/sdk/api/buyer-user";
import { withThumbCreateMutation } from "@zbav-se.me/sdk/mutation/buyer-user/thumb";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC } from "react";

export namespace ThumbDislikeButton {
	export interface Props extends Button.Props {
		listing: tListing;
	}
}

export const ThumbDislikeButton: FC<ThumbDislikeButton.Props> = ({ listing, ui, ...props }) => {
	const queryClient = useQueryClient();
	const thumbCreateMutation = withThumbCreateMutation.useMutation({
		onSuccess(listing) {
			withListingFetchQuery.invalidate(queryClient, {
				where: {
					id: listing.id,
				},
			});
		},
		meta: {
			mutationId: listing.id,
		},
	});
	const isMutating = withThumbCreateMutation.useIsMutating({
		mutationId: listing.id,
	});

	const hasThumb = listing.thumb !== null;
	const isDisliked = listing.thumb === "dislike";

	return (
		<Button
			iconEnabled={DislikeIcon}
			iconProps={{
				ui: {
					text: "xl",
				},
			}}
			disabled={hasThumb || isMutating}
			loading={thumbCreateMutation.isPending}
			onClick={() => {
				thumbCreateMutation.mutate({
					listingId: listing.id,
					type: "dislike",
				});
			}}
			ui={{
				tone: isDisliked ? "secondary" : "neutral",
				theme: "light",
				size: "default",
				justify: "start",
				...ui,
			}}
			{...props}
		/>
	);
};
