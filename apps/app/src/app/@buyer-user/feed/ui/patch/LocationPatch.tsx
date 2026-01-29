import type { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { LocationControl } from "~/app/@common/location/ui/LocationControl";

export namespace LocationPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patch = withFeedFetchQuery.useSet();
	const mutation = withFeedPatchMutation.useMutation({
		onSuccess(feed) {
			patch(() => feed, {
				where: {
					id: feed.id,
				},
			});
		},
		onSettled() {
			onSettled?.();
		},
	});

	return (
		<LocationControl
			textHint={translator.text("Feed location security (hint)")}
			onCancel={onCancel}
			onSave={({ locationId, location }) => {
				mutation.mutate({
					patch: {
						locationId,
						query: {
							...feed.query,
							meta: {
								...feed.query?.meta,
								latLon: location,
							},
						},
					},
					query: {
						where: {
							id: feed.id,
						},
					},
				});
			}}
			loading={mutation.isPending}
			value={feed.locationId}
			ui={{
				inner: "default",
			}}
			{...props}
		/>
	);
};
