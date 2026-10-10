import type { FC } from "react";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { LocationSelect } from "~/location/ui/LocationSelect";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import type { StateType } from "~/ui/type/StateType";
import { Container } from "~/ui/ui/Container";

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
	const translator = useTranslator();

	return (
		<Container
			data-ui="LocationButton[LocationSelectContainer]"
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-inner="default"
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
