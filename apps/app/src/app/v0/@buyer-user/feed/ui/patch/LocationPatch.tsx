import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { LocationSelect } from "~/app/v0/@common/location/ui/LocationSelect";

export namespace LocationPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation();
	const [locationId, setLocationId] = useState<string | undefined | null>(feed.locationId);
	const [location, setLocation] = useState<tLocation | undefined>(undefined);

	return (
		<Container
			data-ui={"LocationPatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				inner: "default",
				...props.ui,
			}}
			{...props}
		>
			<LocationSelect
				value={locationId}
				onLocation={setLocation}
				onChange={setLocationId}
				textHint={translator.text("Feed location security (hint)")}
			/>

			<SaveContainer
				onCancel={onCancel}
				onSave={() => {
					if (!locationId || !location) {
						return;
					}

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
				disabled={!locationId || !location}
			/>
		</Container>
	);
};
