import { tvc } from "@use-pico/cls";
import { motion, useTransform } from "motion/react";
import { type ComponentProps, type FC, type PropsWithChildren, useRef } from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { ArrowLeftIcon } from "../../icon";
import type { UiProps } from "../../type/UiProps";
import { Button } from "../button";

export namespace BottomSheet {
	export interface Props
		extends UiProps<PropsWithChildren<Omit<ComponentProps<typeof Sheet>, "children">>> {
		containerProps?: ComponentProps<typeof Sheet.Container>;
		contentProps?: ComponentProps<typeof Sheet.Content>;
		withHeader?: boolean;
		noClose?: boolean;
	}

	export type PropsEx = Omit<Props, "isOpen" | "onClose">;
}

export const BottomSheet: FC<BottomSheet.Props> = ({
	ui,
	containerProps,
	contentProps,
	withHeader = false,
	noClose = false,
	children,
	...props
}) => {
	const sheetRef = useRef<SheetRef>(null);
	const fade = useTransform(() => {
		const y = sheetRef.current?.y.get() ?? 0;
		const height = sheetRef.current?.height ?? 1;

		return 1 - Math.min(Math.max(y / height, 0), 1);
	});

	return (
		<Sheet
			ref={sheetRef}
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
				{withHeader ? <Sheet.Header data-ui={"BottomSheet-Header"} /> : null}

				<Sheet.Content
					data-ui={"BottomSheet-Content"}
					style={{
						position: "relative",
					}}
					{...contentProps}
				>
					{!noClose ? (
						<Button
							iconEnabled={ArrowLeftIcon}
							onClick={props.onClose}
							iconProps={{
								size: "sm",
							}}
							snapTo={"top-left"}
							round={"full"}
							tone={"primary"}
							theme={"light"}
							tweak={{
								slot: {
									wrapper: {
										class: [
											"z-1",
										],
									},
								},
							}}
						/>
					) : null}

					{children}
				</Sheet.Content>
			</Sheet.Container>

			<motion.div
				data-ui={"BottomSheet-Backdrop"}
				className={tvc([
					"fixed",
					"top-0",
					"left-0",
					"w-full",
					"h-full",
					"touch-none",
					"bg-black/50",
					"pointer-events-auto",
					"z-1",
				])}
				style={{
					opacity: fade,
				}}
				onTap={props.onClose}
			/>
		</Sheet>
	);
};
