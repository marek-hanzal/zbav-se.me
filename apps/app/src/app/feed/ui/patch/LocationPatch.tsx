import type { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user/feed";
import type { FC } from "react";
import { LocationControl } from "~/app/location/ui/LocationControl";

export namespace LocationPatch {
	export interface Props extends Container.Props {
		locale: string;
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({
	locale,
	feed,
	onSettled,
	onCancel,
	...props
}) => {
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
			locale={locale}
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
