import type { ComponentProps, FC, PropsWithChildren } from "react";
import { Sheet } from "react-modal-sheet";
import type { UiProps } from "../../type/UiProps";
import { Container } from "../container";

export namespace BottomSheet {
	export interface Props
		extends UiProps<PropsWithChildren<Omit<ComponentProps<typeof Sheet>, "children">>> {
		//
	}

	export type PropsEx = Omit<Props, "isOpen" | "onClose">;
}

export const BottomSheet: FC<BottomSheet.Props> = ({ ui, children, ...props }) => {
	return (
		<Sheet
			data-ui={ui ?? "BottomSheet-root"}
			tweenConfig={{
				ease: "easeOut",
				duration: 0.15,
			}}
			{...props}
		>
			<Sheet.Container data-ui={"BottomSheet-Container"}>
				<Sheet.Header data-ui={"BottomSheet-Header"} />

				<Sheet.Content data-ui={"BottomSheet-Content"}>
					<Container
						ui={"BottomSheet-Content-Container"}
						square={"md"}
						height={"content"}
					>
						{children}
					</Container>
				</Sheet.Content>
			</Sheet.Container>
		</Sheet>
	);
};
