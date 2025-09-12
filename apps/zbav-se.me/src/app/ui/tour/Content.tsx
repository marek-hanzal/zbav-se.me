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
		tooltipClassName?: string; // applied to the visible surface (the one that fades)
		maxWidthPx?: number;
		margin?: number;
		/** Key that triggers fade-out → swap → fade-in on the single surface */
		contentKey: string | number;
		children: React.ReactNode;
	}
}

/** Move (x/y) and opacity fade on a single surface; no overlap, no position freeze, no size animation. */
export const Content: FC<Content.Props> = ({
	referenceElement,
	placement = "bottom",
	tooltipClassName = "rounded-2xl bg-white text-neutral-900 shadow-2xl p-4",
	maxWidthPx = 420,
	margin = 16,
	contentKey,
	children,
}) => {
	const { x, y, strategy, refs } = useFloating({
		placement,
		whileElementsMounted: floatingAutoUpdate,
		middleware: [
			floatingOffset(12),
			floatingShift({
				padding: margin,
				limiter: limitShift(),
			}),
			floatingFlip(),
			// Only apply caps; do not animate width/height
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
		if (referenceElement) refs.setReference(referenceElement);
	}, [
		referenceElement,
		refs,
	]);

	const tx = Math.round(x ?? 0);
	const ty = Math.round(y ?? 0);

	/* ——— Single-surface fade orchestrator ———
	   We fade the existing surface to 0, then swap to the latest pending content,
	   then fade back to 1. Position keeps animating independently on the wrapper. */

	const [stagedKey, setStagedKey] = useState<string | number>(contentKey);
	const [stagedChildren, setStagedChildren] =
		useState<React.ReactNode>(children);
	const pendingKeyRef = useRef<string | number>(contentKey);
	const pendingChildrenRef = useRef<React.ReactNode>(children);
	const [opacityTarget, setOpacityTarget] = useState<number>(1);
	const fadingOutRef = useRef<boolean>(false);

	// Keep pending payload in refs
	useEffect(() => {
		pendingKeyRef.current = contentKey;
		pendingChildrenRef.current = children;
		// Trigger fade-out only when the key changes
		if (contentKey !== stagedKey) {
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
			{/* Wrapper: only position animates (no key, no freeze) */}
			<motion.div
				ref={refs.setFloating}
				style={{
					position: strategy, // fixed
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
				{/* Single surface fading in/out; swap happens exactly at fade-out end */}
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
					onAnimationComplete={() => {
						// If we just finished fading out, swap to the latest pending and fade in
						if (fadingOutRef.current && opacityTarget === 0) {
							setStagedKey(pendingKeyRef.current);
							setStagedChildren(pendingChildrenRef.current);
							fadingOutRef.current = false;
							// next tick to ensure DOM swap applied before fade-in
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
