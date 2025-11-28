import type { ComponentProps, FC, PropsWithChildren } from "react";
import { Sheet } from "react-modal-sheet";
import type { UiProps } from "../../type/UiProps";

export namespace BottomSheet {
	export interface Props
		extends UiProps<PropsWithChildren<Omit<ComponentProps<typeof Sheet>, "children">>> {
		containerProps?: ComponentProps<typeof Sheet.Container>;
		contentProps?: ComponentProps<typeof Sheet.Content>;
	}

	export type PropsEx = Omit<Props, "isOpen" | "onClose">;
}

export const BottomSheet: FC<BottomSheet.Props> = ({
	ui,
	containerProps,
	contentProps,
	children,
	...props
}) => {
	return (
		<Sheet
			data-ui={ui ?? "BottomSheet-root"}
			tweenConfig={{
				ease: "easeOut",
				duration: 0.15,
			}}
			{...props}
		>
			<Sheet.Container
				data-ui={"BottomSheet-Container"}
				{...containerProps}
			>
				<Sheet.Header data-ui={"BottomSheet-Header"} />

				<Sheet.Content
					data-ui={"BottomSheet-Content"}
					{...contentProps}
				>
					{children}
				</Sheet.Content>
			</Sheet.Container>
		</Sheet>
	);
};
