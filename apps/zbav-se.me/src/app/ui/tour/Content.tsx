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
import { motion } from "motion/react";
import type React from "react";
import { type FC, useEffect, useRef, useState } from "react";

export namespace Content {
	export interface Props {
		referenceElement: HTMLElement | null;
		placement?: Placement;
		tooltipClassName?: string;
		maxWidthPx?: number;
		margin?: number;
		contentKey: string | number; // fade-out -> swap -> fade-in
		children: React.ReactNode;
	}
}

/** Move (x/y) + single-surface fade; během fade pozici krátce stabilizujeme (skip update). */
export const Content: FC<Content.Props> = ({
	referenceElement,
	placement = "bottom",
	tooltipClassName = "rounded-2xl bg-white text-neutral-900 shadow-2xl p-4",
	maxWidthPx = 420,
	margin = 16,
	contentKey,
	children,
}) => {
	const isFadingRef = useRef(false);

	const { x, y, strategy, refs, update } = useFloating({
		placement,
		whileElementsMounted(reference, floating, internalUpdate) {
			const cleanup = floatingAutoUpdate(reference, floating, () => {
				if (isFadingRef.current) {
					return;
				}
				internalUpdate();
			});
			return cleanup;
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
					const width = Math.min(availableWidth, maxWidthPx);
					const height = Math.max(0, availableHeight);
					Object.assign(node.style, {
						maxWidth: `${width}px`,
						maxHeight: `${height}px`,
						overflow: "auto",
						boxSizing: "border-box",
					});
				},
			}),
		],
	});

	useEffect(() => {
		if (referenceElement) {
			refs.setReference(referenceElement);
		}
	}, [
		referenceElement,
		refs,
	]);

	const tx = Math.round(x ?? 0);
	const ty = Math.round(y ?? 0);

	const [stagedKey, setStagedKey] = useState<string | number>(contentKey);
	const [stagedChildren, setStagedChildren] =
		useState<React.ReactNode>(children);
	const pendingKeyRef = useRef<string | number>(contentKey);
	const pendingChildrenRef = useRef<React.ReactNode>(children);
	const [opacityTarget, setOpacityTarget] = useState<number>(1);
	const fadingOutRef = useRef(false);

	useEffect(() => {
		pendingKeyRef.current = contentKey;
		pendingChildrenRef.current = children;
		if (contentKey !== stagedKey) {
			isFadingRef.current = true;
			fadingOutRef.current = true;
			setOpacityTarget(0);
		}
	}, [
		contentKey,
		children,
		stagedKey,
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
					duration: 0.35,
					ease: [
						0.22,
						1,
						0.36,
						1,
					],
				}}
				initial={false}
			>
				<motion.div
					className={[
						tooltipClassName,
						"overflow-auto",
					].join(" ")}
					animate={{
						opacity: opacityTarget,
					}}
					transition={{
						duration: 0.25,
						ease: [
							0.4,
							0,
							0.2,
							1,
						],
					}}
					onAnimationComplete={async () => {
						if (fadingOutRef.current && opacityTarget === 0) {
							setStagedKey(pendingKeyRef.current);
							setStagedChildren(pendingChildrenRef.current);
							fadingOutRef.current = false;
							isFadingRef.current = false;
							await Promise.resolve();
							update?.();
							requestAnimationFrame(() => setOpacityTarget(1));
						}
					}}
				>
					{stagedChildren}
				</motion.div>
			</motion.div>
		</FloatingPortal>
	);
};
