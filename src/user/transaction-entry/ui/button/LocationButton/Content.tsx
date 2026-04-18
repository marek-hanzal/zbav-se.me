import type { FC } from "react";
import { Container } from "@/lib/client/container";
import type { StateType } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { LocationSelect } from "~/common/location/ui/LocationSelect";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export namespace Content {
	export interface Props extends Container.Props {
		locationIdState: StateType.State<string | undefined | null>;
		locationState: StateType.State<LocationSchema.Type | undefined>;
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
