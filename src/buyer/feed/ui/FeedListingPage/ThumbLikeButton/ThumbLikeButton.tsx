import { Button } from "@/lib/client/button";
import { withFallback } from "@/lib/client/fallback";
import { LikeIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";
import { withThumbCreateMutation } from "~/buyer/thumb/mutation/withThumbCreateMutation";

export namespace ThumbLikeButton {
	export interface Props extends Button.Props, MarkSuspense.Props {
		listingId: string;
		meta: ListingMetaSchema.Type | undefined;
	}
}

export const ThumbLikeButton = withFallback(
	({ _suspense, listingId, meta, ui, ...props }: ThumbLikeButton.Props) => {
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
						meta,
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
