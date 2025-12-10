import { tvc } from "@use-pico/cls";
import { motion, useTransform } from "motion/react";
import { type ComponentProps, type FC, type PropsWithChildren, useRef } from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { ArrowLeftIcon } from "../../icon";
import { Badge } from "../badge";
import { Button } from "../button";
import { Tx } from "../tx";

export namespace BottomSheet {
	export interface Props
		extends PropsWithChildren<Omit<ComponentProps<typeof Sheet>, "children">> {
		containerProps?: ComponentProps<typeof Sheet.Container>;
		contentProps?: ComponentProps<typeof Sheet.Content>;
		withHeader?: boolean;
		header?: {
			close?: boolean;
			title?: string;
		};
	}

	export type PropsEx = Omit<Props, "isOpen" | "onClose">;
}

export const BottomSheet: FC<BottomSheet.Props> = ({
	containerProps,
	contentProps,
	withHeader = false,
	header,
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
			data-root={"BottomSheet"}
			tweenConfig={{
				ease: "easeOut",
				duration: 0.15,
			}}
			{...props}
		>
			<Sheet.Container
				data-root={"BottomSheet-Container"}
				{...containerProps}
			>
				{withHeader ? <Sheet.Header data-root={"BottomSheet-Header"} /> : null}

				{header ? (
					<Badge
						data-root={"BottomSheet-Badge-header-wrapper"}
						ui={{
							round: "md",
						}}
					>
						{header.close ? (
							<Button
								iconEnabled={ArrowLeftIcon}
								onClick={props.onClose}
								ui={{
									round: "full",
									tone: "secondary",
									theme: "light",
								}}
							/>
						) : (
							<div />
						)}

						{header?.title ? (
							<Tx
								label={header.title}
								preset={"subheader"}
								ui={{
									tone: "primary",
									theme: "light",
								}}
							/>
						) : null}
					</Badge>
				) : null}

				<Sheet.Content
					data-ui={"BottomSheet-Content"}
					style={{
						position: "relative",
					}}
					{...contentProps}
				>
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
