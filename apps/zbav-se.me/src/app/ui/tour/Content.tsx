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
import { motion } from "motion/react";
import type React from "react";
import {
	type FC,
	type PropsWithChildren,
	useEffect,
	useRef,
	useState,
} from "react";
import { ContentCls } from "~/app/ui/tour/ContentCls";

const MOVE_DURATION_S = 0.35;
const FADE_DURATION_S = 0.25;
const EASE_MOVE: [
	number,
	number,
	number,
	number,
] = [
	0.22,
	1,
	0.36,
	1,
];
const EASE_FADE: [
	number,
	number,
	number,
	number,
] = [
	0.4,
	0,
	0.2,
	1,
];

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
	const isFadingRef = useRef(false);
	const centerRef = useRef<HTMLDivElement>(null);
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			center: !referenceElement,
		}),
	}));

	const common = [
		floatingSize({
			padding: margin,
			apply({ availableWidth, availableHeight, elements }) {
				const node = elements.floating as HTMLElement;
				node.style.maxWidth = `${Math.min(availableWidth, maxWidthPx)}px`;
				node.style.maxHeight = `${Math.max(0, availableHeight)}px`;
				node.style.overflow = "auto";
				node.style.boxSizing = "border-box";
			},
		}),
		floatingShift({
			padding: margin,
			limiter: limitShift(),
		}),
	];
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
		// strategy: "fixed",
		whileElementsMounted(reference, floating, internalUpdate) {
			return floatingAutoUpdate(reference, floating, () => {
				if (!isFadingRef.current) {
					internalUpdate();
				}
			});
		},
		middleware,
	});

	useEffect(() => {
		const el = referenceElement ?? centerRef.current;
		if (!el) {
			return;
		}
		refs.setReference(el);
		const raf = requestAnimationFrame(() => update());
		return () => {
			cancelAnimationFrame(raf);
		};
	}, [
		referenceElement,
		refs,
		update,
	]);

	const [activeKey, setActiveKey] = useState<string | number>(contentKey);
	const [activeChildren, setActiveChildren] =
		useState<React.ReactNode>(children);
	const pendingKeyRef = useRef<string | number>(contentKey);
	const pendingChildrenRef = useRef<React.ReactNode>(children);
	const [opacityTarget, setOpacityTarget] = useState(1);
	const fadingOutRef = useRef(false);

	useEffect(() => {
		pendingKeyRef.current = contentKey;
		pendingChildrenRef.current = children;
		if (contentKey !== activeKey) {
			isFadingRef.current = true;
			fadingOutRef.current = true;
			setOpacityTarget(0);
		}
	}, [
		contentKey,
		children,
		activeKey,
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
					}}
					animate={{
						x,
						y,
					}}
					transition={{
						duration: MOVE_DURATION_S,
						ease: EASE_MOVE,
					}}
					initial={false}
					className={slots.root()}
				>
					<motion.div
						className={slots.tooltip()}
						animate={{
							opacity: opacityTarget,
						}}
						transition={{
							duration: FADE_DURATION_S,
							ease: EASE_FADE,
						}}
						onAnimationComplete={() => {
							if (fadingOutRef.current && opacityTarget === 0) {
								setActiveKey(pendingKeyRef.current);
								setActiveChildren(pendingChildrenRef.current);
								fadingOutRef.current = false;
								isFadingRef.current = false;
								queueMicrotask(() => {
									update();
									requestAnimationFrame(() => {
										setOpacityTarget(1);
									});
								});
							}
						}}
					>
						{activeChildren}
					</motion.div>
				</motion.div>
			</FloatingPortal>
		</>
	);
};
