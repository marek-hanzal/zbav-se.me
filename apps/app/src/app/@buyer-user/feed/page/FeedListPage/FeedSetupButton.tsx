import type { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { FC } from "react";
import { SheetButton } from "~/app/@common/sheet/ui/SheetButton";

export namespace FeedSetupButton {
	export interface Props extends Partial<SheetButton.Props> {
		state: StateType.State<boolean>;
	}
}

export const FeedSetupButton: FC<FeedSetupButton.Props> = ({ state, label, ui, ...props }) => {
	return (
		<SheetButton
			data-ui={"FeedSetupButton[SheetButton]"}
			label={label ?? translator.text("Adjust feed (button)")}
			state={state}
			defaultOpen={false}
			ui={{
				tone: "secondary",
				theme: "light",
				justify: "center",
				items: "center",
				square: "default",
				zIndex: true,
				round: "full",
				snapTo: "top-right",
				text: "xl",
				opacity: "low",
				...ui,
			}}
			{...props}
		/>
	);
};

export const FeedStatusContainerUi: Container.Props["ui"] = {
	layout: "vertical-centered",
	height: "full",
};
