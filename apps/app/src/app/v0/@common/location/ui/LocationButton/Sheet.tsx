import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import type { StateType } from "@use-pico/common/type";
import type { FC, PropsWithChildren } from "react";

export namespace Sheet {
	export interface Props extends PropsWithChildren {
		state: StateType.State<boolean>;
	}
}

export const Sheet: FC<Sheet.Props> = ({ state, children }) => {
	return (
		<BottomSheet
			isOpen={state.value}
			onClose={() => {
				state.set(false);
			}}
			detent={"full"}
			withHeader
			header={() => ({
				title: "Share location (title)",
			})}
		>
			{children}
		</BottomSheet>
	);
};
