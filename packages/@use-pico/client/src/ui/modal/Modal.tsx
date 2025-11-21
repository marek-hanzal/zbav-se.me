import {
	FloatingFocusManager,
	FloatingNode,
	FloatingOverlay,
	FloatingPortal,
	useClick,
	useDismiss,
	useFloating,
	useFloatingNodeId,
	useInteractions,
	useTransitionStyles,
} from "@floating-ui/react";
import { type Cls, useCls } from "@use-pico/cls";
import { type FC, type ReactNode, useMemo } from "react";
import { createModalStore } from "./createModalStore";
import { ModalCls } from "./ModalCls";
import { ModalContext } from "./ModalContext";

export namespace Modal {
	export namespace Children {
		export interface Props {
			close(): void;
		}

		export type Render = (props: Props) => ReactNode;
	}

	export interface Props extends ModalCls.Props {
		/**
		 * The target element that will open the modal.
		 */
		target: ReactNode;
		disabled?: boolean;
		defaultOpen?: boolean;
		size?: Cls.VariantOf<ModalCls, "size">;
		/**
		 * Close the modal when clicking outside of it.
		 */
		outside?: boolean;
		children: Children.Render;
	}

	export type PropsEx = Partial<Props>;
}

export const Modal: FC<Modal.Props> = ({
	target,
	disabled = false,
	defaultOpen = false,
	outside = false,
	size = "md",
	tweak,
	cls = ModalCls,
	children,
}) => {
	const useModalStore = useMemo(
		() =>
			createModalStore({
				defaultOpen,
			}),
		[
			defaultOpen,
		],
	);
	const close = useModalStore((state) => state.close);
	const nodeId = useFloatingNodeId();
	const { refs, context } = useFloating({
		nodeId,
		open: useModalStore((state) => state.isOpen),
		onOpenChange: useModalStore((state) => state.toggle),
	});
	const click = useClick(context, {
		enabled: !disabled,
	});
	const dismiss = useDismiss(context, {
		outsidePress: outside,
		enabled: !disabled,
	});
	const { getReferenceProps, getFloatingProps } = useInteractions([
		click,
		dismiss,
	]);
	const { isMounted, styles } = useTransitionStyles(context);
	const { slots } = useCls(cls, tweak, {
		variant: {
			disabled,
			size,
		},
	});

	return (
		<ModalContext value={useModalStore}>
			<div
				ref={refs.setReference}
				{...getReferenceProps({
					disabled,
				})}
				className={slots.target()}
			>
				{target}
			</div>
			<FloatingNode id={nodeId}>
				{isMounted && (
					<FloatingPortal>
						<FloatingOverlay
							lockScroll
							style={styles}
							data-ui="Modal-root"
							className={slots.root()}
							onDoubleClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
							}}
						>
							<FloatingFocusManager context={context}>
								<div
									ref={refs.setFloating}
									{...getFloatingProps()}
									data-ui="Modal-modal"
									className={slots.modal()}
								>
									{children({
										close,
									})}
								</div>
							</FloatingFocusManager>
						</FloatingOverlay>
					</FloatingPortal>
				)}
			</FloatingNode>
		</ModalContext>
	);
};
