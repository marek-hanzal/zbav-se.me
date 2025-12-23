import { LikeIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { withFeedbackCreateMutation } from "@zbav-se.me/sdk/mutation/user/feedback";
import type { FC } from "react";

export namespace FeedbackLikeButton {
	export interface Props extends Button.Props {
		listingId: string;
	}
}

export const FeedbackLikeButton: FC<FeedbackLikeButton.Props> = ({ listingId, ui, ...props }) => {
	const feedbackCreateMutation = withFeedbackCreateMutation.useMutation({
		meta: {
			mutationId: listingId,
		},
	});
	const isMutating = withFeedbackCreateMutation.useIsMutating({
		mutationId: listingId,
	});

	return (
		<Button
			label={"Like listing (button)"}
			iconEnabled={LikeIcon}
			iconProps={{
				ui: {
					text: "xl",
				},
			}}
			disabled={isMutating}
			loading={feedbackCreateMutation.isPending}
			onClick={() => {
				feedbackCreateMutation.mutate({
					listingId,
					type: "like",
				});
			}}
			ui={{
				tone: "primary",
				theme: "light",
				size: "default",
				justify: "start",
				...ui,
			}}
			{...props}
		/>
	);
};
