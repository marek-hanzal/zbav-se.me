import {
	FloatingPortal,
	autoUpdate as floatingAutoUpdate,
	flip as floatingFlip,
	offset as floatingOffset,
	shift as floatingShift,
	size as floatingSize,
	limitShift,
	type Placement,
	useFloating,
} from "@floating-ui/react";
import { useCls } from "@use-pico/cls";
import { AnimatePresence, motion } from "motion/react";
import {
	type FC,
	type PropsWithChildren,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { ContentCls } from "~/app/ui/tour/ContentCls";

export namespace Content {
	export interface Props extends ContentCls.Props<PropsWithChildren> {
		referenceElement: HTMLElement | null;
		placement?: Placement;
		maxWidthPx?: number;
		margin?: number;
		contentKey: string | number;
	}
}

export const Content: FC<Content.Props> = ({
	referenceElement,
	placement = "bottom",
	maxWidthPx = 420,
	margin = 16,
	contentKey,
	children,
	cls = ContentCls,
	tweak,
}) => {
	const centerRef = useRef<HTMLDivElement>(null);

	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			center: !referenceElement,
		}),
	}));

	const common = useMemo(
		() => [
			floatingSize({
				padding: margin,
				apply({ availableWidth, availableHeight, elements }) {
					const node = elements.floating as HTMLElement;
					node.style.maxWidth = `${Math.min(availableWidth, maxWidthPx)}px`;
					node.style.maxHeight = `${Math.max(0, availableHeight)}px`;
				},
			}),
			floatingShift({
				padding: margin,
				limiter: limitShift(),
			}),
		],
		[
			maxWidthPx,
			margin,
		],
	);

	const middleware = referenceElement
		? [
				floatingOffset(12),
				floatingFlip(),
				...common,
			]
		: [
				...common,
			];

	const { x, y, strategy, refs, update } = useFloating({
		placement: referenceElement ? placement : "top",
		whileElementsMounted(reference, floating, internalUpdate) {
			return floatingAutoUpdate(reference, floating, internalUpdate);
		},
		middleware,
	});

	useEffect(() => {
		const el = referenceElement ?? centerRef.current;
		if (!el) return;
		refs.setReference(el);
		const raf = requestAnimationFrame(() => update());
		return () => cancelAnimationFrame(raf);
	}, [
		referenceElement,
		refs,
		update,
	]);

	return (
		<>
			<div
				ref={centerRef}
				aria-hidden
				className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none"
			/>

			<FloatingPortal>
				<motion.div
					ref={refs.setFloating}
					style={{
						position: strategy,
						willChange: "transform",
					}}
					animate={{
						x,
						y,
					}}
					transition={{
						duration: 0.1,
						ease: "linear",
					}}
					className={slots.root()}
				>
					<AnimatePresence mode="wait">
						<motion.div
							className={slots.tooltip()}
							key={contentKey}
							initial={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
								transition: {
									duration: 0.1,
									ease: "easeInOut",
								},
							}}
							exit={{
								opacity: 0,
								transition: {
									duration: 0.1,
									ease: "easeInOut",
								},
							}}
						>
							{children}
						</motion.div>
					</AnimatePresence>
				</motion.div>
			</FloatingPortal>
		</>
	);
};
