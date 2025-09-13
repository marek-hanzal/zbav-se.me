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
	const slots = useCls(cls, tweak);

	const { x, y, strategy, refs, update } = useFloating({
		placement,
		whileElementsMounted(reference, floating, internalUpdate) {
			return floatingAutoUpdate(reference, floating, () => {
				if (!isFadingRef.current) {
					internalUpdate();
				}
			});
		},
		middleware: [
			floatingOffset(12),
			floatingShift({
				padding: margin,
				limiter: limitShift(),
			}),
			floatingFlip(),
			floatingSize({
				padding: margin,
				apply({ availableWidth, availableHeight, elements }) {
					const node = elements.floating as HTMLElement;
					const w = Math.min(availableWidth, maxWidthPx);
					const h = Math.max(0, availableHeight);
					Object.assign(node.style, {
						maxWidth: `${w}px`,
						maxHeight: `${h}px`,
						overflow: "auto",
						boxSizing: "border-box",
					});
				},
			}),
		],
	});

	useEffect(() => {
		if (referenceElement) refs.setReference(referenceElement);
	}, [
		referenceElement,
		refs,
	]);

	const tx = Math.round(x ?? 0);
	const ty = Math.round(y ?? 0);

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
		<FloatingPortal>
			<motion.div
				ref={refs.setFloating}
				style={{
					position: strategy,
					top: 0,
					left: 0,
					zIndex: 10000,
					maxWidth: "calc(100dvw - 32px)",
					maxHeight: "calc(100dvh - 32px)",
				}}
				animate={{
					x: tx,
					y: ty,
				}}
				transition={{
					duration: MOVE_DURATION_S,
					ease: EASE_MOVE,
				}}
				initial={false}
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
								update?.();
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
	);
};
