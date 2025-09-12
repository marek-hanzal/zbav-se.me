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
import type React from "react";
import { type FC, useEffect, useMemo, useRef, useState } from "react";

export namespace Content {
	export interface Props {
		referenceElement: HTMLElement | null;
		placement?: Placement;
		tooltipClassName?: string;
		maxWidthPx?: number;
		margin?: number;
		/** Changes to this value trigger fade-out → swap → fade-in */
		contentKey: string | number;
		/** Milliseconds for fade-out and fade-in (same duration for both) */
		fadeDurationMs?: number;
		children: React.ReactNode;
	}
}

/** Floating UI tooltip with content cross-fade on key change. */
export const Content: FC<Content.Props> = ({
	referenceElement,
	placement = "bottom",
	tooltipClassName = "rounded-2xl bg-white text-neutral-900 shadow-2xl p-4",
	maxWidthPx = 420,
	margin = 16,
	contentKey,
	fadeDurationMs = 250,
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

	// Wire reference node
	useEffect(() => {
		if (referenceElement) refs.setReference(referenceElement);
	}, [
		referenceElement,
		refs,
	]);

	// Pixel snap to avoid shimmering
	const tx = Math.round(x ?? 0);
	const ty = Math.round(y ?? 0);

	/* ————————— Content cross-fade ————————— */

	/** The currently staged React node (what is actually rendered). */
	const [stagedChildren, setStagedChildren] =
		useState<React.ReactNode>(children);
	/** Which key is currently staged (to prevent double fades). */
	const [stagedKey, setStagedKey] = useState<string | number>(contentKey);
	/** Opacity phase: 1 = visible, 0 = hidden. */
	const [opacity, setOpacity] = useState<number>(1);
	const timeoutRef = useRef<number | null>(null);

	// On key change: fade out → swap → fade in
	useEffect(() => {
		// If contentKey did not change, just update children (no fade)
		if (contentKey === stagedKey) {
			setStagedChildren(children);
			return;
		}

		// Start fade-out
		setOpacity(0);

		// After fade-out, swap children and key, then fade-in
		if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
		timeoutRef.current = window.setTimeout(() => {
			setStagedChildren(children);
			setStagedKey(contentKey);
			// Next frame to ensure DOM has swapped before fade-in
			requestAnimationFrame(() => setOpacity(1));
		}, fadeDurationMs);

		return () => {
			if (timeoutRef.current != null)
				window.clearTimeout(timeoutRef.current);
		};
	}, [
		children,
		contentKey,
		stagedKey,
		fadeDurationMs,
	]);

	// Shared inline transition (robust without Tailwind JIT reliance)
	const crossFadeStyle: React.CSSProperties = useMemo(
		() => ({
			opacity,
			transition: `opacity ${fadeDurationMs}ms ease`,
			// Avoid pointer surprises during fade-out (optional)
			pointerEvents: opacity === 0 ? "none" : "auto",
		}),
		[
			opacity,
			fadeDurationMs,
		],
	);

	return (
		<FloatingPortal>
			<div
				ref={refs.setFloating}
				className={[
					tooltipClassName,
					"overflow-auto",
					"max-w-[calc(100dvw-32px)]",
					"max-h-[calc(100dvh-32px)]",
				].join(" ")}
				style={{
					position: strategy,
					top: 0,
					left: 0,
					transform: `translate3d(${tx}px, ${ty}px, 0)`,
					zIndex: 10000,
					willChange: "transform",
					...crossFadeStyle,
				}}
			>
				{/* Only the inner content fades; position and sizing stay stable */}
				{stagedChildren}
			</div>
		</FloatingPortal>
	);
};
