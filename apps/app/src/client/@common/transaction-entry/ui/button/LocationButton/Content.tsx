import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tLocation } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { LocationSelect } from "~/client/@common/location/ui/LocationSelect";

export namespace Content {
	export interface Props extends Container.Props {
		locationIdState: StateType.State<string | undefined | null>;
		locationState: StateType.State<tLocation | undefined>;
		loading: boolean;
		onSave(): void;
		onCancel(): void;
	}
}

export const Content: FC<Content.Props> = ({
	locationIdState,
	locationState,
	loading,
	onSave,
	onCancel,
	ui,
	...props
}) => {
	return (
		<Container
			data-ui="LocationButton[LocationSelectContainer]"
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<LocationSelect
				value={locationIdState.value}
				onLocation={locationState.set}
				onChange={locationIdState.set}
				textHint={translator.text("Message location security (hint)")}
			/>

			<SaveContainer
				onCancel={onCancel}
				onSave={onSave}
				loading={loading}
				disabled={!locationIdState.value || !locationState.value}
			/>
		</Container>
	);
};
