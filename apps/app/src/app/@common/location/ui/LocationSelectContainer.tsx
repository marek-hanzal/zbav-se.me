import { Container } from "@use-pico/client/ui/container";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { LocationSelect } from "~/app/@common/location/ui/LocationSelect";

export namespace LocationSelectContainer {
	export interface Props extends Container.Props {
		value: string | undefined | null;
		onCancel(): void;
		onSave(props: { locationId: string; location: tLocation }): void;
		loading: boolean;
		textHint: string;
	}
}

export const LocationSelectContainer: FC<LocationSelectContainer.Props> = ({
	value,
	onCancel,
	onSave,
	loading,
	textHint,
	ui,
	...props
}) => {
	const [locationId, setLocationId] = useState<string | undefined | null>(value);
	const [location, setLocation] = useState<tLocation | undefined>(undefined);

	return (
		<Container
			data-ui="LocationSelectContainer[Container]"
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<LocationSelect
				value={locationId}
				onLocation={setLocation}
				onChange={setLocationId}
				textHint={textHint}
			/>

			<SaveContainer
				onCancel={onCancel}
				onSave={() => {
					if (!locationId || !location) {
						return;
					}

					onSave({
						locationId,
						location,
					});
				}}
				loading={loading}
				disabled={!locationId || !location}
			/>
		</Container>
	);
};
