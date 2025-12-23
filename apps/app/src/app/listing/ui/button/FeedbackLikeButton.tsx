import { useQueryClient } from "@tanstack/react-query";
import { LikeIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { withFeedbackCreateMutation } from "@zbav-se.me/sdk/mutation/user/feedback";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace FeedbackLikeButton {
	export interface Props extends Button.Props {
		listing: tListing;
	}
}

export const FeedbackLikeButton: FC<FeedbackLikeButton.Props> = ({ listing, ui, ...props }) => {
	const queryClient = useQueryClient();
	const feedbackCreateMutation = withFeedbackCreateMutation.useMutation({
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
	const isMutating = withFeedbackCreateMutation.useIsMutating({
		mutationId: listing.id,
	});

	const hasFeedback = listing.feedback !== null;
	const isLiked = listing.feedback === "like";

	return (
		<Button
			iconEnabled={LikeIcon}
			iconProps={{
				ui: {
					text: "xl",
				},
			}}
			disabled={hasFeedback || isMutating}
			loading={feedbackCreateMutation.isPending}
			onClick={() => {
				feedbackCreateMutation.mutate({
					listingId: listing.id,
					type: "like",
				});
			}}
			ui={{
				tone: isLiked ? "secondary" : "neutral",
				theme: "light",
				size: "default",
				justify: "start",
				...ui,
			}}
			{...props}
		/>
	);
};
