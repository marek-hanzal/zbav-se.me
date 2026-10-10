import { motion, useTransform } from "motion/react";
import {
	type ComponentProps,
	type FC,
	type PropsWithChildren,
	type ReactNode,
	Suspense,
	useRef,
} from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { Tx } from "~/translation/ui/Tx";
import { tvcFn } from "~/ui/fn/tvcFn";
import { useMergeRefs } from "~/ui/hook/useMergeRefs";
import { Container } from "~/ui/ui/Container";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";

export namespace BottomSheet {
	export namespace Header {
		export interface Props {
			closeFn(): void;
		}

		export type RenderFn = (props: Props) => {
			title?: string;
			right?: ReactNode;
		};
	}

	export interface Props
		extends PropsWithChildren<Omit<ComponentProps<typeof Sheet>, "children">> {
		containerProps?: ComponentProps<typeof Sheet.Container>;
		contentProps?: ComponentProps<typeof Sheet.Content>;
		withHeader?: boolean;
		headerFn?: Header.RenderFn;
	}

	export type PropsEx = Omit<Props, "isOpen" | "onClose">;
}

export const BottomSheet: FC<BottomSheet.Props> = ({
	ref,
	containerProps,
	contentProps,
	withHeader = false,
	headerFn,
	children,
	...props
}) => {
	const sheetRef = useRef<SheetRef>(null);
	const mergedRef = useMergeRefs([
		sheetRef,
		ref,
	]);
	const fade = useTransform(() => {
		const y = sheetRef.current?.y.get() ?? 0;
		const height = sheetRef.current?.height ?? 1;

		return 1 - Math.min(Math.max(y / height, 0), 1);
	});
	const $header = headerFn?.({
		closeFn: props.onClose,
	});

	return (
		<Sheet
			ref={mergedRef}
			data-ui={"BottomSheet[Sheet]"}
			tweenConfig={{
				ease: "easeOut",
				duration: 0.15,
			}}
			detent={"default"}
			{...props}
		>
			<Sheet.Container
				data-ui={"BottomSheet-[SheetContainer]"}
				{...containerProps}
			>
				{$header ? (
					<Sheet.Header
						data-ui={"BottomSheet-[SheetHeader]"}
						unstyled
					>
						<Container
							data-ui={"BottomSheet-[Container.header-wrapper]"}
							data-ui-tone="neutral"
							data-ui-theme="light"
							data-ui-layout="horizontal-flex"
							data-ui-items="center"
							data-ui-justify="space-between"
							data-ui-gap="default"
							data-ui-inner="default"
							data-ui-shadow
						>
							{$header.title ? (
								<Tx
									label={$header.title}
									preset={"subheader"}
									data-ui-tone="primary"
									data-ui-theme="light"
									data-ui-color="lead"
									data-ui-truncate
								/>
							) : null}

							{$header.right ?? <div />}
						</Container>
					</Sheet.Header>
				) : null}

				<Sheet.Content
					data-ui={"BottomSheet-Content"}
					style={{
						position: "relative",
					}}
					{...contentProps}
				>
					<Suspense fallback={<SpinnerContainer />}>{children}</Suspense>
				</Sheet.Content>
			</Sheet.Container>

			<motion.div
				data-ui={"BottomSheet-Backdrop"}
				className={tvcFn([
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
