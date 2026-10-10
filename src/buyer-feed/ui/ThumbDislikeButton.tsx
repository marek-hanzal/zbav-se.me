import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import type { ListingMetaSchema } from "~/buyer-listing/schema/ListingMetaSchema";
import { withThumbCreateMutation } from "~/buyer-thumb/mutation/withThumbCreateMutation";
import { Tx } from "~/translation/ui/Tx";
import { DislikeIcon } from "~/ui/constant/DislikeIcon";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Button } from "~/ui/ui/Button";

export namespace ThumbDislikeButton {
	export interface Props extends Button.Props, MarkSuspense.Props {
		listingId: string;
		meta: ListingMetaSchema.Type | undefined;
	}
}

export const ThumbDislikeButton = withFallbackFn(
	({ _suspense, listingId, meta, ...props }: ThumbDislikeButton.Props) => {
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
		const isDisliked = listing.thumb === "dislike";

		return (
			<Button
				data-ui={"ThumbDislikeButton[Button]"}
				data-action={"dislike listing"}
				iconEnabled={DislikeIcon}
				iconProps={{
					"data-ui-text": "xl",
				}}
				disabled={hasThumb || isMutating}
				loading={thumbCreateMutation.isPending}
				onClick={() => {
					thumbCreateMutation.mutate({
						listingId: listing.id,
						type: "dislike",
						meta,
					});
				}}
				data-ui-tone={isDisliked ? "secondary" : "neutral"}
				data-ui-theme="light"
				data-ui-size="default"
				data-ui-justify="start"
				{...props}
			/>
		);
	},
	({ ...props }: Omit<ThumbDislikeButton.Props, "_suspense">) => {
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
