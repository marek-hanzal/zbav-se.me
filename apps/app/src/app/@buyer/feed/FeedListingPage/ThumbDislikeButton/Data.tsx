import { DislikeIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { withThumbCreateMutation } from "@zbav-se.me/sdk/mutation/buyer/thumb";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import type { FC } from "react";

export namespace Data {
	export interface Props extends Button.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, listingId, ui, ...props }) => {
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
			data-ui={"Data"}
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
};
