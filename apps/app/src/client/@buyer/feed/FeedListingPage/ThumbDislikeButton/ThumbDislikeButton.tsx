import { DislikeIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { withListingQuery } from "~/client/@buyer/listing/withListingQuery";
import { withThumbCreateMutation } from "~/client/@buyer/thump/withThumbCreateMutation";

export namespace ThumbDislikeButton {
	export interface Props extends Button.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ThumbDislikeButton = withFallback(
	({ _suspense, listingId, ui, ...props }: ThumbDislikeButton.Props) => {
		const { data: listing } = withListingQuery.useFetchQuery(listingId);
		const update = withListingQuery.useUpdate();
		const thumbCreateMutation = withThumbCreateMutation.useMutation({
			onSuccess: update,
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
				data-ui={"ThumbDislikeButton"}
				data-action={"dislike listing"}
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
	},
	({ ui, ...props }: Omit<ThumbDislikeButton.Props, "_suspense">) => {
		return (
			<Button
				disabled
				loading
				ui={{
					tone: "secondary",
					theme: "light",
					size: "default",
					justify: "start",
					...ui,
				}}
				{...props}
			>
				<Tx label="Loading... (button)" />
			</Button>
		);
	},
);
