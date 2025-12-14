import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tLocation } from "@zbav-se.me/sdk/api/user";
import { uiCancelButton, uiSaveButton } from "@zbav-se.me/ui/ui";
import { type FC, useState } from "react";
import { LocationSelect } from "~/app/location/ui/LocationSelect";

export namespace LocationControl {
	export interface Props extends Container.Props {
		locale: string;
		onCancel(): void;
		onSave(props: { locationId: string; location: tLocation }): void;
	}
}

export const LocationControl: FC<LocationControl.Props> = ({
	locale,
	onCancel,
	onSave,
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

			<Container
				ui={{
					flow: "horizontal",
					items: "center",
					justify: "space-evenly",
					gap: "default",
				}}
			>
				<Button
					onClick={onCancel}
					{...uiCancelButton({
						className: [],
					})}
				>
					<Tx label="Cancel (button)" />
				</Button>

				<Button
					onClick={() => {
						if (!locationId || !location) {
							return;
						}

						onSave({
							locationId,
							location,
						});
					}}
					{...uiSaveButton({
						className: [],
					})}
				>
					<Tx label="Save (button)" />
				</Button>
			</Container>
		</Container>
	);
};
