import { LikeIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { withThumbCreateMutation } from "@zbav-se.me/sdk/mutation/buyer/thumb";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";

export namespace ThumbLikeButton {
	export interface Props extends Button.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ThumbLikeButton = withFallback(
	({ _suspense, listingId, ui, ...props }: ThumbLikeButton.Props) => {
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
		const isLiked = listing.thumb === "like";

		return (
			<Button
				data-ui={"ThumbLikeButton"}
				data-action={"like listing"}
				iconEnabled={LikeIcon}
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
	},
	({ ui, ...props }: Omit<ThumbLikeButton.Props, "_suspense">) => {
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
