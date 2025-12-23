import { DislikeIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { withFeedbackCreateMutation } from "@zbav-se.me/sdk/mutation/user/feedback";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace FeedbackDislikeButton {
	export interface Props extends Button.Props {
		listing: tListing;
	}
}

export const FeedbackDislikeButton: FC<FeedbackDislikeButton.Props> = ({
	listing,
	ui,
	...props
}) => {
	const patch = withListingFetchQuery.useSet();
	const feedbackCreateMutation = withFeedbackCreateMutation.useMutation({
		onSuccess(listing) {
			patch(() => listing, {
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
	const isDisliked = listing.feedback === "dislike";

	return (
		<Button
			iconEnabled={DislikeIcon}
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
