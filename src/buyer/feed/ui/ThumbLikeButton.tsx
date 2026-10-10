import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";
import { withThumbCreateMutation } from "~/buyer/thumb/mutation/withThumbCreateMutation";
import { Tx } from "~/translation/ui/Tx";
import { LikeIcon } from "~/ui/constant/LikeIcon";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Button } from "~/ui/ui/Button";

export namespace ThumbLikeButton {
	export interface Props extends Button.Props, MarkSuspense.Props {
		listingId: string;
		meta: ListingMetaSchema.Type | undefined;
	}
}

export const ThumbLikeButton = withFallback(
	({ _suspense, listingId, meta, ...props }: ThumbLikeButton.Props) => {
		const { data: listing } = withListingQuery.useFetchQuery(listingId);
		const thumbCreateMutation = withThumbCreateMutation.useMutation({
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
				data-ui={"ThumbLikeButton[Button]"}
				data-action={"like listing"}
				iconEnabled={LikeIcon}
				iconProps={{
					"data-ui-text": "xl",
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
				data-ui-tone={isLiked ? "secondary" : "neutral"}
				data-ui-theme="light"
				data-ui-size="default"
				data-ui-justify="start"
				{...props}
			/>
		);
	},
	({ ...props }: Omit<ThumbLikeButton.Props, "_suspense">) => {
		return (
			<Button
				disabled
				loading
				data-ui-tone="secondary"
				data-ui-theme="light"
				data-ui-size="default"
				data-ui-justify="start"
				{...props}
			>
				<Tx label="Loading... (button)" />
			</Button>
		);
	},
);
