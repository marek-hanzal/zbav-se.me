import type { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { useFeedPatch } from "~/app/@buyer-user/feed/hook/useFeedPatch";
import { LocationSelectContainer } from "~/app/@common/location/ui/LocationSelectContainer";

export namespace LocationPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const { patch, isPending } = useFeedPatch({
		feed,
		onSettled,
	});

	return (
		<LocationSelectContainer
			textHint={translator.text("Feed location security (hint)")}
			onCancel={onCancel}
			onSave={({ locationId, location }) => {
				patch({
					locationId,
					query: {
						...feed.query,
						meta: {
							...feed.query?.meta,
							latLon: location,
						},
					},
				});
			}}
			loading={isPending}
			value={feed.locationId}
			ui={{
				inner: "default",
			}}
			{...props}
		/>
	);
};
