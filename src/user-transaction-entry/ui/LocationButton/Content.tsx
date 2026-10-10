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
		onSaveFn(): void;
		onCancelFn(): void;
	}
}

export const Content: FC<Content.Props> = ({
	locationIdState,
	locationState,
	loading,
	onSaveFn,
	onCancelFn,
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
				onLocationFn={locationState.setFn}
				onChangeFn={locationIdState.setFn}
				textHint={translator.textFn("Message location security (hint)")}
			/>

			<SaveContainer
				onCancelFn={onCancelFn}
				onSaveFn={onSaveFn}
				loading={loading}
				disabled={!locationIdState.value || !locationState.value}
			/>
		</Container>
	);
};
