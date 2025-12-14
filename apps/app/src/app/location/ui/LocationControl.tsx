import { Container } from "@use-pico/client/ui/container";
import type { tLocation } from "@zbav-se.me/sdk/api/user";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";
import { LocationSelect } from "~/app/location/ui/LocationSelect";

export namespace LocationControl {
	export interface Props extends Container.Props {
		locale: string;
		onCancel(): void;
		onSave(props: { locationId: string; location: tLocation }): void;
		loading: boolean;
	}
}

export const LocationControl: FC<LocationControl.Props> = ({
	locale,
	onCancel,
	onSave,
	loading,
	ui,
	...props
}) => {
	const [locationId, setLocationId] = useState<string | undefined>(undefined);
	const [location, setLocation] = useState<tLocation | undefined>(undefined);

	return (
		<Container
			data-ui="LocationControl[Container]"
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<LocationSelect
				locale={locale}
				value={locationId}
				onLocation={setLocation}
				onChange={setLocationId}
			/>

			<SaveControl
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
