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
import { tvc } from "@use-pico/cls";
import { type ComponentProps, type FC, type ReactNode, useState } from "react";
import { uiModal } from "./uiModal";

export namespace Modal {
	export namespace Children {
		export interface Props {
			close(): void;
		}

		export type Render = (props: Props) => ReactNode;
	}

	export interface Props extends Omit<uiModal.Component<ComponentProps<"div">>, "children"> {
		/**
		 * The target element that will open the modal.
		 */
		target: ReactNode;
		disabled?: boolean;
		defaultOpen?: boolean;
		size?: uiModal.Size;
		loading?: boolean;
		/**
		 * Close the modal when clicking outside of it.
		 */
		outside?: boolean;
		children: Children.Render;
		//
		modalClassName?: string;
	}

	export type PropsEx = Partial<Props>;
}

export const Modal: FC<Modal.Props> = ({
	target,
	disabled = false,
	defaultOpen = false,
	outside = false,
	size = "md",
	loading = false,
	ui,
	className,
	modalClassName,
	children,
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const nodeId = useFloatingNodeId();
	const { refs, context } = useFloating({
		nodeId,
		open: isOpen,
		onOpenChange: setIsOpen,
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
	const { isMounted, styles } = useTransitionStyles(context, {
		duration: 400,
		initial: {
			transform: "translateY(10%)",
			scale: 0.975,
			opacity: 0,
		},
		open: {
			transform: "translateY(0)",
			scale: 1,
			opacity: 1,
		},
		common: {
			transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
		},
	});

	return (
		<>
			<div
				ref={refs.setReference}
				{...getReferenceProps({
					disabled,
				})}
				className="Modal-target"
			>
				{target}
			</div>

			<FloatingNode id={nodeId}>
				{isMounted && (
					<FloatingPortal>
						<FloatingOverlay
							lockScroll
							style={styles}
							{...uiModal({
								ui: {
									...ui,
									disabled,
									loading,
									size,
								},
								className: [
									"backdrop-blur-xs",
									"flex",
									"justify-center",
									"py-12",
									disabled && "pointer-events-none cursor-not-allowed",
									loading && "pointer-events-none opacity-50",
									size === "full" && "p-0",
									className,
								],
							})}
						>
							<FloatingFocusManager
								context={context}
								modal
							>
								<div
									ref={refs.setFloating}
									{...getFloatingProps()}
									data-ui="Modal-modal"
									role="dialog"
									aria-modal="true"
									className={tvc([
										"Modal-modal",
										"bg-white",
										"shadow-lg",
										"p-4",
										"max-h-full",
										"h-fit",
										"flex",
										"flex-col",
										"gap-2",
										size === "sm" && "w-1/3",
										size === "md" && "w-2/3",
										size === "lg" && "w-4/5",
										size === "full" && [
											"w-dvw",
											"h-dvh",
											"overflow-hidden",
											"rounded-none",
											"p-0",
										],
										modalClassName,
									])}
								>
									{children({
										close: () => setIsOpen(false),
									})}
								</div>
							</FloatingFocusManager>
						</FloatingOverlay>
					</FloatingPortal>
				)}
			</FloatingNode>
		</>
	);
};
