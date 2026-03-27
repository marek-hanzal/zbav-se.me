import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { type FC, useState } from "react";
import { withFeedQuery } from "~/@buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/@buyer/feed/server/schema/FeedSchema";
import { SaveContainer } from "~/@common/container/ui/SaveContainer";
import { LocationSelect } from "~/@common/location/ui/LocationSelect";
import type { LocationSchema } from "~/@session/location/server/schema/LocationSchema";

export namespace LocationPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation();
	const [locationId, setLocationId] = useState<string | undefined | null>(feed.locationId);
	const [location, setLocation] = useState<LocationSchema.Type | undefined>(undefined);

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
