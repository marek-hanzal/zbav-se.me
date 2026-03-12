import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import type { StateType } from "@use-pico/common/type";
import { CloseButton } from "@zbav-se.me/ui/button";
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
			detent={"default"}
			withHeader
			header={({ close }) => ({
				title: "Share location (title)",
				right: <CloseButton onClick={close} />,
			})}
		>
			{children}
		</BottomSheet>
	);
};
