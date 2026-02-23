import type { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { LocationSelectContainer } from "~/app/@common/location/ui/LocationSelectContainer";

export namespace LocationPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patchMutation = withFeedQuery.useMutation();

	return (
		<LocationSelectContainer
			textHint={translator.text("Feed location security (hint)")}
			onCancel={onCancel}
			onSave={({ locationId, location }) => {
				patchMutation.mutate(
					{
						query: {
							where: {
								id: feed.id,
							},
						},
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
					},
					{
						onSettled,
					},
				);
			}}
			loading={patchMutation.isPending}
			value={feed.locationId}
			ui={{
				inner: "default",
			}}
			{...props}
		/>
	);
};
